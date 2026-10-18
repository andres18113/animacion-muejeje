import {resolve, join} from 'node:path';
import {mkdirSync, existsSync} from 'node:fs';
import {argumentos, numero, raiz, fecha, json, guardar, hash, ejecutar, comandoRemotion, chromeLocal} from './comun.mjs';

const o=argumentos({manifiesto:'valor',actualizar:'bool',bundle:'valor','dry-run':'bool'},
  'Uso: node RUTA/scripts/regresion-visual.mjs --manifiesto FILE [--bundle out/bundle] [--actualizar] [--dry-run]\nRe-renderiza con CLI estándar y compara SHA-256; --actualizar sustituye hashes solo tras cambios aprobados. Nunca actualiza si falla un render.');
if(!o.manifiesto)throw Error('Falta --manifiesto.');
const file=resolve(o.manifiesto), m=json(file);
if(!/^[A-Za-z0-9-]+$/.test(m.composicion??'') || !m.frames?.length) throw Error('Manifiesto sin composición/frames.');
const escala=numero(m.escala,1,0.05,1);
for(const f of m.frames) {numero(f.frame,undefined,0,Infinity,true);if(!/^[a-f0-9]{64}$/.test(f.sha256??''))throw Error('SHA-256 inválido.');}
const salida=resolve(raiz,'out/regresion',fecha()), bundle=resolve(raiz,o.bundle??join(salida,'bundle'));
const commands=[];
if(!o.bundle)commands.push(['bundle','src/index.ts',`--out-dir=${bundle}`]);
const frames=m.frames.map(f=>({...f,archivo:`frame-${f.frame}.png`}));
for(const f of frames)commands.push(['still',bundle,m.composicion,join(salida,f.archivo),`--frame=${f.frame}`,`--scale=${escala}`]);
if(o['dry-run']){console.log(JSON.stringify({salida,actualizar:!!o.actualizar,commands:commands.map(comandoRemotion)},null,2));process.exit(0);}
if(o.bundle&&!existsSync(bundle))throw Error('Bundle local inexistente.');
const chrome=chromeLocal();
mkdirSync(salida,{recursive:true});
const exactos=commands.map(c=>comandoRemotion(c[0]==='bundle'?c:[...c,`--browser-executable=${chrome}`]));
const ejecuciones=[];
for(const [cmd,args] of exactos){
  try{ejecutar(cmd,args);ejecuciones.push({comando:[cmd,args],exitCode:0});}
  catch(e){ejecuciones.push({comando:[cmd,args],exitCode:e.exitCode??null,error:e.message});throw e;}
  finally{guardar(join(salida,'resultado.json'),{composicion:m.composicion,commands:exactos,ejecuciones});}
}
const resultados=frames.map(f=>({frame:f.frame,esperado:f.sha256,actual:hash(join(salida,f.archivo))}));
guardar(join(salida,'resultado.json'),{composicion:m.composicion,commands:exactos,ejecuciones,resultados});
if(o.actualizar){guardar(file,{...m,frames:m.frames.map((f,i)=>({...f,sha256:resultados[i].actual})),actualizado:fecha()});console.log('Hashes actualizados; conservar evidencia de aprobación.');}
else {const fallos=resultados.filter(f=>f.actual!==f.esperado);console.table(resultados.map(f=>({frame:f.frame,coincide:f.actual===f.esperado})));if(fallos.length)process.exitCode=1;}
