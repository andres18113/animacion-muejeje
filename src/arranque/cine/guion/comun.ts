import type {Estado} from "../motor.ts";

/** Estado plano que anima GSAP para un personaje (ver Actor.tsx). */
export type Cuerpo = Estado & {
  salto: number;
  squash: number;
  inclinacion: number;
  paso: number;
  brazoIzq: number;
  brazoDer: number;
  codoIzq: number;
  codoDer: number;
  boton: number;
  led: number;
  ojo: number;
  miradaX: number;
  miradaY: number;
  cejaAltura: number;
  cejaAngulo: number;
  mejillas: number;
  sonrisa: number;
  sorpresa: number;
  desplazX: number;
  visible: number;
};

export const CUERPO_BASE: Cuerpo = {
  salto: 0, squash: 0, inclinacion: 0, paso: 0,
  brazoIzq: 0, brazoDer: 0, codoIzq: 0, codoDer: 0,
  boton: 0, led: 1, ojo: 0, miradaX: 0, miradaY: 0,
  cejaAltura: 0, cejaAngulo: 0, mejillas: 0.25, sonrisa: 0, sorpresa: 0,
  desplazX: 0, visible: 1,
};

/** Anclas narrativas de una escena (frames relativos), derivadas del diálogo. */
export type Anclas = Record<string, number>;

/** Construye la línea de tiempo: `f(frames)` convierte frames de la escena a segundos de GSAP. */
export type Guion<T extends Record<string, Estado>> = {
  inicial: () => T;
  construir: (tl: gsap.core.Timeline, s: T, f: (frames: number) => number, a: Anclas) => void;
};
