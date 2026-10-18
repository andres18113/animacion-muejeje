import assert from 'node:assert/strict';
import {readFileSync, existsSync, readdirSync, realpathSync, lstatSync} from 'node:fs';
import {resolve, dirname, basename, join, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import ts from 'typescript';
import {argumentos, raiz, hash} from './comun.mjs';
const o=argumentos({'permitir-pendiente':'bool'},'Uso: node RUTA/scripts/validar-skill.mjs [--permitir-pendiente]\nValida frontmatter, enlaces, rutas/símbolos repo:, ayudas, unicidad y junction Claude. El modo pendiente permite solo la falta de instalación canónica; la informa sin afirmar discovery.');
const skill=resolve(dirname(fileURLToPath(import.meta.url)),'..'), archivo=join(skill,'SKILL.md');
const texto=readFileSync(archivo,'utf8');
const fm=texto.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);assert.ok(fm,'Frontmatter YAML');
const lineas=fm[1].split(/\r?\n/);assert.equal(lineas.length,2,'Solo name + description, escalares simples');
const name=lineas[0].match(/^name: ([a-z0-9]+(?:-[a-z0-9]+)*)$/)?.[1];
assert.equal(name,basename(skill));assert.ok(name.length<=64);
const description=lineas[1].match(/^description: (.+)$/)?.[1];assert.ok(description?.length>0&&description.length<=1024&&!/[<>]/.test(description));
assert.ok(texto.split('\n').length<300,'SKILL.md <300 líneas');
const enlaces=[...texto.matchAll(/\]\(([^)]+)\)/g)].map(m=>m[1]);
for(const link of enlaces)if(!/^(https?:|repo:|#)/.test(link))assert.ok(existsSync(resolve(skill,decodeURIComponent(link.split('#')[0]))),`Enlace: ${link}`);
const recursos=['references','scripts','assets'].flatMap(dir=>readdirSync(join(skill,dir),{recursive:true,withFileTypes:true}).filter(x=>x.isFile()).map(x=>join(x.parentPath,x.name)));
for(const p of recursos.filter(p=>/references|scripts/.test(relative(skill,p))))assert.ok(enlaces.some(l=>resolve(skill,l)===p),`Falta enlace desde SKILL.md: ${p}`);
const config=ts.readConfigFile(join(raiz,'tsconfig.json'),ts.sys.readFile);
const opts=ts.parseJsonConfigFileContent(config.config,ts.sys,raiz);
const program=ts.createProgram(opts.fileNames,opts.options), checker=program.getTypeChecker();
let citas=0;
for(const p of [archivo,...recursos.filter(p=>p.endsWith('.md'))]){
  const doc=readFileSync(p,'utf8');
  for(const m of doc.matchAll(/\]\(repo:([^\s)]+)\)/g)){
    const [ruta,simbolo]=decodeURIComponent(m[1]).split('#'), f=resolve(raiz,ruta);
    assert.ok(existsSync(f),`${p}: ruta ${ruta}`);citas++;
    if(simbolo){
      const source=program.getSourceFile(f), mod=source&&checker.getSymbolAtLocation(source);
      assert.ok(mod&&checker.getExportsOfModule(mod).some(s=>s.name===simbolo),`${ruta}: export ${simbolo}`);
    }
  }
  // Prohibir citas no verificables en enlaces: usar siempre repo: para fuentes.
  for(const m of doc.matchAll(/`((?:src|tests|docs)\/[^`\s]+\.(?:ts|tsx|mjs|md))`/g))assert.ok(existsSync(resolve(raiz,m[1])),`Ruta inline ${m[1]}`);
}
assert.ok(citas>=20,'Referencias deben citar fuentes reales.');
for(const p of recursos.filter(p=>p.endsWith('.mjs'))){
  const r=spawnSync(process.execPath,[p,'--help'],{cwd:raiz,encoding:'utf8',windowsHide:true});
  assert.equal(r.status,0,`${p} --help: ${r.stderr}`);assert.ok(r.stdout.trim(),`${p}: ayuda vacía`);
}
const canonico=join(raiz,'.agents/skills/arranque-motion'),claude=join(raiz,'.claude/skills/arranque-motion');
let pendiente=false;
if(!existsSync(canonico)||!existsSync(claude)){
  assert.ok(o['permitir-pendiente'],'Falta la junction de Claude Code: ejecutar node scripts/enlazar-skills.mjs.');pendiente=true;
}else{
  assert.ok(lstatSync(claude).isSymbolicLink(),'Claude debe usar junction/symlink.');
  assert.equal(realpathSync(canonico),realpathSync(claude));assert.equal(hash(archivo),hash(join(claude,'SKILL.md')));
}
const encontrados=[];
function recorrer(dir){for(const x of readdirSync(dir,{withFileTypes:true})){
  if(x.isSymbolicLink()||['node_modules','.git','out'].includes(x.name))continue;
  const p=join(dir,x.name);if(x.isDirectory())recorrer(p);
  else if(x.name==='SKILL.md'&&readFileSync(p,'utf8').replaceAll('\r\n','\n')===texto.replaceAll('\r\n','\n'))encontrados.push(p);
}}
recorrer(raiz);assert.deepEqual(encontrados,[archivo],'Una sola fuente SKILL.md');
console.log(`VALIDADO: ${citas} citas de fuentes, enlaces y ayudas. Discovery: ${pendiente?'PENDIENTE host (no validado)':'junction y bytes idénticos'}.`);
