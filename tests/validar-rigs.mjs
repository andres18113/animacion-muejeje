import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { MASCOTAS } from "../src/mascotas/catalogo.ts";
import { CUES_DIALOGO } from "../src/arranque/dialogo.ts";
import { segmentosDeCue, estaHablando } from "../src/arranque/subtitulos.ts";

const generado = new URL("../src/personajes/rigs.generated.ts", import.meta.url);
assert.doesNotThrow(() => readFileSync(generado), "Deben generarse los 15 rigs");
const { RIGS } = await import(generado.href);
const { extraerRig } = await import("../scripts/generar-rigs.mjs");
const { POSE_BASE, EXPRESIONES, mezclarPoses } = await import("../src/personajes/poses.ts");
const { geometriaBoca } = await import("../src/personajes/geometria.ts");
const { visemaDeCaracter, bocaEnFrame, parpadeoEnFrame, respiracionEnFrame } = await import("../src/personajes/labios.ts");
const svg = (id, expresion) => readFileSync(new URL(`../public/mascotas/${id}-${expresion}.svg`, import.meta.url), "utf8");
assert.equal(Object.keys(RIGS).length, 15);
for (const { id } of MASCOTAS) {
  const neutral = svg(id, "neutral");
  const hablando = svg(id, "hablando");
  const alerta = svg(id, "alerta");
  const rig = RIGS[id];
  assert.deepEqual(extraerRig(neutral, hablando, alerta, id), rig);
  assert.equal(rig.piernas.length, 2);
  assert.equal(rig.brazos.length, 2);
  assert.equal(rig.ojos.length, 2);
  const rostro = neutral.slice(neutral.indexOf('<g id="rostro"'));
  const bocaOriginal = [...rostro.matchAll(/<path d="([^"]+)"/g)].at(-1)[1];
  assert.equal(geometriaBoca(rig, POSE_BASE.boca).d, bocaOriginal, id);
  const pequena = geometriaBoca(rig, { ...POSE_BASE.boca, apertura: 1e-8 });
  assert.ok(Math.abs(pequena.grosor - rig.boca.grosor) < 1e-6);
  assert.throws(() => extraerRig(neutral.replace('id="rostro"', 'id="roto"'), hablando, alerta, id));
  const caraRota = neutral.slice(0, neutral.indexOf('<g id="rostro"')) + rostro.replace(`rx="${rig.ojos[0].blanco.rx}"`, 'rx="no"');
  assert.throws(() => extraerRig(caraRota, hablando, alerta, id));
  assert.throws(() => extraerRig(neutral.replace('<g id="cuerpo">', '<g id="cuerpo"><script/>'), hablando, alerta, id), "Rechazar geometría fuera de plantilla");
  assert.throws(() => extraerRig(neutral.replace('<g id="extremidades">', '<g id="extremidades" transform="translate(20 0)">'), hablando, alerta, id), "No ignorar transformaciones");
}
assert.equal(RIGS.voltio.partes.ventilador.centro.x, 202);
assert.equal(RIGS.voltio.partes.ventilador.centro.y, 214);
assert.ok(RIGS.pulso.partes.boton.markup.includes('r="107"'));
assert.ok(RIGS.secu.partes.led.markup.includes("#F3D076"));
assert.equal(EXPRESIONES.dormido.ojo, 1);
assert.deepEqual(mezclarPoses(POSE_BASE, { boca: { apertura: 1 }, mirada: { x: 1 } }, 0), POSE_BASE);
assert.equal(mezclarPoses(POSE_BASE, { boca: { apertura: 1 } }, 0.5).boca.apertura, 0.5);

