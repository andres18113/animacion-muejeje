import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { MASCOTAS } from "../src/mascotas/catalogo.ts";

const exigir = (condicion, mensaje) => {
  if (!condicion) throw new Error(mensaje);
};
const ATRIBUTOS = {
  svg: "xmlns viewBox width height role aria-label",
  title: "", desc: "", g: "id transform",
  ellipse: "cx cy rx ry fill opacity stroke stroke-width",
  circle: "cx cy r fill stroke stroke-width",
  path: "d fill stroke stroke-width stroke-linecap stroke-linejoin",
  rect: "x y width height rx fill stroke stroke-width",
  text: "x y text-anchor font-family font-size font-weight letter-spacing fill",
  polygon: "points fill stroke stroke-width stroke-linejoin",
};
const NUMERICOS = new Set("cx cy rx ry r x y width height opacity stroke-width font-size font-weight letter-spacing".split(" "));

// Lector del subconjunto XML de las plantillas. Conserva rangos y markup literal,
// reconoce grupos anidados y rechaza atributos/estructuras no interpretados.
function analizar(xml) {
  const pila = [];
  let raiz;
  for (const token of xml.matchAll(/<!--[\s\S]*?-->|<[^>]*>|[^<]+/g)) {
    const texto = token[0];
    if (texto.startsWith("<!--")) continue;
    if (!texto.startsWith("<")) {
      exigir(pila.length > 0 || texto.trim() === "", "Texto fuera del SVG");
      if (texto.trim()) exigir(["text", "title", "desc"].includes(pila.at(-1).tag), "Texto en grupo geométrico");
      continue;
    }
    if (texto.startsWith("</")) {
      const nodo = pila.pop();
      exigir(nodo && texto === `</${nodo.tag}>`, "Cierre XML inesperado");
      nodo.finInterior = token.index;
      nodo.fin = token.index + texto.length;
      continue;
    }
    const apertura = /^<([a-zA-Z][\w:-]*)([\s\S]*?)(\/?)>$/.exec(texto);
    exigir(apertura, `Etiqueta no admitida: ${texto}`);
    const atributos = {};
    const resto = apertura[2].replace(/([\w:-]+)\s*=\s*"([^"]*)"/g, (_, clave, valor) => {
      exigir(!(clave in atributos), `Atributo duplicado: ${clave}`);
      atributos[clave] = valor;
      return "";
    });
    exigir(resto.trim() === "", `Atributos XML no admitidos: ${resto}`);
    exigir(Object.hasOwn(ATRIBUTOS, apertura[1]), `Etiqueta fuera de plantilla: ${apertura[1]}`);
    const admitidos = ATRIBUTOS[apertura[1]].split(" ");
    for (const [clave, valor] of Object.entries(atributos)) {
      exigir(admitidos.includes(clave), `Atributo fuera de plantilla: ${apertura[1]}.${clave}`);
      if (NUMERICOS.has(clave)) exigir(valor.trim() !== "" && Number.isFinite(Number(valor)), `Número XML inválido: ${clave}`);
    }
    const nodo = { tag: apertura[1], atributos, hijos: [], inicio: token.index, inicioInterior: token.index + texto.length };
    if (pila.length) pila.at(-1).hijos.push(nodo);
    else {
      exigir(!raiz, "Más de una raíz XML");
      raiz = nodo;
    }
    if (apertura[3]) {
      nodo.finInterior = nodo.inicioInterior;
      nodo.fin = nodo.inicioInterior;
    } else pila.push(nodo);
  }
  exigir(raiz && pila.length === 0 && raiz.tag === "svg", "SVG incompleto");
  exigir(raiz.atributos.viewBox === "0 0 512 512", "viewBox inesperado");
  exigir(raiz.hijos.map((n) => n.tag).join() === "title,desc,ellipse,g,g,g", "Capas SVG inesperadas");
  exigir(raiz.hijos.slice(3).map((n) => n.atributos.id).join() === "extremidades,cuerpo,rostro", "Grupos SVG inesperados");
  exigir(!raiz.hijos[3].atributos.transform && !raiz.hijos[4].atributos.transform, "Transformación de cuerpo/extremidades no admitida");
  return { raiz, xml };
}

