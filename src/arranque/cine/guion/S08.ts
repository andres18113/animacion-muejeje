import {duracionEscena} from "../../anclas.ts";
import {crearMotor} from "../motor.ts";
import {anclasDeEscena,cuesDeEscena} from "../../recursos.ts";
import {proyectar,LUGARES,type Camara,type Punto3D} from "../mundo.ts";
import {puntoDeRuta} from "../rutas.ts";
import {RUTAS_S06} from "./S06.ts";
import {ALTURAS_S05} from "./S05.ts";
import {GUION_S07,CAMARAS_S07,RUTAS_S07,type EstadoS07} from "./S07.ts";
import type {Cuerpo,Guion} from "./comun.ts";
import type {PerspectiveCamera} from "three";

export const CAMARAS_S08={
  lectura:CAMARAS_S07.lectura,
  ram:{px:8.2,py:5.8,pz:7.6,tx:5,ty:0.6,tz:-0.6,fov:42},
} satisfies Record<string,Camara>;
/** §6.8: valores de la lectura; ES:BX = 0000:7C00 equivale a la dirección física 0x7C00. */
export const LECTURA_S08={
  servicio:"INT 13h",funcion:"0x02",dl:0x80,sectorLogico:0,chs:{cilindro:0,cabeza:0,sector:1},
  bytes:512,segmento:0x0000,desplazamiento:0x7C00,inicio:0x7C00,fin:0x7DFF,
} as const;
const PIIX4E:Punto3D=[1.4,.12,3.6];
export const RUTAS_S08={
  // Solicitud: código BIOS → controlador IDE → cinta → unidad.
  solicitud:RUTAS_S07.disco,
  // Respuesta de la unidad: cinta → cabecera → pista → controlador IDE del puente sur.
  datos:[...[...RUTAS_S06.cinta].reverse(),...[...RUTAS_S06.ide].reverse().slice(1)],
  // Transferencia dirigida por el BIOS: puente sur → 82443BX → SDRAM.
  transferencia:[PIIX4E,[2.2,.02,2.2],[2.6,.02,.2],[3.6,.17,-.4],[4.6,.02,-1.2],RUTAS_S06.ram[3]],
} as const satisfies Record<string,readonly Punto3D[]>;
/** Plato del disco visto desde arriba; el sector lógico 0 queda hacia la cámara. */
export const PLATO_S08={centro:[10.2,1.006,-2] as Punto3D,radio:1.3,interior:.55,sector:{desde:70,hasta:96}};

export function fasesS08(a:Record<string,number>){
  const solicitudInicio=a.dl80+4,solicitudFin=Math.max(solicitudInicio+34,a.lee-6);
  const lecturaInicio=Math.max(a.lee,solicitudFin+4),lecturaFin=lecturaInicio+36;
  const datosInicio=lecturaFin+2,datosFin=datosInicio+40;
  const transferenciaInicio=Math.max(a.coloca-6,datosFin+6),transferenciaFin=transferenciaInicio+40;
  const recepcionFin=Math.min(a.direccion+14,transferenciaFin+70);
  const visual=cuesDeEscena("S08"),finVoz=visual[0].cue.startFrame+visual[0].cue.durationFrames;
  const alternativaInicio=finVoz+8,alternativaFin=Math.min(alternativaInicio+80,duracionEscena("S08")-13);
  return {solicitudInicio,solicitudFin,lecturaInicio,lecturaFin,datosInicio,datosFin,transferenciaInicio,transferenciaFin,recepcionFin,movRam:transferenciaInicio-8,finRam:transferenciaInicio+42,finVoz,alternativaInicio,alternativaFin,
    fila13:a.int13-12,fila80:a.dl80-12,sectorFuera:transferenciaInicio-12};
}
/** Bytes recibidos: solo después de que el frente de la transferencia llega a la SDRAM. */
export function bytesRecibidosS08(frame:number,b:ReturnType<typeof fasesS08>){
  if(frame<=b.transferenciaFin)return 0;
  return Math.min(LECTURA_S08.bytes,Math.floor(LECTURA_S08.bytes*(frame-b.transferenciaFin)/(b.recepcionFin-b.transferenciaFin)));
}
export function frenteS08(ruta:readonly Punto3D[],t:number){return puntoDeRuta(ruta,Math.max(0,Math.min(1,t)));}
/** Personajes que pueden quedar delante de un paquete del tablero (lugar, altura de rig). */
export const OCLUSORES_S08=[["bios",LUGARES.bios,2.3],["cmosi",LUGARES.cmosi,2.3],["postin",LUGARES.postin,ALTURAS_S05.postin],["spedi",LUGARES.spedi,ALTURAS_S05.spedi],["rami",LUGARES.rami,ALTURAS_S05.rami],["cipu",[1.6,.36,-2.6],3],["disqui",LUGARES.disqui,2.5]] as const;
export const ETIQUETA_PAQUETE={ancho:76,alto:34,margen:18};
export const LIMITE_ROTULO=870;
/** Ancho del rótulo de un paquete: el de «512 B» conserva 76 px; rótulos más largos crecen. */
export const anchoEtiqueta=(texto:string)=>Math.max(ETIQUETA_PAQUETE.ancho,Math.round(texto.length*13+18));
/**
 * Opacidad del paquete rotulado: se desvanece al acercarse a un personaje situado delante
 * y reaparece al salir, para que la oclusión correcta nunca deje un rótulo recortado.
 */
