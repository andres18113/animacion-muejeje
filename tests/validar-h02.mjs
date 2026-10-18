import "./validar-montaje.mjs";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {FPS, STORYBOARD, DURACION_OBJETIVO_S, DURACION_MAXIMA_S, segundosAFrames} from "../src/arranque/tiempo.ts";
import {ESCENAS, SENALES_ALIMENTACION} from "../src/arranque/escenas.ts";
import {CUES_DIALOGO} from "../src/arranque/dialogo.ts";
import {segmentosDeCue, estaHablando, expresionEnFrame} from "../src/arranque/subtitulos.ts";
import {rutaVoz, rutaAlineacion, rutaCaracteres, rutaSubtitulos, resolverVoz, volumenMusica, detectarSolapes, MUSICA_PAUSA, MUSICA_VOZ, RAMPA_MUSICA} from "../src/arranque/audio.ts";
import {MASCOTAS} from "../src/mascotas/catalogo.ts";
import {anclaEnCue, ANCLAS_VISUALES, duracionEscena} from "../src/arranque/anclas.ts";
import {cuesDeEscena, anclasDeEscena, ALINEACIONES, ALINEACIONES_CARACTERES} from "../src/arranque/recursos.ts";

import {validarVozGenerada} from "./comun-voces.mjs";
import {VOCES_GENERADAS, ALINEACIONES_GENERADAS, CARACTERES_GENERADOS} from "../src/arranque/voces.generado.ts";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const existe = (ruta) => fs.existsSync(path.join(raiz, "public", ruta)) && fs.statSync(path.join(raiz, "public", ruta)).isFile();
const leerAlineacionLocal = (ruta) => JSON.parse(fs.readFileSync(path.join(raiz, "public", ruta), "utf8"));
const palabras = (texto) => texto.trim().split(/\s+/u).filter(Boolean).length;

