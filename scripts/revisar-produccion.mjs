/** Revisión por lote mediante CLI estándar; no declara aprobación audiovisual. */
import {closeSync, existsSync, mkdirSync, openSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {join, relative, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {argumentos, numero, raiz, catalogo, fecha, guardar, hash, comandoRemotion, hojaHTML, chromeLocal} from '../.agents/skills/arranque-motion/scripts/comun.mjs';

const o = argumentos({composicion:'valor',frames:'valor',anclas:'bool',secuencias:'bool',video:'bool',escala:'valor',bundle:'valor',salida:'valor','dry-run':'bool',radio:'valor',verificar:'valor'},
  'Uso: node scripts/revisar-produccion.mjs --composicion S03PrimeraInstruccion [--anclas] [--secuencias] [--radio 6] [--frames 0,24] [--video] [--escala 0.5] [--bundle RUTA] [--salida RUTA] [--dry-run]\nSiempre incluye inicio/final y cortes; --frames añade frames. PNG en un lote CLI, hojas paginadas y MP4 opcional. --verificar manifest.json comprueba mapping y hashes sin render.');

function validarMapping(carpeta, frames) {
  const archivos = readdirSync(carpeta).filter(n=>n.endsWith('.png'));
  const mapa = new Map();
  for (const archivo of archivos) {
    const m = /^element-(\d+)\.png$/.exec(archivo);
    if (!m) throw Error(`PNG inesperado: ${archivo}`);
    const frame = Number(m[1]);
    if (mapa.has(frame)) throw Error(`Frame duplicado: ${frame}`);
    mapa.set(frame, archivo);
  }
  if (mapa.size !== frames.length || frames.some(f=>!mapa.has(f.frame))) throw Error('Selección PNG y frames no coinciden.');
  return mapa;
}
if (o.verificar) {
  const p = resolve(o.verificar), m = JSON.parse(readFileSync(p,'utf8'));
  const base = resolve(p,'..');
  const mapa = validarMapping(join(base,'png'),m.frames);
  for (const f of m.frames) {
    if (f.archivo !== `png/${mapa.get(f.frame)}` || hash(join(base,f.archivo)) !== f.sha256) throw Error(`Mapping/hash inválido: ${f.frame}`);
  }
  for (const h of m.hojas ?? []) if (hash(join(base,h.archivo)) !== h.sha256) throw Error(`Hash hoja inválido: ${h.archivo}`);
  if (m.video && hash(join(base,m.video.archivo)) !== m.video.sha256) throw Error('Hash video inválido.');
  console.log(`Mapping y hashes verificados: ${m.frames.length} frames.`);
  process.exit(0);
}
const comps = await catalogo();
// El catálogo histórico de la skill limita Macro a S01/S02. La composición
// actual incluye S01–S03: derivar sus offsets de esos registros individuales.
const macro = comps.find(c=>c.id==='MacroEncendido');
if (macro) {
  const individuales = comps.filter(c=>c.id!=='MacroEncendido');
  macro.escenas = individuales.flatMap(c=>c.escenas).filter(e=>['S01','S02','S03'].includes(e.id)).map(e=>({...e}));
  let offset = 0;
  for (const e of macro.escenas) { e.offset = offset; offset += e.frames; }
  macro.frames = offset;
}
const comp = comps.find(c=>c.id===o.composicion);
if (!comp) throw Error('Composición ausente del catálogo.');
const escala = numero(o.escala,0.5,0.05,1), radio = numero(o.radio,6,1,60,true);
const anclas = comp.escenas.flatMap(e=>Object.entries(e.anclas).map(([evento,frame])=>({escena:e.id,evento,frame:frame+e.offset})));
const cortes = comp.escenas.slice(1).flatMap(e=>[e.offset-1,e.offset]);
const elegidos = [0,comp.frames-1,...cortes];
if (!o.frames || o.anclas || o.secuencias) elegidos.push(...anclas.map(a=>a.frame));
if (o.frames) elegidos.push(...o.frames.split(',').map(f=>numero(f,undefined,0,comp.frames-1,true)));
if (o.secuencias) for (const a of anclas) for (let d=-radio;d<=radio;d++) elegidos.push(Math.max(0,Math.min(comp.frames-1,a.frame+d)));
const frames = [...new Set(elegidos)].sort((a,b)=>a-b).map(frame=>({frame}));
const salida = resolve(raiz,o.salida ?? join('out/produccion',comp.id,fecha()));
const bundle = resolve(raiz,o.bundle ?? join(salida,'bundle'));
if (o.bundle && !existsSync(bundle)) throw Error('Bundle local inexistente.');
const chrome = chromeLocal();
const commands = [];
if (!o.bundle) commands.push(comandoRemotion(['bundle','src/index.ts',`--out-dir=${bundle}`]));
commands.push(comandoRemotion(['render',bundle,comp.id,join(salida,'png'),'--sequence','--image-format=png',`--frames=${frames.map(f=>f.frame).join(',')}`,`--scale=${escala}`,'--concurrency=2',`--browser-executable=${chrome}`]));
if (o.video) commands.push(comandoRemotion(['render',bundle,comp.id,join(salida,'preview.mp4'),`--scale=${escala}`,'--concurrency=2',`--browser-executable=${chrome}`]));
function inventario(ruta, incluir=()=>true) {
  const archivos=[];
  function recorrer(p) {
    for (const e of readdirSync(p,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {
      const f=join(p,e.name);
      if(e.isDirectory()) recorrer(f);
      else if(e.isFile() && incluir(f)) archivos.push({archivo:relative(ruta,f).replaceAll('\\','/'),sha256:hash(f)});
    }
  }
  recorrer(ruta);
  return {sha256:createHash('sha256').update(JSON.stringify(archivos)).digest('hex'),archivos};
}
function fuente() {
  const archivos = inventario(join(raiz,'src')).archivos.map(f=>({...f,archivo:`src/${f.archivo}`}));
  for (const f of ['package.json','package-lock.json','remotion.config.ts']) if(existsSync(join(raiz,f))) archivos.push({archivo:f,sha256:hash(join(raiz,f))});
  archivos.push({archivo:'scripts/revisar-produccion.mjs',sha256:hash(join(raiz,'scripts/revisar-produccion.mjs'))});
  return {sha256:createHash('sha256').update(JSON.stringify(archivos)).digest('hex'),archivos};
}
const manifest = {version:1,composicion:comp.id,fps:30,ancho:1920,alto:1080,escala,concurrency:2,radio,bundle,anclas,cortes,
  secuencias:o.secuencias?anclas.map(a=>({...a,desde:Math.max(0,a.frame-radio),hasta:Math.min(comp.frames-1,a.frame+radio)})):[],
  frames,commands,ejecuciones:[],hojas:[],fuente:fuente(),
  nota:'Revisión pendiente. Identidad fuente actual y bundle se registran por separado; reutilizar bundle no demuestra que corresponda al código actual.'};
if (o['dry-run']) { console.log(JSON.stringify({salida,...manifest},null,2)); process.exit(0); }
if(existsSync(salida) && readdirSync(salida).length) throw Error('La salida debe estar vacía para impedir mezclar evidencia.');
mkdirSync(salida,{recursive:true});
const guardarManifest=()=>guardar(join(salida,'manifest.json'),manifest);
guardarManifest();
function ejecutarRegistrado(command) {
  const log=`comando-${String(manifest.ejecuciones.length+1).padStart(3,'0')}.log`;
  const fd=openSync(join(salida,log),'w'), inicio=new Date().toISOString();
  let p;
  try { p=spawnSync(command[0],command[1],{cwd:raiz,stdio:['ignore',fd,fd],windowsHide:true}); }
  finally { closeSync(fd); }
  manifest.ejecuciones.push({command,log,inicio,fin:new Date().toISOString(),exitCode:p.status,error:p.error?.message??null});
  guardarManifest();
  if(p.error || p.status!==0) throw Error(`Comando falló (${p.status}); revisar ${join(salida,log)}`);
}
for(const c of commands) ejecutarRegistrado(c);
manifest.identidadBundle=inventario(bundle);
manifest.correspondenciaFuenteBundle=o.bundle?'No verificada: bundle preexistente.':'Bundle creado por CLI desde la fuente registrada en esta ejecución.';
const mapa=validarMapping(join(salida,'png'),frames);
for(const f of frames) { f.archivo=`png/${mapa.get(f.frame)}`; f.sha256=hash(join(salida,f.archivo)); }
guardarManifest();
for(let i=0;i<frames.length;i+=12) {
  const nombre=`hoja-${i/12+1}`;
  writeFileSync(join(salida,`${nombre}.html`),hojaHTML(frames.slice(i,i+12),`${comp.id} · ${nombre}`));
  const c=[chrome,['--headless','--no-sandbox','--allow-file-access-from-files','--hide-scrollbars','--run-all-compositor-stages-before-draw','--virtual-time-budget=3000','--window-size=1500,1350',`--screenshot=${join(salida,`${nombre}.png`)}`,pathToFileURL(join(salida,`${nombre}.html`)).href]];
  manifest.commands.push(c); ejecutarRegistrado(c);
  manifest.hojas.push({archivo:`${nombre}.png`,sha256:hash(join(salida,`${nombre}.png`))});
}
if(o.video) manifest.video={archivo:'preview.mp4',sha256:hash(join(salida,'preview.mp4'))};
const enlaces=`<nav><a href="manifest.json">Manifiesto y comandos</a> · ${manifest.hojas.map(h=>`<a href="${h.archivo}">${h.archivo}</a>`).join(' · ')}${o.video?' · <a href="preview.mp4">Video</a>':''}</nav>`;
writeFileSync(join(salida,'index.html'),hojaHTML(frames,comp.id).replace('<main>',`${enlaces}<main>`));
manifest.finalizado=new Date().toISOString(); guardarManifest();
console.log(`Revisión generada: ${salida} (${frames.length} PNG; aprobación pendiente).`);
