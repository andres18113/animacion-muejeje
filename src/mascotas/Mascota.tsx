import React from "react";
import {Img, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import type {ExpresionMascota, MascotaId} from "./catalogo";

/**
 * Mascota animable de Remotion. Recursos precalculados como SVG transparentes.
 * No usa GIF, temporizadores reales ni CSS animation: todo depende del fotograma.
 */
export interface MascotaProps {
  id: MascotaId;
  expresion?: ExpresionMascota;
  hablando?: boolean;
  animar?: boolean;
  tamano?: number;
  desfase?: number;
  /** Omitir la aparición inicial cuando la mascota está en una escena larga. */
  entrada?: boolean;
}

export const Mascota: React.FC<MascotaProps> = ({
  id,
  expresion = "neutral",
  hablando = false,
  animar = true,
  tamano = 280,
  desfase = 0,
  entrada = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const frameLocal = Math.max(0, frame - desfase);
  // La boca alterna entre dos recursos sin usar APIs no deterministas.
  const bocaAbierta = hablando && Math.floor(frameLocal / 6) % 2 === 0;
  const estado: ExpresionMascota = bocaAbierta ? "hablando" : expresion;
  const avance = entrada
    ? spring({frame: frameLocal, fps, config: {damping: 15, stiffness: 115}})
    : 1;
  const flotacion = animar ? Math.sin((frameLocal + desfase * 3) * 0.075) * 5 : 0;

  return (
    <div
      data-mascota={id}
      aria-label={`Mascota ${id}, expresión ${estado}`}
      style={{
        width: tamano,
        height: tamano,
        transform: `translateY(${flotacion}px) scale(${avance})`,
        transformOrigin: "center bottom",
      }}
    >
      <Img
        src={staticFile(`mascotas/${id}-${estado}.svg`)}
        alt={`Mascota ${id}`}
        style={{width: "100%", height: "100%", objectFit: "contain"}}
      />
    </div>
  );
};
