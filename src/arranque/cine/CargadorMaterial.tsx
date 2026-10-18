import React from "react";
import {crearCamara,proyectar,LUGARES,type Punto3D} from "./mundo.ts";
import {manoEnPantalla} from "./Actor";
import {puntoDeRuta} from "./rutas.ts";
import {Caja,Frente,Marca,FUENTE} from "./ArranqueMaterial";
import {visibilidadPaqueteS08,anchoEtiqueta,type Oclusor} from "./guion/S08.ts";
import {MBR,PANEL_MBR,MEBRE_LUGAR,ALTURA_MEBRE,celdaMBR,binario8,palabraFirma,tamanoRegion,type EstadoS09} from "./guion/S09.ts";
import {GRUBI_LUGAR,ALTURA_GRUBI,PANEL_DISCO,PANEL_MENU,MAPA_DISCO,MENU_LST,ARCHIVOS_EXT2,RUTAS_S10,type EstadoS10} from "./guion/S10.ts";
import {ALTURAS_S05} from "./guion/S05.ts";

const hex3=(n:number)=>`0x${n.toString(16).toUpperCase().padStart(3,"0")}`;
const hex2=(n:number)=>`0x${n.toString(16).toUpperCase().padStart(2,"0")}`;
/** Color de cada byte del MBR según las regiones ya nombradas (orden §8: código → tabla → firma). */
function colorByte(i:number,c:Record<string,number>){
 const {codigo,particiones}=MBR;
 if(i<=codigo.hasta)return i<tamanoRegion(codigo)*c.regionCodigo?"#8FBDF2":"#9FE3BD";
 if(i<=particiones.hasta){const k=i-particiones.desde;return k<tamanoRegion(particiones)*c.regionTabla?(Math.floor(k/particiones.bytesEntrada)%2?"#F2CD8A":"#C99A4B"):"#9FE3BD";}
 return c.regionFirma>0?"#FF9DB0":"#9FE3BD";
}
export function cabezaActor(c:ReturnType<typeof crearCamara>,lugar:Punto3D,alto:number,cuerpo:{desplazX:number;salto:number;desplazZ?:number}){
 const q=proyectar(c,[lugar[0]+cuerpo.desplazX,lugar[1],lugar[2]+(cuerpo.desplazZ??0)]),u=q.escala*alto/512;
 return {x:q.x,y:q.y-(380+cuerpo.salto)*u};
}

