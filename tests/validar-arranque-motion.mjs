import {duracionEscena} from '../src/arranque/anclas.ts';
import {cuesDeEscena,anclasDeEscena} from '../src/arranque/recursos.ts';
// Pruebas de comportamiento de herramientas; nunca invocan un render.
import assert from 'node:assert/strict';
import {existsSync, readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync} from 'node:fs';
import {resolve, join, relative} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=process.cwd();
const skill='.agents/skills/arranque-motion';
assert.ok(existsSync(skill),'Falta la skill en su ubicación canónica');
const tmp=resolve('out/tmp-arranque-motion/pruebas');
assert.ok(!existsSync(tmp),'No sobrescribir una prueba anterior');
mkdirSync(tmp,{recursive:true});
const resultados=[];
function run(script,args=[],esperado=0){
  const r=spawnSync(process.execPath,[script,...args],{cwd:root,encoding:'utf8',windowsHide:true});
  resultados.push({comando:['node',script,...args],exitCode:r.status,esperado});
  assert.equal(r.status,esperado,`${script} ${args.join(' ')}\n${r.stdout}\n${r.stderr}`);
  return r.stdout;
}
const script=n=>`${skill}/scripts/${n}.mjs`;
try{
  const originalS03=readFileSync('src/arranque/cine/guion/S03.ts');
  const dry=run(script('nueva-escena'),['--salida',relative(root,join(tmp,'dry-run')),'--id','S03','--nombre','Primera instrucción','--componente','S03PrimeraInstruccion','--dry-run']);
  assert.ok(dry.includes('LUGARES.cpu'));assert.ok(dry.includes('S03-C01'));assert.ok(dry.includes('ANCLAS_VISUALES'));
  assert.deepEqual(readFileSync('src/arranque/cine/guion/S03.ts'),originalS03);
  assert.ok(!existsSync(join(tmp,'dry-run')));
  const salida=relative(root,join(tmp,'scaffold'));
  run(script('nueva-escena'),['--id','S03','--nombre','Prueba temporal','--componente','S03PruebaTemporal','--salida',salida]);
  assert.ok(existsSync(join(salida,'src/arranque/cine/guion/S03.ts')));
  assert.ok(readFileSync(join(salida,'src/arranque/escenas/S03PruebaTemporal.tsx'),'utf8').includes('<CapaAudio cues={cues}'));
  run('node_modules/typescript/bin/tsc');
  run(script('nueva-escena'),['--id','S03','--nombre','No sobrescribir','--componente','S03PruebaTemporal','--salida',salida],1);
  const plan=JSON.parse(run(script('revisar-escena'),['--composicion','MacroEncendido','--anclas','--secuencias','--video','--dry-run']));
  const n1=duracionEscena("S01"),n2=duracionEscena("S02"),macro=n1+n2;
  // Catálogo legado de la skill (solo lectura): la macro de revisión incluye S01/S02.
  assert.deepEqual(plan.cortes,[n1-1,n1]);assert.equal(plan.anclas.length,11);
  assert.equal(plan.anclas.find(a=>a.escena==='S02'&&a.evento==='boton').frame,n1+anclasDeEscena("S02",cuesDeEscena("S02")).boton);
  assert.equal(plan.secuencias.length,11);assert.equal(plan.commands.filter(c=>c[1][1]==='bundle').length,1);
  assert.ok(plan.commands.at(-1)[1].includes('--concurrency=2'));
  const frames=plan.frames.map(f=>f.frame);
  assert.ok([0,macro-1,...plan.cortes,...plan.anclas.map(a=>a.frame)].every(f=>frames.includes(f)));
  assert.equal(new Set(frames).size,frames.length);assert.ok(frames.every(f=>f>=0&&f<macro));
  for(const a of plan.anclas)for(let d=-6;d<=6;d++)assert.ok(frames.includes(a.frame+d));
  const manual=JSON.parse(run(script('revisar-escena'),['--composicion','S02ControlEncendido','--frames',`0,${n2-1}`,'--bundle','out/bundle','--dry-run']));
  assert.deepEqual(manual.frames.map(f=>f.frame),[0,n2-1]);assert.equal(manual.commands.length,2);
  run(script('revisar-escena'),['--composicion','MacroEncendido','--frames',String(macro),'--dry-run'],1);
  run(script('revisar-escena'),['--composicion','MacroEncendido','--frames','1,','--dry-run'],1);
  run(script('revisar-escena'),['--composicion','MacroEncendido','--escala','0','--dry-run'],1);
  run(script('revisar-escena'),['--composicion','S03PrimeraInstruccion','--dry-run'],0);
  run(script('revisar-escena'),['--desconocida'],1);
  const m=JSON.parse(readFileSync(`${skill}/assets/regresion/macro-encendido.json`,'utf8'));
  assert.deepEqual(m.frames.map(f=>f.frame),[6,140,330,578,684,928,1148,1320]);assert.equal(m.escala,1);
  for(const f of m.frames)assert.equal(createHash('sha256').update(readFileSync(`tests/fixtures/visual/macro-encendido/${f.archivo}`)).digest('hex'),f.sha256);
  const regresion=JSON.parse(run(script('regresion-visual'),['--manifiesto',`${skill}/assets/regresion/macro-encendido.json`,'--dry-run']));
  assert.equal(regresion.commands.length,9);
  const hoja=join(tmp,'hoja');mkdirSync(hoja);
  copyFileSync('tests/fixtures/visual/macro-encendido/macro-6.png',join(hoja,'frame-6.png'));
  const manifest=join(hoja,'manifest.json');writeFileSync(manifest,JSON.stringify({composicion:'Prueba <&>',frames:[{frame:6,archivo:'frame-6.png'}]}));
  run(script('revisar-escena'),['--hoja',manifest]);
  const html=readFileSync(join(hoja,'index.html'),'utf8');assert.ok(html.includes('Prueba &lt;&amp;&gt;'));assert.ok(html.includes('src="frame-6.png"'));
  const solver=run(script('buscar-camara'),['--sujetos','secu,cpu','--top','2']);assert.equal(solver.match(/satisfies Camara/g).length,2);
  run(script('buscar-camara'),['--sujetos','secu','--dry-run']);
  run(script('buscar-camara'),['--sujetos','desconocido','--dry-run'],1);
  const config=join(tmp,'camara.json');
  writeFileSync(config,JSON.stringify({camara:{px:[-6],py:[2],pz:[10],tx:[-1],ty:[0.5],tz:[0],fov:[44]},sujetos:[{lugar:[-2.6,0,1.6],alto:2.3,region:[0,0,1920,885],altura:[200,800]}]}));
  assert.ok(run(script('buscar-camara'),['--config',config]).includes('satisfies Camara'));
  run('scripts/enlazar-skills.mjs',['--dry-run']);
  run(script('validar-skill'),[]);
  console.log(`VALIDADO ARRANQUE-MOTION: ${resultados.length} comandos offline; planes, secuencias, hashes originales, solver, HTML, scaffold tipado y rechazo de sobrescritura.`);
}finally{
  writeFileSync(resolve('out/tmp-arranque-motion/pruebas-resultados.json'),JSON.stringify(resultados,null,2));
  // Ruta literal resuelta y comprobada dentro del directorio de pruebas.
  assert.equal(tmp,resolve(root,'out/tmp-arranque-motion/pruebas'));
  assert.ok(relative(root,tmp).startsWith('out'));
  rmSync(tmp,{recursive:true,force:true});
}
