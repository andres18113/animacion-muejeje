import React from "react";
import {crearCamara} from "./mundo.ts";
import {manoEnPantalla} from "./Actor";
import {puntoDeRuta} from "./rutas.ts";
import {Caja,Frente,Marca,FUENTE} from "./ArranqueMaterial";
import {cabezaActor} from "./CargadorMaterial";
import {visibilidadPaqueteS08,anchoEtiqueta,type Oclusor} from "./guion/S08.ts";
import {MEBRE_LUGAR,ALTURA_MEBRE} from "./guion/S09.ts";
import {GRUBI_LUGAR,ALTURA_GRUBI,RUTAS_S10,PANEL_DISCO,MAPA_DISCO} from "./guion/S10.ts";
import {CABECERA_LINUX,CR0,PARAMETROS_LINUX,PANEL_NUCLEO,PANEL_CR0,type EstadoS11} from "./guion/S11.ts";
import {NUCLEO_LUGAR,INIT_LUGAR,ALTURA_NUCLEO,ALTURA_INIT,TAREAS_NUCLEO,PRIMER_PROCESO,PANEL_LINUX,PANEL_INIT,type EstadoS12} from "./guion/S12.ts";
import {CIPU_LUGAR} from "./guion/S03.ts";

const hex=(n:number)=>n.toString(16).toUpperCase().padStart(2,"0");
const OCLUSORES:readonly Oclusor[]=[["mebre",MEBRE_LUGAR,ALTURA_MEBRE],["grubi",GRUBI_LUGAR,ALTURA_GRUBI]];
/** Centro de la ficha «Linux · vmlinuz» de la fila RAM del mapa (S10/S11). */
export function fichaLinux(){const x=PANEL_DISCO.x+MAPA_DISCO.ext2[0]+14+2*322+20;return {x:x+135,y:PANEL_DISCO.y+199};}

