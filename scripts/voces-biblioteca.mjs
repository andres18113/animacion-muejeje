import path from "node:path";
import {pathToFileURL} from "node:url";
import {REPARTO_VOCES} from "../src/arranque/voces.ts";
import {ejecutarEleven, comando, consultarVoces, validarSuscripcion} from "./voces-comun.mjs";

export function opcionesBiblioteca(args) {
  const o = {accion: null, mascotas: [], dryRun: false};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--dry-run") o.dryRun = true;
    else if (["--estado", "--agregar", "--quitar"].includes(arg)) {
      if (o.accion) throw new Error("Elegir --estado | --agregar mascot,... | --quitar mascot,...");
      o.accion = arg;
      if (arg !== "--estado") {
        const valor = args[++i];
        if (!valor || valor.startsWith("--")) throw new Error(`Faltan mascotas para ${arg}`);
        o.mascotas = [...new Set(valor.split(","))];
        for (const id of o.mascotas) if (!Object.hasOwn(REPARTO_VOCES, id)) throw new Error(`Mascota fuera de REPARTO_VOCES: ${id}`);
      }
    } else throw new Error(`Opción desconocida: ${arg}`);
  }
  if (!o.accion) throw new Error("Elegir --estado | --agregar mascot,... | --quitar mascot,...");
  return o;
}

export async function gestionarBiblioteca(args, {ejecutar = ejecutarEleven, log = console.log, reparto = REPARTO_VOCES} = {}) {
  const o = opcionesBiblioteca(args);
  const llamar = (argsCli) => {log(comando(argsCli)); return ejecutar(argsCli);};
  const agregar = (id, nombreFlag = "--new-name") => {
    const v = reparto[id];
    return ["voices", "share", "--public-user-id", v.publicOwnerId ?? `<publicOwnerId:${id}>`, "--voice-id", v.voiceId, nombreFlag, v.nombre, "--format", "json"];
  };
  const quitar = (id) => ["voices", "delete", "--voice-id", reparto[id].voiceId, "--format", "json"];
  if (o.dryRun) {
    log(comando(["user", "subscription", "get", "--format", "json"]));
    log(comando(["voices", "search", "--format", "json", "--page-size", "100"]));
    if (o.accion === "--agregar") log(comando(["voices", "share", "--help"]));
    for (const id of o.mascotas) log(comando(o.accion === "--agregar" ? agregar(id) : quitar(id)));
    log("DRY-RUN: sin llamadas. Slots/presencia desconocidos; el host comprobará cuota y flags de share antes de modificar. Completar publicOwnerId si aparece un marcador.");
    return 0;
  }
  const s = validarSuscripcion(await llamar(["user", "subscription", "get", "--format", "json"]));
  const presentes = await consultarVoces(llamar);
  log(`Slots: ${s.voice_slots_used}/${s.voice_limit}; caracteres: ${s.character_count}/${s.character_limit}. Límite del plan: 65 altas/ediciones mensuales; revisar uso en la cuenta.`);
  for (const [id, v] of Object.entries(reparto)) log(`${id}: ${v.nombre} (${v.voiceId}) ${presentes.has(v.voiceId) ? "presente" : "ausente"}`);
  if (o.accion === "--estado") return 0;
  const seleccion = o.mascotas.filter(id => o.accion === "--agregar" ? !presentes.has(reparto[id].voiceId) : presentes.has(reparto[id].voiceId));
  if (o.accion === "--agregar") {
    if (s.voice_slots_used + seleccion.length > s.voice_limit) throw new Error(`Sin slots: ${s.voice_slots_used} + ${seleccion.length} > ${s.voice_limit}; quitar otro lote primero`);
    for (const id of seleccion) if (!reparto[id].publicOwnerId?.trim()) throw new Error(`Completar REPARTO_VOCES.${id}.publicOwnerId en src/arranque/voces.ts con el propietario público de la biblioteca`);
    if (!seleccion.length) return 0;
    // Consultar el contrato real del CLI instalado; esta ayuda no consume generación.
    const ayuda = await llamar(["voices", "share", "--help"]);
    const nombreFlag = /--new-name\b/u.test(ayuda) ? "--new-name" : /--name\b/u.test(ayuda) ? "--name" : null;
    if (!nombreFlag || !/--public-user-id\b/u.test(ayuda) || !/--voice-id\b/u.test(ayuda)) throw new Error("Flags de voices share desconocidos; ejecutar elevenlabs voices share --help en el host");
    for (const id of seleccion) {
      const respuesta = await llamar(agregar(id, nombreFlag));
      if (respuesta?.voice_id !== reparto[id].voiceId) throw new Error(`El CLI devolvió otra identidad al añadir ${id}; revisar --estado antes de continuar`);
    }
  } else {
    // La lista se valida antes de toda llamada; ninguna otra voz puede borrarse.
    for (const id of seleccion) await llamar(quitar(id));
  }
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {process.exitCode = await gestionarBiblioteca(process.argv.slice(2));}
  catch (error) {console.error(error.message); process.exitCode = 1;}
}
