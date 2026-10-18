import React from "react";
import type {PerspectiveCamera} from "three";
import {crearCamara,proyectar,LUGARES,type Punto3D} from "./mundo.ts";
import {carasS06,cajaVolumenS06,type VolumenS06} from "./servicios-geometria.ts";
import {puntoDeRuta,recorteDeRuta} from "./rutas.ts";
import {trazar} from "./capas";
import {PROPS_S06,RUTAS_S06,ESTRUCTURAS_S06,lecturasS06,fasesS06,transferenciaRamS06,type EstadoS06} from "./guion/S06.ts";

const Volumen:React.FC<{c:PerspectiveCamera;v:VolumenS06;colores:[string,string,string]}> = ({c,v,colores})=><g>{carasS06(c,v).map((p,i)=><polygon key={i} points={p} fill={colores[i]} stroke="#132632" strokeWidth={2}/>)}</g>;
const Plano:React.FC<{c:PerspectiveCamera;p:readonly Punto3D[];color:string}> = ({c,p,color})=><polygon points={p.map(v=>{const q=proyectar(c,v);return`${q.x},${q.y}`;}).join(" ")} fill={color} stroke="#1C3841" strokeWidth={2}/>;
const Cable:React.FC<{c:PerspectiveCamera;ruta:readonly Punto3D[];color:string;ancho?:number}> = ({c,ruta,color,ancho=5})=><path d={trazar(c,ruta,6).d} fill="none" stroke={color} strokeWidth={ancho} strokeLinejoin="round" strokeLinecap="round"/>;
const Frente:React.FC<{c:PerspectiveCamera;ruta:readonly Punto3D[];t:number;color:string}>=({c,ruta,t,color})=>{
 if(t<=0||t>=1)return null;
 const p=proyectar(c,puntoDeRuta(ruta,t));return <g><path d={trazar(c,recorteDeRuta(ruta,t),6).d} fill="none" stroke={color} strokeOpacity={.6} strokeWidth={3}/><rect x={p.x-9} y={p.y-5} width={18} height={10} rx={3} fill={color}/></g>;
};
const hex=(n:number)=>`0x${n.toString(16).toUpperCase().padStart(5,"0")}`;

