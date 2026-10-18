import fs from "node:fs";
import path from "node:path";
import {pathToFileURL} from "node:url";
import {CUES_DIALOGO} from "../src/arranque/dialogo.ts";
import {MODELO_TTS, REPARTO_VOCES, AJUSTES_CUE} from "../src/arranque/voces.ts";
import {rutaVoz, rutaAlineacion, rutaCaracteres} from "../src/arranque/audio.ts";
import {RAIZ, VERSION, ajustesEfectivos, hashVoz, mapearPalabras, validarCaracteres, leerJson, escribirJson, ejecutarEleven, ejecutarProceso, resolverEjecutable, consultarVoces, validarSuscripcion, tasaErrorPalabras} from "./voces-comun.mjs";

export function opcionesGeneracion(args) {
  const opciones = {escenas: [], cues: [], todo: false, dryRun: false, forzar: false, verificar: false, reconstruir: false, modelo: MODELO_TTS};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (["--escena", "--cue", "--modelo"].includes(arg)) {
      const valor = args[++i];
      if (!valor || valor.startsWith("--")) throw new Error(`Falta valor de ${arg}`);
      if (arg === "--modelo") opciones.modelo = valor;
      else opciones[arg === "--escena" ? "escenas" : "cues"].push(...valor.toUpperCase().split(","));
    } else if (arg === "--todo") opciones.todo = true;
    else if (arg === "--dry-run") opciones.dryRun = true;
    else if (arg === "--forzar") opciones.forzar = true;
    else if (arg === "--verificar") opciones.verificar = true;
    else if (arg === "--reconstruir") opciones.reconstruir = true;
    else throw new Error(`Opción desconocida: ${arg}`);
  }
  if (opciones.reconstruir && opciones.forzar) throw new Error("--reconstruir no admite --forzar: solo reutiliza archivos ya recibidos");
  if (Number(opciones.todo) + Number(opciones.escenas.length > 0) + Number(opciones.cues.length > 0) !== 1) throw new Error("Elegir --todo | --escena S04,S05 (repetible) | --cue S04-C01");
  for (const id of opciones.escenas) if (!CUES_DIALOGO.some(c => c.sceneId === id)) throw new Error(`Escena desconocida: ${id}`);
  for (const id of opciones.cues) if (!CUES_DIALOGO.some(c => c.cueId === id)) throw new Error(`Cue desconocido: ${id}`);
  return opciones;
}

const rutas = (cue, raiz) => {
  const assetPath = rutaVoz(cue), alignmentPath = rutaAlineacion(cue), caracteresPath = rutaCaracteres(cue);
  const base = path.join(raiz, "public", assetPath.slice(0, -4));
  return {assetPath, alignmentPath, caracteresPath, mp3: `${base}.mp3`, captions: `${base}.alineacion.json`, caracteres: `${base}.caracteres.json`, meta: `${base}.meta.json`, stt: `${base}.stt.json`};
};
const ventana = (cue) => cue.durationFrames * 1000 / 30;
export const cabeVoz = (cue, durationMs) => Number.isFinite(durationMs) && durationMs > 0 && durationMs <= ventana(cue) - 100;
const existe = (archivo) => fs.existsSync(archivo) && fs.statSync(archivo).isFile() && fs.statSync(archivo).size > 0;

export function cacheValida(cue, hash, raiz = RAIZ) {
  const r = rutas(cue, raiz);
  try {
    const meta = leerJson(r.meta);
    if (meta.hash !== hash || ![r.mp3, r.captions, r.caracteres].every(existe)) return false;
    // Una toma larga también queda cacheada para no cobrarla de nuevo: exige --forzar.
    validarCaracteres(cue.speechText, leerJson(r.caracteres));
    return JSON.stringify(mapearPalabras(cue.speechText, cue.displayText, leerJson(r.caracteres))) === JSON.stringify(leerJson(r.captions)) && Number.isFinite(meta.durationMs) && meta.durationMs > 0;
  } catch {return false;}
}

