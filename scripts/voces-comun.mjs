import {createHash} from "node:crypto";
import {spawn} from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// Incrementar cuando cambien el contrato de generación o el mapeo.
export const VERSION = 1;
export const normalizar = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const tokens = (texto) => [...texto.matchAll(/\S+/gu)].map(m => ({texto: m[0], indice: m.index}));
const clave = (texto) => normalizar(texto).replace(/ /gu, "");
const FONETICA = {
  atx: "a te equis", pwrok: "power ok", pson: "pe ese on negada", cpu: "ce pe u",
  ii: "dos", fffffff0: "siete efes cero", bios: "bios", post: "post", eeprom: "e e prom",
  sdram: "ese de ram", ram: "ram", ide: "i de e", ata: "ata", cmos: "ce mos", mbr: "eme be erre", grub: "grub", pid: "pe i de",
};

export function validarCaracteres(texto, a) {
  if (!a || !Array.isArray(a.characters) || !Array.isArray(a.character_start_times_seconds) || !Array.isArray(a.character_end_times_seconds) || a.characters.join("") !== texto || a.characters.length !== a.character_start_times_seconds.length || a.characters.length !== a.character_end_times_seconds.length) throw new Error("Alineación por carácter distinta de speechText o longitudes inválidas");
  let anterior = 0;
  for (let i = 0; i < a.characters.length; i++) {
    const inicio = a.character_start_times_seconds[i], fin = a.character_end_times_seconds[i];
    if (typeof a.characters[i] !== "string" || Array.from(a.characters[i]).length !== 1 || !Number.isFinite(inicio) || !Number.isFinite(fin) || inicio < anterior || fin < inicio) throw new Error("Alineación por carácter desordenada o inválida");
    anterior = fin;
  }
  return a;
}

/** Un token visible puede abarcar varias palabras habladas; nunca repartir por longitud. */
export function mapearPalabras(speechText, displayText, alineacion) {
  validarCaracteres(speechText, alineacion);
  const habladas = tokens(speechText), visibles = tokens(displayText), salida = [];
  // Los índices de RegExp usan UTF-16; los timestamps pueden agrupar varios puntos de código.
  const indices = [];
  let offset = 0;
  alineacion.characters.forEach((c, i) => {for (let n = 0; n < c.length; n++) indices[offset++] = i;});
  let cursor = 0;
  for (const visible of visibles) {
    const literal = clave(visible.texto);
    const alternativas = [[literal], ...(FONETICA[literal] ? [FONETICA[literal].split(" ")] : [])];
    const grupo = alternativas.find(lista => lista.every((p, i) => habladas[cursor + i] && clave(habladas[cursor + i].texto) === p));
    if (!grupo) throw new Error(`No se puede mapear «${visible.texto}» cerca de «${habladas[cursor]?.texto ?? "fin"}»`);
    const primera = habladas[cursor], ultima = habladas[cursor + grupo.length - 1];
    const startMs = alineacion.character_start_times_seconds[indices[primera.indice]] * 1000;
    const endMs = alineacion.character_end_times_seconds[indices[ultima.indice + ultima.texto.length - 1]] * 1000;
    if (endMs <= startMs) throw new Error(`Alineación vacía para «${visible.texto}»`);
    salida.push({text: ` ${visible.texto}`, startMs, endMs, timestampMs: null, confidence: null});
    cursor += grupo.length;
  }
  if (cursor !== habladas.length) throw new Error("No se puede mapear: sobran palabras habladas");
  return salida;
}

const ordenar = (objeto) => objeto && typeof objeto === "object" && !Array.isArray(objeto) ? Object.fromEntries(Object.keys(objeto).sort().filter(k => objeto[k] !== undefined).map(k => [k, ordenar(objeto[k])])) : objeto;
export const hashVoz = ({speechText, voiceId, model, settings, version = VERSION}) => createHash("sha256").update(JSON.stringify(ordenar({speechText, voiceId, model, settings, version}))).digest("hex");

export function ajustesEfectivos(model, ajustes) {
  const salida = {stability: ajustes.stability, similarityBoost: ajustes.similarityBoost};
  if (model !== "eleven_v4") for (const k of ["speed", "style"]) if (ajustes[k] !== undefined) salida[k] = ajustes[k];
  for (const k of ["stability", "similarityBoost", "style"]) if (salida[k] !== undefined && (!Number.isFinite(salida[k]) || salida[k] < 0 || salida[k] > 1)) throw new Error(`Ajuste ${k} fuera de 0–1`);
  if (salida.speed !== undefined && (!Number.isFinite(salida.speed) || salida.speed < .7 || salida.speed > 1.2)) throw new Error("Ajuste speed fuera de 0.7–1.2");
  return salida;
}

