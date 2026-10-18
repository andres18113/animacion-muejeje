import {duracionEscena} from "../../anclas.ts";
import {crearMotor} from "../motor.ts";
import {anclasDeEscena,cuesDeEscena} from "../../recursos.ts";
import type {Camara,Punto3D} from "../mundo.ts";
import {GUION_S11,type EstadoS11} from "./S11.ts";
import {CUERPO_BASE,type Cuerpo,type Guion} from "./comun.ts";

/** Núcleo e Init (software) aparecen en la franja libre del frente de la placa, delante del mazo ATX. */
export const NUCLEO_LUGAR:Punto3D=[5.6,.02,4.4];
export const INIT_LUGAR:Punto3D=[7.8,.02,4.6];
export const ALTURA_NUCLEO=2.6,ALTURA_INIT=2.6;
/** Plano frontal del elenco: sin cielo vacío arriba; mazo ATX, paneles y banda de subtítulos libres para todos los personajes. */
export const CAMARAS_S12={linux:{px:7,py:9,pz:15,tx:5,ty:-.5,tz:1,fov:34}} satisfies Record<string,Camara>;
/** D07–D09 (§4): tareas del núcleo en el orden pronunciado; Linux 2.6 con IDE y ext2 integrados, sin imagen de arranque adicional. */
export const TAREAS_NUCLEO=[
  {id:"memoria",texto:"Memoria"},
  {id:"interrupciones",texto:"Interrupciones"},
  {id:"controladores",texto:"Controladores IDE y ext2 integrados"},
  {id:"raiz",texto:"Raíz /dev/hda1 (ext2) montada en /"},
] as const;
export const PRIMER_PROCESO={ruta:"/sbin/init",pid:1};
export const PANEL_LINUX={x:1420,y:320,ancho:480,alto:250};
export const PANEL_INIT={x:1420,y:590,ancho:480,alto:190};
/** Grubi ya cedió el control: se aparta a [0.2, .02, 0], libre en el plano frontal. */
export const GRUBI_APARTADO={x:-3.9,z:-1};
export function fasesS12(a:Record<string,number>){
  const visual=cuesDeEscena("S12");
  return {corte:8,aparece:8,tareas:{memoria:a.memoria-4,interrupciones:a.interrupciones-2,controladores:a.controladores-4,raiz:a.raiz+6},
    exec:[a.raiz+30,a.init-8] as const,aparecenInit:a.init-8,pid1:a.pid1-6,bios:a.bios,fiesta:a.funcionar,finVoz:visual[1].cue.startFrame+visual[1].cue.durationFrames};
}
export type EstadoS12=EstadoS11&{nucleo:Cuerpo;init:Cuerpo;capa:EstadoS11["capa"]&{panelLinux:number;memoria:number;interrupciones:number;controladores:number;raiz:number;exec:number;panelInit:number;pid1:number;biosReposo:number;sistemaListo:number}};
const copiar=(c:Cuerpo)=>({...c});
export const GUION_S12:Guion<EstadoS12>={
  inicial:()=>{
    const fin=crearMotor(GUION_S11,anclasDeEscena("S11",cuesDeEscena("S11")),30).en(duracionEscena("S11") - 1);
    return {...fin,cam:{...fin.cam},mundo:{...fin.mundo},cipu:copiar(fin.cipu),secu:copiar(fin.secu),pulso:copiar(fin.pulso),romi:copiar(fin.romi),bios:copiar(fin.bios),cmosi:copiar(fin.cmosi),postin:copiar(fin.postin),spedi:copiar(fin.spedi),rami:copiar(fin.rami),disqui:copiar(fin.disqui),mebre:{...fin.mebre,desplazZ:fin.mebre.desplazZ},grubi:{...fin.grubi,desplazZ:fin.grubi.desplazZ},
      nucleo:{...CUERPO_BASE,visible:0,ojo:.4},init:{...CUERPO_BASE,visible:0,ojo:.4},
      capa:{...fin.capa,panelLinux:0,memoria:0,interrupciones:0,controladores:0,raiz:0,exec:0,panelInit:0,pid1:0,biosReposo:0,sistemaListo:0}};
  },
  construir:(tl,s,f,a)=>{
    const b=fasesS12(a);
    // Nuevo capítulo: Linux ya ejecuta. Los mapas del cargador se retiran y se corta al frente de la placa.
    tl.to(s.capa,{discoPanel:0,panelNucleo:0,panelCr0:0,duration:f(b.corte)},f(0));
    tl.set(s.cam,{...CAMARAS_S12.linux},f(b.corte));
    tl.to(s.nucleo,{visible:1,ojo:0,salto:16,squash:.06,sonrisa:.7,duration:f(10),ease:"back.out(1.6)"},f(b.aparece));
    tl.to(s.nucleo,{salto:0,squash:0,duration:f(10),ease:"bounce.out"},f(b.aparece+10));
    tl.to(s.capa,{panelLinux:1,duration:f(10)},f(b.aparece+14));
    // Grubi cede el escenario: camina a su sitio libre y mira a Núcleo.
    tl.to(s.grubi,{desplazX:GRUBI_APARTADO.x,desplazZ:GRUBI_APARTADO.z,paso:Math.PI*6,inclinacion:-5,miradaX:-.8,miradaY:.1,duration:f(60),ease:"none"},f(b.aparece+2));
    tl.to(s.grubi,{paso:0,inclinacion:0,miradaX:.9,miradaY:.4,sonrisa:.8,duration:f(10)},f(b.aparece+62));
    // D07: memoria → Rami; interrupciones → Cipu; controladores → Disqui. D08: raíz montada.
    tl.to(s.nucleo,{brazoIzq:65,codoIzq:-12,miradaX:-.4,miradaY:-.9,duration:f(10)},f(b.tareas.memoria-8));
    tl.to(s.capa,{memoria:1,duration:f(6)},f(b.tareas.memoria));
    tl.to(s.rami,{squash:-.08,sonrisa:.9,duration:f(4),ease:"power2.in"},f(b.tareas.memoria+2));
    tl.to(s.rami,{squash:0,duration:f(10),ease:"elastic.out(1,.5)"},f(b.tareas.memoria+6));
    tl.to(s.capa,{interrupciones:1,duration:f(6)},f(b.tareas.interrupciones));
    tl.to(s.cipu,{squash:-.06,cejaAltura:.8,duration:f(4),ease:"power2.in"},f(b.tareas.interrupciones+2));
    tl.to(s.cipu,{squash:0,duration:f(10),ease:"elastic.out(1,.5)"},f(b.tareas.interrupciones+6));
    tl.to(s.nucleo,{brazoIzq:0,codoIzq:0,brazoDer:-70,codoDer:14,miradaX:.7,miradaY:-.9,duration:f(10)},f(b.tareas.controladores-8));
    tl.to(s.capa,{controladores:1,duration:f(6)},f(b.tareas.controladores));
    tl.to(s.disqui,{squash:-.08,miradaX:-.6,miradaY:.8,duration:f(4),ease:"power2.in"},f(b.tareas.controladores+2));
    tl.to(s.disqui,{squash:0,duration:f(10),ease:"elastic.out(1,.5)"},f(b.tareas.controladores+6));
    tl.to(s.capa,{raiz:1,duration:f(8)},f(b.tareas.raiz));
    tl.to(s.nucleo,{brazoDer:0,codoDer:0,sonrisa:.85,salto:8,duration:f(8),ease:"power2.out"},f(b.tareas.raiz+8));
    tl.to(s.nucleo,{salto:0,duration:f(10),ease:"bounce.out"},f(b.tareas.raiz+16));
    // D09: el núcleo ejecuta /sbin/init después de montar la raíz; Init surge como PID 1.
    tl.to(s.nucleo,{brazoDer:-60,codoDer:12,miradaX:.9,miradaY:0,duration:f(10)},f(b.exec[0]-8));
    tl.to(s.capa,{exec:1,duration:f(b.exec[1]-b.exec[0]),ease:"power1.inOut"},f(b.exec[0]));
    tl.to(s.init,{visible:1,ojo:0,salto:16,squash:.06,sonrisa:.7,duration:f(10),ease:"back.out(1.6)"},f(b.aparecenInit));
    tl.to(s.init,{salto:0,squash:0,duration:f(10),ease:"bounce.out"},f(b.aparecenInit+10));
    tl.to(s.nucleo,{brazoDer:0,codoDer:0,miradaX:.8,miradaY:.1,duration:f(14)},f(b.aparecenInit+6));
    tl.to(s.capa,{panelInit:1,duration:f(10)},f(b.aparecenInit+12));
    tl.to(s.init,{brazoDer:-60,codoDer:12,miradaX:.6,miradaY:-.6,duration:f(10)},f(b.pid1-8));
    tl.to(s.capa,{pid1:1,duration:f(8)},f(b.pid1));
    tl.to(s.init,{brazoDer:0,codoDer:0,duration:f(12)},f(b.pid1+30));
    // §10.3: el BIOS deja de dirigir, sin desaparecer.
    tl.to(s.capa,{biosReposo:1,duration:f(12)},f(b.bios));
    tl.to(s.bios,{inclinacion:-6,squash:-.04,sonrisa:.9,ojo:.35,miradaX:.5,miradaY:.3,duration:f(14)},f(b.bios+2));
    tl.to(s.init,{miradaX:-.8,miradaY:-.2,duration:f(10)},f(b.bios+4));
    tl.to(s.nucleo,{miradaX:-.8,miradaY:-.2,duration:f(10)},f(b.bios+6));
    // «ya comenzó a funcionar»: celebración escalonada y asentamiento final.
    tl.to(s.capa,{sistemaListo:1,duration:f(10)},f(b.fiesta));
    const elenco=["nucleo","init","grubi","mebre","disqui","rami","cipu","bios"] as const;
    elenco.forEach((id,i)=>{
      tl.to(s[id],{salto:12,squash:.05,sonrisa:.9,miradaX:0,miradaY:.2,duration:f(7),ease:"power2.out"},f(b.fiesta+4+i*3));
      tl.to(s[id],{salto:0,squash:0,duration:f(10),ease:"bounce.out"},f(b.fiesta+11+i*3));
    });
  },
};
