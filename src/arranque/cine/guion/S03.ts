import {duracionEscena} from "../../anclas.ts";
import type {Camara, Punto3D} from "../mundo.ts";
import {crearMotor} from "../motor.ts";
import {RUTA_FIRMWARE} from "../rutas.ts";
import {anclasDeEscena, cuesDeEscena} from "../../recursos.ts";
import {CUERPO_BASE, type Cuerpo, type Guion} from "./comun.ts";
import {GUION_S02, type EstadoS02} from "./S02.ts";

/**
 * S03 · coreografía (A08, §6.2, §9.3, B01). El cartucho encendido cobra vida
 * como Cipu; sus registros de reinicio forman 0xFFFFFFF0 (no CS×16+IP); la
 * búsqueda viaja Slot 1 → 82443BX → PIIX4E → flash; vuelven instrucciones del
 * firmware; el chipset hace que esa región responda. Empieza exactamente en
 * el estado final de S02 y termina encuadrando flash y CMOS (enlace con S04).
 */
export const CAMARAS_S03 = {
  registros: {px: 5.4, py: 3.1, pz: 1.8, tx: 1.0, ty: 1.35, tz: -2.3, fov: 42},
  amplio: {px: 10.0, py: 9.0, pz: 3.5, tx: 1.8, ty: -0.2, tz: 0.4, fov: 46},
  final: {px: 8.4, py: 8.2, pz: 4.6, tx: 0.9, ty: -0.2, tz: 1.0, fov: 46},
} satisfies Record<string, Camara>;

/** Pies de Cipu sobre el Slot 1 (el cartucho mide ~2 unidades; Cipu, 3). */
export const CIPU_LUGAR: Punto3D = [1.6, 0.36, -2.6];

/** Una sola definición para la llegada visual y el comienzo causal de ejecución. */
export const RETORNO_FIRMWARE = {duracion: 80, anticipacion: 40, factor: 1.45, separacion: 0.22};

/** Fracción del recorrido (en longitud del mundo) donde la búsqueda alcanza cada chip. */
function fraccionEnVertice(indice: number): number {
  let total = 0;
  let hasta = 0;
  for (let i = 1; i < RUTA_FIRMWARE.length; i++) {
    const a = RUTA_FIRMWARE[i - 1];
    const b = RUTA_FIRMWARE[i];
    const l = Math.hypot(b[0] - a[0], b[2] - a[2]);
    total += l;
    if (i <= indice) hasta += l;
  }
  return hasta / total;
}
export const LLEGADAS = {norte: fraccionEnVertice(3), sur: fraccionEnVertice(5), flash: 1};

export type EstadoS03 = {
  cam: Camara;
  cipu: Cuerpo;
  secu: Cuerpo;
  pulso: Cuerpo;
  mundo: {cartucho: number; norte: number; sur: number; flash: number};
  capa: {placa: number; analizador: number; holo: number; suma: number; binario: number; advertencia: number; etiquetas: number; busqueda: number; ramVacia: number; retorno: number; ejecucion: number; mapa: number; repaso: number};
};

/** Estado de S02 en su último instante: la continuidad se deriva, no se copia a mano. */
function finDeS02(): EstadoS02 {
  return crearMotor(GUION_S02, anclasDeEscena("S02", cuesDeEscena("S02")), 30).en(duracionEscena("S02") - 1);
}

