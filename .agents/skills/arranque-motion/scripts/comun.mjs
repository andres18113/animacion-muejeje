import {readFileSync, mkdirSync, writeFileSync, existsSync, readdirSync} from 'node:fs';
import {resolve, dirname, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';

let base = dirname(fileURLToPath(import.meta.url));
while (!existsSync(join(base, 'remotion.config.ts'))) {
  const padre = dirname(base);
  if (padre === base) throw Error('Ejecutar dentro del checkout arranque-so.');
  base = padre;
}
export const raiz = base;
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url) && process.argv.includes('--help')) {
  console.log('comun.mjs: utilidades internas de rutas, argumentos, CLI Remotion local, catálogo, SHA-256 y hojas HTML. Importar desde los scripts de esta skill.');
}
export function argumentos(definicion, ayuda) {
  const args = process.argv.slice(2), r = {};
  if (args.includes('--help')) { console.log(ayuda); process.exit(0); }
  for (let i = 0; i < args.length; i++) {
    const k = args[i].replace(/^--/, '');
    if (!args[i].startsWith('--') || !(k in definicion)) throw Error(`Opción desconocida: ${args[i]}`);
    if (k in r) throw Error(`Opción repetida: --${k}`);
    r[k] = definicion[k] === 'bool' ? true : args[++i];
    if (r[k] === undefined || String(r[k]).startsWith('--')) throw Error(`Falta valor: --${k}`);
  }
  return r;
}
export function numero(v, defecto, min = 0, max = Infinity, entero = false) {
  if (typeof v === 'string' && !v.trim()) throw Error('Número vacío.');
  const n = v === undefined ? defecto : Number(v);
  if (!Number.isFinite(n) || n < min || n > max || (entero && !Number.isInteger(n))) throw Error(`Número fuera de rango: ${v}`);
  return n;
}
export const cargar = p => import(pathToFileURL(resolve(raiz, p)).href);
export const json = p => JSON.parse(readFileSync(p, 'utf8'));
export const guardar = (p, dato) => {mkdirSync(dirname(p), {recursive: true}); writeFileSync(p, JSON.stringify(dato, null, 2) + '\n');};
export const hash = p => createHash('sha256').update(readFileSync(p)).digest('hex');
export const fecha = () => new Date().toISOString().replace(/[:.]/g, '-');
export function ejecutar(cmd, args) {
  const p = spawnSync(cmd, args, {cwd: raiz, stdio: 'inherit', windowsHide: true});
  if (p.error || p.status !== 0) throw Object.assign(Error(`Falló ${cmd} (${p.status}): ${p.error?.message ?? args.join(' ')}`), {exitCode:p.status, causa:p.error?.message});
}
// Binario de la CLI estándar instalada: sin npx, red ni imports bundler/renderer.
export const comandoRemotion = args => [process.execPath, [join(raiz, 'node_modules/@remotion/cli/remotion-cli.js'), ...args]];
export function remotion(args) { ejecutar(...comandoRemotion(args)); }
export async function catalogo() {
  const {REGISTRO_CINE} = await cargar('src/arranque/cine/guion/registro.ts');
  const {cuesDeEscena, anclasDeEscena} = await cargar('src/arranque/recursos.ts');
  const escenas = REGISTRO_CINE.map(e => ({...e, anclas: anclasDeEscena(e.id, cuesDeEscena(e.id))}));
  return [...escenas.map(e => ({id: e.composicion, frames: e.frames, escenas: [{...e, offset: 0}]})),
    {id: 'MacroEncendido', frames: escenas.slice(0, 2).reduce((n,e)=>n+e.frames,0), escenas: escenas.slice(0, 2).map((e,i)=>({...e,offset:i ? escenas[0].frames : 0}))}];
}
export function chromeLocal() {
  function buscar(p) {
    if (!existsSync(p)) return;
    for (const x of readdirSync(p, {withFileTypes:true})) {
      const f = join(p, x.name);
      if (x.isFile() && /^(chrome-headless-shell(?:\.exe)?|headless_shell)$/.test(x.name)) return f;
      if (x.isDirectory()) { const encontrado = buscar(f); if (encontrado) return encontrado; }
    }
  }
  const exe = buscar(join(raiz, 'node_modules/.remotion'));
  if (!exe) throw Error('Falta chrome-headless-shell local bajo node_modules/.remotion; preparar en el host.');
  return exe;
}
export const escapar = s => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function hojaHTML(frames, titulo) {
  return `<!doctype html><html lang="es"><meta charset="utf-8"><title>${escapar(titulo)}</title><style>body{background:#111;color:#eee;font:16px sans-serif;margin:20px}main{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}figure{margin:0}img{width:100%}figcaption{padding:5px}</style><h1>${escapar(titulo)}</h1><main>${frames.map(f=>`<figure><img src="${escapar(f.archivo)}"><figcaption>Frame ${f.frame}</figcaption></figure>`).join('')}</main></html>`;
}