function numero(nodo, clave, defecto) {
  const valor = nodo.atributos[clave] ?? defecto;
  exigir(valor !== undefined && String(valor).trim() !== "" && Number.isFinite(Number(valor)), `${nodo.tag}.${clave} inválido`);
  return Number(valor);
}
const cadena = (nodo, clave) => {
  exigir(typeof nodo.atributos[clave] === "string", `Falta ${nodo.tag}.${clave}`);
  return nodo.atributos[clave];
};
function trazo(nodo) {
  return {
    color: cadena(nodo, "stroke"), grosor: numero(nodo, "stroke-width"),
    remate: nodo.atributos["stroke-linecap"] ?? "butt", union: nodo.atributos["stroke-linejoin"] ?? "miter",
  };
}
function elipse(nodo) {
  exigir(nodo.tag === "ellipse", "Se esperaba ellipse");
  const datos = { cx: numero(nodo, "cx"), cy: numero(nodo, "cy"), rx: numero(nodo, "rx"), ry: numero(nodo, "ry"), color: cadena(nodo, "fill"), opacidad: numero(nodo, "opacity", 1), trazo: nodo.atributos.stroke ? trazo(nodo) : null };
  exigir(datos.rx > 0 && datos.ry > 0 && datos.opacidad >= 0 && datos.opacidad <= 1, "Elipse fuera de rango");
  return datos;
}
function circulo(nodo) {
  exigir(nodo.tag === "circle", "Se esperaba circle");
  const datos = { cx: numero(nodo, "cx"), cy: numero(nodo, "cy"), r: numero(nodo, "r"), color: cadena(nodo, "fill"), trazo: nodo.atributos.stroke ? trazo(nodo) : null };
  exigir(datos.r > 0, "Radio inválido");
  return datos;
}
function camino(nodo, comandos) {
  exigir(nodo.tag === "path" && nodo.atributos.fill === "none", "Se esperaba path sin relleno");
  const d = cadena(nodo, "d");
  const tokens = d.match(/[A-Za-z]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/gi) ?? [];
  exigir(d.replace(/[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?|[A-Za-z]|[\s,]+/gi, "") === "", "Path mal formado");
  exigir(tokens.filter((t) => /^[A-Za-z]$/.test(t)).join() === comandos.join(), `Path inesperado: ${d}`);
  const numeros = tokens.filter((t) => !/^[A-Za-z]$/.test(t)).map(Number);
  exigir(numeros.every(Number.isFinite) && numeros.length === (comandos[1].toLowerCase() === "c" ? 8 : comandos[1].toLowerCase() === "q" ? 6 : 4), `Coordenadas inesperadas: ${d}`);
  exigir(tokens[0] === "M" && /^[A-Za-z]$/.test(tokens[3]), "Orden de coordenadas inesperado");
  return { d, numeros, ...trazo(nodo) };
}
function curva(nodo) {
  const comando = cadena(nodo, "d").match(/[qlQL]/)?.[0];
  exigir(comando, "Curva facial inesperada");
  const { numeros: n, ...datos } = camino(nodo, ["M", comando]);
  const relativo = comando === comando.toLowerCase();
  const punto = (i) => ({ x: n[i] + (relativo ? n[0] : 0), y: n[i + 1] + (relativo ? n[1] : 0) });
  const inicio = { x: n[0], y: n[1] };
  const fin = punto(n.length - 2);
  const control = comando.toLowerCase() === "q" ? punto(2) : { x: (inicio.x + fin.x) / 2, y: (inicio.y + fin.y) / 2 };
  return { ...datos, inicio, control, fin };
}
function rostro(documento, expresion) {
  const nodo = documento.raiz.hijos[5];
  const tipos = expresion === "neutral" ? "path,path,ellipse,ellipse,circle,ellipse,ellipse,circle,ellipse,ellipse,path" : expresion === "hablando" ? "path,path,ellipse,ellipse,circle,ellipse,ellipse,circle,ellipse,ellipse,ellipse,path" : "path,path,ellipse,ellipse,circle,ellipse,ellipse,circle,ellipse,ellipse,ellipse";
  exigir(nodo.hijos.map((n) => n.tag).join() === tipos, `Rostro ${expresion} fuera de plantilla`);
  const transformacion = nodo.atributos.transform ?? "";
  exigir(!transformacion || /^translate\(0 [-+]?\d+(?:\.\d+)?\)$/.test(transformacion), "Transformación facial inesperada");
  const hijos = nodo.hijos;
  return {
    transformacion, desplazamiento: { x: 0, y: transformacion ? Number(transformacion.match(/0 ([-\d.]+)/)[1]) : 0 },
    ojos: [2, 5].map((i) => ({ blanco: elipse(hijos[i]), pupila: elipse(hijos[i + 1]), brillo: circulo(hijos[i + 2]) })),
    cejas: hijos.slice(0, 2).map(curva), mejillas: hijos.slice(8, 10).map(elipse),
    boca: expresion === "neutral" ? curva(hijos[10]) : elipse(hijos[10]),
    ...(expresion === "hablando" ? { lengua: curva(hijos[11]) } : {}),
  };
}

export function extraerRig(neutral, hablando, alerta, id) {
  try {
    exigir(MASCOTAS.some((m) => m.id === id), "Id fuera de catálogo");
    const doc = analizar(neutral);
    const cara = rostro(doc, "neutral");
    const habla = rostro(analizar(hablando), "hablando");
    const aviso = rostro(analizar(alerta), "alerta");
    exigir(cara.transformacion === habla.transformacion && cara.transformacion === aviso.transformacion, "Offset facial inconsistente");
    const miembros = doc.raiz.hijos[3];
    exigir(miembros.hijos.map((n) => n.tag).join() === "path,path,ellipse,ellipse,path,path,circle,circle", "Extremidades fuera de plantilla");
    const piernas = miembros.hijos.slice(0, 2).map((nodo) => {
      const { numeros: n, ...datos } = camino(nodo, ["M", "L"]);
      return { ...datos, inicio: { x: n[0], y: n[1] }, fin: { x: n[2], y: n[3] } };
    });
    const brazos = miembros.hijos.slice(4, 6).map((nodo, i) => {
      const { numeros: n, ...datos } = camino(nodo, ["M", "C"]);
      return { ...datos, inicio: { x: n[0], y: n[1] }, control1: { x: n[2], y: n[3] }, control2: { x: n[4], y: n[5] }, fin: { x: n[6], y: n[7] }, mano: circulo(miembros.hijos[6 + i]) };
    });
    const cuerpo = doc.raiz.hijos[4];
    const interior = (n) => neutral.slice(n.inicioInterior, n.finInterior);
    const literal = (n) => neutral.slice(n.inicio, n.fin);
    const partes = {};
    let seleccion = [];
    let tipo;
    if (id === "voltio") {
      tipo = "ventilador";
      seleccion = cuerpo.hijos.filter((n) => n.tag === "g");
      exigir(seleccion.length === 1 && seleccion[0].atributos.transform === "translate(178 188) scale(0.7) translate(-202 -214)", "Ventilador fuera de plantilla");
      partes.ventilador = { markup: interior(seleccion[0]), transformacion: seleccion[0].atributos.transform, centro: { x: 202, y: 214 } };
    } else if (id === "pulso") {
      tipo = "boton";
      seleccion = cuerpo.hijos.filter((n) => n.tag === "circle" && ["107", "90"].includes(n.atributos.r) || n.tag === "path" && n.atributos.stroke === "#FFE0CA");
      exigir(seleccion.length === 3 && seleccion.map((n) => n.tag).join() === "circle,circle,path", "Botón fuera de plantilla");
      partes.boton = { markup: seleccion.map(literal).join(""), transformacion: "", centro: { x: 256, y: 327 } };
    } else if (id === "secu") {
      tipo = "led";
      seleccion = cuerpo.hijos.filter((n) => n.tag === "circle" && n.atributos.fill === "#F3D076");
      exigir(seleccion.length === 1, "LED fuera de plantilla");
      const led = circulo(seleccion[0]);
      partes.led = { markup: literal(seleccion[0]), transformacion: "", centro: { x: led.cx, y: led.cy } };
    }
    const capasCuerpo = [];
    if (seleccion.length) {
      for (let i = 1; i < seleccion.length; i++) exigir(seleccion[i - 1].fin === seleccion[i].inicio || neutral.slice(seleccion[i - 1].fin, seleccion[i].inicio).trim() === "", "Subpartes no contiguas");
      const primero = seleccion[0];
      const ultimo = seleccion.at(-1);
      capasCuerpo.push({ tipo: "estatico", markup: neutral.slice(cuerpo.inicioInterior, primero.inicio) });
      capasCuerpo.push({ tipo, markup: neutral.slice(primero.inicio, ultimo.fin) });
      capasCuerpo.push({ tipo: "estatico", markup: neutral.slice(ultimo.fin, cuerpo.finInterior) });
    } else capasCuerpo.push({ tipo: "estatico", markup: interior(cuerpo) });
    return {
      id, sombra: elipse(doc.raiz.hijos[2]), piernas, pies: miembros.hijos.slice(2, 4).map(elipse), brazos,
      cuerpo: interior(cuerpo), capasCuerpo, partes,
      rostro: { transformacion: cara.transformacion, desplazamiento: cara.desplazamiento },
      ojos: cara.ojos, cejas: cara.cejas, mejillas: cara.mejillas, boca: cara.boca,
      hablando: { boca: habla.boca, lengua: habla.lengua }, alerta: { boca: aviso.boca, cejas: aviso.cejas },
    };
  } catch (error) {
    throw new Error(`${id}: ${error.message}`, { cause: error });
  }
}

export function generarRigs() {
  const rigs = {};
  exigir(MASCOTAS.length === 15 && new Set(MASCOTAS.map((m) => m.id)).size === 15, "El catálogo debe tener 15 ids únicos");
  for (const { id } of MASCOTAS) {
    const leer = (estado) => readFileSync(new URL(`../public/mascotas/${id}-${estado}.svg`, import.meta.url), "utf8");
    rigs[id] = extraerRig(leer("neutral"), leer("hablando"), leer("alerta"), id);
  }
  const destino = new URL("../src/personajes/rigs.generated.ts", import.meta.url);
  mkdirSync(new URL("../src/personajes/", import.meta.url), { recursive: true });
  writeFileSync(destino, `// generado por scripts/generar-rigs.mjs; no editar\nimport type { MascotaId } from "../mascotas/catalogo.ts";\nimport type { Rig } from "./tipos.ts";\n\nexport const RIGS: Record<MascotaId, Rig> = ${JSON.stringify(rigs, null, 2)};\n`);
  console.log(`Generados ${Object.keys(rigs).length} rigs en ${fileURLToPath(destino)}`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) generarRigs();