// Esta función devuelve diagnósticos: los casos negativos pasan por el mismo
// recorrido que los datos reales, sin modificar módulos ni crear activos.
export function validarCues(cues, archivoExiste = existe, leerAlineacion = leerAlineacionLocal) {
  const errores = [];
  const avisos = [];
  const tiempos = [];
  const ids = new Set();
  for (const cue of cues) {
    const error = (codigo, detalle) => errores.push(`${codigo} ${cue.cueId}: ${detalle}`);
    if (ids.has(cue.cueId)) error("ID", "cueId duplicado");
    ids.add(cue.cueId);
    const escena = STORYBOARD.find((item) => item.id === cue.sceneId);
    const contrato = ESCENAS.find((item) => item.id === cue.sceneId);
    const mascota = MASCOTAS.find((item) => item.id === cue.mascotId);
    if (!escena || !contrato) error("ESCENA", "sceneId sin storyboard o contrato");
    if (!mascota) error("MASCOTA", "mascotId desconocido");
    else if (contrato && !contrato.personajes.includes(mascota.codigo)) error("ELENCO", "mascota fuera de personajes");
    if (!["none", "recorded", "elevenlabs"].includes(cue.provider)) error("PROVEEDOR", "provider desconocido");
    const fin = cue.startFrame + cue.durationFrames;
    if (!Number.isInteger(cue.startFrame) || !Number.isInteger(cue.durationFrames) || cue.durationFrames <= 0 || cue.startFrame < 10 || (escena && fin > segundosAFrames(escena.finSegundos - escena.inicioSegundos) - 10)) {
      error("LIMITES", "cue fuera de escena o sin entrada/salida de 10 frames");
    }
    for (const campo of ["assetPath", "alignmentPath"]) {
      const ruta = cue[campo];
      const esperada = campo === "alignmentPath" ? rutaAlineacion(cue) : rutaVoz(cue);
      const valida = campo === "alignmentPath" ? ruta === esperada : ruta === esperada || ruta === rutaVoz(cue, "wav");
      if (ruta !== null && !valida) error("RUTA", `${campo} no respeta la convención local`);
      if (cue.provider === "none") continue;
      if (campo === "alignmentPath" && ruta === null) continue;
      if (valida && ruta !== null && archivoExiste(ruta)) continue;
      if (cue.provider === "recorded") error("ACTIVO", `${campo} ausente o inválido`);
      if (cue.provider === "elevenlabs") avisos.push(`WARN ${cue.cueId}: pendiente de generación (${campo}); fallback silencio si falta voz`);
    }
    if (cue.provider === "elevenlabs" && (cue.assetPath === null || !archivoExiste(cue.assetPath))) {
      assert.deepEqual(resolverVoz(cue, false), {modo: "silencio"});
    }
    // Siglas expandidas son una unidad semántica; con audio manda la duración medida.
    const cantidad = palabras(/^S0[1-3]$/.test(cue.sceneId) ? cue.speechText : cue.displayText);
    const ppm = cantidad * 60 * FPS / cue.durationFrames;
    if (!cantidad || !Number.isFinite(ppm) || (cue.provider === "none" && (ppm < 100 || ppm > 145))) error("PPM", `velocidad ${ppm.toFixed(2)} fuera de 100–145`);
    if (cue.provider === "none" && ppm > 140) error("CAPACIDAD", `no cabe a <=140 ppm: ${ppm.toFixed(2)}`);
    tiempos.push({cue: cue.cueId, inicio: cue.startFrame, fin, segundos: `${(cue.startFrame / FPS).toFixed(3)}–${(fin / FPS).toFixed(3)}`, palabras: cantidad, ppm: Number(ppm.toFixed(2))});
    try {
      const estimados = segmentosDeCue(cue);
      assert.equal(estimados.map(({texto}) => texto.replace(/\s+/gu, " ")).join(" "), cue.displayText, "los subtítulos deben conservar el texto visible");
      const tieneAlineacion = cue.alignmentPath !== null && cue.alignmentPath === rutaAlineacion(cue) && archivoExiste(cue.alignmentPath);
      const alineacion = tieneAlineacion ? leerAlineacion(cue.alignmentPath) : undefined;
      if (tieneAlineacion && !Array.isArray(alineacion)) throw new Error("La alineación JSON debe ser un array Caption[].");
      validarSegmentos(cue, tieneAlineacion ? segmentosDeCue(cue, alineacion) : estimados);
    } catch (fallo) {
      error("SUBTITULOS", fallo.message);
    }
  }
  for (let i = 0; i < cues.length; i++) {
    for (let j = i + 1; j < cues.length; j++) {
      const a = cues[i];
      const b = cues[j];
      if (a.sceneId !== b.sceneId) continue;
      const [primero, segundo] = a.startFrame <= b.startFrame ? [a, b] : [b, a];
      const hueco = segundo.startFrame - primero.startFrame - primero.durationFrames;
      if (hueco < 0) errores.push(`SOLAPE ${primero.cueId}/${segundo.cueId}: voces superpuestas`);
      else if (hueco < 8) errores.push(`PAUSA ${primero.cueId}/${segundo.cueId}: separación menor a 8 frames`);
    }
  }
  return {errores, avisos, tiempos};
}

function validarSegmentos(cue, segmentos) {
  let anterior = cue.startFrame;
  for (const segmento of segmentos) {
    assert.ok(Number.isInteger(segmento.inicioFrame) && Number.isInteger(segmento.finFrame));
    assert.ok(segmento.inicioFrame >= anterior, "segmentos no monótonos");
    assert.ok(segmento.finFrame > segmento.inicioFrame, "segmento vacío");
    assert.ok(segmento.finFrame <= cue.startFrame + cue.durationFrames, "segmento fuera del cue");
    const lineas = segmento.texto.split("\n");
    assert.ok(lineas.length <= 2 && lineas.every((linea) => linea.length <= 42), "más de 2 líneas o 42 caracteres");
    anterior = segmento.finFrame;
  }
}

