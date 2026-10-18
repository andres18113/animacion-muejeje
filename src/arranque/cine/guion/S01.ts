import {duracionEscena} from "../../anclas.ts";
import {CAMARA_PUENTE, type Camara} from "../mundo.ts";
import {CUERPO_BASE, type Cuerpo, type Guion} from "./comun.ts";
import {PULSO_ENLACE, SECU_ENLACE} from "./S02.ts";

/**
 * S01 · coreografía. Planos: presentación de Voltio → la corriente alterna
 * llega desde la red → +5VSB viaja por el hilo morado hasta el LED de espera →
 * holograma (orden de la placa, salidas, estabilización, PWR_OK) → vuelo
 * sobre el mazo hasta la placa (cámara de enlace con S02).
 */
export const CAMARAS_S01 = {
  primerPlano: {px: 12.6, py: 2.1, pz: 7.8, tx: 10.5, ty: 0.95, tz: 1.3, fov: 33},
  red: {px: 16.4, py: 3.6, pz: 7.4, tx: 13.3, ty: 0.7, tz: -0.4, fov: 44},
  espera: {px: 6.4, py: 6.8, pz: 12.4, tx: 3.2, ty: -0.4, tz: 1.4, fov: 48},
  holograma: {px: 13.0, py: 2.6, pz: 9.4, tx: 9.0, ty: 1.55, tz: 1.0, fov: 40},
} satisfies Record<string, Camara>;

export type EstadoS01 = {
  cam: Camara;
  voltio: Cuerpo;
  /** Pulso y Secu no hablan en S01: esperan sobre la placa y terminan en el estado inicial de S02. */
  pulso: Cuerpo;
  secu: Cuerpo;
  mundo: {luzRed: number; espera: number};
  capa: {acLlegada: number; acAmplitud: number; esperaAvance: number; holo: number; holoSalida: number};
};

