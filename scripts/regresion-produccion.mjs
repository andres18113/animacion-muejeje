/** Regresión por protocolo de captura aprobado: nunca actualiza goldens. */
import {closeSync,existsSync,mkdirSync,openSync,readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {join,relative,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {argumentos,raiz,hash,comandoRemotion,chromeLocal} from '../.agents/skills/arranque-motion/scripts/comun.mjs';

const o=argumentos({manifiesto:'valor',bundle:'valor',salida:'valor',verificar:'valor'},
  'Uso: node scripts/regresion-produccion.mjs --manifiesto RUTA --bundle RUTA --salida RUTA\nVerificación sin render ni escrituras: --manifiesto RUTA --verificar CARPETA_PNG_O_SALIDA. Renderiza el perfil completo; compara solo goldens. Nunca actualiza hashes.');
if(!o.manifiesto) throw Error('Falta --manifiesto.');
const manifiesto=resolve(raiz,o.manifiesto),m=JSON.parse(readFileSync(manifiesto,'utf8'));
if(m.metodo!=='secuencia-png'||!Array.isArray(m.perfilCaptura)||!m.perfilCaptura.length) throw Error('Falta protocolo secuencia-png/perfilCaptura aprobado.');
const perfil=m.perfilCaptura;
if(perfil.some((f,i)=>!Number.isInteger(f)||f<0||(i>0&&f<=perfil[i-1]))) throw Error('perfilCaptura debe contener frames enteros únicos ordenados.');
if(m.escala!==1||m.ancho!==1920||m.alto!==1080||m.fps!==30) throw Error('Esta herramienta exige perfil1920×1080,30fps,escala1.');
if(!m.frames?.length||m.frames.some(f=>!perfil.includes(f.frame)||!/^element-\d+\.png$/.test(f.archivo)||!/^([a-f0-9]{64})$/.test(f.sha256))) throw Error('Goldens inválidos o fuera del perfil.');
function validarPerfilPng(carpeta){
  const errores=[],mapa=new Map(),png=[];
  if(!existsSync(carpeta))return {errores:['Carpeta PNG ausente'],png};
  for(const e of readdirSync(carpeta,{withFileTypes:true})){
    if(!e.name.toLowerCase().endsWith('.png'))continue;
    const match=/^element-(\d+)\.png$/.exec(e.name);
    if(!e.isFile()||!match){errores.push(`PNG inesperado: ${e.name}`);continue;}
    const frame=Number(match[1]);
    if(mapa.has(frame)){errores.push(`Frame duplicado: ${frame}`);continue;}
    mapa.set(frame,e.name);
    if(!perfil.includes(frame))errores.push(`Frame extra: ${frame}`);
    const archivo=join(carpeta,e.name),firma=readFileSync(archivo).subarray(0,8).toString('hex');
    if(firma!=='89504e470d0a1a0a')errores.push(`Firma PNG inválida: ${e.name}`);
    png.push({frame,archivo,sha256:hash(archivo)});
  }
  for(const frame of perfil)if(!mapa.has(frame))errores.push(`Frame ausente: ${frame}`);
  if(mapa.size!==perfil.length)errores.push(`Cantidad PNG: ${mapa.size}; esperada: ${perfil.length}`);
  png.sort((a,b)=>a.frame-b.frame);
  return {errores,png,cantidadEsperada:perfil.length,cantidadReal:mapa.size};
}
function comparar(carpeta){
  return m.frames.map(f=>{
    const archivo=join(carpeta,f.archivo),existe=existsSync(archivo),actual=existe?hash(archivo):null;
    return {frame:f.frame,archivo,esperado:f.sha256,actual,pasa:actual===f.sha256};
  });
}
if(o.verificar){
  if(o.bundle||o.salida) throw Error('--verificar no admite --bundle ni --salida.');
  const base=resolve(raiz,o.verificar),carpeta=existsSync(join(base,'png'))?join(base,'png'):base;
  const captura=validarPerfilPng(carpeta);
  const frames=comparar(carpeta),passed=frames.filter(f=>f.pasa).length;
  const exit=passed===frames.length&&captura.errores.length===0?0:1;
  console.log(JSON.stringify({modo:'solo-comparacion-hashes-sin-render',manifiesto,carpeta,passed,total:frames.length,exit,captura,frames},null,2));
  process.exitCode=exit;
}else{
  if(!o.bundle||!o.salida)throw Error('Faltan --bundle/--salida.');
  const bundle=resolve(raiz,o.bundle),salida=resolve(raiz,o.salida);
  if(!existsSync(bundle)) throw Error('Bundle inexistente.');
  if(existsSync(salida)&&readdirSync(salida).length)throw Error('Salida debe estar vacía.');
  const chrome=chromeLocal();
  function inventario(base){
    const archivos=[];
    function recorrer(p){for(const e of readdirSync(p,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const f=join(p,e.name);if(e.isDirectory())recorrer(f);else if(e.isFile())archivos.push({archivo:relative(base,f).replaceAll('\\','/'),sha256:hash(f)});}}
    recorrer(base);return {sha256:createHash('sha256').update(JSON.stringify(archivos)).digest('hex'),archivos};
  }
  mkdirSync(salida,{recursive:true});
  const command=comandoRemotion(['render',bundle,m.composicion,join(salida,'png'),'--sequence','--image-format=png',`--frames=${perfil.join(',')}`,'--scale=1','--concurrency=2',`--browser-executable=${chrome}`]);
  const reporte={version:1,manifiesto,manifiestoSha256:hash(manifiesto),capturaManifest:m.capturaManifest,metodo:m.metodo,
    config:{composicion:m.composicion,ancho:m.ancho,alto:m.alto,fps:m.fps,escala:1,concurrency:2,perfilCaptura:perfil,cantidadFramesCaptura:perfil.length},
    bundle,bundleAntes:inventario(bundle),chrome,chromeSha256:hash(chrome),node:process.version,
    cliVersion:JSON.parse(readFileSync(join(raiz,'node_modules/@remotion/cli/package.json'),'utf8')).version,
    command,log:'render.log',inicio:new Date().toISOString(),nota:'Bundle reutilizado: correspondencia con fuente actual no verificada. Captura completa; comparación solo de goldens aprobados.'};
  const guardar=()=>writeFileSync(join(salida,'resultado.json'),JSON.stringify(reporte,null,2));guardar();
  const fd=openSync(join(salida,reporte.log),'w');let p;
  try{p=spawnSync(command[0],command[1],{cwd:raiz,stdio:['ignore',fd,fd],windowsHide:true});}finally{closeSync(fd);}
  reporte.exitComando=p.status;reporte.error=p.error?.message??null;reporte.fin=new Date().toISOString();reporte.logSha256=hash(join(salida,reporte.log));
  reporte.bundleDespues=inventario(bundle);reporte.bundleEstable=reporte.bundleAntes.sha256===reporte.bundleDespues.sha256;
  reporte.captura=validarPerfilPng(join(salida,'png'));
  reporte.frames=comparar(join(salida,'png'));reporte.passed=reporte.frames.filter(f=>f.pasa).length;reporte.total=reporte.frames.length;
  reporte.exitGlobal=!p.error&&p.status===0&&reporte.bundleEstable&&reporte.passed===reporte.total&&reporte.captura.errores.length===0?0:1;
  guardar();console.log(JSON.stringify({salida,passed:reporte.passed,total:reporte.total,framesCaptura:perfil.length,bundleEstable:reporte.bundleEstable,exitGlobal:reporte.exitGlobal}));process.exitCode=reporte.exitGlobal;
}
