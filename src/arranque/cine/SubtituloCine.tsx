import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {obtenerMascota} from "../../mascotas/catalogo.ts";
import type {CueVisual} from "../recursos.ts";

/**
 * Subtítulo cinematográfico (RNF-07): texto blanco con sombra sobre un
 * degradado inferior, sin tarjetas. Usa los mismos segmentos que mueven la
 * boca, de modo que voz, labios y texto comparten el mismo intervalo.
 */
/**
 * `contornoNombre` (S03–S12) rodea el nombre del hablante con un halo oscuro: su color de acento
 * se perdía sobre objetos claros (conector ATX, cinta IDE). S01/S02 conservan los píxeles aprobados.
 */
export const SubtituloCine: React.FC<{cues: readonly CueVisual[]; contornoNombre?: boolean}> = ({cues, contornoNombre = false}) => {
  const frame = useCurrentFrame();
  let activo: {texto: string; inicio: number; fin: number; hablante: string; color: string} | null = null;
  for (const {cue, segmentos} of cues) {
    // Un alineado real parte la frase en tramos separados por silencios: la frase se muestra como un
    // solo bloque (primer tramo → último) para no parpadear en cada pausa interna.
    const bloques: {texto: string; inicio: number; fin: number}[] = [];
    for (const s of segmentos) {
      const ultimo = bloques[bloques.length - 1];
      if (ultimo && ultimo.texto === s.texto) ultimo.fin = s.finFrame;
      else bloques.push({texto: s.texto, inicio: s.inicioFrame, fin: s.finFrame});
    }
    for (const b of bloques) {
      // Se mantiene durante las pausas cortas para no parpadear entre frases.
      if (frame >= b.inicio && frame < b.fin + 6) {
        const mascota = obtenerMascota(cue.mascotId);
        activo = {texto: b.texto, inicio: b.inicio, fin: b.fin + 6, hablante: mascota.nombre, color: mascota.acento};
      }
    }
  }
  // Fundido de 4 frames, acortado en bloques breves para que inputRange sea estrictamente creciente.
  const fundido = activo ? Math.min(4, Math.floor((activo.fin - activo.inicio - 1) / 2)) : 0;
  return (
    <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 260, background: "linear-gradient(to top, rgba(3,9,15,0.82), rgba(3,9,15,0))", pointerEvents: "none"}}>
      {activo ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 58,
            textAlign: "center",
            opacity: fundido > 0 ? interpolate(frame, [activo.inicio, activo.inicio + fundido, activo.fin - fundido, activo.fin], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}) : 1,
          }}
        >
          <div style={{fontFamily: "Arial, Helvetica, sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: 3, color: activo.color, textTransform: "uppercase", marginBottom: 10, textShadow: contornoNombre ? "0 0 2px #03090F, 0 0 2px #03090F, 0 0 4px #03090F, 0 2px 8px rgba(0,0,0,0.9)" : "0 2px 8px rgba(0,0,0,0.9)"}}>{activo.hablante}</div>
          <div style={{fontFamily: "Arial, Helvetica, sans-serif", fontSize: 44, lineHeight: 1.22, fontWeight: 600, color: "#FFFFFF", whiteSpace: "pre-line", textShadow: "0 3px 14px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,1)"}}>{activo.texto}</div>
        </div>
      ) : null}
    </div>
  );
};
