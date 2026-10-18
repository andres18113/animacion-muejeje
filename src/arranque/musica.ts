import {CUES_DIALOGO} from "./dialogo.ts";
import {rutaCaracteres, volumenMusica} from "./audio.ts";
import {CARACTERES_GENERADOS} from "./voces.generado.ts";
import {intervaloVozGlobal} from "./intervalosVoz.ts";
import {FPS, STORYBOARD} from "./tiempo.ts";

export const RUTA_MUSICA = "musica/fondo.mp3";
/** Reloj del video completo, compartido con la medición de silencios. */
export const INTERVALOS_VOZ_GLOBALES = CUES_DIALOGO.flatMap(cue => {
  const caracteres = CARACTERES_GENERADOS[rutaCaracteres(cue)];
  return cue.provider === "none" || !caracteres ? [] : [intervaloVozGlobal(cue, caracteres)];
});
export const DURACION_MUSICA = Math.round(STORYBOARD[STORYBOARD.length - 1].finSegundos * FPS);

export function gananciaMusica(frame: number): number {
  const fundido = Math.max(0, Math.min(1, frame / FPS, (DURACION_MUSICA - 1 - frame) / (2 * FPS)));
  return volumenMusica(frame, INTERVALOS_VOZ_GLOBALES) * fundido;
}
