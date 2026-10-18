import {useMemo} from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import type {Anclas, Guion} from "./guion/comun.ts";
import {crearMotor, type Estado} from "./motor.ts";

export type {Estado} from "./motor.ts";

/**
 * Coreografía GSAP determinista. La línea de tiempo se construye una vez,
 * permanece en pausa y se posiciona con `seek(frame / fps)` en cada render:
 * GSAP solo interpola números de objetos de estado (nunca toca el DOM) y
 * React dibuja a partir de una copia. Mismo frame ⇒ mismo resultado.
 */
export function useCoreografia<T extends Record<string, Estado>>(guion: Guion<T>, anclas: Anclas): T {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const motor = useMemo(() => crearMotor(guion, anclas, fps), [guion, anclas, fps]);
  return motor.en(frame);
}