function validarStoryboardYFuente() {
  assert.equal(FPS, 30);
  assert.equal(STORYBOARD.length, 12);
  let anterior = 0;
  for (const escena of STORYBOARD) {
    assert.equal(escena.inicioSegundos, anterior);
    assert.ok(escena.finSegundos > escena.inicioSegundos);
    anterior = escena.finSegundos;
  }
  const suma = STORYBOARD.reduce((total, escena) => total + escena.finSegundos - escena.inicioSegundos, 0);
  assert.ok(suma >= 300 && suma <= 360, "RNF-10 con voces reales");
  assert.equal(Math.round(suma * FPS), Math.round(DURACION_OBJETIVO_S * FPS));
  assert.equal(DURACION_MAXIMA_S, 360);
  assert.ok(suma <= DURACION_MAXIMA_S);
  const especificacion = JSON.parse(fs.readFileSync(path.resolve(raiz, "tests/fixtures/boot-contract.json"), "utf8"));
  assert.equal(especificacion.storyboard.length, 12, "The specification fixture must contain all twelve scenes");
  assert.deepEqual(STORYBOARD.map(({id, nombre}) => [id, nombre]), especificacion.storyboard.map(({id, name}) => [id, name]));
  for (const {id} of ESCENAS) {
    const texto = especificacion.dialogue[id];
    assert.equal(CUES_DIALOGO.filter((cue) => cue.sceneId === id).map((cue) => cue.displayText).join(" "), texto, `literal dialogue ${id}`);
  }
  for (const contrato of ESCENAS) {
    const elenco = CUES_DIALOGO.filter(cue => cue.sceneId === contrato.id).map(cue => MASCOTAS.find(m => m.id === cue.mascotId)?.codigo);
    // Sin lista explícita (S01–S06) se exige el elenco completo con voz, como antes.
    const sinVoz = contrato.personajesSinVoz ?? [];
    assert.ok(sinVoz.every(codigo => contrato.personajes.includes(codigo) && !elenco.includes(codigo)), `actuación sin voz declarada ${contrato.id}`);
    assert.deepEqual(elenco, contrato.personajes.filter(codigo => !sinVoz.includes(codigo)), `elenco completo y ordenado ${contrato.id}`);
  }
  assert.equal(ESCENAS[0].estado, "implementada");
  assert.equal(ESCENAS[1].estado, "implementada");
  // Toda escena implementada debe tener anclas visuales; las demás siguen como contrato.
  for (const escena of ESCENAS) assert.ok(["implementada", "contrato"].includes(escena.estado), `estado de ${escena.id}`);
  for (const contrato of ESCENAS) {
    const escena = STORYBOARD.find(({id}) => id === contrato.id);
    assert.deepEqual(contrato.intervalo, {inicio: escena.inicioSegundos, fin: escena.finSegundos});
    assert.equal(Math.round(contrato.duracionSegundos * FPS), duracionEscena(escena.id));
    assert.equal(contrato.siguienteEscena, STORYBOARD[STORYBOARD.indexOf(escena) + 1]?.id ?? null);
    for (const campo of ["nombre", "personajes", "requisitos", "prerrequisitos", "entrada", "operacion", "salida", "verificaciones"]) assert.ok(contrato[campo]);
    assert.ok(contrato.personajes.every((codigo) => MASCOTAS.some((mascota) => mascota.codigo === codigo)));
  }
  assert.equal(SENALES_ALIMENTACION["PS_ON#"][0], "La placa solicita su activación.");
  assert.equal(SENALES_ALIMENTACION["PWR_OK"][1], "La fuente informa que las condiciones eléctricas son satisfactorias.");
  const cpu = ESCENAS[2].operacion;
  assert.equal(cpu.baseCS, "0xFFFF0000");
  assert.equal(cpu.eip, "0x0000FFF0");
  assert.equal(cpu.direccionFisica, "0xFFFFFFF0");
  assert.equal(cpu.binario, "11111111 11111111 11111111 11110000");
  assert.equal(Number(cpu.baseCS) + Number(cpu.eip), Number(cpu.direccionFisica));
}

