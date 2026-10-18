import {duracionEscena} from "../../anclas.ts";
import type {Camara, Punto3D} from "../mundo.ts";
import {puntoDeRuta, RUTA_FIRMWARE} from "../rutas.ts";
import {crearMotor} from "../motor.ts";
import {anclasDeEscena, cuesDeEscena} from "../../recursos.ts";
import {GUION_S03, type EstadoS03} from "./S03.ts";
import {CUERPO_BASE, type Cuerpo, type Guion} from "./comun.ts";

export const CAMARAS_S04 = {
  romi: {px: -5, py: 3.5, pz: 9, tx: -0.5, ty: 1, tz: 3, fov: 42},
  bios: {px: -5, py: 3.5, pz: -2, tx: 0.5, ty: -0.1, tz: 0.5, fov: 42},
  cmosi: {px: 5.5, py: 3, pz: -2.75, tx: 0.8, ty: 0.8, tz: 3.6, fov: 42},
  salida: {px: 10, py: 8, pz: 8, tx: 2.4, ty: 0, tz: 0, fov: 46},
} satisfies Record<string, Camara>;
export const BLOQUES_FLASH = Array.from({length: 8}, (_, indice) => ({
  indice, inicio: indice * 0x10000, fin: (indice + 1) * 0x10000 - 1,
  funcion: indice === 7 ? "Boot Block" : indice === 1 ? "Tolerancia a fallos" : indice === 0 ? "Respaldo" : "BIOS principal",
}));
export const SECCION_FLASH = {x: 4, z: 3, base: 0.1, paso: 0.43};
export const VIAJE_CODIGO = {duracion: 72, inicioRespectoPrograma: -8};
export const RUTA_CODIGO_S04: readonly Punto3D[] = [...RUTA_FIRMWARE].reverse();
/** Frente físico: conserva exactamente X/Y/Z de las pistas compartidas. */
export function puntoCodigoS04(t: number): Punto3D {
  return puntoDeRuta(RUTA_CODIGO_S04, t);
}
/** Referencia didáctica separada del transporte; nace del gesto, guía al frente real. */
export function referenciaCodigoS04(mano: {x: number; y: number}, frente: {x: number; y: number}) {
  const x = mano.x + 28, y = mano.y - 240, ancho = 280, alto = 84;
  return {x, y, ancho, alto, guia: {x1: x + ancho / 2, y1: y + alto, x2: frente.x, y2: frente.y}};
}
export type EstadoS04 = EstadoS03 & {
  romi: Cuerpo; bios: Cuerpo; cmosi: Cuerpo;
  capa: EstadoS03["capa"] & {seccion: number; conteo: number; detalle: number; codigo: number; configuracion: number; reloj: number; bateria: number; distincion: number};
};

