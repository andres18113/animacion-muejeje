import type {CueDialogo} from "./dialogo.ts";
import type {IntervaloFrames} from "./tiempo.ts";

type IdentidadVoz = Pick<CueDialogo, "sceneId" | "cueId" | "mascotId">;

function baseVoz(cue: IdentidadVoz): string {
  return `${cue.sceneId.toLowerCase()}/${cue.cueId.toLowerCase()}-${cue.mascotId}`;
}

/** Rutas locales relativas a public, en minúsculas como public/mascotas. */
export function rutaVoz(cue: IdentidadVoz, extension: "mp3" | "wav" = "mp3"): string {
  return `voces/${baseVoz(cue)}.${extension}`;
}

export function rutaAlineacion(cue: IdentidadVoz): string {
  return `voces/${baseVoz(cue)}.alineacion.json`;
}

/** Alineación por carácter del servicio TTS (characters + tiempos), relativa al inicio del cue: sincronía labial. */
export function rutaCaracteres(cue: IdentidadVoz): string {
  return `voces/${baseVoz(cue)}.caracteres.json`;
}

export function rutaSubtitulos(cue: IdentidadVoz): string {
  return `subtitulos/${baseVoz(cue)}.json`;
}

export type PistaAudio = {
  id: string;
  tipo: "voz" | "sfx" | "musica";
  src: string;
  /** Usar el mismo reloj para todas las pistas e intervalos que se comparan. */
  desdeFrame: number;
  duracionFrames: number;
  volumenBase: number;
  permitirDuranteVoz?: boolean;
};

export type SolapeAudio = {
  tipo: "voz/voz" | "sfx/voz";
  pistas: [string, string];
  inicioFrame: number;
  finFrame: number;
};

/**
 * Música presente en pausas y cambios de animación (MUSICA_PAUSA) y discreta bajo la narración
 * (MUSICA_VOZ, ≈ −15 dB): baja en los RAMPA_MUSICA frames previos a cada voz y recupera el nivel
 * en los posteriores. La envolvente mínima combina intervalos cercanos sin sumar ganancias.
 * Voz/voz nunca se permite; sfx/voz requiere permitirDuranteVoz en el efecto, de forma explícita.
 */
export const MUSICA_PAUSA = 0.22, MUSICA_VOZ = 0.04, RAMPA_MUSICA = 12;

export function volumenMusica(frame: number, intervalosVoz: readonly IntervaloFrames[]): number {
  let volumen = MUSICA_PAUSA;
  for (const intervalo of intervalosVoz) {
    if (intervalo.finFrame <= intervalo.inicioFrame) continue;
    const distancia = frame < intervalo.inicioFrame ? intervalo.inicioFrame - frame : Math.max(0, frame - intervalo.finFrame);
    const nivel = MUSICA_VOZ + (MUSICA_PAUSA - MUSICA_VOZ) * Math.min(1, distancia / RAMPA_MUSICA);
    volumen = Math.min(volumen, nivel);
  }
  return volumen;
}

export function detectarSolapes(pistas: readonly PistaAudio[]): SolapeAudio[] {
  const solapes: SolapeAudio[] = [];
  for (let i = 0; i < pistas.length; i++) {
    for (let j = i + 1; j < pistas.length; j++) {
      const a = pistas[i];
      const b = pistas[j];
      const inicioFrame = Math.max(a.desdeFrame, b.desdeFrame);
      const finFrame = Math.min(a.desdeFrame + a.duracionFrames, b.desdeFrame + b.duracionFrames);
      if (inicioFrame >= finFrame) continue;
      if (a.tipo === "voz" && b.tipo === "voz") {
        solapes.push({tipo: "voz/voz", pistas: [a.id, b.id], inicioFrame, finFrame});
      } else {
        const efecto = a.tipo === "sfx" && b.tipo === "voz" ? a : b.tipo === "sfx" && a.tipo === "voz" ? b : null;
        if (efecto && !efecto.permitirDuranteVoz) solapes.push({tipo: "sfx/voz", pistas: [a.id, b.id], inicioFrame, finFrame});
      }
    }
  }
  return solapes;
}

/**
 * Ambos proveedores usan solo archivos locales. «elevenlabs» etiqueta un
 * archivo generado por un script fuera del render y posteriormente versionado.
 * Este módulo no genera voces ni realiza E/S. El consumidor puede pasar false
 * tras comprobar disponibilidad local para obtener el fallback silencioso.
 */
export function resolverVoz(cue: CueDialogo, archivoDisponible = true): {modo: "silencio"} | {modo: "audio"; src: string} {
  if (cue.provider === "none" || cue.assetPath === null || !archivoDisponible) return {modo: "silencio"};
  return {modo: "audio", src: cue.assetPath};
}
