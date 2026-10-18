import {duracionEscena} from "../../anclas.ts";
import {crearMotor} from "../motor.ts";
import {anclasDeEscena,cuesDeEscena} from "../../recursos.ts";
import type {Camara,Punto3D} from "../mundo.ts";
import {RUTAS_S06} from "./S06.ts";
import {RUTAS_S08} from "./S08.ts";
import {GUION_S09,type EstadoS09} from "./S09.ts";
import {CUERPO_BASE,type Cuerpo,type Guion} from "./comun.ts";

/** Grubi es código que ejecuta la CPU: aparece sobre la placa entre Bios y el 82443BX, libre del mazo ATX. */
export const GRUBI_LUGAR:Punto3D=[4.1,.02,1];
/** Lugar efectivo de Grubi: S12 lo aparta en z sin cambiar su lugar de referencia. */
export const lugarGrubi=(c:{desplazZ?:number}):Punto3D=>[GRUBI_LUGAR[0],GRUBI_LUGAR[1],GRUBI_LUGAR[2]+(c.desplazZ??0)];
export const ALTURA_GRUBI=2.6;
/** Mebre permanece en su lugar de S09: el contenido del sector sigue en RAM. */
export const MEBRE_DESPLAZAMIENTO_S10={x:0,z:0};
export const CAMARAS_S10={
  grub:{px:12,py:5.5,pz:8,tx:7.5,ty:1.3,tz:-1,fov:46},
} satisfies Record<string,Camara>;
/** §6.10 / §10.1: instalación de referencia. Sin direcciones de carga inventadas. */
export const ETAPAS_GRUB=[
  {id:"stage1",nombre:"Stage 1",ubicacion:"MBR · sector 0",archivo:null},
  {id:"stage15",nombre:"Stage 1.5",ubicacion:"espacio de inserción",archivo:"e2fs_stage1_5"},
  {id:"stage2",nombre:"Stage 2",ubicacion:"partición ext2",archivo:"/boot/grub/stage2"},
] as const;
export const MENU_LST={archivo:"/boot/grub/menu.lst",lineas:["title Linux 2.6","root (hd0,0)","kernel /boot/vmlinuz root=/dev/hda1"] as const,nucleo:"/boot/vmlinuz"};
export const ARCHIVOS_EXT2=["/boot/grub/stage2","/boot/grub/menu.lst","/boot/vmlinuz"] as const;
/** Lectura de la unidad: controlador IDE del puente sur → cinta → disco; vuelta y copia a SDRAM como en S08. */
export const RUTAS_S10={
  solicitud:[...RUTAS_S06.ide,...RUTAS_S06.cinta.slice(1)],
  datos:RUTAS_S08.datos,
  transferencia:RUTAS_S08.transferencia,
} as const satisfies Record<string,readonly Punto3D[]>;
/** Panel de disco/RAM (banda superior) y configuración (columna derecha) en el plano `grub`. */
export const PANEL_DISCO={x:60,y:18,ancho:1800,alto:250};
export const PANEL_MENU={x:1432,y:300,ancho:470,alto:230};
/** Columnas del mapa de disco (relativas a PANEL_DISCO.x). */
export const MAPA_DISCO={etiqueta:18,mbr:[230,430] as const,insercion:[440,780] as const,ext2:[800,1780] as const};
export type Carga={solicitud:[number,number];datos:[number,number];transferencia:[number,number]};
export function fasesS10(a:Record<string,number>){
  const carga=(inicio:number,viaje=26,trayecto=30):Carga=>({solicitud:[inicio,inicio+viaje],datos:[inicio+viaje+4,inicio+viaje+4+trayecto],transferencia:[inicio+viaje+6+trayecto,inicio+viaje+6+2*trayecto]});
  // Stage 2 carga antes de su mención completa; menu.lst solo cuando Stage 2 ya ejecuta.
  const s15=carga(a.localiza+4,24,28),s2=carga(a.s2-47,13,14),menu=carga(s2.transferencia[1]+12,16,18);
  const visual=cuesDeEscena("S10"),finVoz=visual[0].cue.startFrame+visual[0].cue.durationFrames;
  return {mov:[0,40] as const,aparece:22,panel:34,s15,s2,menu,ejecuta15:s15.transferencia[1]+4,ejecuta2:s2.transferencia[1]+4,rutaExt2:a.ext2-6,seleccion:a.kernel,finVoz};
}
export type EstadoS10=EstadoS09&{grubi:Cuerpo&{desplazZ:number};capa:EstadoS09["capa"]&{discoPanel:number;mbrStage1:number;insercion:number;ext2Abierto:number;rutaStage2:number;
  s15Solicitud:number;s15Datos:number;s15Transferencia:number;s2Solicitud:number;s2Datos:number;s2Transferencia:number;menuSolicitud:number;menuDatos:number;menuTransferencia:number;
  ejecuta:number;menuPanel:number;nucleoSeleccionado:number}};