export const GUION_S01: Guion<EstadoS01> = {
  inicial: () => ({
    cam: {...CAMARAS_S01.primerPlano},
    voltio: {...CUERPO_BASE, ojo: 1, squash: -0.06, cejaAltura: -0.2, mejillas: 0.15},
    pulso: {...PULSO_ENLACE},
    // Sin +5VSB la lógica de encendido está apagada: Secu duerme con el LED apagado.
    secu: {...SECU_ENLACE, ojo: 1, led: 0, cejaAltura: -0.3},
    mundo: {luzRed: 1, espera: 0},
    capa: {acLlegada: 0, acAmplitud: 0, esperaAvance: 0, holo: 0, holoSalida: 0},
  }),
  construir: (tl, s, f, a) => {
    // — Despertar y presentación —
    tl.to(s.voltio, {ojo: 0, cejaAltura: 0.6, squash: 0.08, salto: 26, duration: f(7), ease: "power2.out"}, f(2));
    tl.to(s.voltio, {cejaAltura: 0.2, squash: 0, salto: 0, mejillas: 0.4, duration: f(10), ease: "bounce.out"}, f(9));
    tl.to(s.voltio, {brazoDer: -80, codoDer: 25, duration: f(10), ease: "back.out(2)"}, f(14));
    tl.to(s.voltio, {brazoDer: -55, duration: f(6), repeat: 4, yoyo: true, ease: "sine.inOut"}, f(24));
    tl.to(s.voltio, {brazoDer: 0, codoDer: 0, duration: f(12)}, f(56));
    tl.to(s.cam, {fov: 31, duration: f(76), ease: "sine.inOut"}, f(0));

    // — Corriente alterna desde la red (ancla "corriente alterna") —
    tl.to(s.cam, {...CAMARAS_S01.red, duration: f(40), ease: "power3.inOut"}, f(a.ac - 18));
    tl.to(s.voltio, {miradaX: 0.9, miradaY: -0.1, inclinacion: 6, duration: f(14)}, f(a.ac - 6));
    tl.to(s.capa, {acAmplitud: 1, duration: f(10)}, f(a.ac - 4));
    tl.to(s.capa, {acLlegada: 1, duration: f(40), ease: "none"}, f(a.ac - 4));
    // Al llegar la energía: sacudida y arranque del ventilador (anguloVentilador usa a.ac + 30).
    tl.to(s.voltio, {squash: 0.16, salto: 14, cejaAltura: 0.8, mejillas: 0.7, duration: f(5), ease: "power3.out"}, f(a.ac + 36));
    tl.to(s.voltio, {squash: 0, salto: 0, cejaAltura: 0.25, sonrisa: 0.5, duration: f(14), ease: "elastic.out(1, 0.4)"}, f(a.ac + 41));

    // — +5VSB: flujo continuo por el hilo morado (ancla "tensión de espera") —
    tl.to(s.cam, {...CAMARAS_S01.espera, duration: f(46), ease: "power2.inOut"}, f(a.espera - 14));
    tl.to(s.voltio, {miradaX: -0.9, inclinacion: -8, brazoIzq: 62, codoIzq: -15, duration: f(14), ease: "back.out(1.6)"}, f(a.espera - 6));
    tl.to(s.capa, {esperaAvance: 1, duration: f(80), ease: "sine.inOut"}, f(a.espera + 4));
    tl.to(s.mundo, {espera: 1, duration: f(8)}, f(a.espera + 80));
    // A02: +5VSB alimenta la lógica de encendido. Secu se enciende en espera (LED tenue, ojos entreabiertos).
    tl.to(s.secu, {led: SECU_ENLACE.led, ojo: SECU_ENLACE.ojo, cejaAltura: SECU_ENLACE.cejaAltura, salto: 10, duration: f(8), ease: "power2.out"}, f(a.espera + 84));
    tl.to(s.secu, {salto: 0, duration: f(10), ease: "bounce.out"}, f(a.espera + 92));
    tl.to(s.voltio, {brazoIzq: 0, codoIzq: 0, inclinacion: 0, sonrisa: 0.7, duration: f(12)}, f(a.espera + 82));

    // — Holograma: orden de la placa, salidas, estabilización, PWR_OK —
    tl.to(s.cam, {...CAMARAS_S01.holograma, duration: f(36), ease: "power2.inOut"}, f(a.orden - 40));
    tl.to(s.voltio, {miradaX: -0.6, miradaY: -0.45, brazoIzq: 92, codoIzq: -10, sonrisa: 0.2, duration: f(12), ease: "back.out(1.8)"}, f(a.orden - 26));
    tl.to(s.capa, {holo: 1, duration: f(14), ease: "back.out(1.4)"}, f(a.orden - 20));
    tl.to(s.voltio, {brazoDer: -55, codoDer: 30, squash: -0.08, duration: f(10), ease: "power2.out"}, f(a.principal - 4));
    tl.to(s.voltio, {brazoDer: -20, squash: 0, duration: f(14)}, f(a.principal + 10));
    tl.to(s.voltio, {cejaAltura: -0.35, cejaAngulo: 0.6, sonrisa: -0.15, ojo: 0.2, duration: f(10)}, f(a.estable - 4));
    tl.to(s.voltio, {inclinacion: 3, duration: f(4), repeat: 7, yoyo: true, ease: "sine.inOut"}, f(a.estable + 4));
    tl.to(s.voltio, {cejaAltura: 0.2, cejaAngulo: 0, ojo: 0, sonrisa: 0.3, inclinacion: 0, duration: f(12)}, f(a.estable + 50));
    tl.to(s.voltio, {salto: 30, squash: 0.12, brazoDer: -98, codoDer: -10, sonrisa: 0.85, mejillas: 0.85, cejaAltura: 0.6, duration: f(7), ease: "power2.out"}, f(a.pwr));
    tl.to(s.voltio, {salto: 0, squash: 0, duration: f(10), ease: "bounce.out"}, f(a.pwr + 7));
    tl.to(s.capa, {holoSalida: 1, duration: f(8), ease: "power2.in"}, f(590));

    // — Enlace con S02: la cámara vuela sobre el mazo hasta la placa —
    tl.to(s.voltio, {miradaX: -1, brazoDer: 0, brazoIzq: 0, codoIzq: 0, duration: f(10)}, f(582));
    tl.to(s.cam, {...CAMARA_PUENTE, duration: f(14), ease: "power3.inOut"}, f(duracionEscena("S01") - 15));
  },
};