export function resolverEjecutable(nombre, {plataforma = process.platform, ruta = process.env.PATH ?? process.env.Path ?? ""} = {}) {
  const nombres = plataforma === "win32" ? [`${nombre}.exe`, `${nombre}.cmd`, nombre] : [nombre];
  for (const directorio of ruta.split(plataforma === "win32" ? ";" : ":").filter(Boolean)) for (const candidato of nombres) {
    const archivo = path.join(directorio.replace(/^"|"$/gu, ""), candidato);
    if (!fs.existsSync(archivo) || !fs.statSync(archivo).isFile()) continue;
    if (archivo.endsWith(".cmd")) {
      // Los .cmd de npm no son ejecutables con shell:false. Leer el shim y ejecutar
      // su entrada JS con Node evita cmd.exe y conserva cada argumento literalmente.
      const shim = fs.readFileSync(archivo, "utf8");
      const entrada = /"%dp0%[\\/]([^"\r\n]+\.(?:mjs|cjs|js))"/iu.exec(shim);
      if (!entrada) continue;
      const script = path.resolve(path.dirname(archivo), entrada[1].replace(/\\/gu, path.sep));
      if (fs.existsSync(script)) return {archivo: process.execPath, prefijo: [script]};
    } else return {archivo, prefijo: []};
  }
  throw new Error(`${nombre} no disponible en PATH (se admiten .exe y shim npm .cmd); instalar/configurar en el host`);
}

export function ejecutarProceso(archivo, args) {
  return new Promise((resolve, reject) => {
    const hijo = spawn(archivo, args, {shell: false, windowsHide: true, stdio: ["ignore", "pipe", "pipe"]});
    let stdout = "", stderr = "";
    hijo.stdout.setEncoding("utf8").on("data", d => {stdout += d;});
    hijo.stderr.setEncoding("utf8").on("data", d => {stderr += d;});
    hijo.on("error", reject);
    // No volcar stderr: puede contener detalles de autenticación del CLI.
    hijo.on("close", codigo => codigo === 0 ? resolve(stdout) : reject(new Error(`Falló ${path.basename(archivo)} (código ${codigo}); revisar CLI en el host. ${stderr ? "Hay diagnóstico del CLI, omitido por privacidad." : ""}`)));
  });
}

export async function ejecutarEleven(args) {
  const ejecutable = resolverEjecutable("elevenlabs");
  const salida = await ejecutarProceso(ejecutable.archivo, [...ejecutable.prefijo, ...args]);
  if (!args.includes("--format")) return salida.trim();
  try {return JSON.parse(salida);} catch {throw new Error("ElevenLabs no devolvió JSON válido; revisar versión/autenticación en el host");}
}
export const comando = (args) => `elevenlabs ${args.map(a => `'${String(a).replace(/'/gu, "''")}'`).join(" ")}`;
export const leerJson = (archivo) => JSON.parse(fs.readFileSync(archivo, "utf8"));
export const escribirJson = (archivo, datos) => fs.writeFileSync(archivo, `${JSON.stringify(datos, null, 2)}\n`);
export const vocesDeCuenta = (respuesta) => {
  if (!Array.isArray(respuesta?.voices) || respuesta.voices.some(v => typeof v.voice_id !== "string")) throw new Error("Respuesta voices search inválida");
  return new Set(respuesta.voices.map(v => v.voice_id));
};
export async function consultarVoces(ejecutar) {
  const voces = new Set(), paginas = new Set();
  let token;
  do {
    const args = ["voices", "search", "--format", "json", "--page-size", "100"];
    if (token) args.push("--next-page-token", token);
    const respuesta = await ejecutar(args);
    for (const id of vocesDeCuenta(respuesta)) voces.add(id);
    token = respuesta.has_more ? respuesta.next_page_token : null;
    if (respuesta.has_more && (typeof token !== "string" || !token || paginas.has(token))) throw new Error("Paginación de voces inválida");
    if (token) paginas.add(token);
  } while (token);
  return voces;
}
export function validarSuscripcion(s) {
  for (const k of ["character_count", "character_limit", "voice_slots_used", "voice_limit"]) if (!Number.isFinite(s?.[k]) || s[k] < 0) throw new Error(`Suscripción inválida: ${k}`);
  return s;
}
export function tasaErrorPalabras(referencia, texto) {
  const a = normalizar(referencia).split(" ").filter(Boolean), b = normalizar(texto).split(" ").filter(Boolean);
  let fila = Array.from({length: b.length + 1}, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {const siguiente = [i]; for (let j = 1; j <= b.length; j++) siguiente[j] = Math.min(fila[j] + 1, siguiente[j - 1] + 1, fila[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); fila = siguiente;}
  return {errores: fila[b.length], palabras: a.length, wer: a.length ? fila[b.length] / a.length : b.length ? 1 : 0};
}
