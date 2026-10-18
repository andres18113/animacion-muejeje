import {duracionEscena} from "../../anclas.ts";
import {puntoDeRuta} from "../rutas.ts";
import {crearMotor} from "../motor.ts";
import {anclasDeEscena,cuesDeEscena} from "../../recursos.ts";
import {GUION_S05,type EstadoS05} from "./S05.ts";
import {CUERPO_BASE,type Cuerpo,type Guion} from "./comun.ts";
import type {Camara,Punto3D} from "../mundo.ts";

export const ALTURA_DISQUI=2.5;
export const CAMARAS_S06={
  ram:{px:8,py:5,pz:3,tx:3.2,ty:-1,tz:-0.5,fov:44},
  perifericos:{px:10,py:4,pz:8,tx:-1,ty:.3,tz:3.5,fov:42},
  disqui:{px:15,py:3,pz:5,tx:7,ty:0.5,tz:-2,fov:38},
  salida:{px:10,py:7,pz:7,tx:3.6,ty:0,tz:.5,fov:46},
} satisfies Record<string,Camara>;
export const ESTRUCTURAS_S06={
  ivt:{inicio:0,fin:0x3ff,entradas:256,bytesEntrada:4,campos:[{nombre:"Desplazamiento",bytes:2,inicio:0},{nombre:"Segmento",bytes:2,inicio:2}]},
  bda:{inicio:0x400,fin:0x4ff,bytes:256},
} as const;
export const PROPS_S06={
  tarjeta:{p:[-4,.32,-2.5],t:[.18,1.98,3]},
  monitor:{p:[-3,1.3,7],t:[1,1.6,2.6]},
  teclado:{p:[0,1.1,7],t:[2.8,.2,1.2]},
  mesa:{p:[-1.5,.9,7.5],t:[6,.2,4]},
  pedestal:{p:[-3,1.1,7],t:[1.2,.2,.8]},
  disco:{p:[10.2,.3,-2],t:[3.2,.7,3.8]},
} as const;
export const RUTAS_S06={
  ram:[[2.4,.02,-2.25],[3.6,.17,-.4],[4.5,.02,-.4],[5.84,.55,-2.4]],
  video:[[3.6,.17,-.4],[2.5,.02,-.8],[.2,.02,-1.2],[-2.5,.02,-1.5],[-4,.32,-2.5]],
  vga:[[-4.1,1.3,-4.2],[-8.8,.3,-4.2],[-8.8,.3,6],[-4.8,.8,7],[-4.8,1.5,7],[-3.5,1.8,7]],
  teclado:[[1.4,.12,3.6],[-.1,.02,3.6],[-.1,.02,-1.3],[-1.4,.02,-3],[-2.3,.8,-5.55]],
  ps2:[[-2.3,.8,-5.55],[-9.1,.15,-5.55],[-9.1,.15,10],[0,1.15,10],[0,1.15,7.6]],
  ide:[[1.4,.12,3.6],[3.6,.02,3.6],[5.8,.02,3.5],[7.4,.35,2.4]],
  cinta:[[7.4,.35,2.4],[8.5,.1,2.4],[10.2,.1,1.2],[10.2,.65,-.1]],
} as const satisfies Record<string,readonly Punto3D[]>;
export function fasesS06(a:Record<string,number>){
  const ivtInicio=Math.max(36,a.servicios-30),ivtFin=Math.max(a.servicios+10,ivtInicio+40);
  const bdaInicio=Math.max(a.ram-24,ivtFin+6),bdaFin=Math.max(a.ram,bdaInicio+24);
  const videoInicio=Math.max(a.video-36,bdaFin+12),videoFin=Math.max(a.video-4,videoInicio+24);
  // El teclado se consulta cuando la respuesta del monitor (6 frames desde videoFin) ya está completa.
  const tecladoInicio=Math.max(a.teclado-20,videoFin+6),tecladoFin=Math.max(a.teclado-3,tecladoInicio+16);
  const ideInicio=Math.max(a.ide-16,tecladoFin+4),ideFin=Math.max(a.ide,ideInicio+16);
  const visual=cuesDeEscena("S06");
  const finTextoBios=Math.max(...visual[0].segmentos.map(s=>s.finFrame+6));
  const finTextoDisqui=Math.max(...visual[1].segmentos.map(s=>s.finFrame+6));
  // Mantener a Bios legible durante toda su ventana, incluido el silencio final del audio.
  const corteDisqui=Math.max(finTextoBios,visual[0].cue.startFrame+visual[0].cue.durationFrames,ideFin+8);
  const salida=Math.max(finTextoDisqui,visual[1].cue.startFrame+visual[1].cue.durationFrames);
  const peticionInicio=Math.max(a.detecta-20,ideFin+12,corteDisqui+12),llegadaDisco=Math.max(a.ata-12,peticionInicio+56);
  const respuestaInicio=llegadaDisco+8,respuestaFin=Math.max(a.comunicacion-4,respuestaInicio+56);
  return {ivtInicio,ivtFin,bdaInicio,bdaFin,videoInicio,videoFin,tecladoInicio,tecladoFin,ideInicio,ideFin,cortePerifericos:videoInicio-4,corteDisqui,peticionInicio,llegadaDisco,respuestaInicio,respuestaFin,finTextoBios,finTextoDisqui,salida};
}
/** Transporte primero; la SDRAM solo cambia después de recibir el frente. */
export function transferenciaRamS06(frame:number,inicio:number,fin:number){
  const recepcion=inicio+Math.ceil((fin-inicio)*.35);
  const acotar=(n:number)=>Math.max(0,Math.min(1,n));
  const frente=acotar((frame-inicio)/(recepcion-inicio));
  return {recepcion,frente,recibido:frame>=recepcion,escritura:acotar((frame-recepcion)/(fin-recepcion)),posicion:puntoDeRuta(RUTAS_S06.ram,frente)};
}
export function lecturasS06(ram:{x:number;y:number},disco:{x:number;y:number}){
  return {ram:{x:ram.x-800,y:ram.y+100,ancho:1000,alto:220},disco:{x:disco.x-180,y:disco.y+28,ancho:360,alto:100}};
}
export type EstadoS06=EstadoS05&{disqui:Cuerpo;capa:EstadoS05["capa"]&{ramDetalle:number;ivtPreparacion:number;bdaPreparacion:number;perifericosPresentes:number;discoPresente:number;videoPeticion:number;videoDisponible:number;tecladoPeticion:number;tecladoDisponible:number;idePreparado:number;discoPeticion:number;discoDetectado:number;discoRespuesta:number;comunicacionDisponible:number;discoDetalle:number}};
export const GUION_S06:Guion<EstadoS06>={
  inicial:()=>{
    const fin=crearMotor(GUION_S05,anclasDeEscena("S05",cuesDeEscena("S05")),30).en(duracionEscena("S05") - 1);
    return {...fin,cam:{...fin.cam},mundo:{...fin.mundo},cipu:{...fin.cipu},secu:{...fin.secu},pulso:{...fin.pulso},romi:{...fin.romi},bios:{...fin.bios},cmosi:{...fin.cmosi},postin:{...fin.postin},spedi:{...fin.spedi},rami:{...fin.rami},disqui:{...CUERPO_BASE,visible:0,ojo:.6},
      capa:{...fin.capa,ramDetalle:0,ivtPreparacion:0,bdaPreparacion:0,perifericosPresentes:0,discoPresente:0,videoPeticion:0,videoDisponible:0,tecladoPeticion:0,tecladoDisponible:0,idePreparado:0,discoPeticion:0,discoDetectado:0,discoRespuesta:0,comunicacionDisponible:0,discoDetalle:0}};
  },
  construir:(tl,s,f,a)=>{
    const b=fasesS06(a);
    // La guía se desplaza con apoyos, no el programa BIOS hacia RAM. CPU sigue ejecutándolo.
    tl.to(s.bios,{inclinacion:5,squash:-.04,miradaX:.9,miradaY:.5,duration:f(2)},f(2));
    tl.to(s.bios,{desplazX:1.8,paso:Math.PI*2,duration:f(24),ease:"none"},f(4));
    tl.to(s.bios,{brazoDer:-40,brazoIzq:45,duration:f(4),repeat:5,yoyo:true,ease:"sine.inOut"},f(4));
    tl.to(s.bios,{inclinacion:0,squash:0,paso:0,brazoIzq:0,brazoDer:-60,codoDer:12,sonrisa:.7,duration:f(8)},f(28));
    tl.to(s.cam,{...CAMARAS_S06.ram,duration:f(32),ease:"power2.inOut"},f(0));
    // Revelación fuera del campo RAM: detalles ya montados, sin inserción de hardware.
    tl.set(s.capa,{perifericosPresentes:1},f(32));
    tl.to(s.capa,{ramDetalle:1,duration:f(12)},f(a.preparar));
    const recepcionIVT=transferenciaRamS06(0,b.ivtInicio,b.ivtFin).recepcion;
    const recepcionBDA=transferenciaRamS06(0,b.bdaInicio,b.bdaFin).recepcion;
    // Entradas discretas, muestreadas por frame: evita redondeo GSAP en el último byte.
    for(let frame=recepcionIVT;frame<=b.ivtFin;frame++)tl.set(s.capa,{ivtPreparacion:Math.floor(256*transferenciaRamS06(frame,b.ivtInicio,b.ivtFin).escritura)},f(frame));
    for(let frame=recepcionBDA;frame<=b.bdaFin;frame++)tl.set(s.capa,{bdaPreparacion:transferenciaRamS06(frame,b.bdaInicio,b.bdaFin).escritura},f(frame));
    tl.to(s.cipu,{cejaAltura:-.2,sonrisa:.3,duration:f(10)},f(b.ivtInicio));
    tl.to(s.cipu,{cejaAltura:.7,sonrisa:.8,duration:f(10)},f(b.bdaFin));
    tl.to(s.bios,{brazoIzq:60,codoIzq:-15,miradaX:.9,miradaY:.5,duration:f(12)},f(a.ram-12));
    tl.to(s.capa,{ramDetalle:0,duration:f(12)},f(b.cortePerifericos-12));
    tl.to(s.bios,{inclinacion:5,desplazX:3.4,paso:Math.PI*2,duration:f(12),ease:"none"},f(b.cortePerifericos-12));
    tl.to(s.bios,{inclinacion:0,paso:0,duration:f(5)},f(b.cortePerifericos));
    tl.set(s.cam,{...CAMARAS_S06.perifericos},f(b.cortePerifericos));
    tl.to(s.bios,{brazoDer:-75,codoDer:15,brazoIzq:0,codoIzq:0,miradaX:.7,miradaY:-.8,duration:f(12)},f(b.videoInicio-8));
    tl.to(s.capa,{videoPeticion:1,duration:f(b.videoFin-b.videoInicio),ease:"none"},f(b.videoInicio));
    tl.to(s.capa,{videoDisponible:1,duration:f(6)},f(b.videoFin));
    tl.to(s.bios,{brazoIzq:55,codoIzq:-10,brazoDer:0,miradaX:-.2,miradaY:-.7,duration:f(10)},f(b.tecladoInicio-6));
    tl.to(s.capa,{tecladoPeticion:1,duration:f(b.tecladoFin-b.tecladoInicio),ease:"none"},f(b.tecladoInicio));
    tl.to(s.capa,{tecladoDisponible:1,duration:f(6)},f(b.tecladoFin));
    tl.set(s.capa,{discoPresente:1},f(b.ideInicio-2));
    tl.to(s.capa,{idePreparado:1,duration:f(b.ideFin-b.ideInicio),ease:"none"},f(b.ideInicio));
    tl.to(s.bios,{brazoDer:-65,codoDer:10,brazoIzq:0,codoIzq:0,miradaX:.9,miradaY:.3,duration:f(12)},f(b.ideInicio));
    tl.to(s.bios,{brazoDer:0,codoDer:0,sonrisa:.8,duration:f(12)},f(a.ide+12));
    tl.set(s.cam,{...CAMARAS_S06.disqui},f(b.corteDisqui));
    tl.to(s.disqui,{visible:1,ojo:0,salto:10,sonrisa:.6,duration:f(10),ease:"back.out(1.5)"},f(b.corteDisqui));
    tl.to(s.disqui,{salto:0,duration:f(12),ease:"bounce.out"},f(a.disqui));
    tl.to(s.capa,{discoDetalle:1,duration:f(10)},f(a.disqui));
    tl.to(s.disqui,{brazoIzq:65,codoIzq:-14,miradaX:-.8,miradaY:.4,cejaAltura:-.3,duration:f(12)},f(b.peticionInicio-8));
    tl.to(s.capa,{discoPeticion:1,duration:f(b.llegadaDisco-b.peticionInicio),ease:"none"},f(b.peticionInicio));
    tl.to(s.capa,{discoDetectado:1,duration:f(6)},f(b.llegadaDisco));
    tl.to(s.capa,{discoRespuesta:1,duration:f(b.respuestaFin-b.respuestaInicio),ease:"none"},f(b.respuestaInicio));
    tl.to(s.capa,{comunicacionDisponible:1,duration:f(4)},f(b.respuestaFin));
    tl.to(s.disqui,{brazoIzq:0,codoIzq:0,cejaAltura:.7,sonrisa:.85,mejillas:.7,duration:f(12)},f(b.respuestaFin));
    tl.to(s.bios,{sonrisa:.8,miradaX:.9,duration:f(12)},f(b.respuestaFin));
    tl.set(s.capa,{discoDetalle:0},f(b.finTextoDisqui));
    tl.to(s.cam,{...CAMARAS_S06.salida,duration:f(12),ease:"power1.inOut"},f(b.salida));
  },
};