const validarBoca = (boca) => {
  for (const clave of ["apertura", "ancho", "redondez"]) {
    assert.ok(Number.isFinite(boca[clave]) && boca[clave] >= 0 && boca[clave] <= 1, `${clave}: ${boca[clave]}`);
  }
  assert.ok(boca.sonrisa >= -1 && boca.sonrisa <= 1);
};
for (const caracter of "aáeéiíoóuúümbpfvlndtsczr ,.!?¿¡;:\n") validarBoca(visemaDeCaracter(caracter));
assert.equal(visemaDeCaracter("á").apertura, visemaDeCaracter("a").apertura);
for (const caracter of "mbp ,.!?") assert.equal(visemaDeCaracter(caracter).apertura, 0);
assert.notDeepEqual(visemaDeCaracter("o"), visemaDeCaracter("i"));
// El suavizado estimado conserva las ventanas anteriores a las grabaciones.
// Sus hashes exactos se verifican en validar-s06; no depende del montaje del audio real.
const {ventanasHistoricas}=JSON.parse(readFileSync(new URL("./fixtures/labios-defaults-s01-s05.json",import.meta.url),"utf8"));
for (const actual of CUES_DIALOGO) {
  const ventana=ventanasHistoricas[actual.cueId];
  const cue={...actual,...(ventana?{startFrame:ventana[0],durationFrames:ventana[1]}:{})};
  const segmentos = segmentosDeCue(cue);
  let anterior = null;
  let maximo = 0;
  for (let frame = 0; frame <= cue.startFrame + cue.durationFrames + 10; frame += 0.25) {
    const args = { cue, segmentos, frame, fps: 30 };
    const boca = bocaEnFrame(args);
    validarBoca(boca);
    assert.deepEqual(boca, bocaEnFrame(args));
    if (!estaHablando(cue, segmentos, frame)) assert.equal(boca.apertura, 0, `${cue.cueId}, ${frame}`);
    if (anterior) assert.ok(Math.abs(boca.apertura - anterior.apertura) < 0.26, "Mandíbula sin saltos");
    anterior = boca;
    maximo = Math.max(maximo, boca.apertura);
  }
  assert.ok(maximo > 0.2, `${cue.cueId}: debe hablar`);
}
const cue = { ...CUES_DIALOGO[0], startFrame: 10, durationFrames: 120, speechText: "iiii" };
const segmentos = [{ texto: "iiii", inicioFrame: 10, finFrame: 130 }];
for (const frame of [10, 10 + 1e-7, 130 - 1e-7, 130]) {
  const boca = bocaEnFrame({ cue, segmentos, frame, fps: 30 });
  for (const clave of ["apertura", "ancho", "redondez", "sonrisa"]) {
    assert.ok(Math.abs(boca[clave] - POSE_BASE.boca[clave]) < 1e-5, `Sin salto de ${clave} en ${frame}`);
  }
}
const alineacion = {
  characters: ["a", "m", "o"],
  character_start_times_seconds: [0, 0.5, 1.5],
  character_end_times_seconds: [0.5, 1, 2],
};
const alineada = (frame) => bocaEnFrame({ cue, segmentos, frame, fps: 30, alineacion });
assert.deepEqual(alineada(17), visemaDeCaracter("a"));
assert.equal(alineada(32).apertura, 0, "m cierra los labios");
assert.equal(alineada(48).apertura, 0, "hueco del alineado es silencio");
assert.equal(alineada(80).apertura, 0, "fin del alineado es silencio");
assert.deepEqual(alineada(62), visemaDeCaracter("o"));
assert.equal(bocaEnFrame({ cue, segmentos: [], frame: 17, fps: 30, alineacion }).apertura, 0);
assert.equal(bocaEnFrame({ cue, segmentos, frame: 17, fps: 30, alineacion: {
  characters: [], character_start_times_seconds: [], character_end_times_seconds: [],
} }).apertura, 0);
assert.throws(() => bocaEnFrame({ cue, segmentos, frame: 17, fps: 0 }));
assert.throws(() => bocaEnFrame({ cue, segmentos, frame: 17, fps: 30, alineacion: { ...alineacion, characters: ["a"] } }));
// Los huecos no consumen caracteres de speechText.
const dosTramos = [{ texto: "a", inicioFrame: 10, finFrame: 25 }, { texto: "o", inicioFrame: 100, finFrame: 115 }];
assert.deepEqual(bocaEnFrame({ cue: { ...cue, speechText: "ao" }, segmentos: dosTramos, frame: 107, fps: 30 }), visemaDeCaracter("o"));
for (const { id } of MASCOTAS) {
  let duracion = 0;
  let cantidad = 0;
  let inicioAnterior = null;
  let cierresCompletos = 0;
  for (let frame = 0; frame < 9000; frame++) {
    const parpadeo = parpadeoEnFrame(frame, id);
    assert.equal(parpadeo, parpadeoEnFrame(frame, id));
    assert.ok(parpadeo >= 0 && parpadeo <= 1);
    if (parpadeo === 1) cierresCompletos++;
    if (parpadeo > 0) {
      if (duracion === 0) {
        if (inicioAnterior !== null) assert.ok(frame - inicioAnterior >= 75 && frame - inicioAnterior <= 150);
        inicioAnterior = frame;
        cantidad++;
      }
      duracion++;
      assert.ok(duracion <= 8, `${id}: parpadeo demasiado largo`);
    } else duracion = 0;
    const respiracion = respiracionEnFrame(frame, id);
    assert.ok(respiracion >= 0 && respiracion <= 1);
    assert.equal(respiracion, respiracionEnFrame(frame, id));
  }
  assert.ok(cantidad > 50);
  assert.ok(cierresCompletos >= cantidad, `${id}: cada parpadeo debe cerrar el ojo`);
}
console.log("Rigs: 15 identidades; 4 cues; alineación, continuidad, silencios y 135000 frames de parpadeo verificados.");
