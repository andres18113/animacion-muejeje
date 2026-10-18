import {CUES_DIALOGO, type CueDialogo} from "./dialogo.ts";
import {ANCLAS_VISUALES, anclaEnCue} from "./anclas.ts";
import {rutaCaracteres} from "./audio.ts";
import {segmentosDeCue, type Caption, type SegmentoSubtitulo} from "./subtitulos.ts";
import type {AlineacionCaracteres} from "../personajes/labios.ts";
import type {EscenaId} from "./tiempo.ts";
import {ALINEACIONES_GENERADAS, CARACTERES_GENERADOS} from "./voces.generado.ts";

/** Datos locales generados fuera del render, registrados por alignmentPath. */
export const ALINEACIONES: Readonly<Record<string, readonly Caption[] | undefined>> = ALINEACIONES_GENERADAS;
/** Alineaciones medidas por carácter, registradas por rutaCaracteres(cue). */
export const ALINEACIONES_CARACTERES: Readonly<Record<string, AlineacionCaracteres | undefined>> = CARACTERES_GENERADOS;
export type CueVisual = {cue: CueDialogo; segmentos: readonly SegmentoSubtitulo[]; caracteres: AlineacionCaracteres | null};

export function cuesDeEscena(id: EscenaId): CueVisual[] {
  return CUES_DIALOGO.filter((cue) => cue.sceneId === id).map((cue) => {
    const alineacion = cue.alignmentPath ? ALINEACIONES[cue.alignmentPath] : undefined;
    if (cue.alignmentPath && alineacion === undefined) throw new Error(`Alineación local no registrada: ${cue.alignmentPath}`);
    // La boca solo usa tiempos por carácter de una voz real ya alineada; nunca con la estimación.
    const caracteres = cue.alignmentPath ? ALINEACIONES_CARACTERES[rutaCaracteres(cue)] ?? null : null;
    return {cue, segmentos: segmentosDeCue(cue, alineacion), caracteres};
  });
}

export function anclasDeEscena(id: EscenaId, cues: readonly CueVisual[]): Record<string, number> {
  const resultado: Record<string, number> = {};
  for (const ancla of ANCLAS_VISUALES.filter((item) => item.sceneId === id)) {
    const visual = cues.find(({cue}) => cue.cueId === ancla.cueId);
    if (!visual) throw new Error(`Falta cue ${ancla.cueId}`);
    resultado[ancla.evento] = anclaEnCue(visual.cue, ancla.palabra, visual.segmentos);
  }
  return resultado;
}
