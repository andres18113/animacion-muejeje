import React from "react";
import type {PerspectiveCamera} from "three";
import {crearCamara,proyectar,LUGARES,type Punto3D} from "./mundo.ts";
import {carasS06,verticesS06,type VolumenS06} from "./servicios-geometria.ts";
import {puntoDeRuta,recorteDeRuta} from "./rutas.ts";
import {trazar} from "./capas";
import {manoEnPantalla} from "./Actor";
import {PROPS_S06} from "./guion/S06.ts";
import {ALTURAS_S05} from "./guion/S05.ts";
import {PROPS_S07,RUTAS_S07,ORDEN_ARRANQUE,BIOS_EFECTIVA,fasesS07,panelOrdenS07,lecturaDisqueteraS07,panelBios,type EstadoS07} from "./guion/S07.ts";
import {RUTAS_S08,PLATO_S08,LECTURA_S08,fasesS08,bytesRecibidosS08,lecturaDiscoS08,panelRamS08,visibilidadPaqueteS08,anchoEtiqueta,type EstadoS08} from "./guion/S08.ts";

export const FUENTE="Arial, Helvetica, sans-serif";
export const Volumen:React.FC<{c:PerspectiveCamera;v:VolumenS06;colores:[string,string,string]}>=({c,v,colores})=><g>{carasS06(c,v).map((p,i)=><polygon key={i} points={p} fill={colores[i]} stroke="#132632" strokeWidth={2}/>)}</g>;
const Plano:React.FC<{c:PerspectiveCamera;p:readonly Punto3D[];color:string;borde?:string}>=({c,p,color,borde="#1C3841"})=><polygon points={p.map(v=>{const q=proyectar(c,v);return`${q.x},${q.y}`;}).join(" ")} fill={color} stroke={borde} strokeWidth={2}/>;
const Cable:React.FC<{c:PerspectiveCamera;ruta:readonly Punto3D[];color:string;ancho?:number;opacidad?:number}>=({c,ruta,color,ancho=5,opacidad=1})=><path d={trazar(c,ruta,6).d} fill="none" stroke={color} strokeWidth={ancho} strokeOpacity={opacidad} strokeLinejoin="round" strokeLinecap="round"/>;
/** Frente de una señal: estela ya recorrida + paquete en la posición actual. */
export const Frente:React.FC<{c:PerspectiveCamera;ruta:readonly Punto3D[];t:number;color:string;etiqueta?:string;opacidad?:number}>=({c,ruta,t,color,etiqueta,opacidad=1})=>{
 if(t<=0||t>=1)return null;
 const p=proyectar(c,puntoDeRuta(ruta,t));
 return <g>
  <path d={trazar(c,recorteDeRuta(ruta,t),6).d} fill="none" stroke={color} strokeOpacity={.6} strokeWidth={3}/>
  {opacidad<=0?null:etiqueta?<g opacity={opacidad}><rect x={p.x-anchoEtiqueta(etiqueta)/2} y={p.y-17} width={anchoEtiqueta(etiqueta)} height={34} rx={8} fill="#0E1F27" stroke={color} strokeWidth={3}/><text x={p.x} y={p.y+8} textAnchor="middle" fill="#FFFFFF" fontFamily={FUENTE} fontSize={23} fontWeight={700}>{etiqueta}</text></g>
   :<rect x={p.x-13} y={p.y-8} width={26} height={16} rx={4} fill={color} stroke="#0E1F27" strokeWidth={2} opacity={opacidad}/>}
 </g>;
};
export const Caja:React.FC<{x:number;y:number;ancho:number;alto:number;borde:string;opacidad:number;children?:React.ReactNode}>=({x,y,ancho,alto,borde,opacidad,children})=><g opacity={opacidad}>
 <path d={`M${x} ${y} l10 -8 h${ancho} v${alto} l-10 8 Z`} fill="#30495A" stroke={borde} strokeWidth={2}/>
 <rect x={x} y={y} width={ancho} height={alto} rx={8} fill="#10222C" stroke={borde} strokeWidth={2}/>
 {children}
