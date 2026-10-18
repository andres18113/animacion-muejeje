import React from "react";
import type {PerspectiveCamera} from "three";
import {LUGARES, proyectar, type Punto3D} from "./mundo.ts";

/** Sección material de RTC/CMOS: revela celdas ya conservadas, sin leer/escribir Setup. */
export const RtcMaterial: React.FC<{camara: PerspectiveCamera; frame: number; configuracion: number; reloj: number; bateria: number; distincion: number}> = ({camara, frame, configuracion, reloj, bateria, distincion}) => {
  if (configuracion <= 0) return null;
  const rtc = proyectar(camara, LUGARES.cmosi);
  const pila = proyectar(camara, [-1.6, 0.12, -0.2]);
  const base = proyectar(camara, [3.7, 0.72, 5.15]);
  const centroReloj = proyectar(camara, [3.5, 2.8, 5]);
  const volumen = (p: Punto3D) => proyectar(camara, p);
  const radio = 58;
  return <g>
    {/* Puente de sección desde el circuito real hasta su almacenamiento retenido. */}
    <path d={`M${rtc.x} ${rtc.y} Q${rtc.x-120} ${rtc.y-85}, ${base.x+110} ${base.y-40}`} fill="none" stroke="#D8B577" strokeWidth={3} />
    {Array.from({length: 32}, (_, i) => {
      const x = 3.1 + (i % 8) * 0.18, y = 1 + Math.floor(i / 8) * 0.22;
      const p = volumen([x, y, 5.15]);
      const t = volumen([x, y+0.15, 5.15]);
      const d = volumen([x+0.14, y, 5.15]);
      const fondo = volumen([x+0.14, y+0.15, 5.15]);
      const lleno = [0, 2, 3, 7, 9, 13, 16, 19, 21, 24, 25, 28, 31].includes(i);
      return <g key={i}>
        <path d={`M${p.x} ${p.y} L${t.x} ${t.y} L${fondo.x} ${fondo.y} L${d.x} ${d.y} Z`} fill={lleno ? "#B28E4B" : "#152C35"} stroke="#F3D9A5" strokeWidth={2} />
        <path d={`M${p.x} ${p.y} l0 7 L${d.x} ${d.y+7} L${d.x} ${d.y}`} fill="#514126" stroke="#94784A" strokeWidth={1} />
      </g>;
    })}
    <rect x={base.x-195} y={base.y+16} width={390} height={44} rx={7} fill="#061923" stroke="#D8B577" strokeWidth={2} />
    <text x={base.x} y={base.y+47} textAnchor="middle" fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={28} fontWeight={700}>Configuración · 256 bytes</text>
    {reloj > 0.99 ? <g>
      {/* Disco RTC acoplado a las celdas, nunca una lista de texto sobre la placa. */}
      <line x1={centroReloj.x} y1={centroReloj.y+radio} x2={base.x} y2={base.y-125} stroke="#D8B577" strokeWidth={4} />
      <circle cx={centroReloj.x+8} cy={centroReloj.y+9} r={radio} fill="#4B432E" stroke="#9D895E" strokeWidth={3} />
      <circle cx={centroReloj.x} cy={centroReloj.y} r={radio} fill="#061923" stroke="#F3D9A5" strokeWidth={4} />
      {Array.from({length:12},(_,i)=><line key={i} x1={centroReloj.x+44*Math.sin(i*Math.PI/6)} y1={centroReloj.y-44*Math.cos(i*Math.PI/6)} x2={centroReloj.x+51*Math.sin(i*Math.PI/6)} y2={centroReloj.y-51*Math.cos(i*Math.PI/6)} stroke="#D8B577" strokeWidth={3} />)}
      <line x1={centroReloj.x} y1={centroReloj.y} x2={centroReloj.x+38*Math.sin(frame/90)} y2={centroReloj.y-38*Math.cos(frame/90)} stroke="#FFFFFF" strokeWidth={4} />
      <line x1={centroReloj.x} y1={centroReloj.y} x2={centroReloj.x+25} y2={centroReloj.y+11} stroke="#D8B577" strokeWidth={5} />
      <rect x={centroReloj.x-90} y={centroReloj.y-105} width={180} height={38} rx={6} fill="#061923" stroke="#D8B577" strokeWidth={2} />
      <text x={centroReloj.x} y={centroReloj.y-78} textAnchor="middle" fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={26}>Fecha y hora</text>
    </g> : null}
    {bateria > 0.99 ? <g>
      <ellipse cx={pila.x} cy={pila.y} rx={43} ry={18} fill="none" stroke="#FFD27A" strokeWidth={5} />
      <path d={`M${pila.x} ${pila.y} Q${pila.x-60} ${pila.y+50}, ${rtc.x} ${rtc.y+15}`} fill="none" stroke="#D8B577" strokeWidth={4} />
      <rect x={pila.x-190} y={pila.y+28} width={210} height={42} rx={6} fill="#061923" stroke="#D8B577" strokeWidth={2} />
      <text x={pila.x+5} y={pila.y+58} textAnchor="end" fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={28}>Respaldo RTC</text>
    </g> : null}
    {distincion > 0.99 ? <>
      {/* Dos responsabilidades espaciales: datos dorados retenidos, código violeta en flash. */}
      <ellipse cx={rtc.x} cy={rtc.y} rx={72} ry={26} fill="none" stroke="#FFD27A" strokeWidth={5} />
      {(() => {const p=proyectar(camara,[-1.2,0.12,3.8]);return <ellipse cx={p.x} cy={p.y} rx={58} ry={22} fill="none" stroke="#A49BD9" strokeWidth={5} />;})()}
    </> : null}
  </g>;
};
