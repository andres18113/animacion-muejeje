import {duracionEscena} from "../src/arranque/anclas.ts";
// Regresión de continuidad, causalidad y persistencia de S03; sin DOM ni render.
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {respiracionEnFrame} from "../src/personajes/labios.ts";
import {crearMotor} from "../src/arranque/cine/motor.ts";
import {GUION_S02} from "../src/arranque/cine/guion/S02.ts";
import {GUION_S03, RETORNO_FIRMWARE} from "../src/arranque/cine/guion/S03.ts";
import {anclasDeEscena, cuesDeEscena} from "../src/arranque/recursos.ts";

const motor = (id, guion) => crearMotor(guion, anclasDeEscena(id, cuesDeEscena(id)), 30);
const anterior = motor("S02", GUION_S02).en(duracionEscena("S02") - 1);
const secuencial = motor("S03", GUION_S03);
const estados = Array.from({length: duracionEscena("S03")}, (_, frame) => secuencial.en(frame));
let primeraRecepcion = null;
let primeraEjecucion = null;
for (const [frame, e] of estados.entries()) {
  const recibido = e.capa.retorno * RETORNO_FIRMWARE.factor >= 1;
  if (recibido) primeraRecepcion ??= frame;
  if (e.capa.ejecucion > 0) {
    primeraEjecucion ??= frame;
    assert.ok(recibido, `S03 f${frame}: CPU ejecuta sin recibir la primera instrucción`);
  }
  if (frame <= 24) assert.deepEqual(e.cam, anterior.cam, `S03 f${frame}: cámara abandona la metamorfosis`);
  if (frame >= 90) assert.ok(Math.abs(e.capa.placa - 0.3) < 1e-6, `S03 f${frame}: placa compite con la búsqueda`);
}
assert.notEqual(primeraRecepcion, null, "La primera instrucción debe llegar");
assert.notEqual(primeraEjecucion, null, "La CPU debe ejecutar tras recibirla");
assert.ok(primeraEjecucion > primeraRecepcion, "La ejecución visible sigue a la recepción");
assert.equal(estados[0].capa.placa, 1, "La placa conserva intensidad al corte");
assert.equal(estados[0].cipu.visible, 0, "Cipu nace del cartucho durante el hold");
assert.ok(estados[24].cipu.visible > 0.99 && estados[24].mundo.cartucho < 0.01, "La metamorfosis termina dentro del encuadre heredado");
assert.ok(estados.slice(0, 25).some(e => e.cipu.visible > 0 && e.cipu.visible < 1 && e.mundo.cartucho > 0), "Cartucho y Cipu comparten la transformación, sin corte instantáneo");
// El paso 137 recorre todos los frames en orden no secuencial, incluidos ambos
// lados de recepción/ejecución y estados de aparición, cámara y atenuación.
const saltos = motor("S03", GUION_S03);
for (let i = 0; i < estados.length; i++) {
  const frame = (i * 137) % estados.length;
  assert.deepEqual(saltos.en(frame), estados[frame], `S03 f${frame}: seek fuera de orden cambia el estado`);
}
console.log(`VALIDADO S03: ${duracionEscena("S03")} frames, recepción f${primeraRecepcion}, ejecución f${primeraEjecucion}; hold/metamorfosis, placa persistente y seek fuera de orden.`);

// El reloj de oyentes se enlaza en la instancia JSX, fuera del guion puro.
const escena = readFileSync(new URL("../src/arranque/escenas/S03PrimeraInstruccion.tsx", import.meta.url), "utf8");
const framesS02 = escena.includes('const FRAMES_S02 = duracionEscena("S02");');
assert.ok(framesS02, "La escena declara el offset ambiental heredado");
const offset = duracionEscena("S02");
for (const id of ["secu", "pulso"]) {
  const instancia = escena.split("\n").find(linea => linea.includes(`<Actor id="${id}"`));
  assert.ok(instancia?.includes("frame={frame + FRAMES_S02}"), `${id}: la instancia debe conservar el reloj ambiental de S02`);
  const antes = respiracionEnFrame(offset - 1, id, 30);
  const despues = respiracionEnFrame(offset, id, 30);
  assert.ok(Math.abs(despues - antes) < 0.04, `${id}: respiración avanza un frame sin reiniciar fase`);
}
console.log("VALIDADO S03: reloj ambiental de oyentes enlazado a S02 y respiración continua.");