export type Oclusor=readonly [string,Punto3D,number];
export function visibilidadPaqueteS08(c:PerspectiveCamera,e:Record<string,Record<string,number>>,punto:Punto3D,extra:readonly Oclusor[]=[],ancho:number=ETIQUETA_PAQUETE.ancho){
  const p=proyectar(c,punto),{alto,margen}=ETIQUETA_PAQUETE;let vis=1;
  for(const[id,lugar,h]of [...OCLUSORES_S08,...extra] as Oclusor[]){
    const cuerpo=e[id];if(!cuerpo||cuerpo.visible<=.01)continue;
    const q=proyectar(c,[lugar[0]+cuerpo.desplazX,lugar[1],lugar[2]+(cuerpo.desplazZ??0)]);if(q.profundidad>=p.profundidad)continue;
    const u=q.escala*h/512,caja=[q.x-170*u,q.y-(380+cuerpo.salto)*u,q.x+170*u,q.y+10*u];
    const dx=Math.max(caja[0]-(p.x+ancho/2),(p.x-ancho/2)-caja[2],0),dy=Math.max(caja[1]-(p.y+alto/2),(p.y-alto/2)-caja[3],0);
    vis=Math.min(vis,Math.max(0,Math.min(1,Math.hypot(dx,dy)/margen)));
  }
  // Tampoco se dibuja sobre la banda de subtítulos ni fuera del cuadro.
  vis=Math.min(vis,Math.max(0,Math.min(1,(LIMITE_ROTULO-(p.y+alto/2))/margen)),Math.max(0,Math.min(1,(p.x-ancho/2)/margen)),Math.max(0,Math.min(1,(1920-(p.x+ancho/2))/margen)));
  return vis;
}
export function lecturaDiscoS08(c:PerspectiveCamera){
  const q=proyectar(c,LUGARES.disqui),u=q.escala*2.5/512;
  return {x:Math.min(1920-380,q.x+216*u+18),y:q.y-395*u+40,ancho:360,alto:100};
}
export function panelRamS08(c:PerspectiveCamera){
  const q=proyectar(c,LUGARES.rami),u=q.escala*ALTURAS_S05.rami/512;
  return {x:q.x-214,y:Math.max(12,q.y-395*u-224),ancho:740,alto:190};
}
export type EstadoS08=EstadoS07&{capa:EstadoS07["capa"]&{fila13:number;fila80:number;solicitud:number;solicitudRecibida:number;sectorLectura:number;discoLectura:number;datos:number;transferencia:number;ramPanel:number;direccionResalte:number;preparado:number;alternativaSector:number;planoRam:number}};
const copiar=(c:Cuerpo)=>({...c});
export const GUION_S08:Guion<EstadoS08>={
  inicial:()=>{
    const fin=crearMotor(GUION_S07,anclasDeEscena("S07",cuesDeEscena("S07")),30).en(duracionEscena("S07") - 1);
    return {...fin,cam:{...fin.cam},mundo:{...fin.mundo},cipu:copiar(fin.cipu),secu:copiar(fin.secu),pulso:copiar(fin.pulso),romi:copiar(fin.romi),bios:copiar(fin.bios),cmosi:copiar(fin.cmosi),postin:copiar(fin.postin),spedi:copiar(fin.spedi),rami:copiar(fin.rami),disqui:copiar(fin.disqui),
      capa:{...fin.capa,fila13:0,fila80:0,solicitud:0,solicitudRecibida:0,sectorLectura:0,discoLectura:0,datos:0,transferencia:0,ramPanel:0,direccionResalte:0,preparado:0,alternativaSector:0,planoRam:0}};
  },
  construir:(tl,s,f,a)=>{
    const b=fasesS08(a);
    // INT 13h: la rutina de arranque llama al servicio de disco; el BIOS sigue ejecutándose.
    tl.to(s.bios,{brazoIzq:55,codoIzq:-12,miradaX:-.7,miradaY:-.2,duration:f(12)},f(a.servicio-10));
    tl.to(s.capa,{fila13:1,duration:f(12)},f(b.fila13));
    tl.to(s.bios,{brazoIzq:0,codoIzq:0,miradaX:.9,miradaY:.2,duration:f(14)},f(a.identifica-6));
    tl.to(s.disqui,{cejaAltura:.5,miradaX:-.9,miradaY:.4,sonrisa:.5,duration:f(10)},f(a.identifica+4));
    tl.to(s.capa,{fila80:1,duration:f(12)},f(b.fila80));
    // Solicitud de lectura: anticipación de Bios y viaje uniforme por pista y cinta IDE.
    tl.to(s.bios,{brazoDer:-70,codoDer:14,inclinacion:5,squash:-.05,duration:f(10)},f(b.solicitudInicio-10));
    tl.to(s.capa,{solicitud:1,duration:f(b.solicitudFin-b.solicitudInicio),ease:"none"},f(b.solicitudInicio));
    tl.to(s.bios,{inclinacion:0,squash:0,duration:f(10)},f(b.solicitudInicio+4));
    tl.set(s.capa,{solicitudRecibida:1},f(b.solicitudFin));
    tl.to(s.disqui,{squash:-.1,miradaX:.1,miradaY:.9,duration:f(4),ease:"power2.in"},f(b.solicitudFin));
    tl.to(s.disqui,{squash:0,duration:f(10),ease:"elastic.out(1,.5)"},f(b.solicitudFin+4));
    // La unidad lee su sector lógico 0 porque recibió la orden.
    tl.to(s.capa,{discoLectura:1,duration:f(10)},f(b.lecturaInicio-4));
    tl.to(s.capa,{sectorLectura:1,duration:f(b.lecturaFin-b.lecturaInicio),ease:"none"},f(b.lecturaInicio));
    tl.to(s.disqui,{brazoIzq:60,codoIzq:-12,miradaX:-.9,miradaY:.3,cejaAltura:.7,duration:f(10)},f(b.lecturaFin-6));
    tl.to(s.capa,{datos:1,duration:f(b.datosFin-b.datosInicio),ease:"none"},f(b.datosInicio));
    tl.to(s.disqui,{brazoIzq:0,codoIzq:0,sonrisa:.8,duration:f(12)},f(b.datosFin));
    tl.to(s.capa,{discoLectura:0,duration:f(10)},f(b.sectorFuera));
    // El BIOS coloca los bytes: seguimiento de cámara hacia la SDRAM.
    tl.to(s.cam,{...CAMARAS_S08.ram,duration:f(50),ease:"power2.inOut"},f(b.movRam));
    tl.to(s.capa,{planoRam:1,duration:f(50),ease:"power2.inOut"},f(b.movRam));
    tl.to(s.bios,{brazoDer:-60,codoDer:12,miradaX:.8,miradaY:-.6,duration:f(12)},f(b.transferenciaInicio-10));
    tl.to(s.capa,{transferencia:1,duration:f(b.transferenciaFin-b.transferenciaInicio),ease:"none"},f(b.transferenciaInicio));
    tl.to(s.capa,{ramPanel:1,duration:f(10)},f(b.transferenciaFin-8));
    tl.to(s.rami,{squash:-.08,cejaAltura:.8,miradaX:.3,miradaY:-.6,duration:f(6),ease:"power2.in"},f(b.transferenciaFin));
    tl.to(s.rami,{squash:0,duration:f(12),ease:"elastic.out(1,.5)"},f(b.transferenciaFin+6));
    tl.to(s.capa,{direccionResalte:1,duration:f(10)},f(a.direccion-6));
    tl.to(s.bios,{brazoDer:0,codoDer:0,sonrisa:.85,miradaX:.7,miradaY:-.5,duration:f(14)},f(b.recepcionFin));
    tl.to(s.capa,{preparado:1,duration:f(10)},f(a.prepara));
    tl.to(s.rami,{sonrisa:.9,miradaX:-.6,miradaY:.2,duration:f(12)},f(a.prepara+4));
    // §9.4: alternativa simulada; después se retoma el caso exitoso intacto.
    tl.to(s.capa,{alternativaSector:1,duration:f(10)},f(b.alternativaInicio));
    tl.to(s.bios,{cejaAngulo:-.4,sonrisa:-.3,inclinacion:-3,duration:f(10)},f(b.alternativaInicio+4));
    tl.to(s.disqui,{cejaAngulo:-.4,sonrisa:-.2,miradaX:-.9,miradaY:.6,duration:f(10)},f(b.alternativaInicio+8));
    tl.to(s.capa,{alternativaSector:0,duration:f(10)},f(b.alternativaFin-10));
    tl.to(s.bios,{cejaAngulo:0,sonrisa:.8,inclinacion:0,duration:f(12)},f(b.alternativaFin-6));
    tl.to(s.disqui,{cejaAngulo:0,sonrisa:.8,duration:f(12)},f(b.alternativaFin-4));
  },
};
