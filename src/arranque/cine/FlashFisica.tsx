import React from "react";
import type {PerspectiveCamera} from "three";
import {proyectar} from "./mundo.ts";
import {BLOQUES_FLASH, SECCION_FLASH} from "./guion/S04.ts";

/** Corte didáctico desplegado, unido al chip real: ningún bloque se borra ni escribe. */
export const FlashFisica: React.FC<{camara: PerspectiveCamera; apertura: number; conteo: number; detalle: number}> = ({camara, apertura, conteo, detalle}) => {
  if (apertura <= 0) return null;
  const chip = proyectar(camara, [-1.2, 0.12, 3.8]);
  const p = Math.min(1, apertura);
  const hex = (n: number) => `0x${n.toString(16).toUpperCase().padStart(5, "0")}`;
  return <g>
    <path d={`M${chip.x} ${chip.y} Q${chip.x + 160} ${chip.y - 80}, ${chip.x + 240} ${chip.y - 20}`} fill="none" stroke="#A49BD9" strokeWidth={3} opacity={p} />
    {BLOQUES_FLASH.map(b => {
      const centro = proyectar(camara, [SECCION_FLASH.x, SECCION_FLASH.base + b.indice * SECCION_FLASH.paso * p, SECCION_FLASH.z]);
      const x = chip.x + (centro.x - chip.x) * p;
      const y = chip.y + (centro.y - chip.y) * p;
      const w = 510 * p, h = 52 * p;
      const seleccionado = Math.floor(conteo) === b.indice + 1;
      const color = b.indice === 7 ? "#FFD27A" : b.indice === 1 ? "#B9D5ED" : "#BDB1F4";
      return <g key={b.indice} opacity={p}>
        <path d={`M${x-w/2} ${y-h/2} l22 -14 h${w} v${h} l-22 14 Z`} fill="#34414E" stroke={color} strokeWidth={2} />
        <rect x={x-w/2} y={y-h/2} width={w} height={h} rx={5} fill={seleccionado ? "#26364A" : "#071923"} stroke={color} strokeWidth={seleccionado ? 4 : 2} />
        {/* Dos líneas dentro de la losa de 52 px: a 26/24 px el rango pisaba el borde inferior. */}
        {p > 0.96 ? <>
          <text x={x-w/2+12} y={y-6} fill={color} fontSize={23} fontWeight={700} fontFamily="Arial, Helvetica, sans-serif">{`B${b.indice} · ${b.funcion} · 64 KiB`}</text>
          <text x={x-w/2+12} y={y+18} fill="#FFFFFF" fontSize={21} fontFamily="monospace">{`${hex(b.inicio)}–${hex(b.fin)}`}</text>
        </> : null}
      </g>;
    })}
    {p > 0.96 ? (() => {
      const inferior = proyectar(camara, [SECCION_FLASH.x, SECCION_FLASH.base, SECCION_FLASH.z]);
      const superior = proyectar(camara, [SECCION_FLASH.x, SECCION_FLASH.base + 7 * SECCION_FLASH.paso, SECCION_FLASH.z]);
      return <>
        <rect x={superior.x-255} y={superior.y-92} width={532} height={46} rx={6} fill="#061923" stroke="#A49BD9" strokeWidth={2} />
        <text x={superior.x-242} y={superior.y-60} fontFamily="Arial, Helvetica, sans-serif" fontSize={28} fontWeight={700} fill="#FFFFFF">512 KiB · 8 × 64 KiB</text>
        <rect x={inferior.x-255} y={inferior.y+38} width={532} height={detalle > 0.99 ? 98 : 44} rx={6} fill="#061923" stroke="#A49BD9" strokeWidth={2} />
        <text x={inferior.x-242} y={inferior.y+68} fontFamily="Arial, Helvetica, sans-serif" fontSize={25} fill="#FFFFFF">Desplazamientos internos de flash</text>
        {detalle > 0.99 ? <>
          <text x={inferior.x-242} y={inferior.y+98} fontFamily="Arial, Helvetica, sans-serif" fontSize={24} fill="#CFE8FF">B1: parámetros 8 + 8 KiB</text>
          <text x={inferior.x-242} y={inferior.y+124} fontFamily="Arial, Helvetica, sans-serif" fontSize={24} fill="#CFE8FF">+ 48 KiB reservados</text>
        </> : null}
      </>;
    })() : null}
  </g>;
};
