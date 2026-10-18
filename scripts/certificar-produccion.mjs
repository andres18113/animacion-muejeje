/** Cierre técnico; nunca aprueba calidad audiovisual.
 * node scripts/certificar-produccion.mjs --escena S05 --composicion S05PostMemoria
 *   --bundle RUTA --salida NUEVACARPETA [--sin-videos]
 * Ejecuta gates completos, conserva stdout/stderr y freezes; reutiliza bundle.
 * --sin-videos omite render/probe y deja estado incompleto (exit0 solo gates).
 * No escribe en entradas evaluadas; no actualiza referencias ni goldens.
 */
import {closeSync,existsSync,mkdirSync,openSync,readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {dirname,join,relative,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {argumentos,raiz,catalogo,comandoRemotion,chromeLocal} from '../.agents/skills/arranque-motion/scripts/comun.mjs';

const sha=b=>createHash('sha256').update(b).digest('hex');
const hash=p=>sha(readFileSync(p));
export function inventarioEntradas(base,soloBundle=false){
  const archivos=[];
  function recorrer(p){
    for(const e of readdirSync(p,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
      const f=join(p,e.name);
      if(e.isSymbolicLink())throw Error(`Entrada enlazada requiere resolver alcance: ${f}`);
      if(e.isDirectory())recorrer(f);else if(e.isFile())archivos.push({archivo:relative(base,f).replaceAll('\\','/'),sha256:hash(f)});
    }
  }
  if(soloBundle)recorrer(base);
  else{
    for(const d of ['src','public','tests','scripts']){if(!existsSync(join(base,d)))throw Error(`Falta raíz evaluada: ${d}`);recorrer(join(base,d));}
    for(const e of readdirSync(base,{withFileTypes:true}))if(e.isFile()&&(/^(package(?:-lock)?\.json|tsconfig.*\.json|remotion\.config\..+|eslint\.config\..+|\.npmrc)$/.test(e.name)))archivos.push({archivo:e.name,sha256:hash(join(base,e.name))});
  }
  archivos.sort((a,b)=>a.archivo.localeCompare(b.archivo));
  return {sha256:sha(JSON.stringify(archivos)),cantidad:archivos.length,archivos};
}
export function ejecutarConLog(command,carpeta,id,cwd=raiz){
  mkdirSync(carpeta,{recursive:true});
  const stdout=`${id}.stdout.log`,stderr=`${id}.stderr.log`,out=openSync(join(carpeta,stdout),'w'),err=openSync(join(carpeta,stderr),'w');
  const inicio=new Date().toISOString();let p;
  try{p=spawnSync(command[0],command[1],{cwd,stdio:['ignore',out,err],windowsHide:true});}
  finally{closeSync(out);closeSync(err);}
  return {id,command,inicio,fin:new Date().toISOString(),exitCode:p.status,error:p.error?.message??null,stdout,stderr,stdoutSha256:hash(join(carpeta,stdout)),stderrSha256:hash(join(carpeta,stderr))};
}
export function validarSondeo(data,frames,escala,stderr=''){
  if(stderr.trim())throw Error('ffprobe: errores de decodificación en stderr (revisar log archivado).');
  const v=data.streams?.find(s=>s.codec_type==='video');
  if(!v)throw Error('ffprobe: falta stream de vídeo.');
  const fraccion=s=>{const [a,b=1]=String(s).split('/').map(Number);return a/b;};
  const fpsMedio=fraccion(v.avg_frame_rate),fpsNominal=fraccion(v.r_frame_rate);
  if(!Number.isFinite(fpsMedio)||!Number.isFinite(fpsNominal)||Math.abs(fpsMedio-30)>1e-6||Math.abs(fpsNominal-30)>1e-6)throw Error('ffprobe: fps inválido o distinto de30.');
  if(Number(v.nb_read_frames??v.nb_frames)!==frames)throw Error('ffprobe: cantidad de frames incorrecta.');
  const duracion=Number(v.duration??data.format?.duration);
  if(!Number.isFinite(duracion)||Math.abs(duracion-frames/30)>1/30+0.001)throw Error('ffprobe: duración incorrecta.');
  if(v.width!==1920*escala||v.height!==1080*escala)throw Error('ffprobe: dimensiones incorrectas.');
  return {fps:30,frames,duracion,ancho:v.width,alto:v.height};
}
export function comandosGates(escena,base=raiz){
  const node=process.execPath,n=Number(escena.slice(1));
  const gates=[['cine',[node,['tests/validar-cine.mjs']]],['h02',[node,['tests/validar-h02.mjs']]],
    ['tsc',[node,[join(base,'node_modules/typescript/bin/tsc'),'--noEmit']]],
    ['eslint',[node,[join(base,'node_modules/eslint/bin/eslint.js'),'src']]],
    ['rigs',[node,['tests/validar-rigs.mjs']]],['mascotas',[node,['tests/verificar-mascotas.mjs']]],
    ['svg',[node,['tests/validar-svg-mascotas.mjs']]],['skill',[node,['.agents/skills/arranque-motion/scripts/validar-skill.mjs']]]];
  for(let i=3;i<=n;i++){const id=`s${String(i).padStart(2,'0')}`,p=`tests/validar-${id}.mjs`;if(!existsSync(join(base,p)))throw Error(`Gate obligatorio ausente: ${p}`);gates.push([id,[node,[p]]]);}
  return gates;
}
export async function main(){
  const o=argumentos({escena:'valor',composicion:'valor',bundle:'valor',salida:'valor','sin-videos':'bool'},
    'Uso: node scripts/certificar-produccion.mjs --escena S05 --composicion S05PostMemoria --bundle RUTA --salida NUEVACARPETA [--sin-videos]. Cierre técnico, aprobación audiovisual pendiente.');
  if(!/^S(?:0[3-9]|1[0-2])$/.test(o.escena??'')||!o.composicion||!o.bundle||!o.salida)throw Error('Faltan escena/composición/bundle/salida válidos.');
  const salida=resolve(raiz,o.salida),bundle=resolve(raiz,o.bundle);
  for(const d of ['src','public','tests','scripts']){const p=resolve(raiz,d);if(salida===p||salida.startsWith(p+sep))throw Error('Salida dentro de entradas evaluadas.');}
  if(salida===bundle||salida.startsWith(bundle+sep))throw Error('Salida dentro del bundle evaluado.');
  if(!existsSync(bundle))throw Error('Bundle inexistente.');
  if(existsSync(salida)&&readdirSync(salida).length)throw Error('La salida debe estar vacía.');
  const comp=(await catalogo()).find(c=>c.id===o.composicion&&c.escenas.length===1&&c.escenas[0].id===o.escena);
  if(!comp)throw Error('Composición/escena no coincide con registro.');
  const gates=comandosGates(o.escena),chrome=o['sin-videos']?null:chromeLocal();
  const report={version:1,escena:o.escena,composicion:comp.id,bundle,frames:comp.frames,fps:30,duracionEsperada:comp.frames/30,
    sinVideos:!!o['sin-videos'],estado:'en-curso',aprobacionAudiovisual:'pendiente',inicio:new Date().toISOString(),
    fuenteAntes:inventarioEntradas(raiz),bundleAntes:inventarioEntradas(bundle,true),ejecuciones:[],videos:[],
    entorno:{node:process.version,cliVersion:JSON.parse(readFileSync(join(raiz,'node_modules/@remotion/cli/package.json'),'utf8')).version,chrome,chromeSha256:chrome?hash(chrome):null},
    limites:['Bundle reutilizado: correspondencia con fuente actual no verificada.','Regresiones visuales no ejecutadas por este runner; necesitan expediente propio.','Gates/render/probe no constituyen aprobación audiovisual.']};
  mkdirSync(salida,{recursive:true});
  const guardar=()=>writeFileSync(join(salida,'resultado.json'),JSON.stringify(report,null,2));guardar();
  const ejecutar=(id,command)=>{const r=ejecutarConLog(command,salida,id);report.ejecuciones.push(r);guardar();return r;};
  try{
    for(const [id,command]of gates)ejecutar(id,command);
    report.fuenteTrasGates= inventarioEntradas(raiz);
    const gatesPasan=report.ejecuciones.every(e=>e.exitCode===0&&!e.error);
    if(gatesPasan&&report.fuenteTrasGates.sha256===report.fuenteAntes.sha256&&!o['sin-videos']){
      for(const [id,escala]of [['preview',0.5],['1080',1]]){
        const archivo=`${id}.mp4`,r=ejecutar(`render-${id}`,comandoRemotion(['render',bundle,comp.id,join(salida,archivo),`--scale=${escala}`,'--concurrency=2',`--browser-executable=${chrome}`]));
        if(r.exitCode!==0||r.error)continue;
        const probe=ejecutar(`ffprobe-${id}`,['ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',join(salida,archivo)]]);
        const video={archivo,escala,sha256:hash(join(salida,archivo)),probeExit:probe.exitCode};report.videos.push(video);
        if(probe.exitCode===0&&!probe.error){try{video.validacion=validarSondeo(JSON.parse(readFileSync(join(salida,probe.stdout),'utf8')),comp.frames,escala,readFileSync(join(salida,probe.stderr),'utf8'));}catch(e){video.error=e.message;}}
        guardar();
      }
    }
  }catch(e){report.error=e.message;}
  finally{
    try{report.fuenteDespues=inventarioEntradas(raiz);report.bundleDespues=inventarioEntradas(bundle,true);report.fuenteEstable=report.fuenteAntes.sha256===report.fuenteDespues.sha256&&report.fuenteAntes.sha256===report.fuenteTrasGates?.sha256;report.bundleEstable=report.bundleAntes.sha256===report.bundleDespues.sha256;}catch(e){report.error=e.message;}
    const gatesOK=report.ejecuciones.length>=gates.length&&report.ejecuciones.every(e=>e.exitCode===0&&!e.error);
    const videosOK=o['sin-videos']||report.videos.length===2&&report.videos.every(v=>v.validacion&&!v.error);
    report.exitGlobal=!report.error&&gatesOK&&videosOK&&report.fuenteEstable&&report.bundleEstable?0:1;
    report.estado=report.exitGlobal?'fallido':o['sin-videos']?'gates-pasan-videos-omitidos':'cierre-tecnico-pasa';report.fin=new Date().toISOString();guardar();
  }
  console.log(JSON.stringify({salida,estado:report.estado,exitGlobal:report.exitGlobal,gates:report.ejecuciones.slice(0,gates.length).map(e=>({id:e.id,exit:e.exitCode})),videos:report.videos.map(v=>({archivo:v.archivo,valido:!!v.validacion})),fuenteEstable:report.fuenteEstable,bundleEstable:report.bundleEstable,aprobacionAudiovisual:'pendiente'}));
  process.exitCode=report.exitGlobal;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{console.error(e.message);process.exitCode=1;});