export const ServiciosMaterial:React.FC<{e:EstadoS06;frame:number;a:Record<string,number>}>=({e,frame,a})=>{
 const b=fasesS06(a),c=crearCamara(e.cam),ram=proyectar(c,LUGARES.rami),disco=proyectar(c,LUGARES.disqui),l=lecturasS06(ram,disco);
 const mon=cajaVolumenS06(c,PROPS_S06.monitor),key=cajaVolumenS06(c,PROPS_S06.teclado);
 const [mx,my,mz]=PROPS_S06.monitor.p,[mw,mh,md]=PROPS_S06.monitor.t;
 const [kx,ky,kz]=PROPS_S06.teclado.p;
 const solicitud=[...RUTAS_S06.ide,...RUTAS_S06.cinta.slice(1)];
 return <>
  {e.capa.ramDetalle>0?<g>
   {/* Un único sustrato SDRAM: regiones de datos contiguas, corte didáctico parcial. */}
   <line x1={ram.x} y1={ram.y} x2={l.ram.x+800} y2={l.ram.y} stroke="#72B5A0" strokeWidth={3} strokeDasharray="5 7"/>
   <path d={`M${l.ram.x} ${l.ram.y} l18 -14 h1000 v220 l-18 14 Z`} fill="#284A44" stroke="#72B5A0" strokeWidth={2}/>
   <rect x={l.ram.x} y={l.ram.y} width={1000} height={220} rx={10} fill="#10262D" stroke="#89CFBB" strokeWidth={3}/>
   <line x1={l.ram.x+640} y1={l.ram.y+10} x2={l.ram.x+640} y2={l.ram.y+210} stroke="#89CFBB" strokeWidth={3}/>
   <text x={l.ram.x+18} y={l.ram.y+34} fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={28} fontWeight={700}>IVT · 256 × 4 B = 1024 B</text>
   <text x={l.ram.x+18} y={l.ram.y+67} fill="#CFEFFF" fontFamily="monospace" fontSize={26}>{hex(ESTRUCTURAS_S06.ivt.inicio)}–{hex(ESTRUCTURAS_S06.ivt.fin)}</text>
   {Array.from({length:256},(_,i)=><rect key={i} x={l.ram.x+18+(i%32)*18} y={l.ram.y+80+Math.floor(i/32)*8} width={14} height={5} rx={1} fill={e.capa.ivtPreparacion>=i+1?"#A3DDEB":"#29424B"}/>)}
   {ESTRUCTURAS_S06.ivt.campos.map((campo,i)=><g key={campo.nombre}>
    <path d={`M${l.ram.x+18+i*300} ${l.ram.y+158} l7 -7 h288 v46 l-7 7 Z`} fill="#345763" stroke="#9BCBD6" strokeWidth={2}/>
    <rect x={l.ram.x+18+i*300} y={l.ram.y+158} width={288} height={46} rx={5} fill="#132A35" stroke="#9BCBD6" strokeWidth={2}/>
    <text x={l.ram.x+30+i*300} y={l.ram.y+189} fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={24}>{campo.nombre} · {campo.bytes} B</text>
   </g>)}
   {e.capa.bdaPreparacion>0?<g>
    <text x={l.ram.x+658} y={l.ram.y+34} fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={28} fontWeight={700}>BDA · 256 B</text>
    <text x={l.ram.x+658} y={l.ram.y+67} fill="#D4F3E2" fontFamily="monospace" fontSize={26}>{hex(ESTRUCTURAS_S06.bda.inicio)}–{hex(ESTRUCTURAS_S06.bda.fin)}</text>
    <rect x={l.ram.x+658} y={l.ram.y+84} width={324} height={74} rx={6} fill="#173A31" stroke="#7ABB9F" strokeWidth={2}/>
    <text x={l.ram.x+674} y={l.ram.y+114} fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={27}>Datos de</text>
    <text x={l.ram.x+674} y={l.ram.y+146} fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={27}>funcionamiento</text>
   </g>:null}
   <text x={l.ram.x+658} y={l.ram.y+188} fill="#D4F3E2" fontFamily="Arial, Helvetica, sans-serif" fontSize={23}>SDRAM · datos y punteros</text>
   <text x={l.ram.x+658} y={l.ram.y+211} fill="#B8D4CA" fontFamily="Arial, Helvetica, sans-serif" fontSize={20}>Esquema parcial · no a escala</text>
   <Frente c={c} ruta={RUTAS_S06.ram} t={transferenciaRamS06(frame,b.ivtInicio,b.ivtFin).frente} color="#B7E8F4"/>
   <Frente c={c} ruta={RUTAS_S06.ram} t={transferenciaRamS06(frame,b.bdaInicio,b.bdaFin).frente} color="#A9E5C6"/>
  </g>:null}
  {e.capa.perifericosPresentes>0?<g>
   {/* Hardware ya montado, revelado fuera de campo antes del plano de servicios. */}
   <Volumen c={c} v={PROPS_S06.mesa} colores={["#5D493B","#78604C","#A48B6F"]}/>
   {[-4,1].flatMap(x=>[5.8,9.2].map(z=><Volumen key={`${x}-${z}`} c={c} v={{p:[x,0,z],t:[.18,.9,.18]}} colores={["#4D443B","#5A5045","#746355"]}/>))}
   <Volumen c={c} v={PROPS_S06.pedestal} colores={["#46515B","#64717D","#8A969F"]}/>
   <Cable c={c} ruta={RUTAS_S06.vga} color="#334A61" ancho={7}/>
   <Cable c={c} ruta={RUTAS_S06.ps2} color="#6B537C" ancho={5}/>
   {/* Las señales posteriores se ocluyen bajo las cajas, no atraviesan pantalla/teclas. */}
   {e.capa.videoPeticion>=.65?<Frente c={c} ruta={RUTAS_S06.vga} t={(e.capa.videoPeticion-.65)/.35} color="#AFCFFA"/>:null}
   {e.capa.tecladoPeticion>=.65?<Frente c={c} ruta={RUTAS_S06.ps2} t={(e.capa.tecladoPeticion-.65)/.35} color="#DDCAEE"/>:null}
   <Volumen c={c} v={PROPS_S06.tarjeta} colores={["#245445","#30765C","#79A995"]}/>
   <Volumen c={c} v={{p:[-3.88,1,-2.5],t:[.06,.7,.85]}} colores={["#101C22","#233740","#425A64"]}/>
   {[-3.6,-3.2,-2.8,-2.4,-2].map(z=><Volumen key={z} c={c} v={{p:[-3.88,.4,z],t:[.06,.18,.18]}} colores={["#A88636","#CDA44D","#E7C675"]}/>)}
   <Volumen c={c} v={{p:RUTAS_S06.vga[0],t:[.28,.2,.5]}} colores={["#355B90","#496DA0","#8199BB"]}/>
   <Volumen c={c} v={PROPS_S06.monitor} colores={["#475565","#5B6B7C","#7E8D9F"]}/>
   <Plano c={c} p={[[mx+mw/2+.015,my+.24,mz-md/2+.17],[mx+mw/2+.015,my+.24,mz+md/2-.17],[mx+mw/2+.015,my+mh-.22,mz+md/2-.17],[mx+mw/2+.015,my+mh-.22,mz-md/2+.17]]} color={e.capa.videoDisponible>0?"#9BD3CF":"#10212C"}/>
   {e.capa.videoDisponible>0?[-.3,0,.3].map(dy=><Cable key={dy} c={c} ruta={[[mx+mw/2+.025,my+.8+dy,mz-.9],[mx+mw/2+.025,my+.8+dy,mz+.9]]} color="#E8FFEF" ancho={3}/>):null}
   <Volumen c={c} v={PROPS_S06.teclado} colores={["#54626C","#71808A","#929DA5"]}/>
   {Array.from({length:30},(_,i)=><Plano key={i} c={c} p={[[ kx-1.18+(i%10)*.25,ky+.21,kz-.38+Math.floor(i/10)*.24],[kx-.99+(i%10)*.25,ky+.21,kz-.38+Math.floor(i/10)*.24],[kx-.99+(i%10)*.25,ky+.21,kz-.21+Math.floor(i/10)*.24],[kx-1.18+(i%10)*.25,ky+.21,kz-.21+Math.floor(i/10)*.24]]} color="#D2D9DC"/>)}
   {(()=>{const ps=proyectar(c,RUTAS_S06.teclado[RUTAS_S06.teclado.length-1]);return <circle cx={ps.x} cy={ps.y} r={8} fill="#88709C" stroke="#D5CCE1" strokeWidth={2}/>;})()}
   {e.capa.tecladoDisponible>0?(()=>{const p=proyectar(c,[kx+1.1,ky+.22,kz+.3]);return <circle cx={p.x} cy={p.y} r={4} fill="#C4F3B9"/>;})():null}
   {e.capa.videoPeticion>0&&e.capa.videoPeticion<.65?<Frente c={c} ruta={RUTAS_S06.video} t={e.capa.videoPeticion/.65} color="#AFCFFA"/>:null}
   {e.capa.tecladoPeticion>0&&e.capa.tecladoPeticion<.65?<Frente c={c} ruta={RUTAS_S06.teclado} t={e.capa.tecladoPeticion/.65} color="#DDCAEE"/>:null}
   <Frente c={c} ruta={RUTAS_S06.ide} t={e.capa.idePreparado} color="#A4D4EA"/>
  </g>:null}
  {e.capa.discoPresente>0?<g>
   <Cable c={c} ruta={RUTAS_S06.cinta} color="#788A96" ancho={16}/>
   <Cable c={c} ruta={RUTAS_S06.cinta} color="#B4C1C9" ancho={3}/>
   <Volumen c={c} v={PROPS_S06.disco} colores={["#64717B","#798690","#A1AEB5"]}/>
   {(()=>{const p=proyectar(c,[10.2,1.005,-2]);return <ellipse cx={p.x} cy={p.y} rx={45} ry={18} fill="#D3DBDF" stroke="#5A707E" strokeWidth={3}/>;})()}
   <Frente c={c} ruta={solicitud} t={e.capa.discoPeticion} color="#C7DDE9"/>
   <Frente c={c} ruta={[...solicitud].reverse()} t={e.capa.discoRespuesta} color="#B8ECC6"/>
  </g>:null}
  {e.capa.discoDetalle>0?<g>
   <line x1={disco.x} y1={disco.y+4} x2={l.disco.x+l.disco.ancho/2} y2={l.disco.y} stroke="#A8C4D1" strokeWidth={2}/>
   <path d={`M${l.disco.x} ${l.disco.y} l10 -7 h360 v100 l-10 7 Z`} fill="#445866" stroke="#A8C4D1" strokeWidth={2}/>
   <rect x={l.disco.x} y={l.disco.y} width={360} height={100} rx={8} fill="#132732" stroke="#A8C4D1" strokeWidth={2}/>
   <text x={l.disco.x+18} y={l.disco.y+34} fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={29} fontWeight={700}>IDE / ATA</text>
   <text x={l.disco.x+18} y={l.disco.y+76} fill={e.capa.comunicacionDisponible>0?"#CEF2D3":"#D0E5EF"} fontFamily="Arial, Helvetica, sans-serif" fontSize={26}>{e.capa.comunicacionDisponible>0?"Comunicación confirmada":e.capa.discoDetectado>0?"Unidad responde":e.capa.discoPeticion>0?"Consulta en curso":"Disco conectado"}</text>
  </g>:null}
  {e.capa.perifericosPresentes>0&&frame>=b.cortePerifericos&&frame<b.corteDisqui?<>
   <rect x={mon[0]+4} y={mon[3]+7} width={100} height={34} rx={5} fill="#11232D" stroke="#91A7B6" strokeWidth={2}/>
   <text x={mon[0]+16} y={mon[3]+32} fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={25}>VGA</text>
   <rect x={key[0]+4} y={key[3]+7} width={120} height={34} rx={5} fill="#11232D" stroke="#91A7B6" strokeWidth={2}/>
   <text x={key[0]+16} y={key[3]+32} fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={25}>PS/2</text>
  </>:null}
 </>;
};