function probarSubtitulosYAudio() {
  const cue = CUES_DIALOGO[0];
  const segmentos = segmentosDeCue(cue);
  assert.equal(segmentos.map(({texto}) => texto.replace(/\s+/gu, " ")).join(" "), cue.displayText);
  assert.equal(segmentos[0].inicioFrame, cue.startFrame);
  assert.equal(segmentos.at(-1).finFrame, cue.startFrame + cue.durationFrames);
  const pausa = segmentos.find((segmento, i) => segmentos[i + 1]?.inicioFrame - segmento.finFrame === 6);
  assert.ok(pausa, "debe haber pausas de 6 frames entre oraciones");
  assert.equal(estaHablando(cue, segmentos, pausa.finFrame), false);
  assert.equal(estaHablando(cue, segmentos, segmentos[0].inicioFrame), true);
  assert.equal(estaHablando(cue, segmentos, cue.startFrame - 1), false);
  assert.equal(estaHablando(cue, segmentos, cue.startFrame + cue.durationFrames), false);
  assert.equal(expresionEnFrame(cue, segmentos, pausa.finFrame, "alerta"), "alerta");
  assert.equal(expresionEnFrame(cue, segmentos, cue.startFrame), "hablando");
  assert.equal(expresionEnFrame(cue, segmentos, cue.startFrame - 1), "neutral");
  assert.deepEqual(segmentosDeCue(cue, []), []);
  const alineacion = [
    {text: " narración", startMs: 0, endMs: 2000, timestampMs: null, confidence: null},
    {text: " fonética", startMs: 2500, endMs: 5000, timestampMs: 3000, confidence: 0.9},
  ];
  const alineados = segmentosDeCue(cue, alineacion);
  validarSegmentos(cue, alineados);
  assert.ok(alineados.length > 0);
  for (const segmento of alineados) assert.ok(segmentos.some(({texto}) => texto === segmento.texto), "la alineación no cambia el texto visible");
  assert.equal(estaHablando(cue, alineados, cue.startFrame + 65), false, "respeta hueco en alineación");
  assert.equal(estaHablando(cue, alineados, cue.startFrame + 150), false);
  assert.throws(() => segmentosDeCue(cue, [{...alineacion[0], endMs: 999999}]), /alineación/i);
  assert.throws(() => segmentosDeCue(cue, [alineacion[1], alineacion[0]]), /alineación/i);
  assert.throws(() => segmentosDeCue(cue, [{...alineacion[0], startMs: -1}]), /alineación/i);
  assert.throws(() => segmentosDeCue({...cue, durationFrames: 1}), /duración/i);
  assert.equal(rutaVoz(cue), "voces/s01/s01-c01-voltio.mp3");
  assert.equal(rutaVoz(cue, "wav"), "voces/s01/s01-c01-voltio.wav");
  assert.equal(rutaAlineacion(cue), "voces/s01/s01-c01-voltio.alineacion.json");
  assert.equal(rutaSubtitulos(cue), "subtitulos/s01/s01-c01-voltio.json");
  assert.deepEqual(resolverVoz({...cue, provider: "none", assetPath: null}), {modo: "silencio"});
  for (const provider of ["recorded", "elevenlabs"]) {
    assert.deepEqual(resolverVoz({...cue, provider, assetPath: null}), {modo: "silencio"});
    assert.deepEqual(resolverVoz({...cue, provider, assetPath: rutaVoz(cue)}), {modo: "audio", src: rutaVoz(cue)});
    assert.deepEqual(resolverVoz({...cue, provider, assetPath: rutaVoz(cue)}, false), {modo: "silencio"});
  }
  const voz = [{inicioFrame: 20, finFrame: 40}];
  // La música queda claramente por debajo de la voz (≈ −15 dB respecto a las pausas).
  assert.ok(MUSICA_VOZ < MUSICA_PAUSA && 20 * Math.log10(MUSICA_PAUSA / MUSICA_VOZ) >= 14);
  const medio = (MUSICA_PAUSA + MUSICA_VOZ) / 2, mitad = RAMPA_MUSICA / 2;
  assert.equal(volumenMusica(0, voz), MUSICA_PAUSA);
  assert.equal(volumenMusica(20, voz), MUSICA_VOZ);
  assert.equal(volumenMusica(40, voz), MUSICA_VOZ);
  assert.equal(volumenMusica(40 + RAMPA_MUSICA, voz), MUSICA_PAUSA);
  assert.ok(Math.abs(volumenMusica(20 - mitad, voz) - medio) < 1e-10);
  assert.ok(Math.abs(volumenMusica(40 + mitad, voz) - medio) < 1e-10);
  assert.equal(volumenMusica(200, []), MUSICA_PAUSA);
  assert.equal(volumenMusica(45, [...voz, {inicioFrame: 44, finFrame: 60}]), MUSICA_VOZ);
  const pista = (id, tipo, desdeFrame, duracionFrames) => ({id, tipo, src: `${id}.wav`, desdeFrame, duracionFrames, volumenBase: 1});
  assert.equal(detectarSolapes([pista("a", "voz", 0, 30), pista("b", "voz", 30, 20)]).length, 0);
  assert.equal(detectarSolapes([pista("a", "voz", 0, 30), pista("b", "voz", 20, 20)])[0].tipo, "voz/voz");
  assert.equal(detectarSolapes([pista("a", "voz", 0, 30), pista("b", "sfx", 10, 5)])[0].tipo, "sfx/voz");
  assert.deepEqual(detectarSolapes([pista("a", "voz", 0, 30), {...pista("b", "sfx", 10, 5), permitirDuranteVoz: true}]), []);
  assert.deepEqual(detectarSolapes([pista("a", "voz", 0, 30), pista("b", "musica", 0, 60)]), []);
}

