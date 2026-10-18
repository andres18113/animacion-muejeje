import {duracionEscena} from "../../anclas.ts";
import {crearMotor} from "../motor.ts";
import {anclasDeEscena,cuesDeEscena} from "../../recursos.ts";
import {proyectar,LUGARES,type Camara,type Punto3D} from "../mundo.ts";
import {GUION_S06,RUTAS_S06,type EstadoS06} from "./S06.ts";
import type {Cuerpo,Guion} from "./comun.ts";
import type {PerspectiveCamera} from "three";
import {cajaVolumenS06} from "../servicios-geometria.ts";

export const CAMARAS_S07={
  cmos:{px:4.5,py:4.2,pz:9.5,tx:2.4,ty:0.9,tz:2.6,fov:40},
  orden:{px:7.5,py:7.6,pz:12.4,tx:7,ty:0.4,tz:0.9,fov:41},
  lectura:{px:7.6,py:7.2,pz:10.5,tx:6.6,ty:0.5,tz:0.2,fov:44},
} satisfies Record<string,Camara>;
/** Recurso exclusivo de S07: disquetera de 3½" junto al disco, fuera de la placa, y su cabecera de 34 pines. */
export const PROPS_S07={
  disquetera:{p:[13.5,.3,-1.9],t:[2.4,.5,3]},
  cabecera:{p:[8.1,0,-4.4],t:[.35,.3,1.3]},
} as const;
/** Lugar efectivo de Bios al final de S06: base + desplazamiento real del guion. */
export const BIOS_EFECTIVA:Punto3D=[LUGARES.bios[0]+3.4,LUGARES.bios[1],LUGARES.bios[2]];
const PIE_BIOS:Punto3D=[BIOS_EFECTIVA[0],.02,BIOS_EFECTIVA[2]+.25];
export const RUTAS_S07={
  // CMOS vive en el puente sur, bajo Cmosi: consulta y respuesta recorren la misma pista.
  consulta:[PIE_BIOS,[2.4,.02,3],[1.4,.12,3.6]],
  // E/S (controlador de disquetera) → cabecera → cinta de 34 hilos hasta la parte trasera de la unidad.
  disquetera:[PIE_BIOS,[3,.12,3.9],[4.6,.02,4.6],[8.35,.02,4.6],[8.35,.02,-4.4],[8.1,.3,-4.4],[8.9,.1,-4.6],[13.5,.1,-4.6],[13.5,.45,-3.4]],
  cintaDisquetera:[[8.1,.3,-4.4],[8.9,.1,-4.6],[13.5,.1,-4.6],[13.5,.45,-3.4]],
  disco:[PIE_BIOS,[3.6,.02,3.6],...RUTAS_S06.ide.slice(2),...RUTAS_S06.cinta.slice(1)],
} as const satisfies Record<string,readonly Punto3D[]>;
export const ORDEN_ARRANQUE=["Disquetera","Disco IDE"] as const;