/** S09 (y su salida en S10): el sector cargado en 0x7C00 dividido en código, tabla y firma; entrega del control al código. */
export const MbrMaterial:React.FC<{e:EstadoS09|EstadoS10}>=({e})=>{
 const c=crearCamara(e.cam),k=e.capa;
 if(k.mbrPanel<=0&&(k.entrega<=0||k.entrega>=1))return null;
 const {x,y,ancho,alto,paso,celda}=PANEL_MBR,cab=cabezaActor(c,MEBRE_LUGAR,ALTURA_MEBRE,e.mebre);
 const origen=manoEnPantalla("bios",c,LUGARES.bios,2.3,e.bios,1),destino=celdaMBR(0),dx=destino.x+celda[0]/2,dy=destino.y+celda[1]/2;
 const t=k.entrega,cx=(origen.x+dx)/2-120,cy=Math.min(origen.y,dy)-80;
 const px=(1-t)*(1-t)*origen.x+2*(1-t)*t*cx+t*t*dx,py=(1-t)*(1-t)*origen.y+2*(1-t)*t*cy+t*t*dy;
 const fila6=celdaMBR(384),ultimo=celdaMBR(MBR.codigo.hasta);
 const leyenda=[
  {x:x+52,color:"#8FBDF2",alfa:k.regionCodigo,titulo:`Código · ${hex3(MBR.codigo.desde)}–${hex3(MBR.codigo.hasta)} · ${tamanoRegion(MBR.codigo)} B`,linea:k.stage1>0?"GRUB Stage 1":""},
  {x:x+560,color:"#E0B46A",alfa:k.regionTabla,titulo:`Particiones · ${hex3(MBR.particiones.desde)}–${hex3(MBR.particiones.hasta)}`,linea:`${MBR.particiones.entradas} entradas × ${MBR.particiones.bytesEntrada} B = ${tamanoRegion(MBR.particiones)} B`},
  {x:x+1010,color:"#FF9DB0",alfa:k.regionFirma,titulo:`Firma · ${hex3(MBR.firma.desde)}–${hex3(MBR.firma.hasta)}`,linea:MBR.firma.valores.map(v=>v.toString(16).toUpperCase()).join(" ")},
 ];
 return <>
  {k.mbrPanel>0?<g>
   <line x1={x+ancho/2} y1={y+alto} x2={cab.x} y2={cab.y} stroke="#E5BA81" strokeWidth={2} strokeDasharray="5 6" opacity={k.mbrPanel}/>
   <Caja x={x} y={y} ancho={ancho} alto={alto} borde="#E5BA81" opacidad={k.mbrPanel}>
    <text x={x+20} y={y+38} fill="#FFFFFF" fontFamily={FUENTE} fontSize={27} fontWeight={700}>MBR · sector lógico 0 · {MBR.bytes} B en RAM 0x7C00–0x7DFF</text>
    {Array.from({length:MBR.bytes},(_,i)=>{const p=celdaMBR(i);return <rect key={i} x={p.x} y={p.y} width={celda[0]} height={celda[1]} rx={2} fill={colorByte(i,k)}/>;})}
    {k.regionFirma>0?[MBR.firma.desde,MBR.firma.hasta].map(i=>{const p=celdaMBR(i);return <rect key={i} x={p.x-3} y={p.y-3} width={celda[0]+6} height={celda[1]+6} rx={3} fill="none" stroke="#FFE3EA" strokeWidth={3} opacity={k.regionFirma}/>;}):null}
    {k.ejecutaStage1>0?<g fill="none" stroke="#D6E9FF" strokeWidth={3}>
     <rect x={x+46} y={y+50} width={64*paso+6} height={6*PANEL_MBR.pasoFila+2}/>
     <rect x={fila6.x-3} y={fila6.y-1} width={ultimo.x-fila6.x+celda[0]+6} height={PANEL_MBR.pasoFila+2}/>
    </g>:null}
    {leyenda.map(l=><g key={l.titulo} opacity={l.alfa>0?1:.35}>
     <rect x={l.x} y={y+190} width={18} height={18} rx={3} fill={l.color}/>
     <text x={l.x+28} y={y+206} fill="#FFFFFF" fontFamily={FUENTE} fontSize={24} fontWeight={700}>{l.titulo}</text>
     {l.alfa>0&&l.linea?<text x={l.x+28} y={y+238} fill="#F3E6D3" fontFamily={l.color==="#FF9DB0"?"monospace":FUENTE} fontSize={l.color==="#FF9DB0"?26:23} fontWeight={l.color==="#FF9DB0"?700:400}>{l.linea}</text>:null}
    </g>)}
    {k.ejecutaStage1>0?<text x={x+52} y={y+270} fill="#D6E9FF" fontFamily={FUENTE} fontSize={22} fontWeight={700}>▶ la CPU ejecuta desde 0x7C00</text>:null}
    {/* Alineado al borde derecho del panel: a x+1010 los dos binarios desbordaban el marco. */}
    {k.firmaValor>0?<text x={x+ancho-20} y={y+272} textAnchor="end" fill="#FFE3EA" fontFamily="monospace" fontSize={20} opacity={k.firmaValor}>{`${hex2(MBR.firma.valores[0])}=${binario8(MBR.firma.valores[0])} ${hex2(MBR.firma.valores[1])}=${binario8(MBR.firma.valores[1])}`}</text>:null}
    {k.firmaValor>0?<text x={x+560} y={y+272} fill="#FFE3EA" fontFamily={FUENTE} fontSize={22} opacity={k.firmaValor}>palabra little-endian: 0x{palabraFirma().toString(16).toUpperCase()}</text>:null}
   </Caja>
  </g>:null}
  {t>0&&t<1?<g>
   <path d={`M${origen.x} ${origen.y} Q${cx} ${cy} ${px} ${py}`} fill="none" stroke="#D6E9FF" strokeWidth={3} strokeDasharray="6 6" opacity={.8}/>
   <rect x={px-118} y={py-18} width={236} height={36} rx={9} fill="#0E1F27" stroke="#D6E9FF" strokeWidth={3}/>
   <text x={px} y={py+8} textAnchor="middle" fill="#FFFFFF" fontFamily={FUENTE} fontSize={23} fontWeight={700}>ejecución → 0x7C00</text>
  </g>:null}
 </>;
};

