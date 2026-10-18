import assert from "node:assert/strict";
import {STORYBOARD, FPS} from "../src/arranque/tiempo.ts";
import {CUES_DIALOGO} from "../src/arranque/dialogo.ts";
import {cuesDeEscena, anclasDeEscena} from "../src/arranque/recursos.ts";
import {fasesS05} from "../src/arranque/cine/guion/S05.ts";
import fs from "node:fs";
import {gsap} from "gsap";
import {rutaCaracteres, volumenMusica, MUSICA_PAUSA, MUSICA_VOZ, RAMPA_MUSICA} from "../src/arranque/audio.ts";
import {INTERVALOS_VOZ_GLOBALES, gananciaMusica, DURACION_MUSICA} from "../src/arranque/musica.ts";
import {limitesHabla} from "../src/arranque/intervalosVoz.ts";
import {REGISTRO_CINE} from "../src/arranque/cine/guion/registro.ts";
import {duracionEscena} from "../src/arranque/anclas.ts";
import {fasesS08} from "../src/arranque/cine/guion/S08.ts";

const total = Math.round(STORYBOARD.at(-1).finSegundos * FPS);
assert.ok(total >= 300 * FPS && total <= 360 * FPS);
const b = fasesS05(anclasDeEscena("S05", cuesDeEscena("S05")));
assert.ok(b.integridadFin - b.integridadInicio >= 30, "integridad legible un segundo");
assert.ok(b.cmosInicio - 5 - b.integridadInicio >= 30, "inserto firmware visible antes de cambiar de cámara");
assert.ok(Math.floor((b.cmosFin - b.cmosInicio) * .6) >= 30, "plano CMOS legible un segundo");
assert.ok(b.configFin - b.configInicio >= 30, "configuración legible un segundo");
assert.ok(b.refrescoFin - b.refrescoInicio >= 30, "refresco legible un segundo");
assert.ok(b.corteRami - b.configInicio >= 31 && b.corteRami - b.refrescoInicio >= 31, "instrumentos visibles un segundo antes del corte");
assert.ok(b.cierreAlternativa - anclasDeEscena("S05", cuesDeEscena("S05")).detencion >= 30, "diagnóstico 2Ch asentado un segundo");
const sector = fasesS08(anclasDeEscena("S08", cuesDeEscena("S08")));
assert.ok(sector.alternativaFin - sector.alternativaInicio - 20 >= 30, "alternativa del sector legible, sin contar sus fundidos");
const leer = p => JSON.parse(fs.readFileSync(new URL(p, import.meta.url), "utf8"));
const base = leer("./fixtures/montaje-original.json");
const T = 3_000_000, TF = T / FPS;
// Cálculo independiente de los límites, directamente de los archivos del servicio.
const caracter = cue => {
  const a = leer(`../public/${rutaCaracteres(cue)}`);
  const primero = a.characters.findIndex(c => /\S/u.test(c));
  let ultimo = a.characters.length - 1;
  while (!/[^\s\p{P}]/u.test(a.characters[ultimo])) ultimo--;
  return {inicio: Math.round(a.character_start_times_seconds[primero] * 1e6) * 3, fin: Math.round(a.character_end_times_seconds[ultimo] * 1e6) * 3};
};
const calcular = (escenas, cues) => {
  let offset = 0;
  const voces = escenas.flatMap(e => {
    const items = cues.filter(c => c.sceneId === e.id).map(c => {
      const a = caracter(c);
      return {cueId: c.cueId, inicio: (offset + c.startFrame) * TF + a.inicio, fin: (offset + c.startFrame) * TF + a.fin};
    });
    offset += e.frames;
    return items;
  });
  let cursor = 0;
  const silencios = [];
  for (const v of [...voces, {inicio: offset * TF, fin: offset * TF}]) {
    assert.ok(v.inicio >= cursor, "no hay voces solapadas");
    if (v.inicio > cursor) silencios.push(v.inicio - cursor);
    cursor = v.fin;
  }
  return {voces, silencios};
};
const originales = base.escenas.flatMap(e => e.cues.map(c => ({...CUES_DIALOGO.find(v => v.cueId === c.cueId), ...c})));
const antes = calcular(base.escenas, originales);
assert.deepEqual(antes.silencios, base.silencios.map(s => s.ticks), "fixture trazable al alineado real");
const totalOriginal = base.escenas.reduce((s, e) => s + e.frames, 0);
const minimoFrames = 300 * FPS;
const restante = cap => totalOriginal - antes.silencios.reduce((s, d) => s + Math.max(0, Math.ceil((d - cap) / TF)), 0);
let lo = 0, hi = totalOriginal * TF;
while (lo < hi) {const mid = Math.floor((lo + hi) / 2); if (restante(mid) < minimoFrames) lo = mid + 1; else hi = mid;}
assert.ok(restante(lo) >= minimoFrames, "el cap calculado satisface RNF-10");
assert.equal(total, restante(lo), "duración del montaje óptimo con el audio actual");
assert.ok(restante(lo - 1) < minimoFrames, "cualquier cap inferior incumple RNF-10");
// Reparto independiente de los recortes: colas o cues posteriores de la misma escena.
const recortes = antes.silencios.map(d => Math.max(0, Math.ceil((d - lo) / TF)));
let indiceVoz = 0;
for (const escena of base.escenas) {
  let desplazamiento = 0;
  for (const original of escena.cues) {
    const actual = CUES_DIALOGO.find(c => c.cueId === original.cueId);
    assert.equal(actual.startFrame, original.startFrame - desplazamiento, `${original.cueId}: inicio derivado del cap`);
    desplazamiento += recortes[++indiceVoz];
  }
  assert.equal(duracionEscena(escena.id), escena.frames - desplazamiento, `${escena.id}: duración derivada del cap`);
}
const despues = calcular(STORYBOARD.map(e => ({id: e.id, frames: duracionEscena(e.id)})), CUES_DIALOGO);
assert.deepEqual(despues.silencios, antes.silencios.map(d => d - Math.max(0, Math.ceil((d - lo) / TF)) * TF), "cada silencio se conserva o se reduce hasta el cap en frames enteros");
assert.ok(despues.silencios.every(d => d <= lo));
assert.equal(despues.silencios.reduce((a, b) => a + b, 0) + despues.voces.reduce((a, v) => a + v.fin - v.inicio, 0), total * TF, "partición completa sin doble contar cortes");
assert.deepEqual(INTERVALOS_VOZ_GLOBALES, despues.voces.map(v => ({inicioFrame: v.inicio / TF, finFrame: v.fin / TF})), "ducking = todas las voces en reloj global");
assert.equal(DURACION_MUSICA, total);
assert.equal(gananciaMusica(0), 0);
assert.equal(gananciaMusica(total - 1), 0);
assert.equal(gananciaMusica(15), volumenMusica(15, INTERVALOS_VOZ_GLOBALES) * .5, "fade-in de 30 frames");
assert.equal(gananciaMusica(total - 31), volumenMusica(total - 31, INTERVALOS_VOZ_GLOBALES) * .5, "fade-out de 60 frames");
const musicaComponente = fs.readFileSync(new URL("../src/arranque/componentes/MusicaGlobal.tsx", import.meta.url), "utf8");
assert.ok(musicaComponente.includes('loopVolumeCurveBehavior="extend"'), "el bucle conserva el reloj global de volumen");
assert.ok(musicaComponente.includes("getStaticFiles()") && musicaComponente.includes("return null"), "ausencia de pista: fallback vacío");
const video = fs.readFileSync(new URL("../src/arranque/VideoCompleto.tsx", import.meta.url), "utf8");
assert.equal((video.match(/<MusicaGlobal\s*\/>/g) ?? []).length, 1, "una sola capa en VideoCompleto");
for (const v of INTERVALOS_VOZ_GLOBALES) {
  const centro = (v.inicioFrame + v.finFrame) / 2;
  assert.equal(volumenMusica(centro, INTERVALOS_VOZ_GLOBALES), MUSICA_VOZ);
  if (centro >= 30 && centro <= total - 61) assert.equal(gananciaMusica(centro), MUSICA_VOZ);
}
assert.equal(volumenMusica(80, [{inicioFrame: 100, finFrame: 120}]), MUSICA_PAUSA);
assert.equal(volumenMusica(100 - RAMPA_MUSICA, [{inicioFrame: 100, finFrame: 120}]), MUSICA_PAUSA);
assert.ok(Math.abs(volumenMusica(100 - RAMPA_MUSICA / 2, [{inicioFrame: 100, finFrame: 120}]) - (MUSICA_PAUSA + MUSICA_VOZ) / 2) < 1e-12);
assert.ok(Math.abs(volumenMusica(120 + RAMPA_MUSICA / 2, [{inicioFrame: 100, finFrame: 120}]) - (MUSICA_PAUSA + MUSICA_VOZ) / 2) < 1e-12);
for (const e of REGISTRO_CINE) {
  const cues = cuesDeEscena(e.id), a = anclasDeEscena(e.id, cues);
  const tl = gsap.timeline({paused: true});
  e.guion.construir(tl, e.guion.inicial(), f => f / FPS, a);
  assert.ok(tl.getChildren().every(t => t.endTime() * FPS <= e.frames - 1 + 1e-6), `${e.id}: ninguna acción truncada en el corte`);
  tl.kill();
  const ultima = cues.at(-1).cue, habla = caracter(ultima);
  assert.ok(e.frames * TF - (ultima.startFrame * TF + habla.fin) >= .8 * T, `${e.id}: asentamiento después del habla`);
  for (const {cue} of cues) {
    const meta = leer(`../public/${cue.assetPath.replace(/\.mp3$/, ".meta.json")}`);
    assert.ok(cue.durationFrames * 1000 / FPS - meta.durationMs >= 100 - 1e-7);
    assert.ok(cue.startFrame >= 10 && cue.startFrame + cue.durationFrames <= e.frames - 10);
  }
}
const ficticia = {characters: [" ", "a", ".", " "], character_start_times_seconds: [0, .1, .3, .4], character_end_times_seconds: [.1, .3, .4, .5]};
assert.deepEqual(limitesHabla(ficticia), {inicioUs: 100000, finUs: 300000});
assert.throws(() => limitesHabla({...ficticia, characters: [" ", ".", "!", " "]}));
console.log(`VALIDADO montaje: mínimo C=${(lo / T).toFixed(9)} s (${lo} ticks), ${total} frames; cap inferior: ${restante(lo - 1)} frames. Audio íntegro, beats completos y ducking global exacto.`);
