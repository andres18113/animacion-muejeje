import {duracionEscena} from "../../anclas.ts";
import {crearMotor} from "../motor.ts";
import {anclasDeEscena,cuesDeEscena} from "../../recursos.ts";
import {GUION_S10,type EstadoS10,type Carga} from "./S10.ts";
import type {Cuerpo,Guion} from "./comun.ts";

/** §6.12: firma ASCII de la cabecera Linux/x86; identifica el protocolo, no es una dirección. */
export const CABECERA_LINUX={firma:"HdrS",bytes:[0x48,0x64,0x72,0x53] as const};
/** §6.11: CR0 bit 0 = PE (0 → 1); bit 31 = PG permanece 0 en la entrada de 32 bits. */
export const CR0={pe:{bit:0,antes:0,despues:1},pg:{bit:31,valor:0}} as const;
export const PARAMETROS_LINUX={estructuras:["setup_header","boot_params"] as const,lineaOrdenes:"root=/dev/hda1",memoria:"mapa de memoria"};
/** Paneles en el plano heredado `grub`: núcleo (columna derecha) y CR0 junto a Cipu. */
export const PANEL_NUCLEO={x:1432,y:300,ancho:470,alto:250};
export const PANEL_CR0={x:75,y:285,ancho:375,alto:170};
export function fasesS11(a:Record<string,number>){
  const carga=(inicio:number):Carga=>({solicitud:[inicio,inicio+22],datos:[inicio+26,inicio+50],transferencia:[inicio+52,inicio+76]});
  const nucleo=carga(a.cargo+4);
  const visual=cuesDeEscena("S11"),finVoz=visual[0].cue.startFrame+visual[0].cue.durationFrames;
  return {nucleo,panelNucleo:nucleo.transferencia[1]+2,parametros:a.parametros-6,cr0:a.inicio-6,gdt:a.inicio+60,bits32:a.bits32-6,pe:a.protegido,
    cedoInicio:a.cedo+2,cedoFin:a.entrada-4,protocolo:a.protocolo-8,finVoz};
}
export type EstadoS11=EstadoS10&{capa:EstadoS10["capa"]&{nucleoSolicitud:number;nucleoDatos:number;nucleoTransferencia:number;panelNucleo:number;parametrosListos:number;
  panelCr0:number;gdt:number;bits32:number;pe:number;cesion:number;entradaLinux:number;protocoloLinux:number}};