</g>;
const caraSuperior=(c:PerspectiveCamera,v:VolumenS06)=>{const p=verticesS06(v).map(q=>proyectar(c,q));return [3,2,6,7].map(i=>`${p[i].x},${p[i].y}`).join(" ");};
export const Marca:React.FC<{x:number;y:number;tipo:"si"|"no"}>=({x,y,tipo})=>tipo==="si"
 ?<path d={`M${x-11} ${y} l8 9 l15 -18`} fill="none" stroke="#BDF5C8" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"/>
 :<path d={`M${x-10} ${y-10} l20 20 M${x+10} ${y-10} l-20 20`} fill="none" stroke="#FFC9A3" strokeWidth={5} strokeLinecap="round"/>;

/** Capa previa al disco S06: la unidad, su cinta y la consulta quedan detrás del disco cuando corresponde. */
export const DisqueteraMaterial:React.FC<{e:EstadoS07|EstadoS08}>=({e})=>{
 const c=crearCamara(e.cam),fdd=PROPS_S07.disquetera,[fx,fy,fz]=fdd.p,[fw,,fd]=fdd.t,frente=fz+fd/2+.005;
 return <>
  {e.capa.disqueteraPresente>0?<g>
   <Volumen c={c} v={PROPS_S07.cabecera} colores={["#15171B","#1E2127","#33373F"]}/>
   <Cable c={c} ruta={RUTAS_S07.cintaDisquetera} color="#8C98A1" ancho={12}/>
   <Cable c={c} ruta={RUTAS_S07.cintaDisquetera} color="#C6CFD5" ancho={2}/>
   <Volumen c={c} v={fdd} colores={["#5E6A74","#76838D","#9AA7B0"]}/>
   <Plano c={c} p={[[fx-fw/2+.25,fy+.2,frente],[fx+fw/2-.6,fy+.2,frente],[fx+fw/2-.6,fy+.3,frente],[fx-fw/2+.25,fy+.3,frente]]} color="#1A2229"/>
   <Plano c={c} p={[[fx+fw/2-.42,fy+.12,frente],[fx+fw/2-.2,fy+.12,frente],[fx+fw/2-.2,fy+.2,frente],[fx+fw/2-.42,fy+.2,frente]]} color="#B9C2C9"/>
   {(()=>{const p=proyectar(c,[fx-fw/2+.35,fy+.12,frente]);return <circle cx={p.x} cy={p.y} r={6} fill={e.capa.disqueteraActiva>0?"#7CFF9E":"#28402F"} stroke="#0D1A12" strokeWidth={1.5}/>;})()}
  </g>:null}
  <Frente c={c} ruta={RUTAS_S07.disquetera} t={e.capa.disqueteraPeticion} color="#C7DDE9"/>
  <Frente c={c} ruta={[...RUTAS_S07.disquetera].reverse()} t={e.capa.disqueteraRespuesta} color="#FFD3B0"/>
 </>;
};