export function regenerarRegistro(raiz = RAIZ) {
  const voces = {}, alineaciones = {}, caracteres = {};
  for (const cue of [...CUES_DIALOGO].sort((a, b) => a.cueId.localeCompare(b.cueId))) {
    const r = rutas(cue, raiz);
    try {
      const meta = leerJson(r.meta);
      if (meta.cueId !== cue.cueId || meta.mascotId !== cue.mascotId || meta.voiceId !== REPARTO_VOCES[cue.mascotId].voiceId || !cabeVoz(cue, meta.durationMs)) continue;
      const hash = hashVoz({speechText: cue.speechText, voiceId: meta.voiceId, model: meta.model, settings: meta.settings});
      if (!cacheValida(cue, hash, raiz)) continue;
      const a = leerJson(r.captions), c = leerJson(r.caracteres);
      if (a.some(p => p.endMs > ventana(cue)) || c.character_end_times_seconds.some(t => t * 1000 > ventana(cue)) || c.character_end_times_seconds.at(-1) * 1000 > meta.durationMs + 1) continue;
      voces[cue.cueId] = {assetPath: r.assetPath, alignmentPath: r.alignmentPath, caracteresPath: r.caracteresPath, durationMs: meta.durationMs};
      alineaciones[r.alignmentPath] = a;
      caracteres[r.caracteresPath] = c;
    } catch { /* Una toma incompleta o inválida nunca activa audio en Remotion. */ }
  }
  const archivo = path.join(raiz, "src/arranque/voces.generado.ts");
  const eol = fs.existsSync(archivo) && fs.readFileSync(archivo, "utf8").includes("\r\n") ? "\r\n" : "\n";
  const texto = `// generado por scripts/generar-voces.mjs; no editar
import type {Caption} from "./subtitulos.ts";
import type {AlineacionCaracteres} from "../personajes/labios.ts";

export const VOCES_GENERADAS: Record<string, {assetPath: string; alignmentPath: string; caracteresPath: string; durationMs: number}> = ${JSON.stringify(voces, null, 2)};
export const ALINEACIONES_GENERADAS: Record<string, Caption[]> = ${JSON.stringify(alineaciones, null, 2)};
export const CARACTERES_GENERADOS: Record<string, AlineacionCaracteres> = ${JSON.stringify(caracteres, null, 2)};
`;
  fs.mkdirSync(path.dirname(archivo), {recursive: true});
  fs.writeFileSync(archivo, texto.replace(/\n/gu, eol));
  return voces;
}

/** ElevenLabs suele cerrar el último carácter (puntuación) unos 80 ms después del final del MP3.
 * Se recortan a la duración medida los tiempos que la exceden hasta TOLERANCIA_COLA_MS; más allá es un error. */
export const TOLERANCIA_COLA_MS = 150;
export function recortarCola(alineacion, durationMs) {
  const limite = durationMs / 1000, exceso = alineacion.character_end_times_seconds.at(-1) * 1000 - durationMs;
  if (exceso > TOLERANCIA_COLA_MS) throw new Error(`La alineación excede la duración medida del MP3 en ${exceso.toFixed(0)} ms`);
  if (exceso <= 0) return alineacion;
  return {...alineacion, character_start_times_seconds: alineacion.character_start_times_seconds.map(t => Math.min(t, limite)), character_end_times_seconds: alineacion.character_end_times_seconds.map(t => Math.min(t, limite))};
}

async function medirMp3(archivo) {
  let ejecutable;
  try {ejecutable = resolverEjecutable("ffprobe");} catch {return null;}
  const salida = await ejecutarProceso(ejecutable.archivo, [...ejecutable.prefijo, "-v", "error", "-show_entries", "format=duration", "-of", "json", archivo]);
  const duracion = Number(JSON.parse(salida).format?.duration) * 1000;
  if (!Number.isFinite(duracion) || duracion <= 0) throw new Error("ffprobe devolvió una duración inválida");
  return duracion;
}

async function completarRecepcion({cue, voz, model, settings, hash, chars}, r, medir, cliVersion) {
  const recibida = validarCaracteres(cue.speechText, leerJson(r.caracteres));
  const durationMs = await medir(r.mp3) ?? recibida.character_end_times_seconds.at(-1) * 1000;
  if (!Number.isFinite(durationMs) || durationMs <= 0) throw new Error("Duración de audio inválida");
  const alineacion = recortarCola(recibida, durationMs);
  escribirJson(r.caracteres, alineacion);
  escribirJson(r.captions, mapearPalabras(cue.speechText, cue.displayText, alineacion));
  escribirJson(r.meta, {cueId: cue.cueId, mascotId: cue.mascotId, voiceId: voz.voiceId, model, settings, hash, chars, durationMs, fecha: new Date().toISOString(), cliVersion, version: VERSION});
}

