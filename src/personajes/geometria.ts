import type { Boca } from "./poses.ts";
import { interpolar, limitar } from "./poses.ts";
import type { Brazo, Punto, Rig } from "./tipos.ts";

const puntoEntre = (a: Punto, b: Punto, t: number): Punto => ({ x: interpolar(a.x, b.x, t), y: interpolar(a.y, b.y, t) });
const coordenadas = (p: Punto): string => `${p.x} ${p.y}`;

export function girarPunto(p: Punto, centro: Punto, grados: number): Punto {
  const angulo = grados * Math.PI / 180;
  return {
    x: centro.x + (p.x - centro.x) * Math.cos(angulo) - (p.y - centro.y) * Math.sin(angulo),
    y: centro.y + (p.x - centro.x) * Math.sin(angulo) + (p.y - centro.y) * Math.cos(angulo),
  };
}

/**
 * Alcance del brazo según cuánto se levanta: en reposo conserva la forma
 * original; al alzarse se alarga hasta 1.6 veces para que el gesto se lea por
 * encima del cuerpo (los hombros del diseño original quedan dentro del torso).
 */
export function alcanceBrazo(giro: number): number {
  const t = limitar((Math.abs(giro) - 20) / 60);
  return 1 + 0.6 * t * t * (3 - 2 * t);
}

/**
 * Brazo con la forma original en reposo. Al levantarse se construye de forma
 * paramétrica: sale del hombro hacia fuera (como el diseño original) y se
 * curva hacia la mano, con el codo hacia el exterior; así nunca cruza la
 * cara. Cerca de 0° ambas formas se mezclan para que no haya saltos.
 */
export function geometriaBrazo(brazo: Brazo, giro: number, codo: number) {
  if (giro === 0 && codo === 0) return { d: brazo.d, mano: { x: brazo.mano.cx, y: brazo.mano.cy } };
  const s = brazo.inicio;
  // Curva original rotada (comportamiento de partida, válido para giros pequeños).
  const centro = {
    x: (s.x + 3 * brazo.control1.x + 3 * brazo.control2.x + brazo.fin.x) / 8,
    y: (s.y + 3 * brazo.control1.y + 3 * brazo.control2.y + brazo.fin.y) / 8,
  };
  const rotar = (p: Punto) => girarPunto(p, s, giro);
  const doblar = (p: Punto) => rotar(girarPunto(p, centro, codo));
  const original = { c1: rotar(brazo.control1), c2: doblar(brazo.control2), fin: doblar(brazo.fin), mano: doblar({ x: brazo.mano.cx, y: brazo.mano.cy }) };
  // Brazo paramétrico: dirección de salida horizontal del diseño y mano a la distancia de alcance.
  const largo = Math.hypot(brazo.fin.x - s.x, brazo.fin.y - s.y) * alcanceBrazo(giro);
  const reposo = Math.atan2(brazo.fin.y - s.y, brazo.fin.x - s.x);
  const angulo = reposo + (giro + codo * 0.3) * Math.PI / 180;
  const salida = Math.sign(brazo.control1.x - s.x) || 1;
  const fin = { x: s.x + Math.cos(angulo) * largo, y: s.y + Math.sin(angulo) * largo };
  const c1 = { x: s.x + salida * largo * 0.55, y: s.y - largo * 0.05 };
  const c2 = { x: fin.x + salida * largo * (0.18 + codo / 300), y: fin.y + largo * 0.25 };
  const desplazManoX = brazo.mano.cx - brazo.fin.x;
  const desplazManoY = brazo.mano.cy - brazo.fin.y;
  const mano = { x: fin.x + desplazManoX * Math.cos(angulo - reposo) - desplazManoY * Math.sin(angulo - reposo), y: fin.y + desplazManoX * Math.sin(angulo - reposo) + desplazManoY * Math.cos(angulo - reposo) };
  const t = limitar((Math.abs(giro) - 10) / 30);
  const m = t * t * (3 - 2 * t);
  const mezcla = (a: Punto, b: Punto) => puntoEntre(a, b, m);
  const pc1 = mezcla(original.c1, c1);
  const pc2 = mezcla(original.c2, c2);
  const pfin = mezcla(original.fin, fin);
  return {
    d: `M${coordenadas(s)} C${coordenadas(pc1)} ${coordenadas(pc2)} ${coordenadas(pfin)}`,
    mano: mezcla(original.mano, mano),
  };
}

