import React from "react";

/** Canal de una traza temporal: valor 0..1 en función del tiempo normalizado x (0..1). */
export type Canal = {
  nombre: string;
  color: string;
  valor: (x: number) => number;
  /** Texto del estado actual a la derecha (p. ej. "0", "1", "activo"). */
  estado?: (x: number) => string;
  grosor?: number;
};

/**
 * Trazas que se dibujan a medida que transcurre el tiempo: la forma de onda
 * aparece exactamente cuando ocurre el evento, como en un osciloscopio o un
 * analizador lógico. `progreso` 0..1 es la posición del cursor de tiempo.
 */
export const Trazas: React.FC<{canales: Canal[]; progreso: number; ancho: number; altoCanal: number; separacion?: number; tinta?: string; opacidad?: number}> = ({canales, progreso, ancho, altoCanal, separacion = 22, tinta = "#CFE8FF", opacidad = 1}) => {
  const margenNombre = 140;
  const anchoTraza = ancho - margenNombre - 160;
  const p = Math.max(0, Math.min(1, progreso));
  const muestras = 220;
  return (
    <g opacity={opacidad}>
      {canales.map((canal, i) => {
        const y0 = i * (altoCanal + separacion);
        const puntos: string[] = [];
        const n = Math.max(2, Math.ceil(muestras * p));
        for (let k = 0; k <= n; k++) {
          const x = (k / n) * p;
          const v = canal.valor(x);
          puntos.push(`${k === 0 ? "M" : "L"}${(margenNombre + x * anchoTraza).toFixed(1)} ${(y0 + altoCanal - v * altoCanal).toFixed(1)}`);
        }
        const actual = canal.valor(p);
        const cx = margenNombre + p * anchoTraza;
        const cy = y0 + altoCanal - actual * altoCanal;
        return (
          <g key={canal.nombre}>
            <line x1={margenNombre} x2={margenNombre + anchoTraza} y1={y0 + altoCanal} y2={y0 + altoCanal} stroke={tinta} strokeOpacity={0.14} strokeWidth={2} strokeDasharray="4 8" />
            <text x={0} y={y0 + altoCanal * 0.62} fill={canal.color} fontFamily="'Courier New', monospace" fontWeight={700} fontSize={27}>{canal.nombre}</text>
            {p > 0 ? <path d={puntos.join(" ")} fill="none" stroke={canal.color} strokeWidth={canal.grosor ?? 4} strokeLinejoin="round" strokeLinecap="round" filter="url(#brillo)" /> : null}
            {p > 0 ? <circle cx={cx} cy={cy} r={6} fill="#FFFFFF" /> : null}
            {canal.estado && p > 0 ? (
              <text x={margenNombre + anchoTraza + 18} y={y0 + altoCanal * 0.62} fill="#FFFFFF" fontFamily="'Courier New', monospace" fontWeight={700} fontSize={28}>{canal.estado(p)}</text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};

/** Escalón suave de 0 a 1 en x0 (transición de ~1 % del eje). */
export function escalon(x: number, x0: number, ancho = 0.01): number {
  if (x <= x0) return 0;
  if (x >= x0 + ancho) return 1;
  return (x - x0) / ancho;
}

/** Subida con rizado amortiguado: modela tensiones que se estabilizan. */
export function subidaEstabilizada(x: number, inicio: number, subida: number, asentamiento: number, nivel: number): number {
  if (x <= inicio) return 0;
  const t = x - inicio;
  if (t < subida) return nivel * (t / subida);
  const r = t - subida;
  const amortiguacion = Math.exp(-r / (asentamiento / 3));
  return nivel * (1 + 0.12 * amortiguacion * Math.sin(r * 180));
}
