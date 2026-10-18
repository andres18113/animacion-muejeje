import {CAMARA_PUENTE, type Camara} from "../mundo.ts";
import {CUERPO_BASE, type Cuerpo, type Guion} from "./comun.ts";

/**
 * S02 · coreografía. Cadena causal en orden (A03–A07): pulsación → PS_ON# = 0
 * → la fuente entrega las salidas y estas se estabilizan → PWR_OK = 1 → reloj
 * → liberación de RESET → CPU habilitada. Pulso habla primero; Secu después.
 */
export const CAMARAS_S02 = {
  pulso: {px: -5.3, py: 2.6, pz: 8.9, tx: -6.0, ty: 0.75, tz: 2.0, fov: 38},
  persecucion: {px: -3.6, py: 3.4, pz: 8.9, tx: -4.4, ty: 0.55, tz: 1.6, fov: 44},
  secu: {px: -2.0, py: 2.6, pz: 7.8, tx: -2.9, ty: 0.85, tz: 1.4, fov: 37},
  conector: {px: -6.6, py: 2.4, pz: 5.4, tx: -0.32, ty: 0.6, tz: 1.6, fov: 39},
  cpu: {px: -1.0, py: 2.5, pz: 7.2, tx: -0.6, ty: 0.5, tz: -0.4, fov: 41},
  final: {px: -1.6, py: 2.6, pz: 8.2, tx: -0.2, ty: 1.0, tz: -1.0, fov: 40},
} satisfies Record<string, Camara>;

export type EstadoS02 = {
  cam: Camara;
  pulso: Cuerpo;
  secu: Cuerpo;
  mundo: {rieles: number; rizado: number; reloj: number; resetRetenido: number; cpuLista: number};
  senal: {boton: number; psOn: number; psOnHilo: number; rielesHilo: number; rielesPista: number; pwrOk: number; reset: number; analizador: number; repaso: number};
};

/** Estado de Pulso y Secu en el corte S01→S02 (S01 termina exactamente así). */
export const PULSO_ENLACE = {...CUERPO_BASE, mejillas: 0.5, sonrisa: 0.3};
// Secu ya recibe +5VSB desde S01: en espera, adormilado, LED tenue.
export const SECU_ENLACE = {...CUERPO_BASE, ojo: 0.55, cejaAltura: -0.25, led: 0.6};

