import {Track} from "remotion";
import {duracionEscena} from "./anclas.ts";
import {S01Energia} from "./escenas/S01Energia";
import {S02Orden} from "./escenas/S02Orden";
import {S03PrimeraInstruccion} from "./escenas/S03PrimeraInstruccion";

/** Fase A completa (S01–S03; duración derivada del storyboard): cada escena empieza con la cámara y los estados con que termina la anterior. */
export const MacroEncendido = () => <Track name="Fase A: Encendido">
  <S01Energia name="S01: Alimentación inicial" durationInFrames={duracionEscena("S01")} />
  <S02Orden name="S02: Control de encendido" from={duracionEscena("S01")} durationInFrames={duracionEscena("S02")} />
  <S03PrimeraInstruccion name="S03: Primera instrucción" from={duracionEscena("S01") + duracionEscena("S02")} durationInFrames={duracionEscena("S03")} />
</Track>;
