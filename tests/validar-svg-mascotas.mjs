import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const leer = (ruta) => fs.readFileSync(path.join(raiz, ruta), "utf8");
const expresiones = ["neutral", "hablando", "alerta"];
const errores = [];
const comprobar = (nombre, prueba) => {
  try {
    prueba();
    return true;
  } catch (error) {
    errores.push(`${nombre}: ${error.message}`);
    return false;
  }
};

const caracterXML = (n) => n === 9 || n === 10 || n === 13 ||
  (n >= 0x20 && n <= 0xd7ff) || (n >= 0xe000 && n <= 0xfffd) ||
  (n >= 0x10000 && n <= 0x10ffff);

function entidades(texto) {
  assert(!/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[\da-fA-F]+);)/.test(texto),
    "Entidad XML inválida");
  return texto.replace(/&([^;]+);/g, (_, entidad) => {
    if (entidad.startsWith("#")) {
      const n = entidad.startsWith("#x")
        ? Number.parseInt(entidad.slice(2), 16) : Number(entidad.slice(1));
      assert(caracterXML(n), "Referencia de carácter XML inválida");
      return String.fromCodePoint(n);
    }
    return {amp: "&", lt: "<", gt: ">", quot: '"', apos: "'"}[entidad];
  });
}

// Parser del subconjunto XML utilizado por estos SVG. No resuelve recursos ni
// entidades externas: rechaza DTD y declaraciones desconocidas explícitamente.
function analizarSVG(xml) {
  for (const caracter of xml) {
    assert(caracterXML(caracter.codePointAt(0)), "Carácter XML inválido");
  }
  const pila = [];
  const grupos = new Set();
  let raizSVG;
  let i = xml.charCodeAt(0) === 0xfeff ? 1 : 0;
  const nombre = "[A-Za-z_][A-Za-z0-9_.:-]*";
  while (i < xml.length) {
    if (xml[i] !== "<") {
      const fin = xml.indexOf("<", i);
      const texto = xml.slice(i, fin < 0 ? xml.length : fin);
      assert(!texto.includes("]]>"), "Cierre CDATA fuera de CDATA");
      entidades(texto);
      assert(pila.length > 0 || !texto.trim(), "Texto fuera del elemento raíz");
      i += texto.length;
      continue;
    }
    if (xml.startsWith("<!--", i)) {
      const fin = xml.indexOf("-->", i + 4);
      assert(fin >= 0, "Comentario sin cierre");
      const comentario = xml.slice(i + 4, fin);
      assert(!comentario.includes("--") && !comentario.endsWith("-"),
        "Comentario XML inválido");
      i = fin + 3;
      continue;
    }
    if (xml.startsWith("<![CDATA[", i)) {
      const fin = xml.indexOf("]]>", i + 9);
      assert(pila.length > 0 && fin >= 0, "CDATA inválido");
      i = fin + 3;
      continue;
    }
    if (xml.startsWith("<?", i)) {
      const fin = xml.indexOf("?>", i + 2);
      assert(fin >= 0, "Instrucción XML sin cierre");
      const declaracion = xml.slice(i, fin + 2);
      assert(i <= 1 && /^<\?xml\s+version\s*=\s*(["'])1\.0\1(?:\s+encoding\s*=\s*(["'])UTF-8\2)?(?:\s+standalone\s*=\s*(["'])(?:yes|no)\3)?\s*\?>$/i.test(declaracion),
        "Solo se admite declaración XML 1.0 inicial");
      i = fin + 2;
      continue;
    }
    assert(!xml.startsWith("<!", i), "Declaración XML no admitida");
    if (xml.startsWith("</", i)) {
      const cierre = new RegExp(`^</(${nombre})\\s*>`).exec(xml.slice(i));
      assert(cierre, "Etiqueta de cierre inválida");
      assert.equal(pila.pop(), cierre[1], `Cierre desbalanceado: ${cierre[1]}`);
      i += cierre[0].length;
      continue;
    }
    const apertura = new RegExp(`^<(${nombre})`).exec(xml.slice(i));
    assert(apertura, "Etiqueta de apertura inválida");
    const etiqueta = apertura[1];
    i += apertura[0].length;
    const atributos = Object.create(null);
    while (true) {
      const espacio = /^\s*/.exec(xml.slice(i))[0];
      i += espacio.length;
      if (xml.startsWith("/>", i) || xml[i] === ">") break;
      assert(espacio.length > 0, "Falta separación entre atributos");
      const atributo = new RegExp(`^(${nombre})\\s*=\\s*("[^"<]*"|'[^'<]*')`).exec(xml.slice(i));
      assert(atributo, "Atributo XML inválido o sin comillas");
      assert(!Object.hasOwn(atributos, atributo[1]), "Atributo duplicado");
      atributos[atributo[1]] = entidades(atributo[2].slice(1, -1));
      i += atributo[0].length;
    }
    if (pila.length === 0) {
      assert(!raizSVG, "Múltiples elementos raíz");
      assert.equal(etiqueta, "svg", "La raíz debe ser svg");
      raizSVG = atributos;
    }
    assert.equal(etiqueta.includes(":"), false, "Elementos con prefijo no admitidos");
    assert.equal(etiqueta.toLowerCase() === "script", false, "Elemento script prohibido");
    for (const [clave, valor] of Object.entries(atributos)) {
      if (/(?:^|:)(?:href|src)$/i.test(clave)) {
        assert(/^#[^\s]+$/.test(valor), `Referencia externa prohibida: ${clave}=${valor}`);
      }
      if (clave.includes(":") && !clave.startsWith("xmlns:")) {
        const prefijo = clave.split(":")[0];
        assert(prefijo === "xml" || prefijo === "xlink", "Prefijo de atributo no admitido");
        if (prefijo === "xlink") {
          assert.equal(raizSVG["xmlns:xlink"], "http://www.w3.org/1999/xlink",
            "Namespace xlink no declarado en la raíz");
        }
      }
    }
    if (etiqueta === "g" && atributos.id) grupos.add(atributos.id);
    const autocierre = xml.startsWith("/>", i);
    i += autocierre ? 2 : 1;
    if (!autocierre) pila.push(etiqueta);
  }
  assert.equal(pila.length, 0, "Etiquetas sin cierre");
  assert(raizSVG, "Falta elemento raíz");
  assert.equal(raizSVG.xmlns, "http://www.w3.org/2000/svg", "xmlns incorrecto");
  assert.equal(raizSVG.viewBox, "0 0 512 512", "viewBox incorrecto");
  for (const grupo of ["extremidades", "cuerpo", "rostro"]) {
    assert(grupos.has(grupo), `Falta grupo g#${grupo}`);
  }
}

