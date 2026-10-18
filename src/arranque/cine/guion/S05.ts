import {duracionEscena} from "../../anclas.ts";
import type {Camara, Punto3D} from "../mundo.ts";
import {crearMotor} from "../motor.ts";
import {anclasDeEscena, cuesDeEscena} from "../../recursos.ts";
import {GUION_S04, type EstadoS04} from "./S04.ts";
import {CUERPO_BASE, type Cuerpo, type Guion} from "./comun.ts";

export const ALTURAS_S05 = {postin: 2.6, spedi: 2.1, rami: 2.7};
export const CAMARAS_S05 = {
  postin: {px:3,py:3,pz:4,tx:2.7,ty:0.8,tz:-1.8,fov:40},
  firmware: {px:-2,py:7,pz:3,tx:-1.5,ty:0.7,tz:3.5,fov:44},
  cmos: {px:4,py:3,pz:-2,tx:1.4,ty:0.8,tz:3.6,fov:42},
  spedi: {px:11,py:3.8,pz:-3,tx:5.7,ty:1,tz:-2.2,fov:42},
  rami: {px:10.5,py:3.6,pz:-2.5,tx:5.7,ty:1,tz:-2.2,fov:42},
  salida: {px:10,py:7,pz:7,tx:3.6,ty:0,tz:0.5,fov:46},
} satisfies Record<string,Camara>;
export const EEPROM_SPD: Punto3D = [5.84,0.95,-0.6];
/** Pistas ilustrativas sobre placa, sin inferir pines ni registros SMBus concretos. */
export const RUTA_SMBUS: readonly Punto3D[] = [[1.4,0.02,3.6],[3.7,0.02,3.6],[4.2,0.02,2.6],[4.2,0.02,0.3],[5.5,0.02,0.3],[5.84,0.02,-0.6],EEPROM_SPD];
export const POST_VERIFICADO={refresco:{codigo:"20h",funcion:"Prueba refresco DRAM"},dimensionado:{codigo:"28h",funcion:"Dimensiona DRAM"},direccion:{codigo:"2Ch",funcion:"Fallo en línea de dirección"}} as const;
export const EJEMPLO_RAM = {direccion:"0x00001000",binario:"10100101",hex:"0xA5",decimal:165};
export function fasesS05(a: Record<string,number>) {
  const visual=cuesDeEscena("S05");
  const corteFirmware=Math.max(...visual[0].segmentos.map(s=>s.finFrame+6));
  const integridadInicio=Math.max(a.comprobacion+260,corteFirmware),integridadFin=integridadInicio+30;
  const cmosInicio=integridadFin+5,cmosFin=cmosInicio+50;
  const spdInicio=Math.max(a.spedi-12,cmosFin+4);
  const spdRespuestaInicio=Math.max(a.datos-6,spdInicio+50+8);
  const spdFin=Math.max(a.tamano+10,spdRespuestaInicio+56);
  const finTextoSpedi=Math.max(...visual[1].segmentos.map(s=>s.finFrame+6));
  const configInicio=Math.max(finTextoSpedi,spdFin+12),configFin=configInicio+30;
  const refrescoInicio=configFin+6,refrescoFin=refrescoInicio+30,dimensionado=refrescoFin+6;
  const escritura=Math.max(a.almacenar-38,dimensionado+32),lectura=Math.max(a.almacenar+14,escritura+40);
  const alternativa=Math.max(a.critica-12,lectura+44);
  return {corteFirmware,corteSpd:spdInicio,corteRami:a.rami-16,integridadInicio,integridadFin,cmosInicio,cmosFin,spdInicio,spdRespuestaInicio,spdFin,configInicio,configFin,refrescoInicio,refrescoFin,dimensionado,escritura,lectura,alternativa,cierreAlternativa:duracionEscena("S05")-50};
}
export function checkpointS05(frame:number,a:Record<string,number>) {const b=fasesS05(a);return frame<b.refrescoInicio?"POST":frame<b.dimensionado?POST_VERIFICADO.refresco.codigo:POST_VERIFICADO.dimensionado.codigo;}
export function lecturasS05(spd:{x:number;y:number},ram:{x:number;y:number},post:{x:number;y:number},frame:number,a:Record<string,number>) {
  const corte=fasesS05(a).corteFirmware;
  return {spd:{x:spd.x-340,y:spd.y+130,ancho:320,alto:106},ram:{x:ram.x-850,y:ram.y-180,ancho:460,alto:294},alternativa:{x:ram.x+300,y:ram.y-230,ancho:540,alto:330},puerto:{x:frame<corte?post.x+300:ram.x+300,y:frame<corte?post.y-250:ram.y-220,ancho:250,alto:frame<corte?106:150}};
}
export type EstadoS05 = EstadoS04 & {
  postin:Cuerpo;spedi:Cuerpo;rami:Cuerpo;
  capa:EstadoS04["capa"] & {cpuPreparacion:number;cachePreparacion:number;recursosPreparacion:number;integridad:number;cmosConsulta:number;spdConsulta:number;spdRespuesta:number;spdDatos:number;configControlador:number;refresco:number;dimensionado:number;ejemplo:number;escritura:number;lectura:number;alternativa:number};
};
export const GUION_S05:Guion<EstadoS05>={
  inicial:()=>{
    const fin=crearMotor(GUION_S04,anclasDeEscena("S04",cuesDeEscena("S04")),30).en(duracionEscena("S04") - 1);
    return {...fin,cam:{...fin.cam},cipu:{...fin.cipu},secu:{...fin.secu},pulso:{...fin.pulso},romi:{...fin.romi},bios:{...fin.bios},cmosi:{...fin.cmosi},mundo:{...fin.mundo},
      postin:{...CUERPO_BASE,visible:0,sonrisa:0.5},spedi:{...CUERPO_BASE,visible:0,ojo:0.6},rami:{...CUERPO_BASE,visible:0,ojo:0.6},
      capa:{...fin.capa,cpuPreparacion:0,cachePreparacion:0,recursosPreparacion:0,integridad:0,cmosConsulta:0,spdConsulta:0,spdRespuesta:0,spdDatos:0,configControlador:0,refresco:0,dimensionado:0,ejemplo:0,escritura:0,lectura:0,alternativa:0}};
  },
  construir:(tl,s,f,a)=>{
    const b=fasesS05(a);
    tl.to(s.cam,{...CAMARAS_S05.postin,duration:f(20),ease:"power2.inOut"},f(0));
    tl.to(s.postin,{visible:1,salto:18,squash:0.08,duration:f(12),ease:"back.out(1.5)"},f(2));
    tl.to(s.postin,{salto:0,squash:0,duration:f(14),ease:"bounce.out"},f(a.postin));
    tl.to(s.cipu,{brazoDer:-55,codoDer:12,miradaX:0.8,sonrisa:0.65,duration:f(12)},f(a.inicio-8));
    tl.to(s.postin,{brazoIzq:70,codoIzq:-18,miradaX:-0.8,cejaAltura:-0.2,duration:f(14)},f(a.cpu-12));
    tl.to(s.postin,{brazoDer:-65,codoDer:20,miradaX:0.7,duration:f(14)},f(a.memoria-12));
    tl.to(s.postin,{brazoIzq:0,brazoDer:0,codoIzq:0,codoDer:0,sonrisa:0.7,duration:f(16)},f(a.puerto+12));
    tl.to(s.capa,{cpuPreparacion:1,duration:f(a.cpu+10-(a.comprobacion-8)),ease:"none"},f(a.comprobacion-8));
    tl.to(s.capa,{cachePreparacion:1,duration:f(24),ease:"none"},f(a.cache-8));
    tl.to(s.capa,{recursosPreparacion:1,duration:f(24),ease:"none"},f(a.memoria));
    tl.to(s.cipu,{cejaAltura:-0.3,sonrisa:0.1,duration:f(8)},f(a.comprobacion-8));
    tl.to(s.cipu,{cejaAltura:0.6,sonrisa:0.75,duration:f(10)},f(a.memoria+24));
    tl.set(s.cam,{...CAMARAS_S05.firmware},f(b.corteFirmware));
    tl.to(s.capa,{integridad:1,duration:f(b.integridadFin-b.integridadInicio),ease:"none"},f(b.integridadInicio));
    tl.to(s.romi,{cejaAltura:0.5,sonrisa:0.8,duration:f(12)},f(b.integridadFin));
    tl.to(s.cipu,{cejaAltura:0.7,sonrisa:0.8,duration:f(10)},f(b.integridadFin));
    tl.set(s.cam,{...CAMARAS_S05.cmos},f(b.cmosInicio-5));
    tl.set(s.cam,{...CAMARAS_S05.postin},f(b.cmosInicio+Math.floor((b.cmosFin-b.cmosInicio)*0.6)));
    tl.to(s.cipu,{brazoIzq:55,codoIzq:-12,miradaX:-0.7,duration:f(8)},f(b.cmosFin-8));
    tl.to(s.cipu,{brazoIzq:0,codoIzq:0,sonrisa:0.8,duration:f(10)},f(b.cmosFin));
    tl.to(s.capa,{cmosConsulta:1,duration:f(b.cmosFin-b.cmosInicio),ease:"none"},f(b.cmosInicio));
    tl.to(s.cmosi,{brazoIzq:65,codoIzq:-12,miradaX:0.7,duration:f(12)},f(b.cmosInicio));
    tl.to(s.cmosi,{brazoIzq:0,codoIzq:0,duration:f(12)},f(b.cmosFin));
    tl.set(s.cam,{...CAMARAS_S05.spedi},f(b.corteSpd));
    tl.to(s.capa,{spdConsulta:1,duration:f(50),ease:"none"},f(b.spdInicio));
    tl.to(s.capa,{spdRespuesta:1,duration:f(b.spdFin-b.spdRespuestaInicio),ease:"none"},f(b.spdRespuestaInicio));
    tl.to(s.spedi,{visible:1,ojo:0,salto:16,sonrisa:0.6,duration:f(12),ease:"back.out(1.6)"},f(a.spedi-14));
    tl.to(s.spedi,{salto:0,duration:f(12),ease:"bounce.out"},f(a.spedi));
    tl.to(s.spedi,{brazoIzq:75,codoIzq:-12,miradaX:-0.8,miradaY:0.5,duration:f(14)},f(a.datos-16));
    tl.to(s.capa,{spdDatos:1,duration:f(12)},f(a.tamano-12));
    tl.to(s.spedi,{brazoIzq:0,codoIzq:0,sonrisa:0.8,duration:f(14)},f(a.tamano+16));
    tl.to(s.capa,{configControlador:1,duration:f(b.configFin-b.configInicio),ease:"none"},f(b.configInicio));
    tl.to(s.postin,{brazoDer:-70,miradaX:0.7,duration:f(14)},f(b.configInicio));
    tl.to(s.capa,{refresco:1,duration:f(b.refrescoFin-b.refrescoInicio),ease:"none"},f(b.refrescoInicio));
    tl.to(s.capa,{dimensionado:1,duration:f(16)},f(b.dimensionado));
    tl.to(s.capa,{spdDatos:0,duration:f(14)},f(b.dimensionado-10));
    tl.set(s.cam,{...CAMARAS_S05.rami},f(b.corteRami));
    tl.to(s.rami,{visible:1,ojo:0,salto:18,sonrisa:0.55,duration:f(12),ease:"back.out(1.6)"},f(a.rami-14));
    tl.to(s.rami,{salto:0,duration:f(14),ease:"bounce.out"},f(a.rami));
    tl.to(s.rami,{brazoIzq:65,codoIzq:-15,miradaX:-0.8,miradaY:0.4,duration:f(14)},f(a.controlador-12));
    tl.to(s.rami,{cejaAltura:0.4,duration:f(10)},f(a.verificar-10));
    tl.to(s.capa,{ejemplo:1,duration:f(12)},f(b.escritura-16));
    tl.to(s.capa,{escritura:8,duration:f(32),ease:"none"},f(b.escritura));
    tl.to(s.capa,{lectura:8,duration:f(32),ease:"none"},f(b.lectura));
    tl.to(s.rami,{sonrisa:0.85,cejaAltura:0.6,salto:12,duration:f(6)},f(b.lectura+32));
    tl.to(s.rami,{salto:0,duration:f(12),ease:"bounce.out"},f(b.lectura+38));
    // Rama óptica independiente: el caso principal nunca cambia a fallo.
    tl.to(s.capa,{alternativa:1,duration:f(12)},f(b.alternativa));
    tl.to(s.rami,{brazoDer:-70,codoDer:18,miradaX:0.9,sonrisa:-0.2,cejaAngulo:0.5,duration:f(14)},f(b.alternativa));
    tl.to(s.capa,{alternativa:0,duration:f(12)},f(b.cierreAlternativa));
    tl.to(s.rami,{brazoIzq:0,brazoDer:0,codoIzq:0,codoDer:0,cejaAngulo:0,sonrisa:0.8,duration:f(16)},f(b.cierreAlternativa));
    tl.to(s.postin,{brazoDer:0,sonrisa:0.8,duration:f(14)},f(b.cierreAlternativa+12));
    tl.to(s.capa,{ejemplo:0,duration:f(12)},f(b.cierreAlternativa+20));
    tl.to(s.cam,{...CAMARAS_S05.salida,duration:f(16),ease:"power1.inOut"},f(b.cierreAlternativa+32));
  },
};

