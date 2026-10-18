import {PerspectiveCamera, Vector3} from "three";

/**
 * Mundo compartido por S01 y S02: una placa base ATX de 1998 vista por dentro
 * del gabinete. Unidades arbitrarias; la placa ocupa y = 0. La fuente (Voltio)
 * queda a la derecha, fuera de la placa, unida por el conector ATX de 20 pines.
 * Mantener un único mundo garantiza la continuidad espacial entre escenas.
 */
export type Punto3D = readonly [number, number, number];

export const ANCHO = 1920;
export const ALTO = 1080;

export const LUGARES = {
  // Placa base
  placaCentro: [0, 0, 0],
  panelFrontal: [-6.4, 0, 2.6],
  pulso: [-7.7, 0, 2.9],
  secu: [-2.6, 0, 1.6],
  ledEspera: [-3.7, 0, 2.7],
  conectorAtx: [5.0, 0, 1.6],
  cristalReloj: [-0.6, 0, -1.2],
  slotCpu: [1.6, 0, -2.6],
  cpu: [1.6, 1.1, -2.6],
  chipset: [3.6, 0, -0.4],
  romi: [-1.2, 0.12, 3.8],
  bios: [0.1, 0.12, 2.0],
  cmosi: [1.4, 0.12, 3.6],
  postin: [3.6, 0.17, -1.4],
  spedi: [5.9, 1.5, -0.6],
  rami: [5.9, 0.3, -2.4],
  disqui: [10.2, 1.0, -2.0],
  // Exterior de la placa: fuente y red eléctrica
  voltio: [10.6, 0, 1.4],
  enchufe: [16.5, 0.9, -3.6],
} as const satisfies Record<string, Punto3D>;

export type Camara = {px: number; py: number; pz: number; tx: number; ty: number; tz: number; fov: number};

/** Cámara de cierre de S01 = cámara de apertura de S02 (continuidad). */
export const CAMARA_PUENTE: Camara = {px: 1.2, py: 8.4, pz: 11.2, tx: -0.6, ty: 0, tz: 0.4, fov: 40};

export function crearCamara(c: Camara): PerspectiveCamera {
  const camara = new PerspectiveCamera(c.fov, ANCHO / ALTO, 0.1, 400);
  aplicarCamara(camara, c);
  return camara;
}

export function aplicarCamara(camara: PerspectiveCamera, c: Camara): void {
  camara.fov = c.fov;
  camara.aspect = ANCHO / ALTO;
  camara.position.set(c.px, c.py, c.pz);
  camara.lookAt(c.tx, c.ty, c.tz);
  camara.updateProjectionMatrix();
  camara.updateMatrixWorld(true);
}

export type PuntoPantalla = {x: number; y: number; profundidad: number; escala: number};

/**
 * Proyecta un punto del mundo a píxeles de la composición. `escala` es el
 * tamaño aparente de una unidad del mundo en píxeles a esa profundidad:
 * permite que los personajes 2D se apoyen sobre la placa 3D con perspectiva.
 */
export function proyectar(camara: PerspectiveCamera, p: Punto3D): PuntoPantalla {
  const v = new Vector3(p[0], p[1], p[2]).project(camara);
  const distancia = camara.position.distanceTo(new Vector3(p[0], p[1], p[2]));
  const altoVisible = 2 * Math.tan((camara.fov * Math.PI) / 360) * distancia;
  return {
    x: ((v.x + 1) / 2) * ANCHO,
    y: ((1 - v.y) / 2) * ALTO,
    profundidad: distancia,
    escala: ALTO / altoVisible,
  };
}

export function mover(p: Punto3D, dx: number, dy: number, dz: number): Punto3D {
  return [p[0] + dx, p[1] + dy, p[2] + dz];
}