function probarRechazos() {
  const casos = [
    ["solape", CUES_DIALOGO.map((cue) => cue.cueId === "S02-C02" ? {...cue, startFrame: 20} : cue), "SOLAPE"],
    ["fuera de límites", [{...CUES_DIALOGO[0], startFrame: 9999}], "LIMITES"],
    ["mascota desconocida", [{...CUES_DIALOGO[0], mascotId: "inexistente"}], "MASCOTA"],
    ["elenco incorrecto", [{...CUES_DIALOGO[0], mascotId: "cipu"}], "ELENCO"],
    ["cue duplicado", [CUES_DIALOGO[0], CUES_DIALOGO[0]], "ID"],
    ["proveedor inválido", [{...CUES_DIALOGO[0], provider: "otro"}], "PROVEEDOR"],
    ["escena desconocida", [{...CUES_DIALOGO[0], sceneId: "S99"}], "ESCENA"],
    ["locución excesiva", [{...CUES_DIALOGO[0], provider: "none", assetPath: null, alignmentPath: null, durationFrames: 100}], "PPM"],
    ["grabación ausente", [{...CUES_DIALOGO[0], provider: "recorded", assetPath: rutaVoz(CUES_DIALOGO[0])}], "ACTIVO"],
    ["ruta inválida", [{...CUES_DIALOGO[0], provider: "elevenlabs", assetPath: "../fuera.mp3"}], "RUTA"],
  ];
  for (const [nombre, cues, codigo] of casos) assert.ok(validarCues(cues, () => false).errores.some((error) => error.startsWith(codigo)), `autoprueba debe rechazar ${nombre}`);
  const pendiente = validarCues([{...CUES_DIALOGO[0], provider: "elevenlabs", assetPath: rutaVoz(CUES_DIALOGO[0])}], () => false);
  assert.deepEqual(pendiente.errores, []);
  assert.ok(pendiente.avisos.some((aviso) => aviso.includes("pendiente de generación")));
  assert.deepEqual(validarCues([{...CUES_DIALOGO[0], provider: "recorded", assetPath: rutaVoz(CUES_DIALOGO[0])}], () => true).errores, []);
  const conAlineacion = {...CUES_DIALOGO[0], provider: "recorded", assetPath: rutaVoz(CUES_DIALOGO[0]), alignmentPath: rutaAlineacion(CUES_DIALOGO[0])};
  const alineacionInvalida = [{text: "voz", startMs: 0, endMs: 999999, timestampMs: null, confidence: null}];
  assert.ok(validarCues([conAlineacion], () => true, () => alineacionInvalida).errores.some((error) => error.startsWith("SUBTITULOS")), "debe validar el contenido de la alineación declarada");
  assert.ok(validarCues([conAlineacion], () => true, () => ({})).errores.some((error) => error.startsWith("SUBTITULOS")), "debe rechazar un JSON de alineación sin array");
  assert.deepEqual(validarCues([conAlineacion], () => true, () => [{...alineacionInvalida[0], endMs: 1000}]).errores, []);
  console.log(`Autopruebas: ${casos.length + 2} rechazos comprobados; proveedor pendiente, disponibilidad local y carga de alineación comprobados.`);
}

