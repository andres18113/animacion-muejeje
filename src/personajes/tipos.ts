import type { MascotaId } from "../mascotas/catalogo.ts";

export type Punto = { x: number; y: number };
export type Trazo = { color: string; grosor: number; remate: string; union: string };
export type Curva = Trazo & { d: string; inicio: Punto; control: Punto; fin: Punto };
export type Elipse = { cx: number; cy: number; rx: number; ry: number; color: string; opacidad: number; trazo: Trazo | null };
export type Circulo = { cx: number; cy: number; r: number; color: string; trazo: Trazo | null };
export type Brazo = Trazo & { d: string; inicio: Punto; control1: Punto; control2: Punto; fin: Punto; mano: Circulo };
export type Parte = { markup: string; transformacion: string; centro: Punto };
export type CapaCuerpo = { tipo: "estatico" | "ventilador" | "boton" | "led"; markup: string };
export type Rig = {
  id: MascotaId;
  sombra: Elipse;
  piernas: (Trazo & { d: string; inicio: Punto; fin: Punto })[];
  pies: Elipse[];
  brazos: Brazo[];
  cuerpo: string;
  capasCuerpo: CapaCuerpo[];
  partes: { ventilador?: Parte; boton?: Parte; led?: Parte };
  rostro: { transformacion: string; desplazamiento: Punto };
  ojos: { blanco: Elipse; pupila: Elipse; brillo: Circulo }[];
  cejas: Curva[];
  mejillas: Elipse[];
  boca: Curva;
  hablando: { boca: Elipse; lengua: Curva };
  alerta: { boca: Elipse; cejas: Curva[] };
};