if (process.argv.includes("--autoprueba")) {
  const ejemplo = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">' +
    '<g id="extremidades"/><g id="cuerpo"/><g id="rostro"/></svg>';
  analizarSVG(ejemplo);
  const invalidos = [
    ejemplo.replace("</svg>", "</g>"),
    ejemplo.replace("</svg>", ""),
    ejemplo + ejemplo,
    ejemplo.replace('id="cuerpo"', 'id=cuerpo'),
    ejemplo.replace('id="cuerpo"', 'id="cuerpo" id="otro"'),
    ejemplo.replace('id="rostro"', 'id="otro"'),
    ejemplo.replace('0 0 512 512', '0 0 256 256'),
    ejemplo.replace("</svg>", "<script/></svg>"),
    ejemplo.replace("</svg>", '<use href="https://example.invalid/a.svg"/></svg>'),
    ejemplo.replace("</svg>", '<use href="C:/a.svg"/></svg>'),
    ejemplo.replace("</svg>", '<image src="file:///a.png"/></svg>'),
    ejemplo.replace("</svg>", '<image href="&#104;ttps://example.invalid/a.png"/></svg>'),
    ejemplo.replace("</svg>", "<text>&desconocida;</text></svg>"),
    ejemplo.replace("</svg>", "<text>&#0;</text></svg>"),
    '<!DOCTYPE svg SYSTEM "file:///a.dtd">' + ejemplo,
  ];
  for (const invalido of invalidos) assert.throws(() => analizarSVG(invalido));
  analizarSVG(ejemplo.replace("</svg>", '<use href="#cuerpo"/></svg>'));
  console.log(`AUTOPRUEBA XML: 2 válidos y ${invalidos.length} inválidos verificados.`);
}

