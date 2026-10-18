import {gsap} from "gsap";
import type {Anclas, Guion} from "./guion/comun.ts";

export type Estado = Record<string, number>;

export function crearMotor<T extends Record<string, Estado>>(guion: Guion<T>, anclas: Anclas, fps: number) {
  const estado = guion.inicial();
  const tl = gsap.timeline({paused: true, defaults: {ease: "power2.inOut"}});
  guion.construir(tl, estado, (frames) => frames / fps, anclas);
  return {
    /** Estado en un frame dado (copia; los objetos animados contienen referencias internas de GSAP). */
    en(frame: number): T {
      tl.seek(frame / fps, true);
      return copiarNumeros(estado);
    },
  };
}

/** Copia solo los campos numéricos: GSAP añade a cada objeto animado una referencia interna `_gsap`. */
function copiarNumeros<T extends Record<string, Estado>>(estado: T): T {
  const copia: Record<string, Estado> = {};
  for (const grupo of Object.keys(estado)) {
    const valores: Estado = {};
    for (const [clave, valor] of Object.entries(estado[grupo])) {
      if (typeof valor === "number") valores[clave] = valor;
    }
    copia[grupo] = valores;
  }
  return copia as T;
}
