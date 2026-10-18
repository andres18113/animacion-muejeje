import React from "react";

/**
 * Espacio de direcciones físicas de 32 bits (4 GiB) como una columna. La región
 * del firmware se dibuja ampliada en la parte superior ("no a escala"): solo se
 * rotulan valores de la especificación (0xFFFFFFF0) y los extremos del espacio.
 * `progreso` 0..1 la despliega; `destacar` 0..1 ilumina la región del firmware.
 */
export const MapaMemoria: React.FC<{x: number; y: number; alto: number; progreso: number; destacar: number; color?: string}> = ({x, y, alto, progreso, destacar, color = "#A49BD9"}) => {
  if (progreso <= 0) return null;
  const ancho = 46;
  const visible = alto * Math.min(1, progreso);
  const region = 0.16 * alto;
  const fuente = "'Courier New', monospace";
  return (
    <g opacity={Math.min(1, progreso * 1.6)}>
      <rect x={x} y={y + alto - visible} width={ancho} height={visible} rx={8} fill="#0A2A3A" fillOpacity={0.6} stroke="#9FD7FF" strokeOpacity={0.55} strokeWidth={2} />
      {progreso > 0.6 ? (
        <>
          <rect x={x} y={y} width={ancho} height={region} rx={8} fill={color} fillOpacity={0.35 + 0.55 * destacar} stroke={color} strokeWidth={3} filter="url(#brillo)" />
          {/* Corte de escala entre la región del firmware y el resto del espacio. */}
          <path d={`M${x - 8} ${y + region + 14} l${ancho + 16} -8 M${x - 8} ${y + region + 24} l${ancho + 16} -8`} stroke="#9FD7FF" strokeOpacity={0.7} strokeWidth={2} />
          <text x={x + ancho + 16} y={y + 6} fill="#FFFFFF" fontFamily={fuente} fontSize={28} fontWeight={700}>0xFFFFFFFF</text>
          <line x1={x - 18} x2={x} y1={y + 10} y2={y + 10} stroke="#FFD27A" strokeWidth={4} />
          <text x={x + ancho + 16} y={y + 38} fill="#FFD27A" fontFamily={fuente} fontSize={28} fontWeight={700}>← 0xFFFFFFF0</text>
          <text x={x + ancho + 16} y={y + region - 8} fill={color} fontFamily="Arial, Helvetica, sans-serif" fontSize={28} fontWeight={700}>firmware</text>
          <text x={x + ancho + 16} y={y + alto} fill="#CFE8FF" fontFamily={fuente} fontSize={28} fontWeight={700}>0x00000000</text>
          <text x={x} y={y + alto + 36} fill="#CFE8FF" fillOpacity={0.75} fontFamily="Arial, Helvetica, sans-serif" fontSize={28}>4 GiB · no a escala</text>
        </>
      ) : null}
    </g>
  );
};