export const GUION_S03: Guion<EstadoS03> = {
  inicial: () => {
    const fin = finDeS02();
    return {
      cam: {...fin.cam},
      cipu: {...CUERPO_BASE, visible: 0, ojo: 0.6, squash: -0.2},
      secu: {...fin.secu},
      pulso: {...fin.pulso},
      mundo: {cartucho: 1, norte: 0, sur: 0, flash: 0},
      capa: {placa: 1, analizador: fin.senal.analizador, holo: 0, suma: 0, binario: 0, advertencia: 0, etiquetas: 0, busqueda: 0, ramVacia: 0, retorno: 0, ejecucion: 0, mapa: 0, repaso: 0},
    };
  },
  construir: (tl, s, f, a) => {
    // — El cartucho cobra vida: Cipu emerge (ancla "soy Cipu") —
    tl.to(s.capa, {analizador: 0, duration: f(24)}, f(0));
    // El plano heredado permanece 24 frames para leer la metamorfosis.
    // El objetivo desciende antes del arco para liberar la banda de subtítulos.
    const {ty, ...encuadreRegistros} = CAMARAS_S03.registros;
    tl.to(s.cam, {...encuadreRegistros, duration: f(96), ease: "power2.inOut"}, f(24));
    tl.to(s.cam, {ty: 0.2, duration: f(12), ease: "power2.inOut"}, f(24));
    tl.to(s.cam, {ty, duration: f(42), ease: "power2.inOut"}, f(78));
    tl.to(s.capa, {placa: 0.3, duration: f(60), ease: "none"}, f(30));
    tl.to(s.mundo, {cartucho: 0, duration: f(12), ease: "power2.in"}, f(4));
    tl.to(s.cipu, {visible: 1, squash: 0.14, salto: 34, ojo: 0, cejaAltura: 0.7, duration: f(9), ease: "back.out(2)"}, f(6));
    tl.to(s.cipu, {squash: 0, salto: 0, sonrisa: 0.6, mejillas: 0.6, duration: f(12), ease: "bounce.out"}, f(15));
    tl.to(s.secu, {miradaX: 0.9, miradaY: -0.6, sorpresa: 1, cejaAltura: 0.9, salto: 18, duration: f(8), ease: "power2.out"}, f(8));
    tl.to(s.secu, {sorpresa: 0, salto: 0, sonrisa: 0.7, duration: f(14), ease: "bounce.out"}, f(16));
    tl.to(s.cipu, {brazoDer: -80, codoDer: 20, duration: f(10), ease: "back.out(2)"}, f(a.presentacion - 4));
    tl.to(s.cipu, {brazoDer: -58, duration: f(6), repeat: 5, yoyo: true, ease: "sine.inOut"}, f(a.presentacion + 6));
    tl.to(s.cipu, {brazoDer: 0, codoDer: 0, duration: f(10)}, f(a.presentacion + 44));

    // — Termina el reinicio: se estira y despierta del todo (ancla "termina mi reinicio") —
    tl.to(s.cipu, {brazoIzq: 85, brazoDer: -85, squash: 0.12, ojo: 0.7, cejaAltura: 0.4, duration: f(10), ease: "power2.out"}, f(a.reinicio - 8));
    tl.to(s.cipu, {brazoIzq: 0, brazoDer: 0, squash: 0, ojo: 0, sonrisa: 0.4, duration: f(14), ease: "elastic.out(1, 0.5)"}, f(a.reinicio + 10));

    // — Registros de reinicio en el holograma (ancla "primera instrucción") —
    tl.to(s.cipu, {brazoIzq: 80, codoIzq: -15, miradaX: -0.8, miradaY: -0.3, duration: f(12), ease: "back.out(1.8)"}, f(a.instruccion - 16));
    tl.to(s.capa, {holo: 1, duration: f(14), ease: "back.out(1.4)"}, f(a.instruccion - 10));
    // CS.BASE + EIP = dirección física: las mitades se combinan (ancla "FFFFFFF0").
    tl.to(s.cipu, {cejaAltura: -0.3, cejaAngulo: 0.5, ojo: 0.15, sonrisa: -0.1, duration: f(10)}, f(a.direccion - 50));
    tl.to(s.capa, {suma: 1, duration: f(40), ease: "power2.inOut"}, f(a.direccion - 44));
    tl.to(s.capa, {binario: 1, duration: f(8)}, f(a.direccion - 10));
    tl.to(s.cipu, {cejaAltura: 0.6, cejaAngulo: 0, ojo: 0, sonrisa: 0.7, salto: 16, duration: f(6), ease: "power2.out"}, f(a.direccion - 4));
    tl.to(s.cipu, {salto: 0, duration: f(10), ease: "bounce.out"}, f(a.direccion + 2));
    tl.to(s.capa, {advertencia: 1, duration: f(10)}, f(a.direccion + 12));

    // — La búsqueda viaja hacia la región del firmware (ancla "código inicial del BIOS") —
    tl.to(s.cipu, {brazoIzq: 40, codoIzq: 30, squash: -0.1, inclinacion: 6, duration: f(10), ease: "power2.in"}, f(a.bios - 26));
    tl.to(s.cipu, {brazoIzq: 95, codoIzq: -10, squash: 0.08, inclinacion: -8, duration: f(6), ease: "power3.out"}, f(a.bios - 16));
    tl.to(s.cipu, {brazoIzq: 0, codoIzq: 0, squash: 0, inclinacion: 0, miradaX: 0.4, miradaY: 0.6, duration: f(14)}, f(a.bios - 6));
    tl.to(s.capa, {holo: 0, duration: f(12), ease: "power2.in"}, f(a.bios - 14));
    tl.to(s.cam, {...CAMARAS_S03.amplio, duration: f(40), ease: "power2.inOut"}, f(a.bios - 20));
    tl.to(s.capa, {etiquetas: 1, duration: f(16)}, f(a.bios - 2));
    const viaje = 72;
    tl.to(s.capa, {busqueda: 1, duration: f(viaje), ease: "none"}, f(a.bios - 10));
    tl.to(s.mundo, {norte: 0.8, duration: f(6)}, f(a.bios - 10 + viaje * LLEGADAS.norte));
    tl.to(s.mundo, {norte: 0.25, duration: f(16)}, f(a.bios - 4 + viaje * LLEGADAS.norte));
    tl.to(s.mundo, {sur: 0.8, duration: f(6)}, f(a.bios - 10 + viaje * LLEGADAS.sur));
    tl.to(s.mundo, {sur: 0.25, duration: f(16)}, f(a.bios - 4 + viaje * LLEGADAS.sur));
    tl.to(s.mundo, {flash: 1, duration: f(8)}, f(a.bios - 10 + viaje));

    // — Todavía no hay sistema operativo: Linux aún no está cargado (ancla "ningún proceso Linux") —
    tl.to(s.cipu, {miradaX: 0.9, miradaY: 0.5, cejaAltura: 0.2, cejaAngulo: 0.5, sonrisa: -0.3, duration: f(10)}, f(a.linux - 10));
    tl.to(s.cipu, {inclinacion: 7, duration: f(5), repeat: 5, yoyo: true, ease: "sine.inOut"}, f(a.linux - 4));
    tl.to(s.capa, {ramVacia: 1, duration: f(10)}, f(a.linux - 6));
    tl.to(s.capa, {ramVacia: 0, duration: f(18)}, f(a.linux + 44));
    tl.to(s.cipu, {inclinacion: 0, cejaAngulo: 0, sonrisa: 0.2, duration: f(10)}, f(a.linux + 28));

    // — Vuelven las instrucciones del firmware y Cipu las ejecuta (ancla "instrucciones del firmware") —
    const inicioRetorno = a.firmware - RETORNO_FIRMWARE.anticipacion;
    const recepcionPrimera = inicioRetorno + Math.ceil(RETORNO_FIRMWARE.duracion / RETORNO_FIRMWARE.factor);
    tl.to(s.capa, {retorno: 1, duration: f(RETORNO_FIRMWARE.duracion), ease: "none"}, f(inicioRetorno));
    tl.to(s.cipu, {miradaX: -0.5, miradaY: 0.6, cejaAltura: -0.3, cejaAngulo: 0.5, ojo: 0.15, duration: f(10)}, f(a.firmware - 36));
    tl.to(s.capa, {ejecucion: 1, duration: f(56), ease: "none"}, f(recepcionPrimera));
    tl.to(s.cipu, {cejaAltura: 0.4, cejaAngulo: 0, ojo: 0, sonrisa: 0.8, mejillas: 0.8, duration: f(10)}, f(a.firmware + 46));

    // — El chipset hace responder esa región (ancla "El chipset facilita") —
    tl.to(s.mundo, {norte: 1, sur: 1, duration: f(10)}, f(a.chipset - 4));
    tl.to(s.capa, {mapa: 1, duration: f(18), ease: "back.out(1.4)"}, f(a.chipset - 2));
    tl.to(s.cipu, {brazoDer: -70, codoDer: 10, miradaX: -0.6, miradaY: 0.4, duration: f(12), ease: "back.out(1.6)"}, f(a.chipset));
    tl.to(s.cipu, {brazoDer: 0, codoDer: 0, duration: f(12)}, f(a.chipset + 50));
    tl.to(s.secu, {miradaX: 0.4, miradaY: 0.5, duration: f(14)}, f(a.chipset));

    // — Cierre (ancla "primera búsqueda"): se repite la búsqueda y la cámara se asienta sobre flash y CMOS —
    tl.to(s.capa, {repaso: 1, duration: f(30), ease: "none"}, f(a.region - 8));
    tl.to(s.cam, {...CAMARAS_S03.final, duration: f(90), ease: "power1.inOut"}, f(a.region - 50));
    tl.to(s.mundo, {norte: 0.35, sur: 0.35, flash: 0.6, duration: f(20)}, f(a.region + 22));
    tl.to(s.capa, {mapa: 0, duration: f(16)}, f(duracionEscena("S03") - 18));
  },
};
