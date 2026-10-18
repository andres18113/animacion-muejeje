import React from "react";
import type {PerspectiveCamera} from "three";
import {proyectar, type Punto3D} from "./mundo.ts";

/** Polilínea del mundo proyectada a pantalla, con longitudes acumuladas. */
export type Trazo = {puntos: {x: number; y: number}[]; acumulado: number[]; largo: number; d: string};

export function trazar(camara: PerspectiveCamera, recorrido: readonly Punto3D[], subdivisiones = 1): Trazo {
  const muestras: Punto3D[] = [];
  recorrido.forEach((p, i) => {
    if (i === 0) {
      muestras.push(p);
      return;
    }
    const a = recorrido[i - 1];
    for (let s = 1; s <= subdivisiones; s++) {
      const t = s / subdivisiones;
      muestras.push([a[0] + (p[0] - a[0]) * t, a[1] + (p[1] - a[1]) * t, a[2] + (p[2] - a[2]) * t]);
    }
  });
  const puntos = muestras.map((p) => {
    const q = proyectar(camara, p);
    return {x: q.x, y: q.y};
  });
  const acumulado = [0];
  for (let i = 1; i < puntos.length; i++) {
    acumulado.push(acumulado[i - 1] + Math.hypot(puntos[i].x - puntos[i - 1].x, puntos[i].y - puntos[i - 1].y));
  }
  const d = puntos.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  return {puntos, acumulado, largo: acumulado[acumulado.length - 1], d};
}

/** Punto y dirección en la fracción t (0..1) de un trazo. */
export function puntoEn(trazo: Trazo, t: number): {x: number; y: number; nx: number; ny: number} {
  const objetivo = Math.max(0, Math.min(1, t)) * trazo.largo;
  let i = 1;
  while (i < trazo.acumulado.length - 1 && trazo.acumulado[i] < objetivo) i++;
  const a = trazo.puntos[i - 1];
  const b = trazo.puntos[i];
  const tramo = trazo.acumulado[i] - trazo.acumulado[i - 1] || 1;
  const u = (objetivo - trazo.acumulado[i - 1]) / tramo;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const n = Math.hypot(dx, dy) || 1;
  return {x: a.x + dx * u, y: a.y + dy * u, nx: -dy / n, ny: dx / n};
}

export const FiltrosBrillo: React.FC = () => (
  <defs>
    <filter id="brillo" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="difuso" />
      <feMerge>
        <feMergeNode in="difuso" />
        <feMergeNode in="difuso" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="brilloSuave" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="14" />
    </filter>
  </defs>
);

/**
 * Señal que recorre un trazo: `avance` 0..1 es la posición del frente.
 * `persistente` deja la pista encendida detrás del frente (un nivel lógico
 * que se mantiene); si no, solo viaja un pulso corto (un evento).
 */
export const SenalViajera: React.FC<{trazo: Trazo; avance: number; color: string; persistente?: boolean; grosor?: number; intensidad?: number}> = ({trazo, avance, color, persistente = true, grosor = 5, intensidad = 1}) => {
  if (avance <= 0 || intensidad <= 0) return null;
  const frente = Math.min(1, avance) * trazo.largo;
  const pulso = Math.min(140, trazo.largo * 0.35);
  const cabeza = puntoEn(trazo, Math.min(1, avance));
  const visibleCabeza = avance < 1.0001 && avance > 0;
  return (
    <g opacity={intensidad}>
      {persistente ? (
        <path d={trazo.d} fill="none" stroke={color} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${frente} ${trazo.largo + 10}`} filter="url(#brillo)" />
      ) : (
        <path d={trazo.d} fill="none" stroke={color} strokeWidth={grosor + 1} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${pulso} ${trazo.largo + pulso}`} strokeDashoffset={-(frente - pulso)} filter="url(#brillo)" />
      )}
      {visibleCabeza && avance < 1 ? <circle cx={cabeza.x} cy={cabeza.y} r={grosor * 1.8} fill="#FFFFFF" filter="url(#brillo)" /> : null}
    </g>
  );
};

/**
 * Corriente alterna: una senoide que oscila a lo largo del cable y avanza
 * hacia la carga. La forma (no un rótulo) comunica que la polaridad alterna.
 */
export const OndaAlterna: React.FC<{trazo: Trazo; frame: number; amplitud: number; llegada: number; color?: string}> = ({trazo, frame, amplitud, llegada, color = "#FFB347"}) => {
  if (llegada <= 0) return null;
  const pasos = Math.max(40, Math.floor(trazo.largo / 6));
  const fin = Math.min(1, llegada);
  const puntos: string[] = [];
  for (let i = 0; i <= pasos; i++) {
    const t = (i / pasos) * fin;
    const p = puntoEn(trazo, t);
    const fase = (t * trazo.largo) / 38 - frame * 0.42;
    const desvanecer = Math.min(1, (fin - t) * 12, t * 20);
    const a = amplitud * Math.sin(fase) * desvanecer;
    puntos.push(`${i === 0 ? "M" : "L"}${(p.x + p.nx * a).toFixed(1)} ${(p.y + p.ny * a).toFixed(1)}`);
  }
  return <path d={puntos.join(" ")} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" filter="url(#brillo)" />;
};

/**
 * Tensión continua: segmentos que fluyen a velocidad constante sin oscilar.
 * Comparada con la senoide de entrada, muestra la conversión AC → DC.
 */
export const FlujoContinuo: React.FC<{trazo: Trazo; frame: number; avance: number; color: string; grosor?: number}> = ({trazo, frame, avance, color, grosor = 5}) => {
  if (avance <= 0) return null;
  const d = dParcial(trazo, avance);
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeOpacity={0.7} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" filter="url(#brillo)" />
      <path d={d} fill="none" stroke="#FFFFFF" strokeOpacity={0.9} strokeWidth={grosor * 0.45} strokeLinecap="round" strokeDasharray="10 26" strokeDashoffset={-frame * 3} />
    </g>
  );
};

/** Trazado SVG desde el inicio hasta la fracción t del recorrido. */
export function dParcial(trazo: Trazo, t: number): string {
  const objetivo = Math.max(0, Math.min(1, t)) * trazo.largo;
  const partes: string[] = [];
  for (let i = 0; i < trazo.puntos.length; i++) {
    if (trazo.acumulado[i] <= objetivo) {
      partes.push(`${i === 0 ? "M" : "L"}${trazo.puntos[i].x.toFixed(1)} ${trazo.puntos[i].y.toFixed(1)}`);
    } else {
      const p = puntoEn(trazo, t);
      partes.push(`L${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
      break;
    }
  }
  return partes.join(" ");
}
