// Validación cinematográfica de S01/S02 sin navegador: ejecuta las coreografías
// GSAP fotograma a fotograma y proyecta los personajes con la misma cámara de
// Three.js que usa el render. Comprueba encuadre, legibilidad, zona de
// subtítulos, continuidad entre escenas registradas y determinismo.
import assert from "node:assert/strict";
import {crearMotor} from "../src/arranque/cine/motor.ts";
import {REGISTRO_CINE as ESCENAS} from "../src/arranque/cine/guion/registro.ts";
import {crearCamara, proyectar} from "../src/arranque/cine/mundo.ts";
import {anclasDeEscena, cuesDeEscena} from "../src/arranque/recursos.ts";

const FPS = 30;
const ANCHO = 1920;
const ALTO = 1080;
const BANDA_SUBTITULOS = 885; // borde superior del texto de subtítulos (2 líneas)
const BASE_PIES = 455;

function cajaActor(camara, actor, cuerpo) {
  const pie = proyectar(camara, [actor.lugar[0] + (cuerpo.desplazX ?? 0), actor.lugar[1], actor.lugar[2]]);
  const t = pie.escala * actor.alto;
  const u = t / 512;
  const top = pie.y - (BASE_PIES - 60 + (cuerpo.salto ?? 0)) * u;
  return {izq: pie.x - 216 * u, der: pie.x + 216 * u, top, base: pie.y + 15 * u, alto: t, delante: pie.profundidad > 0};
}

const errores = [];
const avisos = [];
for (const escena of ESCENAS) {
  const cues = cuesDeEscena(escena.id);
  const anclas = anclasDeEscena(escena.id, cues);
  const motor = crearMotor(escena.guion, anclas, FPS);
  const otro = crearMotor(escena.guion, anclas, FPS);
  for (let frame = 0; frame < escena.frames; frame++) {
    const e = motor.en(frame);
    // Determinismo: otro motor, recorrido en otro orden, da el mismo estado.
    if (frame % 37 === 0) assert.deepEqual(otro.en(escena.frames - 1 - frame) && otro.en(frame), e, `${escena.id} determinista en ${frame}`);
    const camara = crearCamara(e.cam);
    const subtitulo = cues.some(({segmentos}) => segmentos.some((s) => frame >= s.inicioFrame && frame < s.finFrame + 6));
    for (const actor of escena.actores) {
      const c = cajaActor(camara, actor, e[actor.clave]);
      const habla = cues.some(({cue}) => cue.mascotId === actor.id && frame >= cue.startFrame && frame < cue.startFrame + cue.durationFrames);
      const enPantalla = c.der > 0 && c.izq < ANCHO && c.base > 0 && c.top < ALTO;
      if (habla) {
        if (c.izq < 0 || c.der > ANCHO || c.top < 0) errores.push({escena: escena.id, frame, actor: actor.id, regla: "hablante fuera de cuadro", caja: c});
        if (c.alto < 200) errores.push({escena: escena.id, frame, actor: actor.id, regla: "hablante demasiado pequeño", caja: c});
      }
      if (enPantalla && subtitulo && c.base > BANDA_SUBTITULOS) {
        (habla ? errores : avisos).push({escena: escena.id, frame, actor: actor.id, regla: "pies bajo la banda de subtítulos", caja: c});
      }
    }
  }
}

// Los enlaces conservan los frames y tolerancias de la referencia aprobada.
for (const escena of ESCENAS) {
  const enlace = escena.continuidad;
  if (!enlace) continue;
  const siguiente = ESCENAS.find(e => e.id === enlace.hacia);
  assert.ok(siguiente, 'Destino de continuidad registrado');
  const m1 = crearMotor(escena.guion, anclasDeEscena(escena.id, cuesDeEscena(escena.id)), FPS);
  const m2 = crearMotor(siguiente.guion, anclasDeEscena(siguiente.id, cuesDeEscena(siguiente.id)), FPS);
  const fin = m1.en(enlace.frameCamara).cam;
  const inicio = m2.en(0).cam;
  for (const k of Object.keys(inicio)) {
    assert.ok(Math.abs(fin[k] - inicio[k]) < 1e-6, `continuidad de cámara (${k}): ${fin[k]} ≠ ${inicio[k]}`);
  }
  for (const clave of enlace.actores) {
    const a = m1.en(enlace.frameActores)[clave];
    const b = m2.en(0)[clave];
    for (const k of Object.keys(b)) assert.ok(Math.abs(a[k] - b[k]) < 1e-6, `continuidad de ${clave}.${k}: ${a[k]} ≠ ${b[k]}`);
  }
  const casiFin = m1.en(escena.frames - 1).cam;
  const salto = Math.hypot(casiFin.px - inicio.px, casiFin.py - inicio.py, casiFin.pz - inicio.pz);
  assert.ok(salto < enlace.maxSalto, `salto de cámara en el corte ${escena.id}→${siguiente.id}: ${salto.toFixed(3)}`);
  for (const par of enlace.persistentes ?? []) {
    const valor = (s, ruta) => ruta.split('.').reduce((v, k) => v?.[k], s);
    const a = valor(m1.en(escena.frames - 1), par.desde);
    const b = valor(m2.en(0), par.hasta);
    assert.ok(Number.isFinite(a) && Number.isFinite(b), `estado persistente registrado: ${par.desde}`);
    assert.equal(a, b, `persistencia ${par.desde}`);
  }
}

function agrupar(lista) {
  const grupos = new Map();
  for (const x of lista) {
    const clave = `${x.escena} ${x.actor} ${x.regla}`;
    const g = grupos.get(clave) ?? {clave, desde: x.frame, hasta: x.frame, n: 0, ejemplo: x.caja};
    g.hasta = x.frame;
    g.n++;
    grupos.set(clave, g);
  }
  return [...grupos.values()].map((g) => ({...g, ejemplo: `x ${g.ejemplo.izq.toFixed(0)}..${g.ejemplo.der.toFixed(0)} y ${g.ejemplo.top.toFixed(0)}..${g.ejemplo.base.toFixed(0)} alto ${g.ejemplo.alto.toFixed(0)}`}));
}

if (avisos.length) console.table(agrupar(avisos));
if (errores.length) {
  console.table(agrupar(errores));
  console.error(`ENCUADRE: ${errores.length} frames con errores`);
  process.exit(1);
}
console.log(`VALIDADO CINE: ${ESCENAS.map((e) => e.id).join(", ")}; encuadre de hablantes, banda de subtítulos, continuidad ${ESCENAS.filter((e) => e.continuidad).map((e) => `${e.id}→${e.continuidad.hacia}`).join(", ")} y determinismo GSAP.`);