export const GUION_S02: Guion<EstadoS02> = {
  inicial: () => ({
    cam: {...CAMARA_PUENTE},
    pulso: {...PULSO_ENLACE},
    secu: {...SECU_ENLACE},
    mundo: {rieles: 0, rizado: 1, reloj: 0, resetRetenido: 1, cpuLista: 0},
    senal: {boton: 0, psOn: 0, psOnHilo: 0, rielesHilo: 0, rielesPista: 0, pwrOk: 0, reset: 0, analizador: 0, repaso: 0},
  }),
  construir: (tl, s, f, a) => {
    // — Pulso se presenta —
    tl.to(s.cam, {...CAMARAS_S02.pulso, duration: f(40), ease: "power3.inOut"}, f(0));
    tl.to(s.pulso, {salto: 22, squash: 0.1, duration: f(6), ease: "power2.out", repeat: 1, yoyo: true}, f(8));
    tl.to(s.pulso, {brazoDer: -82, codoDer: 20, duration: f(10), ease: "back.out(2)"}, f(14));
    tl.to(s.pulso, {brazoDer: -58, duration: f(6), repeat: 3, yoyo: true}, f(24));
    tl.to(s.pulso, {brazoDer: 0, codoDer: 0, duration: f(10)}, f(54));
    // Anticipación y pulsación (ancla "Mi pulsación").
    tl.to(s.pulso, {squash: -0.18, salto: 0, brazoIzq: 60, brazoDer: -60, cejaAltura: -0.3, duration: f(10), ease: "power2.in"}, f(a.boton - 16));
    tl.to(s.pulso, {salto: 40, squash: 0.15, duration: f(6), ease: "power2.out"}, f(a.boton - 6));
    tl.to(s.pulso, {salto: 0, squash: -0.18, boton: 1, duration: f(4), ease: "power3.in"}, f(a.boton));
    tl.to(s.pulso, {squash: 0, boton: 0, brazoIzq: 0, brazoDer: 0, cejaAltura: 0.3, duration: f(14), ease: "elastic.out(1, 0.5)"}, f(a.boton + 6));
    tl.to(s.senal, {boton: 1, duration: f(34), ease: "power1.inOut"}, f(a.boton + 2));
    tl.to(s.pulso, {miradaX: 1, miradaY: 0.1, duration: f(12)}, f(a.boton + 12));
    tl.to(s.cam, {...CAMARAS_S02.persecucion, duration: f(50), ease: "power2.inOut"}, f(a.boton + 4));
    // Secu despierta al recibir el pulso.
    tl.to(s.secu, {ojo: 0, sorpresa: 1, cejaAltura: 1, salto: 28, squash: 0.12, led: 1, miradaX: -0.9, duration: f(6), ease: "power3.out"}, f(a.boton + 36));
    tl.to(s.secu, {salto: 0, squash: 0, duration: f(12), ease: "bounce.out"}, f(a.boton + 42));
    tl.to(s.secu, {sorpresa: 0, cejaAltura: 0.2, miradaX: 0, sonrisa: 0.4, duration: f(14)}, f(a.boton + 60));

    // — Secu se presenta —
    tl.to(s.cam, {...CAMARAS_S02.secu, duration: f(36), ease: "power2.inOut"}, f(176));
    tl.to(s.secu, {brazoIzq: 62, codoIzq: -20, duration: f(12), ease: "back.out(1.6)"}, f(196));
    tl.to(s.secu, {brazoIzq: 0, codoIzq: 0, duration: f(12)}, f(250));
    tl.to(s.pulso, {miradaX: 0.9, sonrisa: 0.5, duration: f(10)}, f(180));

    // — PS_ON# = 0 (ancla "PS_ON#"): Secu baja la línea —
    tl.to(s.cam, {...CAMARAS_S02.conector, duration: f(44), ease: "power2.inOut"}, f(a.psOn - 30));
    tl.to(s.senal, {analizador: 1, duration: f(14)}, f(a.psOn - 26));
    tl.to(s.secu, {brazoDer: -100, codoDer: -15, cejaAltura: -0.2, cejaAngulo: 0.4, sonrisa: 0, squash: 0.1, salto: 24, inclinacion: 8, duration: f(10), ease: "power2.out"}, f(a.psOn - 12));
    tl.to(s.secu, {brazoDer: 15, squash: -0.2, salto: 0, inclinacion: -6, duration: f(5), ease: "power4.in"}, f(a.psOn - 2));
    tl.to(s.secu, {squash: 0, brazoDer: 0, inclinacion: 0, miradaX: 1, miradaY: -0.2, cejaAngulo: 0, duration: f(14), ease: "elastic.out(1, 0.5)"}, f(a.psOn + 4));
    tl.to(s.senal, {psOn: 1, duration: f(30), ease: "power1.in"}, f(a.psOn));
    tl.to(s.senal, {psOnHilo: 1, duration: f(18), ease: "none"}, f(a.psOn + 30));
    // La fuente responde: las salidas llegan por los hilos naranja, rojo y amarillo.
    tl.to(s.senal, {rielesHilo: 1, duration: f(18), ease: "power1.out"}, f(a.psOn + 54));
    tl.to(s.mundo, {rieles: 1, duration: f(20)}, f(a.psOn + 62));
    tl.to(s.senal, {rielesPista: 1, duration: f(24), ease: "power1.out"}, f(a.psOn + 70));
    tl.to(s.secu, {cejaAltura: -0.35, cejaAngulo: 0.6, ojo: 0.15, sonrisa: -0.2, duration: f(10)}, f(a.psOn + 70));

    // — Espera de la confirmación: el rizado se amortigua (ancla "confirmación eléctrica") —
    tl.to(s.mundo, {rizado: 0, duration: f(a.pwr - a.psOn - 70), ease: "power2.out"}, f(a.psOn + 72));
    tl.to(s.secu, {paso: Math.PI * 6, duration: f(a.pwr - a.psOn - 76), ease: "none"}, f(a.psOn + 76));
    tl.to(s.senal, {pwrOk: 1, duration: f(30), ease: "power1.inOut"}, f(a.pwr));
    tl.to(s.secu, {ojo: 0, cejaAltura: 0.7, cejaAngulo: 0, sonrisa: 0.8, mejillas: 0.8, brazoIzq: 96, codoIzq: -20, salto: 22, duration: f(8), ease: "back.out(2)"}, f(a.pwr + 30));
    tl.to(s.secu, {salto: 0, brazoIzq: 0, codoIzq: 0, duration: f(12), ease: "bounce.out"}, f(a.pwr + 38));
    // Con alimentación estable arranca el generador de reloj (A07).
    tl.to(s.mundo, {reloj: 1, duration: f(10)}, f(a.pwr + 34));

    // — Liberación de RESET (ancla "liberación del reinicio") —
    tl.to(s.cam, {...CAMARAS_S02.cpu, duration: f(46), ease: "power2.inOut"}, f(a.reset - 34));
    tl.to(s.secu, {miradaX: 0.6, miradaY: -0.8, inclinacion: 6, brazoDer: -72, codoDer: -10, duration: f(12), ease: "back.out(1.5)"}, f(a.reset - 14));
    tl.to(s.pulso, {miradaX: 1, miradaY: -0.7, duration: f(12)}, f(a.reset - 10));
    tl.to(s.senal, {reset: 1, duration: f(26), ease: "power1.inOut"}, f(a.reset));
    tl.to(s.mundo, {resetRetenido: 0, duration: f(16), ease: "power2.in"}, f(a.reset + 26));
    tl.to(s.mundo, {cpuLista: 1, duration: f(26), ease: "power2.out"}, f(a.reset + 38));
    tl.to(s.secu, {inclinacion: 0, brazoDer: 0, codoDer: 0, sonrisa: 0.6, duration: f(14)}, f(a.reset + 30));
    tl.to(s.pulso, {salto: 30, squash: 0.12, sonrisa: 0.9, cejaAltura: 0.7, duration: f(7), ease: "power2.out", repeat: 1, yoyo: true}, f(a.reset + 44));

    // — Repaso de la secuencia mientras la cámara se acerca a la CPU (ancla "La CPU no comienza") —
    tl.to(s.cam, {...CAMARAS_S02.final, duration: f(120), ease: "power1.inOut"}, f(a.cpu));
    tl.to(s.senal, {analizador: 0.35, duration: f(30)}, f(a.cpu + 10));
    tl.to(s.senal, {repaso: 1, duration: f(96), ease: "none"}, f(a.cpu + 6));
  },
};