const manifiesto = JSON.parse(leer("docs/mascotas/mascotas-manifiesto.json"));
const fuente = leer("src/mascotas/catalogo.ts");
const catalogo = [];
comprobar("Catálogo y manifiesto", () => {
  const bloque = /export const MASCOTAS\s*=\s*\[([\s\S]*?)\]\s*as const/.exec(fuente);
  assert(bloque, "No se encontró el arreglo estático MASCOTAS");
  for (const objeto of bloque[1].matchAll(/\{([^{}]*)\}/g)) {
    const datos = {};
    for (const clave of ["id", "codigo", "nombre"]) {
      const valor = new RegExp(`\\b${clave}\\s*:\\s*("(?:\\\\.|[^"\\\\])*")`).exec(objeto[1]);
      assert(valor, `Falta ${clave} en el catálogo`);
      datos[clave] = JSON.parse(valor[1]);
    }
    catalogo.push(datos);
  }
  assert.equal(manifiesto.totalPersonajes, 15);
  assert.equal(manifiesto.personajes.length, 15);
  assert.equal(new Set(manifiesto.personajes.map(({id}) => id)).size, 15);
  assert.equal(catalogo.length, 15);
  assert.equal(new Set(catalogo.map(({id}) => id)).size, 15);
  assert.deepEqual(manifiesto.expresiones, expresiones);
  manifiesto.personajes.forEach((p, indice) => {
    assert.equal(p.code, `M${String(indice + 1).padStart(2, "0")}`);
    assert.deepEqual(catalogo[indice], {id: p.id, codigo: p.code, nombre: p.name});
    assert(/^[a-z0-9]+$/.test(p.id), `ID no ASCII/minúsculas: ${p.id}`);
  });
});

const archivos = fs.readdirSync(path.join(raiz, "public/mascotas"));
const svgs = archivos.filter((archivo) => /\.svg$/i.test(archivo));
comprobar("Inventario SVG", () => {
  assert.equal(svgs.length, 45);
  const esperados = manifiesto.personajes.flatMap(({id}) =>
    expresiones.map((expresion) => `${id}-${expresion}.svg`));
  assert.deepEqual([...svgs].sort(), esperados.sort(), "Inventario SVG inesperado");
});
const filas = manifiesto.personajes.map((personaje) => {
  const contenidos = [];
  const fila = {codigo: personaje.code, id: personaje.id, nombre: personaje.name};
  for (const expresion of expresiones) {
    const archivo = `${personaje.id}-${expresion}.svg`;
    fila[expresion] = comprobar(archivo, () => {
      assert(/^[a-z0-9]+-(neutral|hablando|alerta)\.svg$/.test(archivo), "Nombre inválido");
      const contenido = leer(`public/mascotas/${archivo}`);
      contenidos.push(contenido);
      analizarSVG(contenido);
    }) ? "OK" : "ERROR";
  }
  fila.distintas = comprobar(`${personaje.id} expresiones`, () => {
    assert.equal(contenidos.length, 3);
    assert.equal(new Set(contenidos).size, 3, "Expresiones byte-idénticas");
  }) ? "3/3" : "ERROR";
  return fila;
});

function listar(ruta) {
  return fs.readdirSync(path.join(raiz, ruta), {withFileTypes: true}).flatMap((entrada) => {
    const archivo = `${ruta}/${entrada.name}`;
    return entrada.isDirectory() ? listar(archivo) : [archivo];
  });
}
// Fragmentos para evitar insertar términos excluidos en los recursos del hito.
const terminos = ["UE" + "FI", "G" + "PT", "NV" + "Me", "E" + "SP",
  "Secure" + " Boot", "SSD", "LGA", "DDR"];
const literal = new RegExp(terminos.join("|"), "ig");
const completo = new RegExp(`(?<![\\p{L}\\p{N}_])(?:${terminos.join("|")})(?![\\p{L}\\p{N}_])`, "iu");
let coincidencias = 0;
let prohibidos = 0;
for (const ruta of [...svgs.map((archivo) => `public/mascotas/${archivo}`),
  ...listar("src/mascotas"), "docs/mascotas/mascotas-manifiesto.json"]) {
  leer(ruta).split(/\r?\n/).forEach((linea, indice) => {
    const hits = [...linea.matchAll(literal)];
    if (!hits.length) return;
    coincidencias += hits.length;
    const esTermino = completo.test(linea);
    if (esTermino) prohibidos++;
    console.log(`${ruta}:${indice + 1}: ${linea.trim()} [${esTermino ? "PROHIBIDO" : "subcadena"}]`);
  });
}
if (prohibidos) errores.push(`${prohibidos} líneas contienen términos excluidos completos`);
console.table(filas);
console.log(`Búsqueda literal: ${coincidencias} coincidencias; términos completos: ${prohibidos}.`);
console.log(`RESUMEN: ${filas.length} personajes; ${svgs.length} SVG; ${errores.length} errores.`);
for (const error of errores) console.error(`ERROR: ${error}`);
process.exitCode = errores.length ? 1 : 0;