const copiar=(c:Cuerpo)=>({...c});
export const GUION_S11:Guion<EstadoS11>={
  inicial:()=>{
    const fin=crearMotor(GUION_S10,anclasDeEscena("S10",cuesDeEscena("S10")),30).en(duracionEscena("S10") - 1);
    return {...fin,cam:{...fin.cam},mundo:{...fin.mundo},cipu:copiar(fin.cipu),secu:copiar(fin.secu),pulso:copiar(fin.pulso),romi:copiar(fin.romi),bios:copiar(fin.bios),cmosi:copiar(fin.cmosi),postin:copiar(fin.postin),spedi:copiar(fin.spedi),rami:copiar(fin.rami),disqui:copiar(fin.disqui),mebre:{...fin.mebre,desplazZ:fin.mebre.desplazZ},grubi:{...fin.grubi,desplazZ:fin.grubi.desplazZ},
      capa:{...fin.capa,nucleoSolicitud:0,nucleoDatos:0,nucleoTransferencia:0,panelNucleo:0,parametrosListos:0,panelCr0:0,gdt:0,bits32:0,pe:0,cesion:0,entradaLinux:0,protocoloLinux:0}};
  },
  construir:(tl,s,f,a)=>{
    const b=fasesS11(a);
    // D01–D03: Stage 2 lee /boot/vmlinuz y lo copia a RAM; la configuración cede su lugar al núcleo.
    tl.to(s.capa,{menuPanel:0,duration:f(12)},f(0));
    tl.to(s.grubi,{brazoDer:-70,codoDer:14,miradaX:.9,miradaY:-.6,inclinacion:4,duration:f(10)},f(Math.max(0,a.cargo-8)));
    tl.to(s.capa,{nucleoSolicitud:1,duration:f(b.nucleo.solicitud[1]-b.nucleo.solicitud[0]),ease:"none"},f(b.nucleo.solicitud[0]));
    tl.to(s.disqui,{squash:-.08,duration:f(4),ease:"power2.in"},f(b.nucleo.solicitud[1]));
    tl.to(s.disqui,{squash:0,duration:f(10),ease:"elastic.out(1,.5)"},f(b.nucleo.solicitud[1]+4));
    tl.to(s.capa,{nucleoDatos:1,duration:f(b.nucleo.datos[1]-b.nucleo.datos[0]),ease:"none"},f(b.nucleo.datos[0]));
    tl.to(s.capa,{nucleoTransferencia:1,duration:f(b.nucleo.transferencia[1]-b.nucleo.transferencia[0]),ease:"none"},f(b.nucleo.transferencia[0]));
    tl.to(s.grubi,{brazoDer:0,codoDer:0,inclinacion:0,duration:f(12)},f(b.nucleo.transferencia[1]));
    tl.to(s.capa,{panelNucleo:1,duration:f(10)},f(b.panelNucleo));
    // D04: parámetros de arranque.
    tl.to(s.grubi,{brazoIzq:60,codoIzq:-12,miradaX:.8,miradaY:-.3,duration:f(10)},f(b.parametros-8));
    tl.to(s.capa,{parametrosListos:1,duration:f(10)},f(b.parametros));
    tl.to(s.grubi,{brazoIzq:0,codoIzq:0,duration:f(12)},f(b.parametros+40));
    // D05: el código de inicio prepara GDT/segmentos y después habilita PE; la CPU (Cipu) lo vive.
    tl.to(s.capa,{panelCr0:1,duration:f(10)},f(b.cr0));
    tl.to(s.grubi,{miradaX:-.6,miradaY:-.5,duration:f(10)},f(b.cr0));
    tl.to(s.cipu,{cejaAltura:.5,miradaX:-.7,miradaY:.4,duration:f(10)},f(b.cr0+4));
    tl.to(s.capa,{gdt:1,duration:f(10)},f(b.gdt));
    tl.to(s.capa,{bits32:1,duration:f(10)},f(b.bits32));
    tl.to(s.cipu,{squash:-.08,duration:f(6),ease:"power2.in"},f(b.pe-6));
    tl.to(s.capa,{pe:1,duration:f(8),ease:"none"},f(b.pe));
    tl.to(s.cipu,{squash:.04,salto:12,sonrisa:.9,cejaAltura:.9,duration:f(8),ease:"power2.out"},f(b.pe));
    tl.to(s.cipu,{squash:0,salto:0,duration:f(12),ease:"bounce.out"},f(b.pe+8));
    // D06: Grubi cede el control al punto de entrada previsto por el protocolo.
    tl.to(s.grubi,{squash:-.1,brazoDer:20,codoDer:-4,miradaX:.9,miradaY:-.7,duration:f(10),ease:"power2.in"},f(b.cedoInicio-10));
    tl.to(s.grubi,{squash:0,brazoDer:-85,codoDer:16,inclinacion:5,duration:f(8),ease:"power2.out"},f(b.cedoInicio));
    tl.to(s.capa,{cesion:1,duration:f(b.cedoFin-b.cedoInicio),ease:"power1.inOut"},f(b.cedoInicio));
    tl.set(s.capa,{entradaLinux:1,ejecuta:5},f(b.cedoFin));
    tl.to(s.grubi,{brazoDer:0,codoDer:0,inclinacion:0,sonrisa:.8,cejaAltura:.4,miradaX:.6,miradaY:-.5,duration:f(16)},f(b.cedoFin+4));
    tl.to(s.capa,{protocoloLinux:1,duration:f(10)},f(b.protocolo));
  },
};
