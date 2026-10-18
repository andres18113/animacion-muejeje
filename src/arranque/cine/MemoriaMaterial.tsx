import React from "react";
import {puntoDisplayPostinS05} from "./postin-display.ts";
import {ALTURAS_S05} from "./guion/S05.ts";
import {crearCamara,proyectar,LUGARES} from "./mundo.ts";
import {trazar} from "./capas";
import {puntoDeRuta} from "./rutas.ts";
import {EEPROM_SPD,EJEMPLO_RAM,POST_VERIFICADO,RUTA_SMBUS,lecturasS05,fasesS05,checkpointS05,alternativaS05,formaAlternativaS05,type EstadoS05} from "./guion/S05.ts";

/** Instrumentos materiales y muestras separadas: datosSPD nunca se confunden con datosRAM. */
export const MemoriaMaterial:React.FC<{e:EstadoS05;frame:number;fps:number;a:Record<string,number>}>=({e,frame,fps,a})=>{
  const c=crearCamara(e.cam),b=fasesS05(a);
  const pSPD=proyectar(c,EEPROM_SPD),pRAM=proyectar(c,LUGARES.rami),pPOST=proyectar(c,LUGARES.postin);
  const displayPOST=puntoDisplayPostinS05(pPOST,e.postin,frame,fps,ALTURAS_S05.postin);
  const l=lecturasS05(pSPD,pRAM,pPOST,frame,a);
  const cpu=proyectar(c,[1.6,.36,-2.6]),mc=proyectar(c,[3.6,.17,-.4]);
  const pedido=proyectar(c,puntoDeRuta(RUTA_SMBUS,e.capa.spdConsulta));
  const respuesta=proyectar(c,puntoDeRuta([...RUTA_SMBUS].reverse(),e.capa.spdRespuesta));
  const alt=alternativaS05(frame,a),formaAlt=formaAlternativaS05(l.alternativa);
  const cpuEjecuta=frame>=a.inicio&&frame<a.cpu+60;
  const puerto=(frame>=a.puerto-8&&frame<b.corteFirmware)||(frame>=b.refrescoInicio&&frame<b.alternativa);
  return <>
    {frame>=a.inicio&&frame<b.corteFirmware?<path d={`M${cpu.x} ${cpu.y} Q${cpu.x+80} ${cpu.y-80}, ${pPOST.x} ${pPOST.y}`} fill="none" stroke="#D8B88C" strokeWidth={3} strokeDasharray="8 6" />:null}
    {frame>=b.corteSpd?<>
      {/* EEPROM sobre DIMM, revelada en inspección; no se inserta una memoria nueva. */}
      <path d={trazar(c,RUTA_SMBUS,4).d} fill="none" stroke="#C8AC6E" strokeWidth={2} strokeOpacity={0.55}/>
      <rect x={pSPD.x-22} y={pSPD.y-14} width={44} height={28} rx={4} fill="#1F2832" stroke="#D8B577" strokeWidth={2}/>
      {[-12,-4,4,12].map(dx=><g key={dx}><line x1={pSPD.x+dx} y1={pSPD.y-20} x2={pSPD.x+dx} y2={pSPD.y-14} stroke="#E4D6AB" strokeWidth={3}/><line x1={pSPD.x+dx} y1={pSPD.y+14} x2={pSPD.x+dx} y2={pSPD.y+20} stroke="#E4D6AB" strokeWidth={3}/></g>)}
      {e.capa.spdConsulta>0&&e.capa.spdConsulta<1?<rect x={pedido.x-12} y={pedido.y-7} width={24} height={14} rx={4} fill="#F3D9A5"/>:null}
    </>:null}
    {e.capa.spdRespuesta>0&&e.capa.spdRespuesta<1?<rect x={respuesta.x-12} y={respuesta.y-7} width={24} height={14} rx={4} fill="#F3D9A5"/>:null}
    {e.capa.spdDatos>0?<g>
      <path d={`M${pSPD.x} ${pSPD.y} L${l.spd.x+l.spd.ancho/2} ${l.spd.y}`} fill="none" stroke="#D8B577" strokeWidth={2} strokeDasharray="5 7"/>
      <path d={`M${l.spd.x} ${l.spd.y} l14 -10 h${l.spd.ancho} v${l.spd.alto} l-14 10 Z`} fill="#675A3A" stroke="#D8B577" strokeWidth={2}/>
      <rect x={l.spd.x} y={l.spd.y} width={l.spd.ancho} height={l.spd.alto} rx={7} fill="#14252A" stroke="#D8B577" strokeWidth={2}/>
      <text x={l.spd.x+18} y={l.spd.y+29} fill="#F3D9A5" fontFamily="Arial, Helvetica, sans-serif" fontSize={26} fontWeight={700}>EEPROM SPD · SMBus</text>
      <text x={l.spd.x+18} y={l.spd.y+64} fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={30} fontWeight={700}>128 MiB · PC100</text>
      <text x={l.spd.x+18} y={l.spd.y+92} fill="#CEE8DD" fontFamily="Arial, Helvetica, sans-serif" fontSize={23}>Datos del módulo</text>
    </g>:null}
    {e.capa.configControlador>0&&(frame<b.corteRami||(frame>=a.controlador-12&&frame<a.controlador+40))?<>
      <ellipse cx={mc.x} cy={mc.y} rx={62} ry={24} fill="none" stroke="#8CDECE" strokeWidth={4}/>
      <path d={`M${mc.x} ${mc.y} L${pRAM.x} ${pRAM.y}`} fill="none" stroke="#8CDECE" strokeWidth={3} strokeOpacity={0.65}/>
      <line x1={mc.x} y1={mc.y} x2={mc.x-80} y2={mc.y+28} stroke="#8CDECE" strokeWidth={2} strokeDasharray="5 7"/>
      <rect x={mc.x-340} y={mc.y+28} width={260} height={42} rx={6} fill="#10262C" stroke="#8CDECE" strokeWidth={2}/>
      <text x={mc.x-210} y={mc.y+58} textAnchor="middle" fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={28} fontWeight={700}>82443BX</text>
      <circle cx={mc.x} cy={mc.y} r={8+8*e.capa.configControlador} fill="#9BE8CB" fillOpacity={0.5}/>
    </>:null}
    {e.capa.refresco>0&&frame<b.corteRami?<ellipse cx={pRAM.x} cy={pRAM.y} rx={60+30*Math.sin(e.capa.refresco*Math.PI*4)} ry={24} fill="none" stroke="#9BE8CB" strokeWidth={4}/>:null}
    {cpuEjecuta||puerto?<g>
      <path d={`M${displayPOST.x} ${displayPOST.y} L${l.puerto.x} ${l.puerto.y+40}`} fill="none" stroke="#D8B88C" strokeWidth={2} strokeDasharray="5 7"/>
      <path d={`M${l.puerto.x} ${l.puerto.y} l12 -9 h${l.puerto.ancho} v${l.puerto.alto} l-12 9 Z`} fill="#736247" stroke="#D8B88C" strokeWidth={2}/>
      <rect x={l.puerto.x} y={l.puerto.y} width={l.puerto.ancho} height={l.puerto.alto} rx={10} fill="#13232D" stroke="#D8B88C" strokeWidth={3}/>
      <text x={l.puerto.x+l.puerto.ancho/2} y={l.puerto.y+32} textAnchor="middle" fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={26}>{cpuEjecuta?"CPU ejecuta":"Puerto 80h"}</text>
      <text x={l.puerto.x+l.puerto.ancho/2} y={l.puerto.y+83} textAnchor="middle" fill="#BDEAD1" fontFamily="monospace" fontSize={44} fontWeight={700}>{cpuEjecuta?"POST":checkpointS05(frame,a)}</text>
      {frame>=b.refrescoInicio?<text x={l.puerto.x+l.puerto.ancho/2} y={l.puerto.y+135} textAnchor="middle" fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={22}>{frame<b.dimensionado?POST_VERIFICADO.refresco.funcion:POST_VERIFICADO.dimensionado.funcion}</text>:null}
    </g>:null}
    {e.capa.ejemplo>0?<g>
      {/* Palabra material de ocho celdas. No representa todo el contenido ni algoritmo del BIOS. */}
      <line x1={pRAM.x} y1={pRAM.y} x2={l.ram.x+l.ram.ancho} y2={l.ram.y+135} stroke="#72B5A0" strokeWidth={3}/>
      <rect x={l.ram.x} y={l.ram.y} width={l.ram.ancho} height={42} rx={7} fill="#0C242B" stroke="#72B5A0" strokeWidth={2}/>
      <text x={l.ram.x+18} y={l.ram.y+30} fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={28} fontWeight={700}>Ejemplo didáctico RAM</text>
      <rect x={l.ram.x} y={l.ram.y+50} width={l.ram.ancho} height={42} rx={6} fill="#152E34" stroke="#72B5A0" strokeWidth={2}/>
      <text x={l.ram.x+18} y={l.ram.y+80} fill="#D3F3DF" fontFamily="monospace" fontSize={28}>{EJEMPLO_RAM.direccion}</text>
      {EJEMPLO_RAM.binario.split("").map((bit,i)=><g key={i}>
        <path d={`M${l.ram.x+i*57.5} ${l.ram.y+106} l7 -7 h49 v58 l-7 7 Z`} fill="#315F52" stroke="#72B5A0" strokeWidth={2}/>
        <rect x={l.ram.x+i*57.5} y={l.ram.y+106} width={49} height={58} rx={5} fill={e.capa.escritura>=i+1?"#17372D":"#1E292F"} stroke={e.capa.lectura>=i+1?"#B5EFBE":"#72B5A0"} strokeWidth={e.capa.lectura>=i+1?4:2}/>
        <text x={l.ram.x+i*57.5+24.5} y={l.ram.y+145} textAnchor="middle" fill="#FFFFFF" fontFamily="monospace" fontSize={32} fontWeight={700}>{e.capa.escritura>=i+1?bit:"·"}</text>
      </g>)}
      {e.capa.escritura>=8?<>
        <rect x={l.ram.x} y={l.ram.y+184} width={l.ram.ancho} height={44} rx={6} fill="#0C242B" stroke="#72B5A0" strokeWidth={2}/>
        <text x={l.ram.x+18} y={l.ram.y+216} fill="#FFFFFF" fontFamily="monospace" fontSize={30} fontWeight={700}>0xA5 = 165</text>
      </>:null}
      {e.capa.lectura>=8?<text x={l.ram.x} y={l.ram.y+278} fill="#C8F4CD" stroke="#061923" strokeWidth={5} paintOrder="stroke" fontFamily="Arial, Helvetica, sans-serif" fontSize={27} fontWeight={700}>Caso principal: continúa</text>:null}
    </g>:null}
    {e.capa.alternativa>0?<g>
      {/* Muestra alternativa separado: alias de direcciones, no bit de datos cambiado. */}
      <path d={formaAlt.base.d} fill="#26121C" stroke="#E99A9F" strokeWidth={3}/>
      <rect x={l.alternativa.x} y={l.alternativa.y} width={l.alternativa.ancho} height={44} rx={7} fill="#281623" stroke="#E99A9F" strokeWidth={2}/>
      <text x={l.alternativa.x+18} y={l.alternativa.y+31} fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={28} fontWeight={700}>Alternativa didáctica</text>
      <text x={formaAlt.codigo.x} y={formaAlt.codigo.y} fill="#FFC7CB" fontFamily="monospace" fontSize={formaAlt.codigo.tamano} fontWeight={700}>{alt.diagnostico?POST_VERIFICADO.direccion.codigo:"—"}</text>
      <text x={formaAlt.linea.x} y={formaAlt.linea.y} fill="#FFC7CB" fontFamily="Arial, Helvetica, sans-serif" fontSize={formaAlt.linea.tamano} fontWeight={700}>Línea de dirección</text>
      {["dirección A","dirección B"].map((t,i)=><g key={t}><rect x={l.alternativa.x+24} y={l.alternativa.y+120+i*72} width={180} height={42} rx={5} fill="#271C26" stroke="#E99A9F" strokeWidth={2}/><text x={l.alternativa.x+36} y={l.alternativa.y+150+i*72} fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={26}>{t}</text><path d={`M${l.alternativa.x+204} ${l.alternativa.y+141+i*72} L${l.alternativa.x+348} ${l.alternativa.y+190}`} fill="none" stroke="#E99A9F" strokeWidth={4}/></g>)}
      {[alt.direccionA,alt.direccionB].map((u,i)=>u>0&&u<1?<circle key={i} cx={l.alternativa.x+204+144*u} cy={l.alternativa.y+141+i*72+(49-i*72)*u} r={7} fill="#FFE3E6"/>:null)}
      {alt.direccionB>=1?<rect x={l.alternativa.x+337} y={l.alternativa.y+168} width={8} height={44} fill="#FF9EA8"/>:null}
      <rect x={l.alternativa.x+348} y={l.alternativa.y+153} width={74} height={74} rx={6} fill="#441F2C" stroke="#FFC7CB" strokeWidth={4}/>
      <text x={l.alternativa.x+385} y={l.alternativa.y+202} textAnchor="middle" fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={22}>celda</text>
      <text x={formaAlt.parada.x} y={formaAlt.parada.y} fill="#FFFFFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={formaAlt.parada.tamano} fontWeight={700}>{alt.detenida?"POST detenido":"Prueba de dirección"}</text>
    </g>:null}
  </>;
};
