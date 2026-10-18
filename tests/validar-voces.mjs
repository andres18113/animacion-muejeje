import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {fileURLToPath, pathToFileURL} from "node:url";
import {mapearPalabras, hashVoz, normalizar, ajustesEfectivos, resolverEjecutable, consultarVoces, tasaErrorPalabras} from "../scripts/voces-comun.mjs";
import {generarVoces, cacheValida, regenerarRegistro, opcionesGeneracion, recortarCola, TOLERANCIA_COLA_MS} from "../scripts/generar-voces.mjs";
import {gestionarBiblioteca, opcionesBiblioteca} from "../scripts/voces-biblioteca.mjs";
import {CUES_DIALOGO} from "../src/arranque/dialogo.ts";
import {REPARTO_VOCES} from "../src/arranque/voces.ts";

// Cada palabra tiene un hueco real antes de la siguiente; no rellenarlo.
const alinear = (texto) => {
  const characters = Array.from(texto);
  return {characters, character_start_times_seconds: characters.map((_, i) => i * .04), character_end_times_seconds: characters.map((_, i) => i * .04 + .02)};
};
const speech = "Pentium dos, dirección siete efes, cero. La ese de ram guarda datos.";
const display = "Pentium II, dirección FFFFFFF0. La SDRAM guarda datos.";
const alineacion = alinear(speech);
const captions = mapearPalabras(speech, display, alineacion);
assert.deepEqual(captions.map(c => c.text), display.split(" ").map(p => ` ${p}`));
const esperado = (fragmento) => {
  const i = speech.indexOf(fragmento);
  return [alineacion.character_start_times_seconds[i] * 1000, alineacion.character_end_times_seconds[i + fragmento.length - 1] * 1000];
};
for (const [visible, hablado] of [["FFFFFFF0.", "siete efes, cero."], ["SDRAM", "ese de ram"]]) {
  const c = captions.find(c => c.text.trim() === visible);
  assert.deepEqual([c.startMs, c.endMs], esperado(hablado));
}
assert.ok(captions[1].startMs > captions[0].endMs, "conserva silencio entre palabras");
assert.equal(normalizar(captions.map(c => c.text).join("")), normalizar(display));
assert.throws(() => mapearPalabras(speech, "Texto diferente", alineacion), /mapear/i);
assert.throws(() => mapearPalabras(speech, display, {...alineacion, characters: ["x"]}), /alineación/i);
assert.throws(() => mapearPalabras(speech, display, {...alineacion, character_start_times_seconds: alineacion.characters.map(() => -1)}), /alineación/i);
const datos = {speechText: speech, voiceId: "voz", model: "eleven_v4", settings: {stability: .5, similarityBoost: .75}, version: 1};
assert.match(hashVoz(datos), /^[a-f0-9]{64}$/);
assert.equal(hashVoz(datos), hashVoz({...datos, settings: {similarityBoost: .75, stability: .5}}));
for (const cambio of [{speechText: `${speech}!`}, {voiceId: "otra"}, {model: "eleven_v3"}, {settings: {...datos.settings, stability: .6}}, {version: 2}]) assert.notEqual(hashVoz(datos), hashVoz({...datos, ...cambio}));
assert.deepEqual(ajustesEfectivos("eleven_v4", {...datos.settings, speed: 1.1, style: .2}), datos.settings);
assert.deepEqual(ajustesEfectivos("eleven_v3", {...datos.settings, speed: 1.1, style: .2}), {...datos.settings, speed: 1.1, style: .2});
assert.throws(() => ajustesEfectivos("eleven_v3", {...datos.settings, speed: 2}), /speed/i);
console.log("VALIDADO VOCES: mapeo fonético a palabras visibles, silencios, rechazos y hash estable/sensible.");

// Todo el diálogo debe mapear sin inventar ni perder una palabra visible.
for (const cue of CUES_DIALOGO) {
  const c = mapearPalabras(cue.speechText, cue.displayText, alinear(cue.speechText));
  assert.deepEqual(c.map(p => p.text.trim()), cue.displayText.split(/\s+/u), cue.cueId);
}
assert.deepEqual(tasaErrorPalabras("uno dos tres", "uno cuatro tres cinco"), {errores: 2, palabras: 3, wer: 2 / 3});
assert.equal(tasaErrorPalabras("Árbol, BIOS.", "arbol bios").wer, 0);
assert.throws(() => opcionesGeneracion(["--todo", "--cue", "S04-C01"]), /elegir/i);
assert.throws(() => opcionesGeneracion(["--escena", "S99"]), /desconocida/i);
assert.throws(() => opcionesGeneracion(["--cue"]), /falta/i);
assert.throws(() => opcionesBiblioteca(["--quitar", "ajena"]), /fuera/i);
assert.throws(() => opcionesBiblioteca(["--estado", "--agregar", "bios"]), /elegir/i);

