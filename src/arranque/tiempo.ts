/** Segundos de storyboard globales; los intervalos en frames son [inicio, fin). */
export const FPS = 30;
export const DURACION_OBJETIVO_S = 9000 / FPS;
export const DURACION_MAXIMA_S = 360;

export function segundosAFrames(segundos: number): number {
  if (!Number.isFinite(segundos) || segundos < 0) {
    throw new RangeError("Los segundos deben ser finitos y no negativos.");
  }
  return Math.round(segundos * FPS);
}

/** §9.1: mismo orden y contenido; montaje con voces reales, cap 10940000/3000000 s (RNF-10). */
export const STORYBOARD = [
  {id: "S01", nombre: "Fuente ATX", inicioSegundos: 0 / FPS, finSegundos: 600 / FPS},
  {id: "S02", nombre: "Botón y encendido", inicioSegundos: 600 / FPS, finSegundos: 1323 / FPS},
  {id: "S03", nombre: "CPU y reset vector", inicioSegundos: 1323 / FPS, finSegundos: 2073 / FPS},
  {id: "S04", nombre: "BIOS, flash y CMOS", inicioSegundos: 2073 / FPS, finSegundos: 2961 / FPS},
  {id: "S05", nombre: "POST, SPD y SDRAM", inicioSegundos: 2961 / FPS, finSegundos: 4227 / FPS},
  {id: "S06", nombre: "Periféricos y estructuras BIOS", inicioSegundos: 4227 / FPS, finSegundos: 4970 / FPS},
  {id: "S07", nombre: "Orden de arranque e INT 19h", inicioSegundos: 4970 / FPS, finSegundos: 5705 / FPS},
  {id: "S08", nombre: "INT 13h y lectura de sector", inicioSegundos: 5705 / FPS, finSegundos: 6322 / FPS},
  {id: "S09", nombre: "MBR y sus campos", inicioSegundos: 6322 / FPS, finSegundos: 7061 / FPS},
  {id: "S10", nombre: "GRUB Legacy", inicioSegundos: 7061 / FPS, finSegundos: 7763 / FPS},
  {id: "S11", nombre: "Preparación y entrada al kernel", inicioSegundos: 7763 / FPS, finSegundos: 8400 / FPS},
  {id: "S12", nombre: "Linux y PID 1", inicioSegundos: 8400 / FPS, finSegundos: 9000 / FPS},
] as const;

export type EscenaId = (typeof STORYBOARD)[number]["id"];
export type IntervaloFrames = {inicioFrame: number; finFrame: number};

/** Edad de un estado heredado, con origen en la escena que lo introdujo. */
export function desfaseEscenas(actual: EscenaId, origen: EscenaId): number {
  const a = STORYBOARD.find(e => e.id === actual)!;
  const b = STORYBOARD.find(e => e.id === origen)!;
  return segundosAFrames(a.inicioSegundos - b.inicioSegundos);
}