/** S07 y persistencias en S08: disquetera, orden de arranque CMOS, disco seleccionado y rutina BIOS. */
export const SeleccionMaterial:React.FC<{e:EstadoS07|EstadoS08;frame:number;a:Record<string,number>}>=({e,frame,a})=>{
 const b=fasesS07(a),c=crearCamara(e.cam),k=e.capa as Record<string,number|undefined>,v=(n:string)=>k[n]??0;
 const lectura=lecturaDisqueteraS07(c),panel=panelOrdenS07(e.capa.panelK);
 const cm=proyectar(c,LUGARES.cmosi),uc=cm.escala*2.3/512;
 const filas=[1,v("fila13")>0?1:0,v("fila80")>0?1:0].reduce((x,y)=>x+y,0),pb=panelBios(c,filas,v("planoRam"));
 const bios=proyectar(c,BIOS_EFECTIVA),ub=bios.escala*2.3/512;
 const respuestaDisquetera=frame>=b.regresoFin;
 return <>
  <Frente c={c} ruta={RUTAS_S07.consulta} t={e.capa.consultaCmos} color="#C7DDE9"/>
  <Frente c={c} ruta={[...RUTAS_S07.consulta].reverse()} t={e.capa.respuestaCmos} color="#E9D7A8"/>
  {e.capa.discoSeleccionado>0?<g opacity={e.capa.discoSeleccionado}>
   <Cable c={c} ruta={RUTAS_S07.disco.slice(1)} color="#9BE7B0" ancho={3} opacidad={.75}/>
   <polygon points={caraSuperior(c,PROPS_S06.disco)} fill="none" stroke="#9BE7B0" strokeWidth={4}/>
  </g>:null}
  {e.capa.disqueteraPeticion>0&&frame<b.movLectura+12?<Caja x={lectura.x} y={lectura.y} ancho={lectura.ancho} alto={lectura.alto} borde="#A9BCC8" opacidad={Math.max(0,Math.min(1,(b.movLectura+12-frame)/12))}>
   <text x={lectura.x+18} y={lectura.y+36} fill="#FFFFFF" fontFamily={FUENTE} fontSize={28} fontWeight={700}>Disquetera</text>
   <text x={lectura.x+18} y={lectura.y+74} fill={respuestaDisquetera?"#FFE2CC":"#DCEBF3"} fontFamily={FUENTE} fontSize={25}>{respuestaDisquetera?"Responde: sin disquete":e.capa.disqueteraActiva>0?"Unidad consultada":"Consulta en curso"}</text>
  </Caja>:null}
  {e.capa.ordenPanel>0?<g>
   <line x1={panel.x+panel.ancho} y1={panel.y+panel.alto-30} x2={cm.x} y2={cm.y-300*uc} stroke="#A9C4B4" strokeWidth={2} strokeDasharray="5 6" opacity={e.capa.ordenPanel}/>
   <Caja x={panel.x} y={panel.y} ancho={panel.ancho} alto={panel.alto} borde="#A9C4B4" opacidad={e.capa.ordenPanel}>
    <text x={panel.x+18} y={panel.y+36} fill="#FFFFFF" fontFamily={FUENTE} fontSize={24} fontWeight={700}>CMOS · orden de arranque</text>
    {ORDEN_ARRANQUE.map((nombre,i)=>{
     const y=panel.y+52+i*66,activa=i===0?e.capa.fila1:e.capa.fila2,
      estado=i===0?(e.capa.sinDisquete>0?"sin disquete arrancable":e.capa.fila1>0?"se intenta primero":""):(e.capa.discoSeleccionado>0?"seleccionado":e.capa.fila2>0?"a continuación":"");
     return <g key={nombre}>
      <rect x={panel.x+12} y={y} width={panel.ancho-24} height={58} rx={6} fill={activa>0?"#1B3A47":"#142C36"} stroke={activa>0?(i===0&&e.capa.sinDisquete>0?"#FFC9A3":"#BDE7F4"):"#3B5966"} strokeWidth={activa>=1?3:2}/>
      <text x={panel.x+28} y={y+27} fill="#FFFFFF" fontFamily={FUENTE} fontSize={27} fontWeight={700}>{i+1}  {nombre}</text>
      {estado?<text x={panel.x+28} y={y+50} fill={i===0&&e.capa.sinDisquete>0?"#FFE2CC":"#D6F2E0"} fontFamily={FUENTE} fontSize={21}>{estado}</text>:null}
      {i===0&&e.capa.sinDisquete>0?<Marca x={panel.x+panel.ancho-46} y={y+29} tipo="no"/>:null}
      {i===1&&e.capa.discoSeleccionado>0?<Marca x={panel.x+panel.ancho-46} y={y+29} tipo="si"/>:null}
     </g>;
    })}
   </Caja>
  </g>:null}
  {e.capa.rutina19>0?<g>
   <line x1={pb.x+pb.ancho} y1={pb.y+pb.alto-16} x2={bios.x-150*ub} y2={bios.y-330*ub} stroke="#B9B0F0" strokeWidth={2} opacity={e.capa.rutina19*pb.opacidad*(1-v("biosPanelFuera"))}/>
   <Caja x={pb.x} y={pb.y} ancho={pb.ancho} alto={pb.alto} borde="#B9B0F0" opacidad={e.capa.rutina19*pb.opacidad*(1-v("biosPanelFuera"))}>
    {[{codigo:"INT 19h",texto:"rutina de arranque",alfa:1,codigoAlfa:e.capa.codigo19,resalte:e.capa.bootstrap*(1-v("fila13"))},
      {codigo:"INT 13h",texto:"servicio de disco",alfa:v("fila13"),codigoAlfa:1,resalte:v("fila13")*(1-v("solicitud"))},
      {codigo:"DL = 0x80",texto:"primer disco duro",alfa:v("fila80"),codigoAlfa:1,resalte:v("fila80")*(1-v("solicitudRecibida"))}].slice(0,filas).map((fila,i)=>{
     const y=pb.y+11+i*48;
     return <g key={fila.codigo} opacity={fila.alfa}>
      <rect x={pb.x+10} y={y} width={pb.ancho-20} height={42} rx={6} fill={fila.resalte>.5?"#2A2752":"#17213A"} stroke={fila.resalte>.5?"#D5CEFF":"#4A5476"} strokeWidth={fila.resalte>.5?3:2}/>
      <text x={pb.x+20} y={y+30} fill="#FFFFFF" fontFamily="monospace" fontSize={24} fontWeight={700} opacity={fila.codigoAlfa}>{fila.codigo}</text>
      <text x={pb.x+160} y={y+29} fill="#E4E0FF" fontFamily={FUENTE} fontSize={24}>{fila.texto}</text>
     </g>;
    })}
   </Caja>
  </g>:null}
 </>;
};