export function consultaCMOSS05(t:number) {
  return {pedido:Math.max(0,Math.min(1,t/0.2)),lectura:Math.max(0,Math.min(1,(t-0.2)/0.4)),respuesta:Math.max(0,Math.min(1,(t-0.6)/0.4))};
}
export function alternativaS05(frame:number,a:Record<string,number>) {
  const b=fasesS05(a),t=Math.max(0,Math.min(1,(frame-b.alternativa)/Math.max(1,a.detencion-b.alternativa)));
  return {direccionA:Math.min(1,t/0.4),direccionB:Math.max(0,Math.min(1,(t-0.4)/0.4)),diagnostico:t>=0.8,detenida:t>=1};
}
export function lecturasPostS05(cpu:{x:number;y:number},flash:{x:number;y:number},rtcBase:{x:number;y:number}) {
  return {cpu:{x:cpu.x-700,y:cpu.y-330,ancho:400,alto:360},firmware:{x:flash.x+210,y:flash.y-80,ancho:580,alto:150},cmos:{x:rtcBase.x-195,y:rtcBase.y+16,ancho:390,alto:44}};
}

export function formaAlternativaS05(r:{x:number;y:number}) {
  return {base:{d:`M${r.x+14} ${r.y+238} l24 -12 h460 v14 l-24 12 Z`,caja:[r.x+12,r.y+224,r.x+500,r.y+254]},
    codigo:{x:r.x+28,y:r.y+92,tamano:42},linea:{x:r.x+145,y:r.y+88,tamano:27},diagnosticoCaja:[r.x+25,r.y+48,r.x+530,r.y+100],
    parada:{x:r.x+278,y:r.y+310,tamano:28,caja:[r.x+275,r.y+280,r.x+538,r.y+318]}};
}
export function barridoFirmwareS05(r:{x:number;y:number},t:number) {
  const u=Math.max(0,Math.min(1,(t-.18)/.62));
  return {x:r.x+20+u*455,y:r.y+67,ancho:50,alto:28,titulo:{x:r.x+20,y:r.y+56,tamano:29},descripcion:{x:r.x+20,y:r.y+126,tamano:24}};
}
