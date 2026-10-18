import React from "react";
import {crearCamara,proyectar,LUGARES} from "./mundo.ts";
import {puntoDeRuta,RUTA_FIRMWARE} from "./rutas.ts";
import {RtcMaterial} from "./RtcMaterial";
import {fasesS05,barridoFirmwareS05,consultaCMOSS05,lecturasPostS05,type EstadoS05} from "./guion/S05.ts";

/** Secciones de inspección ligadas a CPU/flash/RTC, sin inferir registros ni algoritmos. */
export const PostMaterial:React.FC<{e:EstadoS05;frame:number;a:Record<string,number>}>=({e,frame,a})=>{
  const c=crearCamara(e.cam),b=fasesS05(a);
  const cpu=proyectar(c,[1.6,.36,-2.6]),flash=proyectar(c,[-1.2,.12,3.8]);
  const baseRtc=proyectar(c,[3.7,.72,5.15]);
  const l=lecturasPostS05(cpu,flash,baseRtc),t=e.capa.integridad;
  const cm=consultaCMOSS05(e.capa.cmosConsulta),retorno=b.cmosInicio+Math.floor((b.cmosFin-b.cmosInicio)*.6);
  const rutaCMOS=[LUGARES.cmosi,...RUTA_FIRMWARE.slice(0,6).reverse()];
  const barrido=barridoFirmwareS05(l.firmware,t);
  return <>
    {frame>=a.comprobacion-8&&frame<a.memoria+60?<g>
      {/* Despiece óptico junto al Slot: los bloques representan funciones, no un plano de die. */}
      <path d={`M${cpu.x} ${cpu.y} L${l.cpu.x+380} ${l.cpu.y+220}`} fill="none" stroke="#8CBFD0" strokeWidth={2} strokeDasharray="5 7"/>
      <path d={`M${l.cpu.x+15} ${l.cpu.y+270} L${l.cpu.x+340} ${l.cpu.y+220} l45 48 l-325 50 Z`} fill="#1A363E" stroke="#7CA7B4" strokeWidth={3}/>
      {[{x:35,y:40,w:140,h:142,texto:"CPU",p:e.capa.cpuPreparacion},{x:215,y:114,w:140,h:116,texto:"Caché",p:e.capa.cachePreparacion}].map(n=><g key={n.texto}>
        <path d={`M${l.cpu.x+n.x} ${l.cpu.y+n.y} l14 -12 h${n.w} v${n.h} l-14 12 Z`} fill="#3C5D68" stroke="#B2D3DE" strokeWidth={2}/>
        <rect x={l.cpu.x+n.x} y={l.cpu.y+n.y} width={n.w} height={n.h} rx={8} fill="#142B36" stroke="#9BC9D7" strokeWidth={3}/>
        <text x={l.cpu.x+n.x+n.w/2} y={l.cpu.y+n.y+38} textAnchor="middle" fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={30} fontWeight={700}>{n.texto}</text>
        {n.p>0&&n.p<1?<rect x={l.cpu.x+n.x+10+n.p*(n.w-28)} y={l.cpu.y+n.y+50} width={8} height={n.h-62} fill="#CBF4FF"/>:null}
        {n.p>=1?<path d={`M${l.cpu.x+n.x+42} ${l.cpu.y+n.y+n.h-32} l16 16 l35 -36`} fill="none" stroke="#9CE5BB" strokeWidth={6}/>:null}
      </g>)}
      <path d={`M${l.cpu.x+175} ${l.cpu.y+147} L${l.cpu.x+215} ${l.cpu.y+172}`} fill="none" stroke="#96C6D3" strokeWidth={4}/>
      {e.capa.cachePreparacion>0&&e.capa.cachePreparacion<1?(()=>{const u=e.capa.cachePreparacion<.5?e.capa.cachePreparacion*2:2-e.capa.cachePreparacion*2;return <circle cx={l.cpu.x+175+40*u} cy={l.cpu.y+147+25*u} r={7} fill="#E5FBFF"/>;})():null}
      {[0,1,2].map(i=><rect key={i} x={l.cpu.x+75+i*72} y={l.cpu.y+264-i*10} width={49} height={24} rx={4} fill={e.capa.recursosPreparacion>=(i+1)/3?"#A3E7BE":"#203841"} stroke="#8AB8C5" strokeWidth={2}/>)}
      <rect x={l.cpu.x+20} y={l.cpu.y+311} width={360} height={42} rx={6} fill="#10242D" stroke="#8AB8C5" strokeWidth={2}/>
      <text x={l.cpu.x+200} y={l.cpu.y+341} textAnchor="middle" fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={27}>Preparación inicial</text>
    </g>:null}
    {frame>=b.integridadInicio&&frame<b.cmosInicio-5?<g>
      {/* Barrido ilustrativo de regiones correspondientes: no afirma cobertura ni checksum. */}
      <path d={`M${flash.x} ${flash.y} L${l.firmware.x} ${l.firmware.y+105}`} fill="none" stroke="#A49BD9" strokeWidth={3} strokeDasharray="5 7"/>
      <path d={`M${l.firmware.x} ${l.firmware.y+25} l24 -18 h${l.firmware.ancho-24} v112 l-24 18 Z`} fill="#413B5C" stroke="#BDB1F4" strokeWidth={2}/>
      <rect x={l.firmware.x} y={l.firmware.y+25} width={l.firmware.ancho-24} height={112} rx={7} fill="#151C30" stroke="#BDB1F4" strokeWidth={3}/>
      <text x={barrido.titulo.x} y={barrido.titulo.y} fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={barrido.titulo.tamano} fontWeight={700}>Regiones BIOS</text>
      {Array.from({length:9},(_,i)=><line key={i} x1={l.firmware.x+25+i*51} y1={l.firmware.y+70} x2={l.firmware.x+25+i*51} y2={l.firmware.y+94} stroke="#8173B5" strokeWidth={4}/>)}
      {t>=.18&&t<.8?<rect x={barrido.x} y={barrido.y} width={barrido.ancho} height={barrido.alto} rx={4} fill="#D6CCFF" fillOpacity={.5}/>:null}
      <text x={barrido.descripcion.x} y={barrido.descripcion.y} fill="#D6CCFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={barrido.descripcion.tamano}>Integridad de regiones</text>
      {t>=1?<path d={`M${l.firmware.x+490} ${l.firmware.y+113} l15 13 l28 -30`} fill="none" stroke="#9CE5BB" strokeWidth={6}/>:null}
      {t>0&&t<1&&(t<.18||t>=.8)?(()=>{const p=proyectar(c,puntoDeRuta(t<.18?RUTA_FIRMWARE:[...RUTA_FIRMWARE].reverse(),t<.18?t/.18:(t-.8)/.2));return <rect x={p.x-10} y={p.y-6} width={20} height={12} rx={3} fill="#C6B7F0"/>;})():null}
    </g>:null}
    {frame>=b.cmosInicio-5&&frame<retorno?<g>
      <RtcMaterial camara={c} frame={frame} configuracion={1} reloj={0} bateria={0} distincion={0}/>
      <rect x={l.cmos.x} y={baseRtc.y+70} width={390} height={38} rx={6} fill="#061923" stroke="#D8B577" strokeWidth={2}/>
      <text x={baseRtc.x} y={baseRtc.y+98} textAnchor="middle" fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={26}>CPU consulta configuración</text>
      {cm.lectura>0&&cm.lectura<1?(()=>{const i=Math.min(31,Math.floor(cm.lectura*32)),p=proyectar(c,[3.1+(i%8)*.18,1+Math.floor(i/8)*.22,5.15]);return <rect x={p.x-20} y={p.y-32} width={40} height={42} rx={4} fill="none" stroke="#FFFFFF" strokeWidth={3}/>;})():null}
    </g>:null}
    {e.capa.cmosConsulta>0&&e.capa.cmosConsulta<1&&(cm.pedido<1||cm.respuesta>0)?(()=>{const p=proyectar(c,puntoDeRuta(cm.pedido<1?[...rutaCMOS].reverse():rutaCMOS,cm.pedido<1?cm.pedido:cm.respuesta));return <rect x={p.x-11} y={p.y-7} width={22} height={14} rx={4} fill="#F3D9A5"/>;})():null}
  </>;
};