export const GUION_S04: Guion<EstadoS04> = {
  inicial: () => {
    const fin = crearMotor(GUION_S03, anclasDeEscena("S03", cuesDeEscena("S03")), 30).en(duracionEscena("S03") - 1);
    return {...fin, cam: {...fin.cam}, cipu: {...fin.cipu}, secu: {...fin.secu}, pulso: {...fin.pulso}, mundo: {...fin.mundo},
      romi: {...CUERPO_BASE, visible: 0, squash: -0.18, ojo: 0.6},
      bios: {...CUERPO_BASE, visible: 0, squash: -0.12},
      cmosi: {...CUERPO_BASE, visible: 0, ojo: 0.5},
      capa: {...fin.capa, seccion: 0, conteo: 0, detalle: 0, codigo: 0, configuracion: 0, reloj: 0, bateria: 0, distincion: 0}};
  },
  construir: (tl, s, f, a) => {
    tl.to(s.cam, {...CAMARAS_S04.romi, duration: f(48), ease: "power2.inOut"}, f(0));
    tl.to(s.capa, {mapa: 0, duration: f(12)}, f(0));
    tl.to(s.capa, {etiquetas: 0, duration: f(20)}, f(8));
    // Romi surge del soporte físico; abrir estratos ilustra su organización, no escritura.
    tl.to(s.romi, {visible: 1, squash: 0.08, ojo: 0, salto: 22, duration: f(12), ease: "back.out(1.6)"}, f(2));
    tl.to(s.romi, {squash: 0, salto: 0, sonrisa: 0.55, duration: f(14), ease: "bounce.out"}, f(a.romi));
    tl.to(s.romi, {brazoDer: -72, codoDer: 18, miradaX: 0.9, miradaY: -0.5, cejaAltura: 0.6, duration: f(14)}, f(a.flash - 10));
    tl.to(s.capa, {seccion: 1, duration: f(52), ease: "power2.inOut"}, f(a.capacidad - 58));
    tl.to(s.romi, {brazoIzq: 65, codoIzq: -20, sonrisa: 0.8, duration: f(12)}, f(a.capacidad - 14));
    tl.to(s.capa, {conteo: 8, duration: f(a.bloques - a.capacidad), ease: "none"}, f(a.capacidad));
    tl.to(s.romi, {brazoDer: -45, duration: f(8), repeat: 7, yoyo: true, ease: "sine.inOut"}, f(a.capacidad));
    tl.to(s.capa, {detalle: 1, duration: f(12)}, f(a.capacidad - 12));
    tl.to(s.romi, {brazoDer: 0, brazoIzq: 0, codoDer: 0, codoIzq: 0, sonrisa: 0.5, duration: f(14)}, f(a.bloques + 8));
    // El código nace de la flash, viaja hacia CPU; solo la CPU ejecuta al recibir.
    tl.to(s.capa, {seccion: 0, detalle: 0, duration: f(28)}, f(230));
    // Cortes entre intervenciones: evitan barrer oyentes sobre los instrumentos.
    tl.set(s.cam, {...CAMARAS_S04.bios}, f(252));
    tl.to(s.bios, {visible: 1, squash: 0.08, salto: 16, sonrisa: 0.65, duration: f(12), ease: "back.out(1.5)"}, f(a.bios - 14));
    tl.to(s.bios, {squash: 0, salto: 0, duration: f(12)}, f(a.bios));
    tl.to(s.romi, {miradaX: 0.8, sonrisa: 0.8, brazoIzq: 55, duration: f(12)}, f(a.bios));
    tl.to(s.bios, {brazoDer: -85, codoDer: 8, miradaX: 0.8, miradaY: -0.6, cejaAltura: -0.3, duration: f(14)}, f(a.programa - 16));
    const inicioCodigo = a.programa + VIAJE_CODIGO.inicioRespectoPrograma;
    tl.to(s.capa, {codigo: 1, duration: f(VIAJE_CODIGO.duracion), ease: "none"}, f(inicioCodigo));
    const recepcion = inicioCodigo + VIAJE_CODIGO.duracion;
    tl.to(s.cipu, {salto: 12, cejaAltura: 0.5, sonrisa: 0.75, brazoIzq: 50, duration: f(6)}, f(recepcion));
    tl.to(s.cipu, {salto: 0, brazoIzq: 0, duration: f(14), ease: "bounce.out"}, f(recepcion + 6));
    tl.to(s.bios, {brazoDer: 0, codoDer: 0, sonrisa: 0.8, cejaAltura: 0.5, duration: f(12)}, f(a.prepara));
    // Cmosi representa RTC/CMOS del PIIX4E, separada de la pila que la respalda.
    tl.set(s.cam, {...CAMARAS_S04.cmosi}, f(443));
    tl.to(s.cmosi, {visible: 1, ojo: 0, salto: 14, sonrisa: 0.6, duration: f(12), ease: "back.out(1.6)"}, f(a.cmosi - 14));
    tl.to(s.cmosi, {salto: 0, duration: f(12), ease: "bounce.out"}, f(a.cmosi));
    tl.to(s.cmosi, {brazoIzq: 70, codoIzq: -12, miradaX: -0.7, miradaY: -0.4, duration: f(14)}, f(a.configuracion - 16));
    tl.to(s.capa, {configuracion: 1, duration: f(12)}, f(a.configuracion - 12));
    tl.to(s.capa, {reloj: 1, duration: f(12)}, f(a.reloj - 12));
    tl.to(s.cmosi, {brazoDer: -65, codoDer: 20, miradaX: 0.9, miradaY: 0.6, duration: f(14)}, f(a.bateria - 14));
    tl.to(s.capa, {bateria: 1, duration: f(16)}, f(a.bateria - 16));
    tl.to(s.cmosi, {inclinacion: -6, cejaAngulo: 0.6, sonrisa: -0.2, duration: f(6), repeat: 3, yoyo: true}, f(a.noBios - 4));
    tl.to(s.capa, {distincion: 1, duration: f(10)}, f(a.noBios - 10));
    tl.to(s.cmosi, {inclinacion: 0, cejaAngulo: 0, brazoIzq: 0, brazoDer: 0, codoIzq: 0, codoDer: 0, sonrisa: 0.8, duration: f(16)}, f(a.diferentes - 12));
    tl.to(s.romi, {brazoIzq: 0, miradaX: 0.6, duration: f(14)}, f(a.diferentes));
    tl.to(s.capa, {configuracion: 0, reloj: 0, bateria: 0, distincion: 0, duration: f(12)}, f(duracionEscena("S04") - 16));
    tl.to(s.cam, {...CAMARAS_S04.salida, duration: f(14), ease: "power1.inOut"}, f(duracionEscena("S04") - 16));
  },
};