/** S08: solicitud INT 13h, lectura del sector lógico 0, transferencia y recepción en 0x7C00. */
export const LecturaMaterial:React.FC<{e:EstadoS08;frame:number;a:Record<string,number>}>=({e,frame,a})=>{
 const b=fasesS08(a),c=crearCamara(e.cam),disco=lecturaDiscoS08(c),ram=panelRamS08(c),bytes=bytesRecibidosS08(frame,b);
 const {centro,radio,interior,sector}=PLATO_S08,arco=(r:number,g:number):Punto3D=>[centro[0]+r*Math.cos(g*Math.PI/180),centro[1],centro[2]+r*Math.sin(g*Math.PI/180)];
 const contorno=(r:number)=>Array.from({length:49},(_,i)=>{const q=proyectar(c,arco(r,i*7.5));return`${q.x},${q.y}`;}).join(" ");
 const cuna=(hasta:number)=>{const pts:Punto3D[]=[];for(let g=sector.desde;g<=hasta;g+=2)pts.push(arco(radio-.08,g));for(let g=hasta;g>=sector.desde;g-=2)pts.push(arco(interior,g));return pts.map(p=>{const q=proyectar(c,p);return`${q.x},${q.y}`;}).join(" ");};
 const barrido=sector.desde+(sector.hasta-sector.desde)*e.capa.sectorLectura,cabezal=proyectar(c,arco((radio+interior)/2,barrido)),pivote=proyectar(c,[11.55,1.01,-3.55]);
 const rami=proyectar(c,LUGARES.rami),ur=rami.escala*ALTURAS_S05.rami/512,alt=e.capa.alternativaSector;
 const mano=manoEnPantalla("bios",c,LUGARES.bios,2.3,e.bios,1);
 return <>
  <Frente c={c} ruta={RUTAS_S08.solicitud} t={e.capa.solicitud} color="#C7DDE9"/>
  {e.capa.discoLectura>0?<g opacity={e.capa.discoLectura}>
   <polygon points={contorno(radio)} fill="#B9C6CD" fillOpacity={.35} stroke="#E5EEF2" strokeWidth={2}/>
   <polygon points={contorno(interior)} fill="none" stroke="#E5EEF2" strokeWidth={1.5} strokeOpacity={.7}/>
   <polygon points={cuna(sector.hasta)} fill="#2C4D5C" stroke="#E5EEF2" strokeWidth={2}/>
   {e.capa.sectorLectura>0?<polygon points={cuna(barrido)} fill="#9FE3BD"/>:null}
   <line x1={pivote.x} y1={pivote.y} x2={cabezal.x} y2={cabezal.y} stroke="#D7DEE3" strokeWidth={5} strokeLinecap="round"/>
   <circle cx={cabezal.x} cy={cabezal.y} r={5} fill="#FFFFFF"/>
   <Caja x={disco.x} y={disco.y} ancho={disco.ancho} alto={disco.alto} borde="#A8C4D1" opacidad={1}>
    <text x={disco.x+18} y={disco.y+38} fill="#FFFFFF" fontFamily={FUENTE} fontSize={28} fontWeight={700}>Sector lógico {LECTURA_S08.sectorLogico}</text>
    <text x={disco.x+18} y={disco.y+78} fill="#D6F2E0" fontFamily={FUENTE} fontSize={26}>{LECTURA_S08.bytes} bytes</text>
   </Caja>
  </g>:null}
  <Frente c={c} ruta={RUTAS_S08.datos} t={e.capa.datos} color="#9FE3BD" etiqueta="512 B" opacidad={visibilidadPaqueteS08(c,e,puntoDeRuta(RUTAS_S08.datos,e.capa.datos))}/>
  <Frente c={c} ruta={RUTAS_S08.transferencia} t={e.capa.transferencia} color="#9FE3BD" etiqueta="512 B" opacidad={visibilidadPaqueteS08(c,e,puntoDeRuta(RUTAS_S08.transferencia,e.capa.transferencia))}/>
  {e.capa.transferencia>0&&e.capa.transferencia<1?<line x1={mano.x} y1={mano.y} x2={proyectar(c,puntoDeRuta(RUTAS_S08.transferencia,e.capa.transferencia)).x} y2={proyectar(c,puntoDeRuta(RUTAS_S08.transferencia,e.capa.transferencia)).y} stroke="#B9B0F0" strokeWidth={2} strokeDasharray="4 7" opacity={.8*visibilidadPaqueteS08(c,e,puntoDeRuta(RUTAS_S08.transferencia,e.capa.transferencia))}/>:null}
  {e.capa.ramPanel>0?<g>
   <line x1={ram.x+214} y1={ram.y+ram.alto} x2={rami.x} y2={rami.y-380*ur} stroke="#89CFBB" strokeWidth={2} strokeDasharray="5 6" opacity={e.capa.ramPanel}/>
   <Caja x={ram.x} y={ram.y} ancho={ram.ancho} alto={ram.alto} borde={alt>.5?"#FFC9A3":"#89CFBB"} opacidad={e.capa.ramPanel}>
    {alt>.5?<text x={ram.x+18} y={ram.y+36} fill="#FFE2CC" fontFamily={FUENTE} fontSize={27} fontWeight={700}>Alternativa · sector no arrancable</text>
     :<text x={ram.x+18} y={ram.y+36} fill="#FFFFFF" fontFamily={FUENTE} fontSize={27} fontWeight={700}>RAM física 0x7C00–0x7DFF</text>}
    <rect x={ram.x+ram.ancho-232} y={ram.y+10} width={216} height={36} rx={6} fill={e.capa.direccionResalte>.5?"#1F4A3E":"#143128"} stroke={e.capa.direccionResalte>.5?"#BDF5C8":"#5F8F80"} strokeWidth={e.capa.direccionResalte>.5?3:2}/>
    <text x={ram.x+ram.ancho-124} y={ram.y+37} textAnchor="middle" fill="#FFFFFF" fontFamily="monospace" fontSize={26} fontWeight={700}>0000:7C00</text>
    {Array.from({length:LECTURA_S08.bytes},(_,i)=><rect key={i} x={ram.x+18+(i%64)*11} y={ram.y+56+Math.floor(i/64)*13} width={9} height={10} rx={1.5} fill={i<bytes?(alt>.5?"#7E6A5E":"#9FE3BD"):"#29424B"}/>)}
    {alt>.5?<path d={`M${ram.x+18} ${ram.y+56} l704 104 M${ram.x+722} ${ram.y+56} l-704 104`} stroke="#FFC9A3" strokeWidth={4} opacity={.85}/>:null}
    <text x={ram.x+18} y={ram.y+181} fill={alt>.5?"#FFE2CC":"#D6F2E0"} fontFamily={FUENTE} fontSize={24}>{alt>.5?"El BIOS no entrega el control: no se llega a GRUB":e.capa.preparado>0?`${LECTURA_S08.bytes} B cargados · aún sin ejecutar`:bytes>0?`Recibiendo · ${bytes} / ${LECTURA_S08.bytes} B`:"Esperando transferencia"}</text>
   </Caja>
  </g>:null}
 </>;
};
