import React from "react";
import type {PerspectiveCamera} from "three";
import {Personaje} from "../../personajes/Personaje";
import {RIGS} from "../../personajes/rigs.generated.ts";
import {geometriaBrazo} from "../../personajes/geometria.ts";
import {bocaEnFrame, parpadeoEnFrame, respiracionEnFrame} from "../../personajes/labios.ts";
import {EXPRESIONES, mezclarPoses, type Pose, type PoseParcial} from "../../personajes/poses.ts";
import type {MascotaId} from "../../mascotas/catalogo.ts";
import type {CueVisual} from "../recursos.ts";
import {estaHablando} from "../subtitulos.ts";
import {proyectar, type Punto3D} from "./mundo.ts";
import type {Cuerpo} from "./guion/comun.ts";

/** Base de los pies en el viewBox 512 de los personajes. */
const BASE_PIES = 455;

export function poseDesdeCuerpo(c: Cuerpo, extra: PoseParcial = {}): Pose {
  const base = mezclarPoses(undefined, {
    salto: c.salto, squash: c.squash, inclinacion: c.inclinacion, paso: c.paso,
    brazoIzq: c.brazoIzq, brazoDer: c.brazoDer, codoIzq: c.codoIzq, codoDer: c.codoDer,
    boton: c.boton, led: c.led, ojo: c.ojo,
    mirada: {x: c.miradaX, y: c.miradaY},
    cejas: {altura: c.cejaAltura, angulo: c.cejaAngulo},
    mejillas: c.mejillas,
    boca: {sonrisa: c.sonrisa},
    ...extra,
  });
  // La sorpresa abre la boca en "o" cuando el personaje no está hablando.
  return c.sorpresa > 0 ? mezclarPoses(base, {boca: EXPRESIONES.sorpresa.boca}, c.sorpresa) : base;
}

export const Actor: React.FC<{
  id: MascotaId;
  camara: PerspectiveCamera;
  lugar: Punto3D;
  alto: number;
  cuerpo: Cuerpo;
  frame: number;
  frameAmbiente?: number;
  fps: number;
  cue?: CueVisual;
  ventilador?: number;
}> = ({id, camara, lugar, alto, cuerpo, frame, frameAmbiente = frame, fps, cue, ventilador = 0}) => {
  if (cuerpo.visible <= 0) return null;
  const pie = proyectar(camara, [lugar[0] + cuerpo.desplazX, lugar[1], lugar[2]]);
  const tamano = pie.escala * alto;
  const respiracion = respiracionEnFrame(frameAmbiente, id, fps);
  const parpadeo = parpadeoEnFrame(frameAmbiente, id, fps);
  const extra: PoseParcial = {
    ventilador,
    squash: cuerpo.squash + 0.018 * (respiracion - 0.5),
    ojo: Math.max(cuerpo.ojo, parpadeo),
  };
  let pose = poseDesdeCuerpo(cuerpo, extra);
  if (cue && estaHablando(cue.cue, cue.segmentos, frame)) {
    // Mientras habla, la boca sigue siempre los visemas (también en consonantes cerradas)
    // y conserva una parte de la intención emocional de la coreografía.
    const boca = bocaEnFrame({cue: cue.cue, segmentos: cue.segmentos, frame, fps, alineacion: cue.caracteres});
    pose = {...pose, boca: {...boca, sonrisa: Math.max(-1, Math.min(1, boca.sonrisa + cuerpo.sonrisa * 0.35))}};
  }
  return (
    <div
      style={{
        position: "absolute",
        left: pie.x - tamano / 2,
        top: pie.y - tamano * (BASE_PIES / 512),
        width: tamano,
        height: tamano,
        opacity: Math.min(1, cuerpo.visible),
      }}
    >
      <Personaje id={id} pose={pose} tamano={tamano} />
    </div>
  );
};

/**
 * Posición en pantalla de la mano de un personaje (0 = izquierda de la imagen),
 * con la misma geometría del rig: sirve para anclar efectos a sus gestos.
 */
export function manoEnPantalla(id: MascotaId, camara: PerspectiveCamera, lugar: Punto3D, alto: number, cuerpo: Cuerpo, lado: 0 | 1): {x: number; y: number} {
  const pie = proyectar(camara, [lugar[0] + cuerpo.desplazX, lugar[1], lugar[2]]);
  const u = (pie.escala * alto) / 512;
  const brazo = RIGS[id].brazos[lado];
  const mano = geometriaBrazo(brazo, lado === 0 ? cuerpo.brazoIzq : cuerpo.brazoDer, lado === 0 ? cuerpo.codoIzq : cuerpo.codoDer).mano;
  return {x: pie.x + (mano.x - 256) * u, y: pie.y + (mano.y - BASE_PIES - cuerpo.salto) * u};
}

/** Ángulo acumulado de un ventilador cuya velocidad (grados/frame) sube de 0 a vMax entre f0 y f1. */
export function anguloVentilador(frame: number, f0: number, f1: number, vMax: number): number {
  let angulo = 0;
  for (let f = 0; f < frame; f++) {
    const t = Math.max(0, Math.min(1, (f - f0) / Math.max(1, f1 - f0)));
    angulo += vMax * t * t;
  }
  return angulo;
}