const copiar=(c:Cuerpo)=>({...c});
export const GUION_S10:Guion<EstadoS10>={
  inicial:()=>{
    const fin=crearMotor(GUION_S09,anclasDeEscena("S09",cuesDeEscena("S09")),30).en(duracionEscena("S09") - 1);
    return {...fin,cam:{...fin.cam},mundo:{...fin.mundo},cipu:copiar(fin.cipu),secu:copiar(fin.secu),pulso:copiar(fin.pulso),romi:copiar(fin.romi),bios:copiar(fin.bios),cmosi:copiar(fin.cmosi),postin:copiar(fin.postin),spedi:copiar(fin.spedi),rami:copiar(fin.rami),disqui:copiar(fin.disqui),mebre:{...fin.mebre,desplazZ:fin.mebre.desplazZ},
      grubi:{...CUERPO_BASE,desplazZ:0,visible:0,ojo:.4},
      capa:{...fin.capa,discoPanel:0,mbrStage1:0,insercion:0,ext2Abierto:0,rutaStage2:0,s15Solicitud:0,s15Datos:0,s15Transferencia:0,s2Solicitud:0,s2Datos:0,s2Transferencia:0,menuSolicitud:0,menuDatos:0,menuTransferencia:0,ejecuta:1,menuPanel:0,nucleoSeleccionado:0}};
  },
  construir:(tl,s,f,a)=>{
    const b=fasesS10(a);
    // Stage 1 (dentro de Mebre) ya ejecuta: Mebre cede sitio y aparece Grubi; el mapa pasa del sector al disco.
    tl.to(s.cam,{...CAMARAS_S10.grub,duration:f(b.mov[1]-b.mov[0]),ease:"power2.inOut"},f(b.mov[0]));
    tl.to(s.capa,{mbrPanel:0,duration:f(14)},f(0));
    // Mebre anuncia a Grubi: su área de código contiene la primera etapa.
    tl.to(s.mebre,{miradaX:-.9,miradaY:.3,brazoIzq:55,codoIzq:-12,inclinacion:-4,duration:f(10)},f(b.aparece-12));
    tl.to(s.grubi,{visible:1,ojo:0,salto:16,squash:.06,sonrisa:.7,duration:f(10),ease:"back.out(1.6)"},f(b.aparece));
    tl.to(s.grubi,{salto:0,squash:0,duration:f(10),ease:"bounce.out"},f(b.aparece+10));
    tl.to(s.mebre,{brazoIzq:0,codoIzq:0,inclinacion:0,duration:f(12)},f(b.aparece+30));
    tl.to(s.capa,{discoPanel:1,duration:f(12)},f(b.panel));
    // «instalada en el MBR»: Grubi señala a Mebre; el sector 0 del mapa se identifica como Stage 1.
    tl.to(s.grubi,{brazoIzq:65,codoIzq:-12,miradaX:-.9,miradaY:.2,duration:f(10)},f(a.stage1-10));
    tl.to(s.capa,{mbrStage1:1,duration:f(10)},f(a.stage1-4));
    tl.to(s.mebre,{squash:-.06,sonrisa:.9,duration:f(6)},f(a.stage1));
    tl.to(s.mebre,{squash:0,duration:f(10),ease:"elastic.out(1,.5)"},f(a.stage1+6));
    // «localiza una etapa intermedia»: lista instalada → espacio de inserción; lectura y copia a SDRAM.
    tl.to(s.grubi,{brazoIzq:0,codoIzq:0,brazoDer:-70,codoDer:14,miradaX:.8,miradaY:-.6,duration:f(10)},f(a.localiza-8));
    tl.to(s.capa,{insercion:1,duration:f(6)},f(a.localiza-2));
    const carga=(c:{solicitud:[number,number];datos:[number,number];transferencia:[number,number]},prefijo:"s15"|"s2"|"menu")=>{
      tl.to(s.capa,{[`${prefijo}Solicitud`]:1,duration:f(c.solicitud[1]-c.solicitud[0]),ease:"none"},f(c.solicitud[0]));
      tl.to(s.capa,{[`${prefijo}Datos`]:1,duration:f(c.datos[1]-c.datos[0]),ease:"none"},f(c.datos[0]));
      tl.to(s.capa,{[`${prefijo}Transferencia`]:1,duration:f(c.transferencia[1]-c.transferencia[0]),ease:"none"},f(c.transferencia[0]));
    };
    carga(b.s15,"s15");
    tl.to(s.disqui,{squash:-.08,miradaX:-.4,miradaY:.8,duration:f(4),ease:"power2.in"},f(b.s15.solicitud[1]));
    tl.to(s.disqui,{squash:0,miradaX:-.9,miradaY:.4,duration:f(10),ease:"elastic.out(1,.5)"},f(b.s15.solicitud[1]+4));
    // Control a Stage 1.5 cuando ya está en RAM.
    tl.set(s.capa,{ejecuta:2},f(b.ejecuta15));
    tl.to(s.grubi,{brazoDer:0,codoDer:0,salto:8,sonrisa:.85,duration:f(8),ease:"power2.out"},f(b.ejecuta15));
    tl.to(s.grubi,{salto:0,duration:f(10),ease:"bounce.out"},f(b.ejecuta15+8));
    // «comprende … ext dos»: Stage 1.5 recorre ext2 hasta /boot/grub/stage2.
    tl.to(s.capa,{ext2Abierto:1,duration:f(12)},f(b.rutaExt2-12));
    tl.to(s.grubi,{brazoDer:-75,codoDer:14,miradaX:.6,miradaY:-.9,duration:f(10)},f(b.rutaExt2-8));
    tl.to(s.capa,{rutaStage2:1,duration:f(40),ease:"none"},f(b.rutaExt2));
    carga(b.s2,"s2");
    tl.to(s.disqui,{squash:-.08,duration:f(4),ease:"power2.in"},f(b.s2.solicitud[1]));
    tl.to(s.disqui,{squash:0,duration:f(10),ease:"elastic.out(1,.5)"},f(b.s2.solicitud[1]+4));
    tl.set(s.capa,{ejecuta:3},f(b.ejecuta2));
    tl.to(s.grubi,{brazoDer:0,codoDer:0,squash:-.06,duration:f(8)},f(b.ejecuta2-6));
    tl.to(s.grubi,{squash:0,duration:f(10),ease:"elastic.out(1,.5)"},f(b.ejecuta2+2));
    // «leo mi configuración»: menu.lst se lee de ext2; «selecciono el núcleo»: línea kernel elegida, sin cargarlo.
    carga(b.menu,"menu");
    tl.to(s.capa,{menuPanel:1,duration:f(10)},f(b.menu.transferencia[1]-4));
    tl.to(s.grubi,{brazoDer:-70,codoDer:14,miradaX:.9,miradaY:-.5,duration:f(10)},f(b.menu.transferencia[1]-8));
    tl.to(s.grubi,{brazoDer:-85,codoDer:18,cejaAltura:.7,sonrisa:.9,duration:f(8)},f(b.seleccion-4));
    tl.to(s.capa,{nucleoSeleccionado:1,duration:f(10)},f(b.seleccion));
    tl.to(s.grubi,{brazoDer:0,codoDer:0,miradaX:-.2,miradaY:.1,duration:f(16)},f(b.finVoz+10));
  },
};