function validarSinRed(directorio) {
  const prohibido = /fetch\s*\(|\b(?:XMLHttpRequest|WebSocket|EventSource)\b|sendBeacon\s*\(|\baxios\b|["'](?:node:)?https?["']|api\.elevenlabs|xi-api-key|ELEVENLABS_API_KEY|process\.env|https?:\/\/|["']@remotion\/(?:media|captions|elevenlabs)(?:\/|["'])/i;
  for (const entrada of fs.readdirSync(directorio, {withFileTypes: true})) {
    const ruta = path.join(directorio, entrada.name);
    if (entrada.isDirectory()) validarSinRed(ruta);
    else assert.ok(!prohibido.test(fs.readFileSync(ruta, "utf8")), `uso de red, claves o dependencia prohibida en ${path.relative(raiz, ruta)}`);
  }
}

validarStoryboardYFuente();
for (const cue of CUES_DIALOGO) validarVozGenerada(cue);
assert.ok(Object.keys(VOCES_GENERADAS).every(id => CUES_DIALOGO.some(c => c.cueId === id)), "registro sin cues huérfanos");
assert.deepEqual(Object.keys(ALINEACIONES_GENERADAS).sort(), Object.values(VOCES_GENERADAS).map(v => v.alignmentPath).sort());
assert.deepEqual(Object.keys(CARACTERES_GENERADOS).sort(), Object.values(VOCES_GENERADAS).map(v => v.caracteresPath).sort());
assert.equal(duracionEscena("S01"), 600);
assert.equal(duracionEscena("S02"), 723);
const tablaAnclas = ANCLAS_VISUALES.map(({sceneId, cueId, palabra, evento}) => {
  const visuales = cuesDeEscena(sceneId);
  const {cue, segmentos} = visuales.find((item) => item.cue.cueId === cueId);
  if (cue.alignmentPath) assert.deepEqual(ALINEACIONES[cue.alignmentPath], leerAlineacionLocal(cue.alignmentPath), "registro de alineación idéntico al JSON local");
  const frame = anclasDeEscena(sceneId, visuales)[evento];
  assert.ok(segmentos.some((s) => s.inicioFrame <= frame && frame < s.finFrame && s.texto.replace(/\s+/gu, " ").toLowerCase().includes(palabra.toLowerCase())), `ancla ${evento} dentro de la frase que contiene «${palabra}»`);
  const escena = STORYBOARD.find((item) => item.id === sceneId);
  return {sceneId, cueId, evento, palabra, frame, frameGlobal: segundosAFrames(escena.inicioSegundos) + frame};
});
for (const id of [...new Set(tablaAnclas.map((a) => a.sceneId))]) {
  const frames = tablaAnclas.filter((a) => a.sceneId === id).map((a) => a.frame);
  // Estricto: dos operaciones distintas nunca ocurren en el mismo frame (RNF-03).
  assert.ok(frames.every((frame, i) => i === 0 || frame > frames[i - 1]), `anclas estrictamente cronológicas ${id}`);
}
// Alineación por carácter (sincronía labial): solo para cues con voz alineada y idéntica al JSON local.
for (const [ruta, registro] of Object.entries(ALINEACIONES_CARACTERES)) {
  const cue = CUES_DIALOGO.find((c) => c.alignmentPath && rutaCaracteres(c) === ruta);
  assert.ok(cue, `alineación por carácter sin cue alineado: ${ruta}`);
  assert.deepEqual(registro, leerAlineacionLocal(ruta), `registro por carácter idéntico al JSON local: ${ruta}`);
  assert.ok(cuesDeEscena(cue.sceneId).find((v) => v.cue.cueId === cue.cueId).caracteres === registro, `la boca recibe la alineación ${ruta}`);
}
assert.equal(rutaCaracteres(CUES_DIALOGO[0]), "voces/s01/s01-c01-voltio.caracteres.json");
assert.throws(() => anclaEnCue(CUES_DIALOGO[0], "palabra ausente"), /ancla/i);
assert.throws(() => anclaEnCue(CUES_DIALOGO[0], "   "), /ancla/i);
assert.throws(() => anclaEnCue(CUES_DIALOGO[0], "PWR_OK", []), /ancla/i);
const cueAncla = CUES_DIALOGO[0];
const alineadoPrueba = segmentosDeCue(cueAncla, [{text: cueAncla.speechText, startMs: 2000, endMs: 15000, timestampMs: null, confidence: null}]);
assert.equal(anclaEnCue(cueAncla, "SOY   VOLTIO", alineadoPrueba), cueAncla.startFrame + 60, "el ancla sigue la alineación y normaliza espacios/mayúsculas");
assert.notEqual(anclaEnCue(cueAncla, "PWR_OK", alineadoPrueba), anclaEnCue(cueAncla, "PWR_OK"), "alinear desplaza eventos sin constantes manuales");
// Alineado por palabras con silencios de 10 ms (forma real del TTS): cada frase queda en varios tramos
// con el mismo texto y las anclas deben seguir estrictamente ordenadas en todas las escenas.
for (const id of [...new Set(ANCLAS_VISUALES.map((a) => a.sceneId))]) {
  const frames = ANCLAS_VISUALES.filter((a) => a.sceneId === id).map(({cueId, palabra}) => {
    const cue = CUES_DIALOGO.find((c) => c.cueId === cueId), lista = cue.speechText.trim().split(/\s+/u), paso = cue.durationFrames * 1000 / FPS / lista.length;
    const porPalabras = lista.map((texto, i) => ({text: ` ${texto}`, startMs: i * paso, endMs: (i + 1) * paso - 10, timestampMs: null, confidence: null}));
    return cue.startFrame + anclaEnCue(cue, palabra, segmentosDeCue(cue, porPalabras)) - cue.startFrame;
  });
  assert.ok(frames.every((frame, i) => i === 0 || frame > frames[i - 1]), `anclas ordenadas con alineado por palabras ${id}: ${frames.join(",")}`);
}
const pulso = CUES_DIALOGO.find((c) => c.cueId === "S02-C01");
const secu = CUES_DIALOGO.find((c) => c.cueId === "S02-C02");
const [visualPulso, visualSecu] = cuesDeEscena("S02");
const segmentosPulso = visualPulso.segmentos;
const segmentosSecu = visualSecu.segmentos;
assert.ok(segmentosPulso.at(-1).finFrame < segmentosSecu[0].inicioFrame);
for (let frame = 0; frame < duracionEscena("S02"); frame++) {
  assert.ok(!(estaHablando(pulso, segmentosPulso, frame) && estaHablando(secu, segmentosSecu, frame)), `bocas simultáneas en ${frame}`);
}
const muestras = [pulso.startFrame - 1, segmentosPulso[0].inicioFrame, pulso.startFrame + pulso.durationFrames].map((frame) => ({frame, expresion: expresionEnFrame(pulso, segmentosPulso, frame)}));
assert.deepEqual(muestras.map((m) => m.expresion), ["neutral", "hablando", "neutral"]);
console.table(muestras);
console.table(tablaAnclas);
fs.mkdirSync(path.join(raiz, "out/h02"), {recursive: true});
fs.writeFileSync(path.join(raiz, "out/h02/anclas.json"), JSON.stringify(tablaAnclas, null, 2));
function validarTecnologia(directorio) {
  for (const entrada of fs.readdirSync(directorio, {withFileTypes: true})) {
    const ruta = path.join(directorio, entrada.name);
    if (entrada.isDirectory()) validarTecnologia(ruta);
    else assert.ok(!/\b(?:UEFI|GPT|NVMe|ESP)\b|Secure\s+Boot/iu.test(fs.readFileSync(ruta, "utf8")), `tecnología fuera de alcance en ${ruta}`);
  }
}
validarTecnologia(path.join(raiz, "src/arranque"));
probarSubtitulosYAudio();
probarRechazos();
validarSinRed(path.join(raiz, "src"));
const resultado = validarCues(CUES_DIALOGO);
console.table(resultado.tiempos);
for (const aviso of resultado.avisos) console.warn(aviso);
for (const error of resultado.errores) console.error(`ERROR ${error}`);
assert.deepEqual(resultado.errores, []);
console.log(`VALIDADO H02: 12 escenas, ${DURACION_OBJETIVO_S} s / ${Math.round(DURACION_OBJETIVO_S * FPS)} frames; ${CUES_DIALOGO.length} cues; subtítulos, expresiones y mezcla local. Sin llamadas de red.`);