const OCLUSORES_S10:readonly Oclusor[]=[["mebre",MEBRE_LUGAR,ALTURA_MEBRE],["grubi",GRUBI_LUGAR,ALTURA_GRUBI]];
const CARGAS=[["s15","Stage 1.5"],["s2","Stage 2"],["menu","menu.lst"]] as const;
/** S10: Stage 1 → Stage 1.5 → Stage 2 leídos del disco y copiados a SDRAM; menu.lst y elección del núcleo. */
export const GrubMaterial:React.FC<{e:EstadoS10}>=({e})=>{
 const c=crearCamara(e.cam),k=e.capa,{x,y,ancho,alto}=PANEL_DISCO,m=PANEL_MENU,col=MAPA_DISCO;
 const disqui=cabezaActor(c,LUGARES.disqui,2.5,e.disqui),rami=cabezaActor(c,LUGARES.rami,ALTURAS_S05.rami,e.rami);
 const chips=ARCHIVOS_EXT2.map((archivo,i)=>({archivo,x:x+col.ext2[0]+14+i*322,ancho:310}));
 const ram=[
  {id:1,texto:"Stage 1 · 0x7C00",x:x+col.mbr[0],ancho:col.mbr[1]-col.mbr[0],vis:1},
  {id:2,texto:"Stage 1.5",x:x+col.insercion[0]+60,ancho:230,vis:k.s15Transferencia>=1?1:0},
  {id:3,texto:"Stage 2",x:chips[0].x+40,ancho:226,vis:k.s2Transferencia>=1?1:0},
  {id:4,texto:"menu.lst",x:chips[1].x+40,ancho:226,vis:k.menuTransferencia>=1?1:0},
  // S11: la imagen del núcleo copiada a RAM; id 5 = Linux en ejecución tras la entrada.
  {id:5,texto:"Linux · vmlinuz",x:chips[2].x+20,ancho:270,vis:((k as Record<string,number>).nucleoTransferencia??0)>=1?1:0},
 ];
 const segmento=(x0:number,x1:number,activo:number,borde:string)=><rect x={x+x0} y={y+56} width={x1-x0} height={76} rx={8} fill={activo>0?"#1D3A4A":"#14283A"} stroke={activo>0?borde:"#3E5A6B"} strokeWidth={activo>0?3:2}/>;
 return <>
  {k.discoPanel>0?<g>
   <line x1={x+col.ext2[0]+150} y1={y+alto} x2={disqui.x} y2={disqui.y} stroke="#A8C4D1" strokeWidth={2} strokeDasharray="5 6" opacity={k.discoPanel}/>
   <line x1={x+col.mbr[0]+80} y1={y+alto} x2={rami.x} y2={rami.y} stroke="#89CFBB" strokeWidth={2} strokeDasharray="5 6" opacity={k.discoPanel}/>
   <Caja x={x} y={y} ancho={ancho} alto={alto} borde="#9C9BD1" opacidad={k.discoPanel}>
    <text x={x+col.etiqueta} y={y+84} fill="#FFFFFF" fontFamily={FUENTE} fontSize={26} fontWeight={700}>Disco IDE</text>
    <text x={x+col.etiqueta} y={y+114} fill="#D0E5EF" fontFamily="monospace" fontSize={22}>(hd0)</text>
    {segmento(col.mbr[0],col.mbr[1],k.mbrStage1,"#E5BA81")}
    <text x={x+col.mbr[0]+14} y={y+86} fill="#FFFFFF" fontFamily={FUENTE} fontSize={23} fontWeight={700}>Sector 0 · MBR</text>
    {k.mbrStage1>0?<text x={x+col.mbr[0]+14} y={y+118} fill="#F3E6D3" fontFamily={FUENTE} fontSize={22}>Stage 1</text>:null}
    {segmento(col.insercion[0],col.insercion[1],k.insercion,"#C7C6F2")}
    <text x={x+col.insercion[0]+14} y={y+86} fill="#FFFFFF" fontFamily={FUENTE} fontSize={23} fontWeight={700}>Espacio de inserción</text>
    {k.insercion>0?<text x={x+col.insercion[0]+14} y={y+118} fill="#E4E0FF" fontFamily="monospace" fontSize={21}>Stage 1.5 · e2fs_stage1_5</text>:null}
    {segmento(col.ext2[0],col.ext2[1],k.ext2Abierto,"#A9E5C6")}
    {k.ext2Abierto>0?chips.map(ch=>{
     const activo=ch.archivo===ARCHIVOS_EXT2[0]?k.rutaStage2>=1:ch.archivo===ARCHIVOS_EXT2[1]?k.menuDatos>0:k.nucleoSeleccionado>0;
     return <g key={ch.archivo}><rect x={ch.x} y={y+66} width={ch.ancho} height={34} rx={6} fill={activo?"#24513F":"#183447"} stroke={activo?"#BDF5C8":"#4F7584"} strokeWidth={activo?3:2}/>
      <text x={ch.x+12} y={y+90} fill="#FFFFFF" fontFamily="monospace" fontSize={20}>{ch.archivo}</text>
      {ch.archivo===MENU_LST.nucleo&&k.nucleoSeleccionado>0?<Marca x={ch.x+ch.ancho-22} y={y+83} tipo="si"/>:null}</g>;
    }):<text x={x+col.ext2[0]+14} y={y+86} fill="#FFFFFF" fontFamily={FUENTE} fontSize={23} fontWeight={700}>Partición ext2 (hd0,0)</text>}
    {k.ext2Abierto>0?<text x={x+col.ext2[0]+16} y={y+124} fill="#D6F2E0" fontFamily={FUENTE} fontSize={21}>ext2 (hd0,0): Stage 1.5 recorre directorios hasta stage2</text>:null}
    {k.rutaStage2>0&&k.rutaStage2<1?<rect x={chips[0].x} y={y+102} width={chips[0].ancho*k.rutaStage2} height={4} fill="#BDF5C8"/>:null}
    <text x={x+col.etiqueta} y={y+206} fill="#FFFFFF" fontFamily={FUENTE} fontSize={26} fontWeight={700}>RAM</text>
    {ram.map(r=>r.vis>0?<g key={r.id}>
     <rect x={r.x} y={y+174} width={r.ancho} height={50} rx={8} fill={k.ejecuta===r.id?"#2A2752":"#173A31"} stroke={k.ejecuta===r.id?"#D5CEFF":"#7ABB9F"} strokeWidth={k.ejecuta===r.id?3:2}/>
     {/* «▶ Stage 1 · 0x7C00» no cabe a 21 px en la columna del MBR (200 px). */}
     <text x={r.x+12} y={y+206} fill="#FFFFFF" fontFamily={r.id===1?FUENTE:"monospace"} fontSize={r.id===1?19:21} fontWeight={700}>{k.ejecuta===r.id?"▶ ":""}{r.texto}</text>
    </g>:null)}
    <text x={x+col.etiqueta} y={y+240} fill="#D5CEFF" fontFamily={FUENTE} fontSize={20}>▶ = ejecuta la CPU</text>
    {/* Copia disco → RAM en curso: el mismo progreso que los paquetes físicos (respuesta + transferencia). */}
    {([["s15",x+col.insercion[0]+175],["s2",chips[0].x+chips[0].ancho/2],["menu",chips[1].x+chips[1].ancho/2],["nucleo",chips[2].x+155]] as const).map(([id,cx])=>{
     const kk=k as Record<string,number>,d=kk[`${id}Datos`]??0,t=kk[`${id}Transferencia`]??0;if(d<=0||t>=1)return null;
     const pr=(d+t)/2,y0=y+134,y1=y+170,yy=y0+(y1-y0)*pr;
     return <g key={id}><line x1={cx} y1={y0} x2={cx} y2={y1} stroke="#C7C6F2" strokeWidth={3} strokeDasharray="4 4"/><path d={`M${cx-7} ${y1-8} L${cx} ${y1} L${cx+7} ${y1-8}`} fill="none" stroke="#C7C6F2" strokeWidth={3}/><circle cx={cx} cy={yy} r={6} fill="#FFFFFF"/></g>;
    })}
   </Caja>
  </g>:null}
  {CARGAS.map(([id,etiqueta])=>{
   const s=k[`${id}Solicitud` as const],d=k[`${id}Datos` as const],t=k[`${id}Transferencia` as const],ancho=anchoEtiqueta(etiqueta);
   return <g key={id}>
    <Frente c={c} ruta={RUTAS_S10.solicitud} t={s} color="#C7DDE9"/>
    <Frente c={c} ruta={RUTAS_S10.datos} t={d} color="#C7C6F2" etiqueta={etiqueta} opacidad={visibilidadPaqueteS08(c,e,puntoDeRuta(RUTAS_S10.datos,d),OCLUSORES_S10,ancho)}/>
    <Frente c={c} ruta={RUTAS_S10.transferencia} t={t} color="#C7C6F2" etiqueta={etiqueta} opacidad={visibilidadPaqueteS08(c,e,puntoDeRuta(RUTAS_S10.transferencia,t),OCLUSORES_S10,ancho)}/>
   </g>;
  })}
  {k.menuPanel>0?<Caja x={m.x} y={m.y} ancho={m.ancho} alto={m.alto} borde="#9C9BD1" opacidad={k.menuPanel}>
   <text x={m.x+16} y={m.y+36} fill="#FFFFFF" fontFamily="monospace" fontSize={22} fontWeight={700}>{MENU_LST.archivo}</text>
   {MENU_LST.lineas.map((l,i)=>{const nucleo=l.startsWith("kernel");return <g key={l}>
    {nucleo&&k.nucleoSeleccionado>0?<rect x={m.x+8} y={m.y+50+i*40} width={m.ancho-16} height={34} rx={5} fill="#24513F" stroke="#BDF5C8" strokeWidth={2}/>:null}
    <text x={m.x+16} y={m.y+74+i*40} fill="#E4E0FF" fontFamily="monospace" fontSize={19}>{l}</text></g>;})}
   <text x={m.x+16} y={m.y+206} fill={k.nucleoSeleccionado>0?"#D6F2E0":"#B9C6E0"} fontFamily={FUENTE} fontSize={21}>{k.nucleoSeleccionado>0?"Núcleo elegido · todavía no cargado":"Stage 2 lee la configuración"}</text>
  </Caja>:null}
 </>;
};