/** S11: D01–D06. Carga del núcleo, parámetros, CR0/modo protegido y cesión al punto de entrada. */
export const NucleoMaterial:React.FC<{e:EstadoS11|EstadoS12}>=({e})=>{
 const c=crearCamara(e.cam),k=e.capa,n=PANEL_NUCLEO,r=PANEL_CR0,cipu=cabezaActor(c,CIPU_LUGAR,3,e.cipu);
 const w=anchoEtiqueta("vmlinuz"),peValor=k.pe>=.5?CR0.pe.despues:CR0.pe.antes;
 const origen=manoEnPantalla("grubi",c,GRUBI_LUGAR,ALTURA_GRUBI,e.grubi,1),destino=fichaLinux(),t=k.cesion;
 const cx=(origen.x+destino.x)/2,cy=Math.min(origen.y,destino.y)-60,px=(1-t)*(1-t)*origen.x+2*(1-t)*t*cx+t*t*destino.x,py=(1-t)*(1-t)*origen.y+2*(1-t)*t*cy+t*t*destino.y;
 const lineas=[
  {texto:`Cabecera: ${CABECERA_LINUX.firma} = ${CABECERA_LINUX.bytes.map(hex).join(" ")}`,mono:true,vis:1},
  {texto:PARAMETROS_LINUX.estructuras.join(" · "),mono:true,vis:k.parametrosListos},
  {texto:`línea de órdenes: ${PARAMETROS_LINUX.lineaOrdenes}`,mono:true,vis:k.parametrosListos},
  {texto:`${PARAMETROS_LINUX.memoria} para el núcleo`,mono:false,vis:k.parametrosListos},
 ];
 return <>
  <Frente c={c} ruta={RUTAS_S10.solicitud} t={k.nucleoSolicitud} color="#C7DDE9"/>
  <Frente c={c} ruta={RUTAS_S10.datos} t={k.nucleoDatos} color="#B9E0F2" etiqueta="vmlinuz" opacidad={visibilidadPaqueteS08(c,e,puntoDeRuta(RUTAS_S10.datos,k.nucleoDatos),OCLUSORES,w)}/>
  <Frente c={c} ruta={RUTAS_S10.transferencia} t={k.nucleoTransferencia} color="#B9E0F2" etiqueta="vmlinuz" opacidad={visibilidadPaqueteS08(c,e,puntoDeRuta(RUTAS_S10.transferencia,k.nucleoTransferencia),OCLUSORES,w)}/>
  {k.panelNucleo>0?<Caja x={n.x} y={n.y} ancho={n.ancho} alto={n.alto} borde="#9DD3EE" opacidad={k.panelNucleo}>
   <text x={n.x+16} y={n.y+36} fill="#FFFFFF" fontFamily="monospace" fontSize={22} fontWeight={700}>/boot/vmlinuz → RAM</text>
   {lineas.map((l,i)=>l.vis>0?<text key={l.texto} x={n.x+16} y={n.y+72+i*32} fill="#DDF1FA" fontFamily={l.mono?"monospace":FUENTE} fontSize={l.mono?19:21} opacity={l.vis}>{l.texto}</text>:null)}
   {k.entradaLinux>0?<text x={n.x+16} y={n.y+222} fill={k.protocoloLinux>0?"#FFFFFF":"#D5CEFF"} fontFamily={FUENTE} fontSize={21} fontWeight={700}>▶ entrada de 32 bits · protocolo Linux/x86</text>:null}
  </Caja>:null}
  {k.panelCr0>0?<g>
   <line x1={r.x+r.ancho} y1={r.y+40} x2={cipu.x-60} y2={cipu.y+60} stroke="#9FD7FF" strokeWidth={2} strokeDasharray="5 6" opacity={k.panelCr0}/>
   <Caja x={r.x} y={r.y} ancho={r.ancho} alto={r.alto} borde="#9FD7FF" opacidad={k.panelCr0}>
    <text x={r.x+16} y={r.y+30} fill="#FFFFFF" fontFamily={FUENTE} fontSize={23} fontWeight={700}>CR0 de la CPU</text>
    {k.bits32>0?<text x={r.x+r.ancho-16} y={r.y+30} textAnchor="end" fill="#BDF5C8" fontFamily={FUENTE} fontSize={20} fontWeight={700}>{k.pe>=.5?"modo protegido":"objetivo: 32 bits"}</text>:null}
    {Array.from({length:32},(_,i)=>{const bit=31-i,clave=bit===CR0.pe.bit||bit===CR0.pg.bit;return <rect key={i} x={r.x+18+i*10.6} y={r.y+42} width={8.6} height={18} rx={1.5} fill={bit===CR0.pe.bit&&peValor?"#9FE3BD":clave?"#2E4A63":"#1E3346"} stroke={clave?"#D6E9FF":"none"} strokeWidth={clave?2:0}/>;})}
    <text x={r.x+18} y={r.y+78} fill="#B9D3E6" fontFamily="monospace" fontSize={17}>bit 31 · PG</text>
    <text x={r.x+r.ancho-18} y={r.y+78} textAnchor="end" fill="#B9D3E6" fontFamily="monospace" fontSize={17}>PE · bit 0</text>
    {k.gdt>0?<g opacity={k.gdt}><text x={r.x+18} y={r.y+104} fill="#DDF1FA" fontFamily={FUENTE} fontSize={20}>GDT y segmentos preparados</text><Marca x={r.x+r.ancho-30} y={r.y+98} tipo="si"/></g>:null}
    <text x={r.x+18} y={r.y+132} fill="#FFFFFF" fontFamily="monospace" fontSize={20} fontWeight={700}>{k.pe>=.5?`PE (bit 0): ${CR0.pe.antes} → ${CR0.pe.despues}`:`PE (bit 0) = ${CR0.pe.antes}`}</text>
    {k.pe>=.5?<text x={r.x+18} y={r.y+158} fill="#DDF1FA" fontFamily="monospace" fontSize={18}>PG (bit 31) = {CR0.pg.valor}: sin paginación</text>:null}
   </Caja>
  </g>:null}
  {t>0&&t<1?<g>
   <path d={`M${origen.x} ${origen.y} Q${cx} ${cy} ${px} ${py}`} fill="none" stroke="#D5CEFF" strokeWidth={3} strokeDasharray="6 6" opacity={.8}/>
   <rect x={px-140} y={py-18} width={280} height={36} rx={9} fill="#0E1F27" stroke="#D5CEFF" strokeWidth={3}/>
   <text x={px} y={py+8} textAnchor="middle" fill="#FFFFFF" fontFamily={FUENTE} fontSize={22} fontWeight={700}>control → entrada Linux</text>
  </g>:null}
 </>;
};

