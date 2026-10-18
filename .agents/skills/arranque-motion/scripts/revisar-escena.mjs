import {writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {argumentos, numero, raiz, catalogo, fecha, guardar, hash, comandoRemotion, hojaHTML, chromeLocal, ejecutar, json} from './comun.mjs';

const o = argumentos({composicion:'valor',frames:'valor',anclas:'bool',secuencias:'bool',video:'bool',escala:'valor',bundle:'valor','dry-run':'bool',radio:'valor',hoja:'valor'},
  'Uso: node RUTA/scripts/revisar-escena.mjs --composicion MacroEncendido|S01Alimentacion|S02ControlEncendido [--frames 6,140] [--anclas] [--secuencias] [--radio 6] [--video] [--escala 0.5] [--bundle out/bundle] [--dry-run]\nPor defecto: anclas + inicio/final + ambos lados de los cortes. --frames sustituye esa selección; --anclas la combina. Secuencias: todos los frames ±radio alrededor de cada ancla. --hoja manifest.json regenera solo HTML desde PNGs existentes, sin render.');
if (o.hoja) {
  const p = resolve(o.hoja), m = json(p);
  const {dirname} = await import('node:path');
  for (const f of m.frames) if (!existsSync(resolve(dirname(p),f.archivo))) throw Error(`Falta PNG: ${f.archivo}`);
  if (!o['dry-run']) writeFileSync(join(dirname(p),'index.html'),hojaHTML(m.frames,m.composicion));
  console.log(`HTML ${o['dry-run']?'planificado':'generado'}: ${join(dirname(p),'index.html')}`);
  process.exit(0);
}
const comp = (await catalogo()).find(c=>c.id===o.composicion);
if (!comp) throw Error('Composición ausente de registro.ts.');
const escala = numero(o.escala,0.5,0.05,1), radio = numero(o.radio,6,1,60,true);
const anclas = comp.escenas.flatMap(e=>Object.entries(e.anclas).map(([evento,f])=>({escena:e.id,evento,frame:f+e.offset})));
const cortes = comp.escenas.slice(1).flatMap(e=>[e.offset-1,e.offset]);
const elegidos = o.frames ? o.frames.split(',').map(f=>numero(f,undefined,0,comp.frames-1,true)) : [0,comp.frames-1,...cortes];
if (!o.frames || o.anclas) elegidos.push(...anclas.map(a=>a.frame));
if (o.secuencias) for (const a of anclas) for (let d=-radio;d<=radio;d++) elegidos.push(Math.max(0,Math.min(comp.frames-1,a.frame+d)));
const frames = [...new Set(elegidos)].sort((a,b)=>a-b).map(frame=>({frame,archivo:`frame-${String(frame).padStart(5,'0')}.png`}));
const salida = resolve(raiz,'out/revision',comp.id,fecha());
const bundle = resolve(raiz,o.bundle ?? join(salida,'bundle'));
const commands = [];
if (!o.bundle) commands.push(['bundle','src/index.ts',`--out-dir=${bundle}`]);
for (const f of frames) commands.push(['still',bundle,comp.id,join(salida,f.archivo),`--frame=${f.frame}`,`--scale=${escala}`]);
if(o.video) commands.push(['render',bundle,comp.id,join(salida,'preview.mp4'),`--scale=${escala}`,'--concurrency=2']);
const manifest = {version:1,composicion:comp.id,fps:30,ancho:1920,alto:1080,escala,bundle,anclas,cortes,
  secuencias:o.secuencias?anclas.map(a=>({...a,desde:Math.max(0,a.frame-radio),hasta:Math.min(comp.frames-1,a.frame+radio)})):[],
  frames,commands:commands.map(c=>comandoRemotion(c)),ejecuciones:[],nota:'Revisión pendiente: completar rúbrica y evidencias antes de aprobar.'};
if (o['dry-run']) {console.log(JSON.stringify({salida,...manifest},null,2));process.exit(0);}
if(o.bundle && !existsSync(bundle)) throw Error('Bundle local inexistente.');
const chrome = chromeLocal(); // Fallar antes de renderizar si falta navegador local.
mkdirSync(salida,{recursive:true});
guardar(join(salida,'manifest.json'),manifest);
manifest.commands=commands.map(c=>comandoRemotion(c[0]==='bundle'?c:[...c,`--browser-executable=${chrome}`]));
function ejecutarRegistrado(cmd,args){
  try{ejecutar(cmd,args);manifest.ejecuciones.push({comando:[cmd,args],exitCode:0});}
  catch(e){manifest.ejecuciones.push({comando:[cmd,args],exitCode:e.exitCode??null,error:e.message});throw e;}
  finally{guardar(join(salida,'manifest.json'),manifest);}
}
for(const c of manifest.commands) ejecutarRegistrado(...c);
for(const f of frames) f.sha256=hash(join(salida,f.archivo));
writeFileSync(join(salida,'index.html'),hojaHTML(frames,comp.id));
// Hojas paginadas: evita recorte y texturas demasiado altas de Chrome.
manifest.hojas=[];
for(let i=0;i<frames.length;i+=12) {
  const nombre=`hoja-${i/12+1}`;
  writeFileSync(join(salida,`${nombre}.html`),hojaHTML(frames.slice(i,i+12),`${comp.id} · ${nombre}`));
  const args=['--headless','--no-sandbox','--allow-file-access-from-files','--hide-scrollbars','--run-all-compositor-stages-before-draw','--virtual-time-budget=3000','--window-size=1500,1350',`--screenshot=${join(salida,`${nombre}.png`)}`,pathToFileURL(join(salida,`${nombre}.html`)).href];
  manifest.commands.push([chrome,args]);
  ejecutarRegistrado(chrome,args);
  manifest.hojas.push({archivo:`${nombre}.png`,sha256:hash(join(salida,`${nombre}.png`))});
}
guardar(join(salida,'manifest.json'),manifest);
const enlaces=`<nav><a href="manifest.json">Manifiesto y comandos</a> · ${manifest.hojas.map(h=>`<a href="${h.archivo}">${h.archivo}</a>`).join(' · ')}${o.video?' · <a href="preview.mp4">Video</a>':''}</nav>`;
writeFileSync(join(salida,'index.html'),hojaHTML(frames,comp.id).replace('<main>',`${enlaces}<main>`));
console.log(`Revisión generada: ${salida}`);
