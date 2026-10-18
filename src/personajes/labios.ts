import type { CueDialogo } from "../arranque/dialogo.ts";
import type { SegmentoSubtitulo } from "../arranque/subtitulos.ts";
import type { Boca } from "./poses.ts";
import { limitar, POSE_BASE } from "./poses.ts";

export type AlineacionCaracteres = {
  characters: readonly string[];
  character_start_times_seconds: readonly number[];
  character_end_times_seconds: readonly number[];
};

/** Aproximación ortográfica española; sin voz, no equivale a fonemas medidos. */
export function visemaDeCaracter(caracter: string): Boca {
  const letra = caracter.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const forma = (apertura: number, ancho: number, redondez: number): Boca => ({ apertura, ancho, redondez, sonrisa: 0 });
  if (letra === "a") return forma(0.9, 0.65, 0.3);
  if (letra === "e") return forma(0.55, 0.8, 0.15);
  if (letra === "i" || letra === "y") return forma(0.3, 1, 0.05);
  if (letra === "o") return forma(0.75, 0.25, 0.95);
  if (letra === "u") return forma(0.45, 0.1, 1);
  if (/^[mbp]$/.test(letra)) return { ...POSE_BASE.boca };
  if (/^[fv]$/.test(letra)) return forma(0.15, 0.65, 0.05);
  if (/^[lndtñ]$/.test(letra)) return forma(0.35, 0.6, 0.2);
  if (/^[scz]$/.test(letra)) return forma(0.2, 0.85, 0.05);
  if (letra === "r") return forma(0.4, 0.6, 0.35);
  if (/^[kgqjxw]$/.test(letra)) return forma(0.4, 0.55, 0.3);
  return { ...POSE_BASE.boca };
}

type Intervalo = { inicio: number; fin: number };
type Evento = Intervalo & { boca: Boca };
const suave = (t: number) => {
  const x = limitar(t);
  return x * x * (3 - 2 * x);
};
function unirIntervalos(intervalos: Intervalo[]): Intervalo[] {
  const salida: Intervalo[] = [];
  for (const intervalo of intervalos.sort((a, b) => a.inicio - b.inicio)) {
    const anterior = salida[salida.length - 1];
    if (anterior && intervalo.inicio <= anterior.fin + 1e-7) anterior.fin = Math.max(anterior.fin, intervalo.fin);
    else salida.push({ ...intervalo });
  }
  return salida;
}

