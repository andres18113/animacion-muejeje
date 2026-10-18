import {duracionEscena} from "../../anclas.ts";
import {crearMotor} from "../motor.ts";
import {anclasDeEscena,cuesDeEscena} from "../../recursos.ts";
import type {Camara,Punto3D} from "../mundo.ts";
import {GUION_S08,CAMARAS_S08,type EstadoS08} from "./S08.ts";
import {CUERPO_BASE,type Cuerpo,type Guion} from "./comun.ts";

/** Mebre es el sector y su contenido (§7.4): aparece junto a la SDRAM donde S08 dejó los 512 B, fuera del mazo ATX. */
export const lugarMebre=(c:{desplazZ?:number}):Punto3D=>[MEBRE_LUGAR[0],MEBRE_LUGAR[1],MEBRE_LUGAR[2]+(c.desplazZ??0)];
export const MEBRE_LUGAR:Punto3D=[7.9,.02,-1];
export const ALTURA_MEBRE=2.6;
export const CAMARAS_S09={
  ram:CAMARAS_S08.ram,
  mbr:{px:10.4,py:5.2,pz:7.8,tx:7,ty:2,tz:-.7,fov:43},
} satisfies Record<string,Camara>;
/** §6.9: distribución exacta del sector; offsets dentro del MBR. */
export const MBR={
  bytes:512,
  codigo:{desde:0x000,hasta:0x1BD},
  particiones:{desde:0x1BE,hasta:0x1FD,entradas:4,bytesEntrada:16},
  firma:{desde:0x1FE,hasta:0x1FF,valores:[0x55,0xAA] as const},
} as const;
export const tamanoRegion=(r:{desde:number;hasta:number})=>r.hasta-r.desde+1;
export const binario8=(n:number)=>n.toString(2).padStart(8,"0");
/** Palabra de 16 bits leída little-endian desde 0x1FE: byte bajo 0x55, byte alto 0xAA. */
export const palabraFirma=()=>MBR.firma.valores[0]|(MBR.firma.valores[1]<<8);
/** Panel MBR en el plano `mbr`: banda superior libre, rejilla de 64 × 8 = 512 celdas (una por byte). */
export const PANEL_MBR={x:300,y:24,ancho:1320,alto:300,columnas:64,filas:8,paso:19,pasoFila:15,celda:[16,12] as const,rejilla:[52,56] as const};
export function celdaMBR(offset:number){
  const {x,y,paso,pasoFila,rejilla,columnas}=PANEL_MBR;
  return {x:x+rejilla[0]+(offset%columnas)*paso,y:y+rejilla[1]+Math.floor(offset/columnas)*pasoFila};
}
export function fasesS09(a:Record<string,number>){
  const visual=cuesDeEscena("S09"),finVoz=visual[0].cue.startFrame+visual[0].cue.durationFrames;
  // Corte en la pausa entre frases: un movimiento interpolado arrastraría a Cmosi por la banda de subtítulos.
  const corte=visual[0].segmentos.find(s=>s.texto.replace(/\s+/g," ").startsWith("Mis quinientos"))!.inicioFrame-3;
  return {aparece:4,movMbr:corte-16,finMbr:corte,corte,panel:corte+2,codigo:a.codigo-14,tabla:a.tabla-12,firma:a.firma-4,valor:a.valor-6,stage1:a.stage1-8,
    entregaInicio:a.control-16,entregaFin:a.control+12,biosFin:a.lectura,finVoz};
}
export type EstadoS09=EstadoS08&{mebre:Cuerpo&{desplazZ:number};capa:EstadoS08["capa"]&{biosPanelFuera:number;mbrPanel:number;regionCodigo:number;regionTabla:number;regionFirma:number;firmaValor:number;stage1:number;entrega:number;ejecutaStage1:number}};
const copiar=(c:Cuerpo)=>({...c});
export const GUION_S09:Guion<EstadoS09>={
  inicial:()=>{
    const fin=crearMotor(GUION_S08,anclasDeEscena("S08",cuesDeEscena("S08")),30).en(duracionEscena("S08") - 1);
    return {...fin,cam:{...fin.cam},mundo:{...fin.mundo},cipu:copiar(fin.cipu),secu:copiar(fin.secu),pulso:copiar(fin.pulso),romi:copiar(fin.romi),bios:copiar(fin.bios),cmosi:copiar(fin.cmosi),postin:copiar(fin.postin),spedi:copiar(fin.spedi),rami:copiar(fin.rami),disqui:copiar(fin.disqui),
      mebre:{...CUERPO_BASE,desplazZ:0,visible:0,ojo:.5,miradaX:-.4,miradaY:-.3},
      capa:{...fin.capa,biosPanelFuera:0,mbrPanel:0,regionCodigo:0,regionTabla:0,regionFirma:0,firmaValor:0,stage1:0,entrega:0,ejecutaStage1:0}};
  },
  construir:(tl,s,f,a)=>{
    const b=fasesS09(a);
    // Los 512 B cargados toman cuerpo: Mebre surge junto a la SDRAM; Rami lo mira.
    tl.to(s.mebre,{visible:1,ojo:0,salto:14,squash:.06,sonrisa:.6,duration:f(10),ease:"back.out(1.6)"},f(b.aparece));
    tl.to(s.mebre,{salto:0,squash:0,duration:f(10),ease:"bounce.out"},f(b.aparece+10));
    tl.to(s.rami,{miradaX:.9,miradaY:.5,sonrisa:.8,duration:f(10)},f(b.aparece+4));
    tl.to(s.bios,{miradaX:.9,miradaY:-.2,duration:f(10)},f(b.aparece+6));
    tl.to(s.mebre,{brazoIzq:40,codoIzq:-10,miradaX:-.2,miradaY:.2,duration:f(10)},f(a.presenta));
    tl.to(s.mebre,{brazoIzq:0,codoIzq:0,duration:f(12)},f(a.presenta+40));
    // El panel RAM se convierte en el mapa del sector; la rutina BIOS deja el primer plano.
    tl.set(s.cam,{...CAMARAS_S09.mbr},f(b.corte));
    tl.to(s.capa,{ramPanel:0,duration:f(16)},f(b.movMbr));
    tl.to(s.capa,{biosPanelFuera:1,duration:f(14)},f(b.movMbr));
    tl.to(s.capa,{mbrPanel:1,duration:f(12)},f(b.panel));
    tl.to(s.mebre,{brazoIzq:60,codoIzq:-12,brazoDer:-60,codoDer:12,miradaY:-.8,miradaX:0,duration:f(12),ease:"back.out(1.4)"},f(a.bytes-10));
    tl.to(s.mebre,{brazoDer:0,codoDer:0,duration:f(12)},f(a.bytes+30));
    // Regiones en el orden pronunciado: código → tabla → firma (55 AA iluminados durante su mención, §9.3).
    tl.to(s.capa,{regionCodigo:1,duration:f(22),ease:"none"},f(b.codigo));
    tl.to(s.mebre,{brazoIzq:75,codoIzq:-14,miradaX:-.6,miradaY:-.9,duration:f(10)},f(b.codigo-6));
    tl.to(s.capa,{regionTabla:1,duration:f(16),ease:"none"},f(b.tabla));
    tl.to(s.mebre,{brazoIzq:30,codoIzq:-6,brazoDer:-70,codoDer:14,miradaX:.3,miradaY:-.9,duration:f(10)},f(b.tabla-6));
    tl.to(s.capa,{regionFirma:1,duration:f(6)},f(b.firma));
    tl.to(s.mebre,{brazoIzq:0,codoIzq:0,brazoDer:-85,codoDer:16,miradaX:.6,miradaY:-.9,salto:8,duration:f(8),ease:"power2.out"},f(b.firma-6));
    tl.to(s.mebre,{salto:0,duration:f(10),ease:"bounce.out"},f(b.firma+2));
    tl.to(s.capa,{firmaValor:1,duration:f(10)},f(b.valor));
    tl.to(s.mebre,{brazoDer:0,codoDer:0,miradaX:-.3,miradaY:.1,duration:f(14)},f(a.valor+40));
    // «área ejecutable … primera etapa de GRUB»: el código recibe su nombre.
    tl.to(s.mebre,{brazoIzq:65,codoIzq:-12,miradaX:-.6,miradaY:-.9,duration:f(12)},f(a.ejecutable-8));
    tl.to(s.capa,{stage1:1,duration:f(10)},f(b.stage1));
    // C08: Bios entrega la referencia de ejecución al código (no a la tabla); la CPU lo ejecuta.
    tl.to(s.bios,{squash:-.08,brazoDer:20,codoDer:-4,cejaAltura:.3,duration:f(10),ease:"power2.in"},f(b.entregaInicio-10));
    tl.to(s.bios,{squash:0,brazoDer:-80,codoDer:16,inclinacion:5,duration:f(8),ease:"power2.out"},f(b.entregaInicio));
    tl.to(s.capa,{entrega:1,duration:f(b.entregaFin-b.entregaInicio),ease:"power1.inOut"},f(b.entregaInicio));
    tl.set(s.capa,{ejecutaStage1:1},f(b.entregaFin));
    tl.to(s.mebre,{squash:-.1,brazoIzq:0,codoIzq:0,duration:f(4),ease:"power2.in"},f(b.entregaFin));
    tl.to(s.mebre,{squash:0,sonrisa:.85,cejaAltura:.6,duration:f(12),ease:"elastic.out(1,.5)"},f(b.entregaFin+4));
    tl.to(s.cipu,{cejaAltura:.8,sonrisa:.9,miradaX:.8,miradaY:-.4,duration:f(10)},f(b.entregaFin+2));
    // «termina la lectura BIOS»: Bios se retira del protagonismo, asentada.
    tl.to(s.bios,{brazoDer:0,codoDer:0,inclinacion:0,sonrisa:.85,miradaX:.8,miradaY:-.4,duration:f(14)},f(b.biosFin));
  },
};