const temporal = fs.mkdtempSync(path.join(os.tmpdir(), "arranque-voces-"));
// Cola de alineación: el punto final de ElevenLabs termina ~80 ms después del MP3; se recorta hasta la tolerancia.
{
  const a = {characters: ["a", "."], character_start_times_seconds: [0, 1.0], character_end_times_seconds: [1.0, 1.08]};
  const r = recortarCola(a, 1000);
  assert.deepEqual(r.character_end_times_seconds, [1.0, 1.0]); assert.deepEqual(r.character_start_times_seconds, [0, 1.0]);
  assert.equal(recortarCola(a, 1100), a, "sin exceso no se modifica");
  assert.throws(() => recortarCola(a, 1080 - TOLERANCIA_COLA_MS - 1), /excede/);
  assert.ok(opcionesGeneracion(["--todo", "--reconstruir"]).reconstruir);
  assert.throws(() => opcionesGeneracion(["--todo", "--reconstruir", "--forzar"]), /reconstruir/);
}
const silencioso = () => {};
const suscripcion = {character_count: 0, character_limit: 40000, voice_slots_used: 0, voice_limit: 10};
const cue = CUES_DIALOGO.find(c => c.cueId === "S04-C01");
const voz = REPARTO_VOCES[cue.mascotId];
const llamadas = [];
const a = alinear(cue.speechText);
const mp3 = Buffer.from("ID3 audio simulado solo en carpeta temporal").toString("base64");
let duracion = 5000, presupuesto = suscripcion, disponibles = [voz.voiceId];
const ejecutar = async (args) => {
  llamadas.push(args);
  if (args[0] === "user") return presupuesto;
  if (args[0] === "voices" && args[1] === "search") return {voices: disponibles.map(voice_id => ({voice_id}))};
  if (args[0] === "--version") return "1.6.1";
  if (args[0] === "text-to-speech") return {audio_base64: mp3, alignment: a};
  if (args[0] === "speech-to-text") return {text: cue.speechText};
  throw new Error(`Llamada no prevista: ${args[0]}`);
};
const dependencias = {raiz: temporal, ejecutar, medir: async () => duracion, log: silencioso};
const base = path.join(temporal, "public/voces/s04/s04-c01-romi");
try {
  assert.equal(await generarVoces(["--todo", "--dry-run", "--verificar", "--forzar"], dependencias), 0);
  assert.equal(llamadas.length, 0, "dry-run no llama ni a suscripción ni a versión ni a STT");
  assert.deepEqual(fs.readdirSync(temporal), [], "dry-run no escribe archivos");
  presupuesto = {...suscripcion, character_count: 38000};
  await assert.rejects(generarVoces(["--cue", cue.cueId], dependencias), /presupuesto/i);
  assert.deepEqual(llamadas.map(c => c[0]), ["user"], "guardia antes de buscar voces o convertir");
  presupuesto = suscripcion; llamadas.length = 0; disponibles = [];
  await assert.rejects(generarVoces(["--cue", cue.cueId], dependencias), /voces-biblioteca/);
  assert.ok(llamadas.every(c => c[0] !== "text-to-speech" && c[1] !== "share"));
  disponibles = [voz.voiceId]; llamadas.length = 0;
  assert.equal(await generarVoces(["--cue", cue.cueId, "--verificar"], dependencias), 0);
  const meta = JSON.parse(fs.readFileSync(`${base}.meta.json`, "utf8"));
  assert.equal(meta.cliVersion, "1.6.1"); assert.equal(meta.durationMs, 5000);
  assert.equal(meta.voiceId, voz.voiceId); assert.equal(meta.chars, Array.from(cue.speechText).length);
  assert.equal(JSON.parse(fs.readFileSync(`${base}.stt.json`, "utf8")).wer, 0);
  assert.ok(cacheValida(cue, meta.hash, temporal));
  assert.equal(Object.keys(regenerarRegistro(temporal)).length, 1);
  const registro = fs.readFileSync(path.join(temporal, "src/arranque/voces.generado.ts"), "utf8");
  regenerarRegistro(temporal);
  assert.equal(fs.readFileSync(path.join(temporal, "src/arranque/voces.generado.ts"), "utf8"), registro, "registro determinista");
  // Cargar los módulos reales contra un registro lleno, sin tocar public/src del proyecto.
  const raizProyecto = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  for (const relativo of ["src/arranque/dialogo.ts", "src/arranque/audio.ts", "src/arranque/subtitulos.ts", "src/arranque/tiempo.ts", "src/arranque/anclas.ts", "src/arranque/recursos.ts", "src/arranque/voces.ts", "scripts/voces-comun.mjs", "tests/comun-voces.mjs"]) {
    const destino = path.join(temporal, relativo); fs.mkdirSync(path.dirname(destino), {recursive: true});
    fs.copyFileSync(path.join(raizProyecto, relativo), destino);
  }
  const {CUES_DIALOGO: cuesLocales} = await import(pathToFileURL(path.join(temporal, "src/arranque/dialogo.ts")).href);
  const {validarVozGenerada} = await import(pathToFileURL(path.join(temporal, "tests/comun-voces.mjs")).href);
  const {cuesDeEscena} = await import(pathToFileURL(path.join(temporal, "src/arranque/recursos.ts")).href);
  for (const local of cuesLocales) assert.ok(validarVozGenerada(local));
  const visual = cuesDeEscena(cue.sceneId).find(v => v.cue.cueId === cue.cueId);
  assert.equal(visual.cue.provider, "elevenlabs"); assert.equal(visual.cue.assetPath, "voces/s04/s04-c01-romi.mp3");
  assert.deepEqual(visual.caracteres, a); assert.ok(visual.segmentos.length > 0);
  const jsonOriginal = fs.readFileSync(`${base}.alineacion.json`, "utf8");
  fs.writeFileSync(`${base}.alineacion.json`, "[]\n");
  assert.throws(() => validarVozGenerada(visual.cue), assert.AssertionError, "registro distinto del JSON debe fallar");
  fs.writeFileSync(`${base}.alineacion.json`, jsonOriginal);
  llamadas.length = 0;
  assert.equal(await generarVoces(["--cue", cue.cueId], dependencias), 0);
  assert.equal(llamadas.length, 0, "caché evita todas las llamadas");
  await generarVoces(["--cue", cue.cueId, "--verificar"], dependencias);
  assert.deepEqual(llamadas.map(c => c[0]), ["user", "speech-to-text"], "verificar caché no vuelve a cobrar TTS");
  llamadas.length = 0;
  await generarVoces(["--cue", cue.cueId, "--modelo", "eleven_v3"], dependencias);
  assert.ok(llamadas.some(c => c[0] === "text-to-speech" && c[c.indexOf("--model-id") + 1] === "eleven_v3"), "modelo invalida caché");
  duracion = cue.durationFrames * 1000 / 30 - 99;
  assert.equal(await generarVoces(["--cue", cue.cueId, "--forzar"], dependencias), 1, "margen de 100 ms obligatorio");
  assert.deepEqual(regenerarRegistro(temporal), {}, "toma larga no se registra");
  assert.ok(fs.existsSync(`${base}.mp3`) && fs.existsSync(`${base}.meta.json`) && fs.existsSync(`${base}.caracteres.json`) && fs.existsSync(`${base}.alineacion.json`), "conservar diagnóstico de toma larga");
  llamadas.length = 0;
  assert.equal(await generarVoces(["--cue", cue.cueId], dependencias), 1);
  assert.equal(llamadas.length, 0, "no volver a cobrar una toma larga sin --forzar");
  fs.rmSync(`${base}.mp3`);
  assert.equal(cacheValida(cue, meta.hash, temporal), false, "activo ausente invalida caché");

  // Fallback sin ffprobe, y rechazo del alineado incluso si llega audio.
  assert.equal(await generarVoces(["--cue", cue.cueId, "--forzar"], {...dependencias, medir: async () => null}), 0);
  assert.equal(JSON.parse(fs.readFileSync(`${base}.meta.json`, "utf8")).durationMs, a.character_end_times_seconds.at(-1) * 1000);
  const roto = async args => args[0] === "text-to-speech" ? {audio_base64: mp3, alignment: {...a, characters: ["x"]}} : ejecutar(args);
  assert.equal(await generarVoces(["--cue", cue.cueId, "--forzar"], {...dependencias, ejecutar: roto}), 1);
  assert.deepEqual(regenerarRegistro(temporal), {}, "una recepción incompleta desactiva el registro anterior");

  // Resolución Windows: leer shim npm, sin cmd.exe ni interpretación de texto.
  const bin = path.join(temporal, "bin con espacios"); fs.mkdirSync(bin);
  fs.writeFileSync(path.join(bin, "entrada.cjs"), "// entrada simulada\n");
  fs.writeFileSync(path.join(bin, "elevenlabs.cmd"), '"%_prog%" "%dp0%\\entrada.cjs" %*\r\n');
  assert.deepEqual(resolverEjecutable("elevenlabs", {plataforma: "win32", ruta: bin}), {archivo: process.execPath, prefijo: [path.join(bin, "entrada.cjs")]});
  fs.writeFileSync(path.join(bin, "elevenlabs.exe"), "simulado");
  assert.deepEqual(resolverEjecutable("elevenlabs", {plataforma: "win32", ruta: bin}), {archivo: path.join(bin, "elevenlabs.exe"), prefijo: []});
  assert.throws(() => resolverEjecutable("ausente", {plataforma: "win32", ruta: bin}), /PATH/);

  const paginas = [];
  const todos = await consultarVoces(async args => {paginas.push(args); return paginas.length === 1 ? {voices: [{voice_id: "a"}], has_more: true, next_page_token: "segunda"} : {voices: [{voice_id: "b"}], has_more: false};});
  assert.deepEqual([...todos], ["a", "b"]); assert.ok(paginas[1].includes("segunda"));
  await assert.rejects(consultarVoces(async () => ({voices: [], has_more: true})), /paginación/i);

  // Biblioteca: dry-run aislado, guardia global de slots y borrado acotado.
  const biblioteca = [], reparto = {...REPARTO_VOCES, romi: {...voz, publicOwnerId: "propietario-publico"}, bios: {...REPARTO_VOCES.bios, publicOwnerId: null}};
  let slots = 10;
  const cliBiblioteca = async args => {
    biblioteca.push(args);
    if (args[0] === "user") return {...suscripcion, voice_slots_used: slots};
    if (args[1] === "search") return {voices: []};
    if (args.includes("--help")) return "--public-user-id --voice-id --new-name";
    if (args[1] === "share") return {voice_id: voz.voiceId};
    throw new Error("Modificación de biblioteca inesperada");
  };
  const depsBiblioteca = {ejecutar: cliBiblioteca, log: silencioso, reparto};
  for (const args of [["--estado"], ["--agregar", "romi"], ["--quitar", "romi"]]) assert.equal(await gestionarBiblioteca([...args, "--dry-run"], depsBiblioteca), 0);
  assert.equal(biblioteca.length, 0);
  await assert.rejects(gestionarBiblioteca(["--agregar", "romi"], depsBiblioteca), /slots/);
  assert.ok(biblioteca.every(c => c[1] !== "share"));
  slots = 0; biblioteca.length = 0;
  assert.equal(await gestionarBiblioteca(["--agregar", "romi"], depsBiblioteca), 0);
  const share = biblioteca.find(c => c[1] === "share" && !c.includes("--help"));
  assert.ok(share.includes("propietario-publico") && share.includes(voz.voiceId) && share.includes("--new-name"));
  biblioteca.length = 0;
  await assert.rejects(gestionarBiblioteca(["--agregar", "bios"], depsBiblioteca), /publicOwnerId/);
  assert.ok(biblioteca.every(c => c[1] !== "share"));
  biblioteca.length = 0;
  const borrar = async args => {
    biblioteca.push(args);
    if (args[0] === "user") return suscripcion;
    if (args[1] === "search") return {voices: [{voice_id: voz.voiceId}, {voice_id: "voz-ajena"}]};
    if (args[1] === "delete") return {};
    throw new Error("Llamada no prevista");
  };
  assert.equal(await gestionarBiblioteca(["--quitar", "romi"], {...depsBiblioteca, ejecutar: borrar}), 0);
  assert.deepEqual(biblioteca.filter(c => c[1] === "delete"), [["voices", "delete", "--voice-id", voz.voiceId, "--format", "json"]]);
} finally {
  // Ruta absoluta creada aquí; jamás resolver un destino de borrado desde argumentos.
  assert.ok(path.resolve(temporal).startsWith(path.resolve(os.tmpdir()) + path.sep));
  fs.rmSync(temporal, {recursive: true, force: true});
}
console.log("VALIDADO VOCES: 20 cues, caché, presupuesto, gate, registro, STT/WER, PATH Windows, paginación y lotes; CLI simulada, sin red.");
