import type {ExpresionMascota} from "../mascotas/catalogo.ts";
import type {CueDialogo} from "./dialogo.ts";
import {FPS} from "./tiempo.ts";

/** Forma compatible con Caption sin importar paquetes transitivos. */
export type Caption = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
  pageBreakAfter?: boolean;
};

export type SegmentoSubtitulo = {texto: string; inicioFrame: number; finFrame: number};
type Frase = {texto: string; peso: number; finOracion: boolean};

/** Heurística de longitud locutada; el alineado real sustituye esta estimación. */
function pesoLocucion(texto: string): number {
  return Math.max(1, texto
    .replace(/ATX/g, "a te equis")
    .replace(/PWR_OK/g, "power ok")
    .replace(/PS_ON#/g, "pe ese on negada")
    .replace(/CPU/g, "ce pe u")
    .replace(/Pentium II/g, "Pentium dos")
    .replace(/FFFFFFF0/g, "siete efes, cero")
    .trim().length);
}

const MAX_LINEA = 42;

/** Ajuste voraz a líneas de MAX_LINEA; corta tokens más largos que una línea. */
function ajustarLineas(texto: string): string[] {
  const lineas: string[] = [];
  let linea = "";
  for (const palabra of texto.split(/\s+/).filter(Boolean)) {
    for (const trozo of palabra.match(new RegExp(`.{1,${MAX_LINEA}}`, "g")) || []) {
      if (linea && linea.length + 1 + trozo.length > MAX_LINEA) {
        lineas.push(linea);
        linea = "";
      }
      linea += (linea ? " " : "") + trozo;
    }
  }
  if (linea) lineas.push(linea);
  return lineas;
}

const cabe = (texto: string) => ajustarLineas(texto).length <= 2;

/** Dos líneas de longitud parecida en vez de una línea llena y una huérfana. */
function lineasEquilibradas(texto: string): string[] {
  const voraz = ajustarLineas(texto);
  if (voraz.length !== 2) return voraz;
  const palabras = texto.split(/\s+/).filter(Boolean);
  let mejor = voraz;
  for (let i = 1; i < palabras.length; i++) {
    const a = palabras.slice(0, i).join(" ");
    const b = palabras.slice(i).join(" ");
    if (a.length > MAX_LINEA || b.length > MAX_LINEA) continue;
    const coste = (x: string[]) => Math.max(x[0].length, x[1].length) + (terminaEnAtona(x[0]) ? 30 : 0);
    if (coste([a, b]) < coste(mejor)) mejor = [a, b];
  }
  return mejor;
}

/** Buen punto de corte: antes de un nexo o de un artículo que abre sintagma. */
const NEXOS = new Set(["y", "e", "o", "que", "mediante", "con", "para", "hasta", "en"]);
const ARTICULOS = new Set(["un", "una", "el", "la", "los", "las"]);
const bonoCorte = (palabra: string) => NEXOS.has(palabra.toLowerCase()) ? 35 : ARTICULOS.has(palabra.toLowerCase()) ? 10 : 0;
/** Palabras átonas que no deben quedar al final de una línea o bloque. */
const ATONAS = new Set(["un", "una", "el", "la", "los", "las", "de", "del", "al", "a", "en", "y", "e", "o", "que", "con", "mi", "mis", "su"]);
const terminaEnAtona = (texto: string) => ATONAS.has((texto.split(" ").pop() || "").toLowerCase());

/** Reparte palabras en bloques de longitud similar (evita colas de una palabra). */
function bloquesEquilibrados(texto: string): string[] {
  const palabras = texto.split(/\s+/).filter(Boolean);
  // Dos bloques: equilibrio, con preferencia por cortar antes de un nexo.
  let mejor: string[] | null = null;
  let mejorCoste = Infinity;
  for (let i = 1; i < palabras.length; i++) {
    const a = palabras.slice(0, i).join(" ");
    const b = palabras.slice(i).join(" ");
    if (!cabe(a) || !cabe(b)) continue;
    const coste = Math.abs(a.length - b.length) - bonoCorte(palabras[i]) + (terminaEnAtona(a) ? 30 : 0);
    if (coste < mejorCoste) {
      mejorCoste = coste;
      mejor = [a, b];
    }
  }
  if (mejor) return mejor;
  for (let n = 3; n <= palabras.length; n++) {
    const objetivo = texto.length / n;
    const bloques: string[] = [];
    let actual = "";
    for (const palabra of palabras) {
      const candidato = actual ? `${actual} ${palabra}` : palabra;
      if (actual && candidato.length > objetivo && bloques.length < n - 1) {
        bloques.push(actual);
        actual = palabra;
      } else {
        actual = candidato;
      }
    }
    bloques.push(actual);
    if (bloques.every(cabe)) return bloques;
  }
  return palabras;
}

/**
 * Subtítulos de máximo dos líneas: una oración completa si cabe; si no,
 * cláusulas (comas, punto y coma, dos puntos) agrupadas; y solo si una
 * cláusula no cabe, bloques de palabras equilibrados.
 */
function frasesVisibles(texto: string): Frase[] {
  const frases: Frase[] = [];
  const oraciones = texto.match(/[^.!?]+[.!?]?/g) || [];
  for (const bruta of oraciones) {
    const oracion = bruta.trim();
    if (!oracion) continue;
    const bloques: string[] = [];
    if (cabe(oracion)) {
      bloques.push(oracion);
    } else {
      let actual = "";
      for (const clausula of (oracion.match(/[^,;:]+[,;:]?/g) || []).map((c) => c.trim()).filter(Boolean)) {
        const candidato = actual ? `${actual} ${clausula}` : clausula;
        if (cabe(candidato)) {
          actual = candidato;
          continue;
        }
        if (actual) bloques.push(actual);
        actual = clausula;
        if (!cabe(actual)) {
          bloques.push(...bloquesEquilibrados(actual));
          actual = "";
        }
      }
      if (actual) bloques.push(actual);
    }
    bloques.forEach((bloque, i) => {
      frases.push({texto: lineasEquilibradas(bloque).join("\n"), peso: pesoLocucion(bloque), finOracion: i === bloques.length - 1 && /[.!?]$/.test(oracion)});
    });
  }
  return frases;
}

/** Estimación proporcional con 6 frames de silencio al final de cada oración. */
export function estimarSubtitulos(cue: CueDialogo): SegmentoSubtitulo[] {
  const frases = frasesVisibles(cue.displayText);
  if (frases.length === 0) return [];
  const pausas = frases.slice(0, -1).filter((frase) => frase.finOracion).length * 6;
  const disponibles = cue.durationFrames - pausas;
  if (!Number.isInteger(disponibles) || disponibles < frases.length) {
    throw new RangeError("Duración insuficiente para frases y pausas.");
  }
  const pesoTotal = frases.reduce((total, frase) => total + frase.peso, 0);
  // Un frame mínimo por frase; repartir el resto evita segmentos de duración 0.
  const repartibles = disponibles - frases.length;
  let pesoAcumulado = 0;
  let cursor = cue.startFrame;
  return frases.map((frase, indice) => {
    const anterior = Math.round(repartibles * pesoAcumulado / pesoTotal);
    pesoAcumulado += frase.peso;
    const duracion = 1 + Math.round(repartibles * pesoAcumulado / pesoTotal) - anterior;
    const segmento = {texto: frase.texto, inicioFrame: cursor, finFrame: cursor + duracion};
    cursor += duracion + (frase.finOracion && indice < frases.length - 1 ? 6 : 0);
    return segmento;
  });
}

/**
 * Timestamps relativos al archivo de voz (0 = inicio del cue), nunca globales.
 * Mantiene las frases de displayText aunque el alineado contenga la locución
 * fonética. Proyecta longitudes relativas sobre palabras o frases alineadas.
 * Un hueco de alineación divide el intervalo y conserva el mismo texto visible;
 * así la expresión vuelve a neutral/alerta durante cada silencio conocido.
 * Para sincronía fonética exacta hará falta revisar el alineado real de la voz.
 */
export function adaptarAlineacion(cue: CueDialogo, alineacion: readonly Caption[]): SegmentoSubtitulo[] {
  let finAnterior = 0;
  for (const caption of alineacion) {
    if (!Number.isFinite(caption.startMs) || !Number.isFinite(caption.endMs) || caption.startMs < finAnterior || caption.endMs <= caption.startMs || caption.endMs > cue.durationFrames * 1000 / FPS) {
      throw new RangeError("Alineación desordenada o fuera de la duración del cue.");
    }
    finAnterior = caption.endMs;
  }
  const captions = alineacion.filter((caption) => caption.text.trim().length > 0);
  if (captions.length === 0) return [];
  const frases = frasesVisibles(cue.displayText);
  const pesoTotal = frases.reduce((total, frase) => total + frase.peso, 0);
  const pesoAlineado = captions.reduce((total, caption) => total + caption.text.trim().length, 0);
  const segmentos: SegmentoSubtitulo[] = [];
  let pesoFrase = 0;
  for (const frase of frases) {
    const inicio = pesoFrase / pesoTotal;
    pesoFrase += frase.peso;
    const fin = pesoFrase / pesoTotal;
    let pesoCaption = 0;
    for (const caption of captions) {
      const inicioCaption = pesoCaption / pesoAlineado;
      pesoCaption += caption.text.trim().length;
      const finCaption = pesoCaption / pesoAlineado;
      const desde = Math.max(inicio, inicioCaption);
      const hasta = Math.min(fin, finCaption);
      if (desde >= hasta) continue;
      const duracionMs = caption.endMs - caption.startMs;
      const inicioMs = caption.startMs + (desde - inicioCaption) / (finCaption - inicioCaption) * duracionMs;
      const finMs = caption.startMs + (hasta - inicioCaption) / (finCaption - inicioCaption) * duracionMs;
      const inicioFrame = cue.startFrame + Math.round(inicioMs * FPS / 1000);
      const finFrame = cue.startFrame + Math.round(finMs * FPS / 1000);
      if (finFrame <= inicioFrame) continue;
      const anterior = segmentos[segmentos.length - 1];
      if (anterior && anterior.texto === frase.texto && anterior.finFrame === inicioFrame) anterior.finFrame = finFrame;
      else segmentos.push({texto: frase.texto, inicioFrame, finFrame});
    }
  }
  return segmentos;
}

/** null/undefined = estimar; [] = alineación sin habla. */
export function segmentosDeCue(cue: CueDialogo, alineacion?: readonly Caption[] | null): SegmentoSubtitulo[] {
  return alineacion == null ? estimarSubtitulos(cue) : adaptarAlineacion(cue, alineacion);
}

export function estaHablando(cue: CueDialogo, segmentos: readonly SegmentoSubtitulo[], frameEscena: number): boolean {
  return frameEscena >= cue.startFrame && frameEscena < cue.startFrame + cue.durationFrames && segmentos.some((segmento) => frameEscena >= segmento.inicioFrame && frameEscena < segmento.finFrame);
}

export function expresionEnFrame(cue: CueDialogo, segmentos: readonly SegmentoSubtitulo[], frameEscena: number, expresionBase: "neutral" | "alerta" = "neutral"): ExpresionMascota {
  return estaHablando(cue, segmentos, frameEscena) ? "hablando" : expresionBase;
}
