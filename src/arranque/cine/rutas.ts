import type {Punto3D} from "./mundo.ts";

/** Chips que intervienen en la primera búsqueda: puente norte, puente sur y flash paralela (§1.2, §6.3). */
export const CHIPS_FIRMWARE: {nombre: "norte" | "sur" | "flash"; etiqueta: string; p: Punto3D; t: readonly [number, number]; alto: number; color: string}[] = [
  {nombre: "norte", etiqueta: "82443BX", p: [3.6, 0, -0.4], t: [1.3, 1.3], alto: 0.17, color: "#7CC8FF"},
  {nombre: "sur", etiqueta: "PIIX4E", p: [1.4, 0, 3.6], t: [1.1, 1.1], alto: 0.12, color: "#7CC8FF"},
  {nombre: "flash", etiqueta: "Flash 4 Mbit", p: [-1.2, 0, 3.8], t: [0.9, 0.5], alto: 0.12, color: "#A49BD9"},
];

/** Recorrido de la primera búsqueda: Slot 1 → 82443BX (FSB) → PIIX4E → flash del BIOS. */
export const RUTA_FIRMWARE: readonly Punto3D[] = [
  [2.4, 0.02, -2.25], [3.1, 0.02, -1.5], [3.45, 0.02, -0.9],
  [3.5, 0.02, 0.3], [2.3, 0.02, 1.9], [1.6, 0.02, 3.0],
  [0.8, 0.02, 3.65], [-0.2, 0.02, 3.8], [-0.7, 0.02, 3.8],
];

/**
 * Recorte de una ruta del mundo hasta la fracción t de su longitud (0..1).
 * Se mide en el mundo, no en pantalla, para que los tiempos de llegada a cada
 * chip no dependan del encuadre.
 */
export function recorteDeRuta(ruta: readonly Punto3D[], t: number): Punto3D[] {
  const largos = ruta.slice(1).map((b, i) => Math.hypot(b[0] - ruta[i][0], b[1] - ruta[i][1], b[2] - ruta[i][2]));
  const total = largos.reduce((x, y) => x + y, 0);
  let resto = Math.max(0, Math.min(1, t)) * total;
  const salida: Punto3D[] = [ruta[0]];
  for (let i = 0; i < largos.length; i++) {
    const a = ruta[i];
    const b = ruta[i + 1];
    if (resto >= largos[i]) {
      salida.push(b);
      resto -= largos[i];
      continue;
    }
    const u = largos[i] === 0 ? 0 : resto / largos[i];
    salida.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]);
    break;
  }
  return salida;
}

/** Punto de la ruta en la fracción t de su longitud en el mundo. */
export function puntoDeRuta(ruta: readonly Punto3D[], t: number): Punto3D {
  const recorte = recorteDeRuta(ruta, t);
  return recorte[recorte.length - 1];
}