export function fasesS07(a:Record<string,number>){
  const visual=cuesDeEscena("S07");
  const finCmosi=visual[0].cue.startFrame+visual[0].cue.durationFrames;
  const consultaInicio=a.parametros+26,consultaFin=consultaInicio+30;
  const respuestaFin=a.configuracion,respuestaInicio=respuestaFin-24;
  // El plano se asienta antes de la petición; nunca pisa el acercamiento inicial de 40 frames.
  const movOrden=Math.max(40,a.disquetera-78);
  const peticionInicio=a.disquetera-7,peticionFin=peticionInicio+34;
  const unidadFin=peticionFin+30,regresoFin=unidadFin+32;
  const movLectura=Math.max(a.selecciona+10,regresoFin+20);
  return {consultaInicio,consultaFin,respuestaInicio,respuestaFin,movOrden,finOrden:movOrden+60,peticionInicio,peticionFin,unidadFin,regresoFin,movLectura,finLectura:Math.min(movLectura+46,a.activa+10),finCmosi,
    revelado:44,panelFuera:a.activa-12,insignia:a.activa+10,codigo19:a.int19-10};
}
/** Lecturas en pantalla: posiciones fijas por plano, interpoladas con el mismo progreso que la cámara. */
export const PANEL_ORDEN={ancho:380,alto:190,posiciones:[[70,60],[8,205]] as const};
export function panelOrdenS07(k:number){
  const t=Math.max(0,Math.min(1,k)),[x0,y0]=PANEL_ORDEN.posiciones[0],[x1,y1]=PANEL_ORDEN.posiciones[1];
  return {x:x0+(x1-x0)*t,y:y0+(y1-y0)*t,ancho:PANEL_ORDEN.ancho,alto:PANEL_ORDEN.alto};
}
export function lecturaDisqueteraS07(c:PerspectiveCamera){
  const [x0,y0,x1]=cajaVolumenS06(c,PROPS_S07.disquetera);
  return {x:Math.min(1920-376,(x0+x1)/2-180),y:y0-112,ancho:360,alto:92};
}
/** Panel de la rutina BIOS en ejecución junto a Bios (S07 y S08); `k` sigue al plano RAM de S08. */
export function panelBios(c:PerspectiveCamera,filas:number,k=0){
  const q=proyectar(c,BIOS_EFECTIVA),u=q.escala*2.3/512,izq=q.x-216*u,techo=q.y-395*u,alto=22+filas*48;
  // Con el plano RAM, Secu entra por la izquierda: el panel se desvanece en el centro del movimiento y reaparece sobre Bios.
  const ram=k>=.5?1:0;
  return {x:izq-420+100*ram,y:techo-86-102*ram,ancho:380,alto,opacidad:k<.5?1-2*k:Math.max(0,(k-.8)/.2)};
}
export type EstadoS07=EstadoS06&{capa:EstadoS06["capa"]&{panelK:number;disqueteraPresente:number;consultaCmos:number;respuestaCmos:number;ordenPanel:number;fila1:number;fila2:number;disqueteraPeticion:number;disqueteraActiva:number;disqueteraRespuesta:number;sinDisquete:number;discoSeleccionado:number;rutina19:number;codigo19:number;bootstrap:number}};
const copiar=(c:Cuerpo)=>({...c});
export const GUION_S07:Guion<EstadoS07>={
  inicial:()=>{
    const fin=crearMotor(GUION_S06,anclasDeEscena("S06",cuesDeEscena("S06")),30).en(duracionEscena("S06") - 1);
    return {...fin,cam:{...fin.cam},mundo:{...fin.mundo},cipu:copiar(fin.cipu),secu:copiar(fin.secu),pulso:copiar(fin.pulso),romi:copiar(fin.romi),bios:copiar(fin.bios),cmosi:copiar(fin.cmosi),postin:copiar(fin.postin),spedi:copiar(fin.spedi),rami:copiar(fin.rami),disqui:copiar(fin.disqui),
      capa:{...fin.capa,panelK:0,disqueteraPresente:0,consultaCmos:0,respuestaCmos:0,ordenPanel:0,fila1:0,fila2:0,disqueteraPeticion:0,disqueteraActiva:0,disqueteraRespuesta:0,sinDisquete:0,discoSeleccionado:0,rutina19:0,codigo19:0,bootstrap:0}};
  },
  construir:(tl,s,f,a)=>{
    const b=fasesS07(a);
    // Plano a dos: Cmosi habla, Bios escucha y consulta.
    tl.to(s.cam,{...CAMARAS_S07.cmos,duration:f(40),ease:"power2.inOut"},f(0));
    tl.to(s.cmosi,{squash:-.08,miradaX:.2,miradaY:.2,sonrisa:.5,duration:f(8)},f(4));
    tl.to(s.cmosi,{squash:0,cejaAltura:.5,brazoIzq:55,codoIzq:-12,duration:f(12),ease:"back.out(1.6)"},f(a.parametros));
    tl.to(s.bios,{miradaX:-.9,miradaY:.4,sonrisa:.5,duration:f(10)},f(6));
    // La disquetera ya montada se revela fuera del plano cerrado, no aparece en cámara.
    tl.set(s.capa,{disqueteraPresente:1},f(b.revelado));
    // C01: Bios solicita; los parámetros responden desde la CMOS.
    tl.to(s.bios,{brazoIzq:50,codoIzq:-10,inclinacion:-4,duration:f(10)},f(b.consultaInicio-10));
    tl.to(s.capa,{consultaCmos:1,duration:f(b.consultaFin-b.consultaInicio),ease:"none"},f(b.consultaInicio));
    tl.to(s.cmosi,{squash:-.1,duration:f(4),ease:"power2.in"},f(b.consultaFin));
    tl.to(s.cmosi,{squash:0,duration:f(10),ease:"elastic.out(1,.5)"},f(b.consultaFin+4));
    tl.to(s.capa,{ordenPanel:1,duration:f(12)},f(b.consultaFin+2));
    tl.to(s.capa,{respuestaCmos:1,duration:f(b.respuestaFin-b.respuestaInicio),ease:"none"},f(b.respuestaInicio));
    tl.to(s.bios,{brazoIzq:0,codoIzq:0,inclinacion:0,squash:-.05,cejaAltura:.7,duration:f(8)},f(b.respuestaFin));
    tl.to(s.bios,{squash:0,duration:f(10)},f(b.respuestaFin+8));
    // Plano de orden: CMOS, Bios, disquetera y disco a la vez.
    tl.to(s.cam,{...CAMARAS_S07.orden,duration:f(60),ease:"power2.inOut"},f(b.movOrden));
    tl.to(s.capa,{panelK:1,duration:f(60),ease:"power2.inOut"},f(b.movOrden));
    tl.to(s.cmosi,{brazoIzq:0,codoIzq:0,miradaX:.9,miradaY:.3,duration:f(14)},f(b.movOrden+10));
    tl.to(s.bios,{miradaX:.9,miradaY:.5,duration:f(12)},f(b.movOrden+20));
    // C02: primero se intenta la disquetera.
    tl.to(s.capa,{fila1:1,duration:f(8)},f(b.peticionInicio-6));
    tl.to(s.bios,{brazoDer:-70,codoDer:14,inclinacion:4,duration:f(10)},f(b.peticionInicio-12));
    tl.to(s.capa,{disqueteraPeticion:1,duration:f(b.peticionFin-b.peticionInicio),ease:"none"},f(b.peticionInicio));
    tl.to(s.capa,{disqueteraActiva:1,duration:f(4)},f(b.peticionFin));
    tl.to(s.capa,{disqueteraActiva:0,duration:f(4)},f(b.unidadFin-4));
    tl.to(s.capa,{disqueteraRespuesta:1,duration:f(b.regresoFin-b.unidadFin),ease:"none"},f(b.unidadFin));
    tl.to(s.capa,{fila2:.5,duration:f(8)},f(a.ide));
    tl.to(s.bios,{brazoDer:-20,codoDer:4,inclinacion:0,duration:f(10)},f(b.regresoFin-4));
    // «no hay un disquete arrancable»: respuesta ya recibida; Bios la constata.
    tl.to(s.bios,{cejaAngulo:-.3,sonrisa:.1,squash:-.04,duration:f(8)},f(b.regresoFin));
    tl.set(s.capa,{sinDisquete:1},f(a.sinDisquete));
    tl.to(s.bios,{cejaAngulo:0,squash:0,sonrisa:.6,duration:f(10)},f(a.sinDisquete+20));
    tl.to(s.bios,{brazoDer:-65,codoDer:12,miradaX:.9,miradaY:-.2,duration:f(12)},f(a.selecciona-12));
    tl.to(s.capa,{fila2:1,discoSeleccionado:1,duration:f(10)},f(a.selecciona));
    tl.to(s.disqui,{miradaX:-.9,miradaY:.5,cejaAltura:.9,salto:8,duration:f(8),ease:"power2.out"},f(a.selecciona+6));
    tl.to(s.disqui,{salto:0,duration:f(12),ease:"bounce.out"},f(a.selecciona+14));
    tl.to(s.cmosi,{sonrisa:.9,miradaX:.8,miradaY:.2,duration:f(10)},f(a.selecciona+4));
    // Seleccionado el disco, la cámara se acerca a Bios y al camino IDE que usará la lectura.
    tl.to(s.cam,{...CAMARAS_S07.lectura,duration:f(b.finLectura-b.movLectura),ease:"power2.inOut"},f(b.movLectura));
    // C03: anticipación → activación de la rutina de arranque → asentamiento.
    tl.to(s.capa,{ordenPanel:0,duration:f(14)},f(b.panelFuera));
    tl.to(s.bios,{brazoDer:30,codoDer:-6,brazoIzq:-30,codoIzq:6,squash:-.12,cejaAltura:-.2,duration:f(12),ease:"power2.in"},f(a.activa-12));
    tl.to(s.bios,{brazoDer:-80,codoDer:16,brazoIzq:70,codoIzq:-14,salto:18,squash:.08,boton:1,cejaAltura:.8,duration:f(8),ease:"power2.out"},f(a.activa));
    tl.to(s.bios,{salto:0,squash:-.06,duration:f(8),ease:"power3.in"},f(a.activa+8));
    tl.to(s.bios,{squash:0,boton:0,brazoDer:0,codoDer:0,brazoIzq:45,codoIzq:-10,miradaX:-.6,miradaY:-.3,sonrisa:.8,duration:f(16),ease:"elastic.out(1,.6)"},f(a.activa+16));
    tl.to(s.capa,{rutina19:1,duration:f(12)},f(b.insignia));
    tl.to(s.capa,{codigo19:1,duration:f(10)},f(b.codigo19));
    tl.to(s.capa,{bootstrap:1,duration:f(12)},f(b.codigo19));
    tl.to(s.bios,{brazoIzq:0,codoIzq:0,miradaX:.9,miradaY:.3,duration:f(14)},f(a.int19+20));
  },
};