/** Cuatro cúbicas: una sonrisa de área cero se convierte gradualmente en elipse. */
export function geometriaBoca(rig: Rig, boca: Boca) {
  const apertura = limitar(boca.apertura);
  const ancho = limitar(boca.ancho);
  const redondez = limitar(boca.redondez);
  const sonrisa = limitar(boca.sonrisa, -1, 1);
  const neutral = rig.boca;
  const centroX = (neutral.inicio.x + neutral.fin.x) / 2;
  const escala = 0.6 + ancho * 0.8;
  const inicio = { x: centroX + (neutral.inicio.x - centroX) * escala, y: neutral.inicio.y };
  const fin = { x: centroX + (neutral.fin.x - centroX) * escala, y: neutral.fin.y };
  const control = { x: neutral.control.x, y: neutral.control.y + sonrisa * (sonrisa < 0 ? 64 : 18) };
  const mitad1 = puntoEntre(inicio, control, 0.5);
  const mitad2 = puntoEntre(control, fin, 0.5);
  const medio = puntoEntre(mitad1, mitad2, 0.5);
  const cubica = (a: Punto, c: Punto, b: Punto) => [puntoEntre(a, c, 2 / 3), puntoEntre(b, c, 2 / 3), b];
  const cerrado = [inicio, ...cubica(inicio, mitad1, medio), ...cubica(medio, mitad2, fin), ...cubica(fin, mitad2, medio), ...cubica(medio, mitad1, inicio)];
  const referencia = rig.hablando.boca;
  const aviso = rig.alerta.boca;
  const rx = interpolar(referencia.rx, aviso.rx, redondez) * (0.6 + ancho * 0.9);
  const ry = interpolar(referencia.ry, aviso.ry, redondez) * (0.7 + redondez * 0.6);
  const cx = interpolar(referencia.cx, aviso.cx, redondez);
  const cy = interpolar(referencia.cy, aviso.cy, redondez);
  const k = 0.5522847498307936;
  const abierto: Punto[] = [
    { x: cx - rx, y: cy }, { x: cx - rx, y: cy - k * ry }, { x: cx - k * rx, y: cy - ry }, { x: cx, y: cy - ry },
    { x: cx + k * rx, y: cy - ry }, { x: cx + rx, y: cy - k * ry }, { x: cx + rx, y: cy },
    { x: cx + rx, y: cy + k * ry }, { x: cx + k * rx, y: cy + ry }, { x: cx, y: cy + ry },
    { x: cx - k * rx, y: cy + ry }, { x: cx - rx, y: cy + k * ry }, { x: cx - rx, y: cy },
  ];
  const puntos = cerrado.map((p, i) => puntoEntre(p, abierto[i], apertura));
  let d = `M${coordenadas(puntos[0])}`;
  for (let i = 1; i < puntos.length; i += 3) d += ` C${coordenadas(puntos[i])} ${coordenadas(puntos[i + 1])} ${coordenadas(puntos[i + 2])}`;
  d += " Z";
  if (apertura === 0) {
    d = sonrisa === 0 && ancho === 0.5 ? neutral.d : `M${coordenadas(inicio)} Q${coordenadas(control)} ${coordenadas(fin)}`;
  }
  const lengua = rig.hablando.lengua;
  const escalarLengua = (p: Punto) => ({ x: cx + (p.x - cx) * rx / referencia.rx, y: cy + (p.y - cy) * ry / referencia.ry });
  return {
    d, grosor: interpolar(neutral.grosor, referencia.trazo?.grosor ?? 5, apertura),
    relleno: apertura === 0 ? "none" : referencia.color,
    lengua: `M${coordenadas(escalarLengua(lengua.inicio))} Q${coordenadas(escalarLengua(lengua.control))} ${coordenadas(escalarLengua(lengua.fin))}`,
    opacidadLengua: apertura * apertura,
  };
}