/** frame y segmentos relativos a la escena; alineación relativa al inicio del cue. */
export function bocaEnFrame({ cue, segmentos, frame, fps, alineacion }: {
  cue: CueDialogo;
  segmentos: readonly SegmentoSubtitulo[];
  frame: number;
  fps: number;
  alineacion?: AlineacionCaracteres | null;
}): Boca {
  if (!Number.isFinite(fps) || fps <= 0 || !Number.isFinite(frame)) throw new RangeError("Frame/fps inválido");
  if (cue.rampaLabialFrames !== undefined && (!Number.isFinite(cue.rampaLabialFrames) || cue.rampaLabialFrames <= 0)) throw new RangeError("Rampa labial debe ser finita y positiva");
  const cerrada = { ...POSE_BASE.boca };
  const tramos = unirIntervalos(segmentos.map((s) => ({ inicio: Math.max(cue.startFrame, s.inicioFrame), fin: Math.min(cue.startFrame + cue.durationFrames, s.finFrame) })).filter((s) => s.fin > s.inicio));
  const tramo = tramos.find((s) => frame >= s.inicio && frame < s.fin);
  if (!tramo) return cerrada;
  const eventos: Evento[] = [];
  if (alineacion != null) {
    const { characters, character_start_times_seconds: inicios, character_end_times_seconds: fines } = alineacion;
    if (characters.length !== inicios.length || characters.length !== fines.length) throw new RangeError("Alineación: longitudes distintas");
    let finAnterior = 0;
    characters.forEach((caracter, i) => {
      if (!Number.isFinite(inicios[i]) || !Number.isFinite(fines[i]) || inicios[i] < finAnterior || fines[i] < inicios[i] || fines[i] * fps > cue.durationFrames + 1e-7) throw new RangeError("Alineación desordenada o fuera del cue");
      finAnterior = fines[i];
      if (fines[i] > inicios[i]) eventos.push({ inicio: cue.startFrame + inicios[i] * fps, fin: cue.startFrame + fines[i] * fps, boca: visemaDeCaracter(caracter) });
    });
  } else {
    const caracteres = Array.from(cue.speechText);
    const duracion = tramos.reduce((suma, s) => suma + s.fin - s.inicio, 0);
    let transcurrido = 0;
    for (const s of tramos) {
      const longitud = s.fin - s.inicio;
      for (let i = 0; i < caracteres.length; i++) {
        const desde = Math.max(transcurrido, i * duracion / caracteres.length);
        const hasta = Math.min(transcurrido + longitud, (i + 1) * duracion / caracteres.length);
        if (hasta > desde) eventos.push({ inicio: s.inicio + desde - transcurrido, fin: s.inicio + hasta - transcurrido, boca: visemaDeCaracter(caracteres[i]) });
      }
      transcurrido += longitud;
    }
  }
  // Ventana suave de dos frames: integra los visemas vecinos incluso cuando un
  // carácter dura menos de dos frames. No depende del orden de renderizado.
  const radio = Math.max(0.5, fps / 30);
  const cdf = (x: number) => suave((x + radio) / (2 * radio));
  const resultado = { ...cerrada };
  for (const evento of eventos) {
    const inicio = Math.max(evento.inicio, tramo.inicio);
    const fin = Math.min(evento.fin, tramo.fin);
    if (fin <= inicio) continue;
    const peso = cdf(fin - frame) - cdf(inicio - frame);
    for (const clave of ["apertura", "ancho", "redondez", "sonrisa"] as const) resultado[clave] += (evento.boca[clave] - cerrada[clave]) * peso;
  }
  const islas = unirIntervalos(eventos.map((e) => ({ inicio: Math.max(e.inicio, tramo.inicio), fin: Math.min(e.fin, tramo.fin) })).filter((e) => e.fin > e.inicio));
  const isla = islas.find((s) => frame >= s.inicio && frame < s.fin);
  if (!isla) return cerrada;
  const envolvente = suave(Math.min(frame - isla.inicio, isla.fin - frame) / (cue.rampaLabialFrames ?? radio));
  for (const clave of ["apertura", "ancho", "redondez", "sonrisa"] as const) resultado[clave] = cerrada[clave] + (resultado[clave] - cerrada[clave]) * envolvente;
  return {
    apertura: limitar(resultado.apertura), ancho: limitar(resultado.ancho),
    redondez: limitar(resultado.redondez), sonrisa: limitar(resultado.sonrisa, -1, 1),
  };
}

function hashSemilla(semilla: string | number): number {
  let estado = 2166136261;
  for (const letra of String(semilla)) estado = Math.imul(estado ^ letra.charCodeAt(0), 16777619);
  return estado >>> 0;
}
function avanzar(estado: number): number {
  return (Math.imul(1664525, estado) + 1013904223) >>> 0;
}

/** Base de 30 fps por defecto; fps opcional permite conservar el ritmo real. */
export function parpadeoEnFrame(frame: number, semilla: string | number, fps = 30): number {
  if (!Number.isFinite(frame) || frame < 0 || !Number.isFinite(fps) || fps <= 0) return 0;
  const f = frame * 30 / fps;
  let estado = avanzar(hashSemilla(semilla));
  let inicio = 75 + estado % 76;
  while (inicio <= f) {
    estado = avanzar(estado);
    const duracion = 5 + estado % 3;
    if (f < inicio + duracion) {
      const progreso = (f - inicio + 0.5) / duracion;
      return suave((1 - Math.abs(2 * progreso - 1)) * 1.25);
    }
    estado = avanzar(estado);
    inicio += 75 + estado % 76;
  }
  return 0;
}

export function respiracionEnFrame(frame: number, semilla: string | number, fps = 30): number {
  const hash = hashSemilla(semilla);
  const periodo = 3.1 + (hash % 120) / 100;
  return (1 + Math.sin(frame / fps * 2 * Math.PI / periodo + (hash % 628) / 100)) / 2;
}