export async function generarVoces(args, {raiz = RAIZ, ejecutar = ejecutarEleven, medir = medirMp3, log = console.log} = {}) {
  const o = opcionesGeneracion(args);
  const seleccion = CUES_DIALOGO.filter(c => o.todo || o.escenas.includes(c.sceneId) || o.cues.includes(c.cueId));
  const planes = seleccion.map(cue => {
    const voz = REPARTO_VOCES[cue.mascotId], ajuste = AJUSTES_CUE[cue.cueId] ?? {};
    const model = ajuste.model ?? o.modelo, settings = ajustesEfectivos(model, {...voz.ajustes, ...(ajuste.speed === undefined ? {} : {speed: ajuste.speed})});
    const hash = hashVoz({speechText: cue.speechText, voiceId: voz.voiceId, model, settings});
    return {cue, voz, model, settings, hash, chars: Array.from(cue.speechText).length, cached: cacheValida(cue, hash, raiz)};
  });
  const reconstruible = (p) => {const r = rutas(p.cue, raiz); return o.reconstruir && !existe(r.meta) && existe(r.mp3) && existe(r.caracteres);};
  const pendientes = planes.filter(p => o.forzar || (!p.cached && !reconstruible(p))), necesarios = pendientes.reduce((n, p) => n + p.chars, 0);
  for (const p of planes) log(`${p.cue.cueId}: ${p.chars} chars; ${p.cue.mascotId} / ${p.voz.nombre} (${p.voz.voiceId}); ${p.model}; caché ${p.cached ? "sí" : "no"}${o.forzar ? "; forzada" : ""}`);
  log(`Total seleccionado: ${planes.reduce((n, p) => n + p.chars, 0)} chars; por generar: ${necesarios}; voces necesarias: ${[...new Set(pendientes.map(p => p.cue.mascotId))].join(",") || "ninguna"}`);
  if (o.dryRun) {log("DRY-RUN: sin CLI, consultas, generación, STT ni escritura."); return 0;}
  let cliVersion = null;
  if (pendientes.length || o.verificar) {
    const s = validarSuscripcion(await ejecutar(["user", "subscription", "get", "--format", "json"]));
    if (s.character_count + necesarios > s.character_limit - 2000) throw new Error(`Presupuesto insuficiente: ${s.character_count} + ${necesarios} > ${s.character_limit} - 2000 de reserva`);
    if (pendientes.length) {
      const cuenta = await consultarVoces(ejecutar);
      const faltan = [...new Set(pendientes.filter(p => !cuenta.has(p.voz.voiceId)).map(p => p.cue.mascotId))];
      if (faltan.length) throw new Error(`Voces ausentes: ${faltan.join(",")}. Ejecutar node scripts/voces-biblioteca.mjs --agregar ${faltan.join(",")} (completar publicOwnerId); no se añaden automáticamente.`);
      cliVersion = await ejecutar(["--version"]);
    }
  }
  let fallos = 0;
  try {
    for (const p of planes) {
      const {cue, voz, model, settings, hash, chars} = p, r = rutas(cue, raiz);
      try {
        if (o.forzar || (!p.cached && !reconstruible(p))) {
          const argsTts = ["text-to-speech", "convert_with_timestamps", "--voice-id", voz.voiceId, "--model-id", model, "--language-code", "es", "--text", cue.speechText, "--output-format", "mp3_44100_128", "--format", "json", "--voice-settings.stability", String(settings.stability), "--voice-settings.similarity-boost", String(settings.similarityBoost)];
          for (const k of ["speed", "style"]) if (settings[k] !== undefined) argsTts.push(`--voice-settings.${k}`, String(settings[k]));
          const respuesta = await ejecutar(argsTts);
          if (typeof respuesta.audio_base64 !== "string" || !respuesta.audio_base64.length || !/^[A-Za-z0-9+/]+={0,2}$/u.test(respuesta.audio_base64)) throw new Error("Audio base64 ausente o inválido");
          const audio = Buffer.from(respuesta.audio_base64, "base64");
          if (!audio.length || respuesta.audio_base64.length % 4 === 1) throw new Error("Audio base64 vacío o inválido");
          fs.mkdirSync(path.dirname(r.mp3), {recursive: true});
          // Invalidar la recepción anterior antes de sustituir sus archivos.
          fs.rmSync(r.meta, {force: true});
          fs.writeFileSync(r.mp3, audio);
          escribirJson(r.caracteres, respuesta.alignment);
          await completarRecepcion(p, r, medir, cliVersion);
        } else if (o.reconstruir && !existe(r.meta) && existe(r.mp3) && existe(r.caracteres)) {
          // Recepción ya pagada cuyo cierre falló: se rehace sin llamar a la API.
          await completarRecepcion(p, r, medir, cliVersion);
          log(`RECONSTRUIDO ${cue.cueId} desde archivos existentes`);
        }
        const meta = leerJson(r.meta);
        if (!cabeVoz(cue, meta.durationMs)) {fallos++; log(`FAIL ${cue.cueId}: excede ${(meta.durationMs - (ventana(cue) - 100)).toFixed(1)} ms (incluye reserva de 100 ms); archivos conservados, sin registrar. Ajustar modelo/velocidad y usar --forzar.`);}
        else log(`OK ${cue.cueId}: ${meta.durationMs.toFixed(1)} ms${p.cached && !o.forzar ? " (caché)" : ""}`);
        if (o.verificar) {
          const stt = await ejecutar(["speech-to-text", "convert", "--model-id", "scribe_v1", "--language-code", "es", "--file", r.mp3, "--format", "json"]);
          if (typeof stt.text !== "string") throw new Error("STT sin campo text");
          const comparacion = tasaErrorPalabras(cue.speechText, stt.text);
          escribirJson(r.stt, {...stt, referencia: cue.speechText, ...comparacion});
          log(`STT ${cue.cueId}: WER ${(comparacion.wer * 100).toFixed(2)}% (${comparacion.errores}/${comparacion.palabras}); revisar escucha en el host.`);
        }
      } catch (error) {fallos++; log(`FAIL ${cue.cueId}: ${error.message}`);}
    }
  } finally {regenerarRegistro(raiz);}
  return fallos ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {process.exitCode = await generarVoces(process.argv.slice(2));}
  catch (error) {console.error(error.message); process.exitCode = 1;}
}