/** S12: D07–D09. Tareas del núcleo, ejecución de /sbin/init como PID 1 y BIOS en reposo (§10.3). */
export const SistemaMaterial:React.FC<{e:EstadoS12}>=({e})=>{
 const c=crearCamara(e.cam),k=e.capa,p=PANEL_LINUX,q=PANEL_INIT;
 const nucleo=cabezaActor(c,NUCLEO_LUGAR,ALTURA_NUCLEO,e.nucleo),init=cabezaActor(c,INIT_LUGAR,ALTURA_INIT,e.init);
 const desde=manoEnPantalla("nucleo",c,NUCLEO_LUGAR,ALTURA_NUCLEO,e.nucleo,1),t=k.exec;
 const hasta={x:init.x,y:init.y+40},mx=(desde.x+hasta.x)/2,my=Math.min(desde.y,hasta.y)-70;
 const px=(1-t)*(1-t)*desde.x+2*(1-t)*t*mx+t*t*hasta.x,py=(1-t)*(1-t)*desde.y+2*(1-t)*t*my+t*t*hasta.y;
 return <>
  {k.panelLinux>0?<g>
   <line x1={p.x} y1={p.y+p.alto-30} x2={nucleo.x+40} y2={nucleo.y+30} stroke="#9DD3EE" strokeWidth={2} strokeDasharray="5 6" opacity={k.panelLinux}/>
   <Caja x={p.x} y={p.y} ancho={p.ancho} alto={p.alto} borde="#9DD3EE" opacidad={k.panelLinux}>
    <text x={p.x+16} y={p.y+34} fill="#FFFFFF" fontFamily={FUENTE} fontSize={23} fontWeight={700}>Linux 2.6 · núcleo en ejecución</text>
    {TAREAS_NUCLEO.map((tarea,i)=>{const v=k[tarea.id];return <g key={tarea.id} opacity={v>0?1:.45}>
     <rect x={p.x+12} y={p.y+48+i*40} width={p.ancho-24} height={34} rx={6} fill={v>0?"#1D3D4C":"#14283A"} stroke={v>0?"#9DD3EE":"#3E5A6B"} strokeWidth={2}/>
     <text x={p.x+26} y={p.y+72+i*40} fill="#FFFFFF" fontFamily={FUENTE} fontSize={21}>{tarea.texto}</text>
     {v>0?<Marca x={p.x+p.ancho-36} y={p.y+65+i*40} tipo="si"/>:null}
    </g>;})}
    {k.biosReposo>0?<text x={p.x+16} y={p.y+234} fill="#E4E0FF" fontFamily={FUENTE} fontSize={20} opacity={k.biosReposo}>BIOS: deja de dirigir · sigue en la flash</text>:null}
   </Caja>
  </g>:null}
  {t>0&&t<1?<g>
   <path d={`M${desde.x} ${desde.y} Q${mx} ${my} ${px} ${py}`} fill="none" stroke="#BDF5C8" strokeWidth={3} strokeDasharray="6 6" opacity={.8}/>
   <rect x={px-96} y={py-18} width={192} height={36} rx={9} fill="#0E1F27" stroke="#BDF5C8" strokeWidth={3}/>
   <text x={px} y={py+8} textAnchor="middle" fill="#FFFFFF" fontFamily="monospace" fontSize={21} fontWeight={700}>exec {PRIMER_PROCESO.ruta}</text>
  </g>:null}
  {k.panelInit>0?<g>
   <line x1={q.x} y1={q.y+40} x2={init.x+40} y2={init.y+30} stroke="#A9E5C6" strokeWidth={2} strokeDasharray="5 6" opacity={k.panelInit}/>
   <Caja x={q.x} y={q.y} ancho={q.ancho} alto={q.alto} borde="#A9E5C6" opacidad={k.panelInit}>
    <text x={q.x+16} y={q.y+38} fill="#FFFFFF" fontFamily="monospace" fontSize={26} fontWeight={700}>{PRIMER_PROCESO.ruta}</text>
    <rect x={q.x+12} y={q.y+56} width={q.ancho-24} height={46} rx={7} fill={k.pid1>0?"#24513F":"#183447"} stroke={k.pid1>0?"#BDF5C8":"#4F7584"} strokeWidth={k.pid1>0?3:2}/>
    <text x={q.x+26} y={q.y+88} fill="#FFFFFF" fontFamily={FUENTE} fontSize={23} fontWeight={700}>PID {PRIMER_PROCESO.pid} · primer proceso de usuario</text>
    <text x={q.x+16} y={q.y+134} fill="#D6F2E0" fontFamily={FUENTE} fontSize={21}>creado por el núcleo tras montar /</text>
    {k.sistemaListo>0?<text x={q.x+16} y={q.y+168} fill="#BDF5C8" fontFamily={FUENTE} fontSize={22} fontWeight={700} opacity={k.sistemaListo}>Sistema operativo en funcionamiento</text>:null}
   </Caja>
  </g>:null}
 </>;
};
