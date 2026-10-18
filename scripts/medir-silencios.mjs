import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {CUES_DIALOGO} from "../src/arranque/dialogo.ts";
import {FPS, STORYBOARD} from "../src/arranque/tiempo.ts";
import {rutaCaracteres} from "../src/arranque/audio.ts";
import {limitesHabla} from "../src/arranque/intervalosVoz.ts";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// Reloj exacto de 3 MHz: un frame a 30 fps y un microsegundo son enteros.
const TICKS = 3_000_000;
const ticksFrame = TICKS / FPS;
const escenas = STORYBOARD.map(e => ({...e, inicio: Math.round(e.inicioSegundos * FPS) * ticksFrame, fin: Math.round(e.finSegundos * FPS) * ticksFrame}));
const total = escenas.at(-1).fin;
const voces = CUES_DIALOGO.map(cue => {
  const archivo = rutaCaracteres(cue);
  const alineacion = JSON.parse(fs.readFileSync(path.join(raiz, "public", archivo), "utf8"));
  const {inicioUs, finUs} = limitesHabla(alineacion);
  const base = escenas.find(e => e.id === cue.sceneId).inicio + cue.startFrame * ticksFrame;
  return {cueId: cue.cueId, escena: cue.sceneId, inicio: base + inicioUs * 3, fin: base + finUs * 3};
}).sort((a, b) => a.inicio - b.inicio);
const intervalo = (inicio, fin) => ({inicioTicks: inicio, finTicks: fin, inicioSegundos: inicio / TICKS, finSegundos: fin / TICKS, duracionSegundos: (fin - inicio) / TICKS, inicioFrame: inicio / ticksFrame, finFrame: fin / ticksFrame, duracionFrames: (fin - inicio) / ticksFrame});
const silencios = [];
let cursor = 0;
for (const voz of [...voces, {inicio: total, fin: total}]) {
  if (voz.inicio > cursor) {
    const partes = escenas.flatMap(e => {
      const desde = Math.max(cursor, e.inicio), hasta = Math.min(voz.inicio, e.fin);
      if (hasta <= desde) return [];
      const locales = voces.filter(v => v.escena === e.id);
      const tipo = hasta <= locales[0].inicio ? "entrada" : desde >= locales.at(-1).fin ? "cola" : "entre cues";
      return [{escena: e.id, tipo, ...intervalo(desde, hasta)}];
    });
    silencios.push({...intervalo(cursor, voz.inicio), escena: partes.map(p => p.escena).join("→"), tipo: partes.length > 1 ? "corte" : partes[0].tipo, partes});
  }
  cursor = Math.max(cursor, voz.fin);
}
const resultado = {fps: FPS, ticksPorSegundo: TICKS, duracionFrames: total / ticksFrame, duracionSegundos: total / TICKS, voces: voces.map(v => ({cueId: v.cueId, escena: v.escena, ...intervalo(v.inicio, v.fin)})), silencios};
const mmss = t => `${String(Math.floor(t / 60)).padStart(2, "0")}:${(t % 60).toFixed(2).padStart(5, "0")}`;
console.log(`Duración: ${resultado.duracionSegundos.toFixed(6)} s (${resultado.duracionFrames} frames). Límites exactos en ticks de 1/${TICKS} s; tabla redondeada a centésimas.`);
console.table(silencios.flatMap(s => [
  {inicio: mmss(s.inicioSegundos), fin: mmss(s.finSegundos), segundos: s.duracionSegundos.toFixed(6), escena: s.escena, tipo: s.tipo},
  ...(s.partes.length > 1 ? s.partes.map(p => ({inicio: mmss(p.inicioSegundos), fin: mmss(p.finSegundos), segundos: p.duracionSegundos.toFixed(6), escena: p.escena, tipo: `  ${p.tipo}`})) : []),
]));
fs.mkdirSync(path.join(raiz, "out/voces"), {recursive: true});
fs.writeFileSync(path.join(raiz, "out/voces/silencios.json"), JSON.stringify(resultado, null, 2) + "\n");
