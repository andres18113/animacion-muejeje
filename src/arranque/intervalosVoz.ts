import type {CueDialogo} from "./dialogo.ts";
import type {AlineacionCaracteres} from "../personajes/labios.ts";
import {FPS, STORYBOARD} from "./tiempo.ts";

/** Microsegundos enteros: conserva los límites del alineado sin cuantizarlos a frames. */
export function limitesHabla(alineacion: AlineacionCaracteres) {
  const primero = alineacion.characters.findIndex((c) => /\S/u.test(c));
  let ultimo = alineacion.characters.length - 1;
  while (ultimo >= 0 && !/[^\s\p{P}]/u.test(alineacion.characters[ultimo])) ultimo--;
  if (primero < 0 || ultimo < primero) throw new Error("Alineación sin habla");
  return {
    inicioUs: Math.round(alineacion.character_start_times_seconds[primero] * 1_000_000),
    finUs: Math.round(alineacion.character_end_times_seconds[ultimo] * 1_000_000),
  };
}

export function inicioEscena(id: string): number {
  const escena = STORYBOARD.find((e) => e.id === id);
  if (!escena) throw new Error(`Escena desconocida: ${id}`);
  return Math.round(escena.inicioSegundos * FPS);
}

/** Un intervalo por cue, del primer carácter no blanco al último carácter pronunciado. */
export function intervaloVozGlobal(cue: CueDialogo, alineacion: AlineacionCaracteres) {
  const {inicioUs, finUs} = limitesHabla(alineacion);
  const baseFrame = inicioEscena(cue.sceneId) + cue.startFrame;
  return {inicioFrame: baseFrame + inicioUs * FPS / 1_000_000, finFrame: baseFrame + finUs * FPS / 1_000_000};
}
