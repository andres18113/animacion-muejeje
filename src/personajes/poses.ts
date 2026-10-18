export type Boca = { apertura: number; ancho: number; redondez: number; sonrisa: number };
export type Pose = {
  x: number;
  y: number;
  /** Altura del salto en unidades SVG; paso es la fase de marcha en radianes. */
  salto: number;
  /** Cambio de escala vertical: 0 = reposo, positivo estira; área constante. */
  squash: number;
  inclinacion: number;
  paso: number;
  brazoIzq: number;
  brazoDer: number;
  codoIzq: number;
  codoDer: number;
  ventilador: number;
  boton: number;
  led: number;
  ojo: number;
  mirada: { x: number; y: number };
  cejas: { altura: number; angulo: number };
  mejillas: number;
  boca: Boca;
};
export type PoseParcial = Omit<Partial<Pose>, "boca" | "mirada" | "cejas"> & {
  boca?: Partial<Boca>;
  mirada?: Partial<Pose["mirada"]>;
  cejas?: Partial<Pose["cejas"]>;
};
export type Expresion = Pick<PoseParcial, "ojo" | "mirada" | "cejas" | "mejillas" | "boca">;

export const POSE_BASE: Readonly<Pose> = {
  x: 0, y: 0, salto: 0, squash: 0, inclinacion: 0, paso: 0,
  brazoIzq: 0, brazoDer: 0, codoIzq: 0, codoDer: 0,
  ventilador: 0, boton: 0, led: 0.5,
  ojo: 0, mirada: { x: 0, y: 0 }, cejas: { altura: 0, angulo: 0 },
  mejillas: 0.25, boca: { apertura: 0, ancho: 0.5, redondez: 0.5, sonrisa: 0 },
};

export const EXPRESIONES = {
  neutral: { ojo: 0, mirada: { x: 0, y: 0 }, cejas: { altura: 0, angulo: 0 }, mejillas: 0.25, boca: { ...POSE_BASE.boca } },
  feliz: { cejas: { altura: 0.4, angulo: -0.2 }, mejillas: 0.65, boca: { sonrisa: 0.7 } },
  sorpresa: { cejas: { altura: 1, angulo: 0 }, boca: { apertura: 0.85, ancho: 0.3, redondez: 1 } },
  alerta: { cejas: { altura: 0, angulo: 1 }, boca: { apertura: 0.65, ancho: 0.1, redondez: 0.85 } },
  concentrado: { ojo: 0.25, mirada: { x: 0, y: 0.25 }, cejas: { altura: -0.35, angulo: 0.6 }, boca: { sonrisa: -0.2 } },
  preocupado: { cejas: { altura: 0.25, angulo: 0.85 }, boca: { sonrisa: -0.8 } },
  dormido: { ojo: 1, mirada: { x: 0, y: 0 }, cejas: { altura: -0.2, angulo: 0 }, boca: { apertura: 0, sonrisa: 0 } },
} satisfies Record<string, Expresion>;

export const limitar = (valor: number, minimo = 0, maximo = 1): number => Math.min(maximo, Math.max(minimo, valor));
export const interpolar = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Mezcla profunda, sin mutar entradas; los campos omitidos de b conservan a. */
export function mezclarPoses(a: PoseParcial = POSE_BASE, b: PoseParcial = {}, t = 1): Pose {
  const desde: Pose = {
    ...POSE_BASE, ...a,
    mirada: { ...POSE_BASE.mirada, ...a.mirada },
    cejas: { ...POSE_BASE.cejas, ...a.cejas },
    boca: { ...POSE_BASE.boca, ...a.boca },
  };
  const hasta: Pose = {
    ...desde, ...b,
    mirada: { ...desde.mirada, ...b.mirada },
    cejas: { ...desde.cejas, ...b.cejas },
    boca: { ...desde.boca, ...b.boca },
  };
  const mezcla = { ...desde };
  const factor = limitar(t);
  for (const clave of Object.keys(desde) as (keyof Pose)[]) {
    if (clave === "mirada" || clave === "cejas" || clave === "boca") continue;
    mezcla[clave] = interpolar(desde[clave], hasta[clave], factor);
  }
  mezcla.mirada = { x: interpolar(desde.mirada.x, hasta.mirada.x, factor), y: interpolar(desde.mirada.y, hasta.mirada.y, factor) };
  mezcla.cejas = { altura: interpolar(desde.cejas.altura, hasta.cejas.altura, factor), angulo: interpolar(desde.cejas.angulo, hasta.cejas.angulo, factor) };
  mezcla.boca = {
    apertura: interpolar(desde.boca.apertura, hasta.boca.apertura, factor),
    ancho: interpolar(desde.boca.ancho, hasta.boca.ancho, factor),
    redondez: interpolar(desde.boca.redondez, hasta.boca.redondez, factor),
    sonrisa: interpolar(desde.boca.sonrisa, hasta.boca.sonrisa, factor),
  };
  return mezcla;
}
