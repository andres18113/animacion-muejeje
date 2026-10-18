import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifiesto = JSON.parse(fs.readFileSync(path.join(raiz, "docs/mascotas/mascotas-manifiesto.json"), "utf8"));
const expresiones = ["neutral", "hablando", "alerta"];
if (manifiesto.personajes.length !== 15) throw new Error("El elenco debe tener 15 personajes");
const ids = new Set();
for (const personaje of manifiesto.personajes) {
  if (ids.has(personaje.id)) throw new Error(`ID duplicado: ${personaje.id}`);
  ids.add(personaje.id);
  for (const expresion of expresiones) {
    const ruta = path.join(raiz, "public", "mascotas", `${personaje.id}-${expresion}.svg`);
    const contenido = fs.readFileSync(ruta, "utf8");
    if (!contenido.includes('viewBox="0 0 512 512"') || !contenido.includes('id="rostro"')) {
      throw new Error(`SVG incorrecto: ${ruta}`);
    }
  }
}
console.log(`VALIDADO: ${ids.size} personajes, ${ids.size * expresiones.length} SVG.`);
