import {readdirSync, existsSync, lstatSync, realpathSync, mkdirSync, symlinkSync} from 'node:fs';
import {resolve, join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const raiz=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
if(args.includes('--help')){console.log('Uso: node scripts/enlazar-skills.mjs [--dry-run]\nCrea enlaces faltantes de .claude/skills a cada carpeta .agents/skills. Windows: junction; otros: symlink. Nunca sustituye entradas existentes.');process.exit(0);}
if(args.some(a=>a!=='--dry-run'))throw Error('Opción desconocida.');
const destino=join(raiz,'.claude/skills');
if(!args.includes('--dry-run'))mkdirSync(destino,{recursive:true});
for(const e of readdirSync(join(raiz,'.agents/skills'),{withFileTypes:true}).filter(e=>e.isDirectory())){
  const origen=join(raiz,'.agents/skills',e.name), enlace=join(destino,e.name);
  let entrada;try{entrada=lstatSync(enlace);}catch(err){if(err.code!=='ENOENT')throw err;}
  if(entrada){
    if(entrada.isSymbolicLink()&&existsSync(enlace)&&realpathSync(enlace)===realpathSync(origen))console.log(`OK ${e.name}`);
    else{console.error(`CONFLICTO ${enlace}; no se modifica.`);process.exitCode=1;}
    continue;
  }
  if(args.includes('--dry-run')){console.log(`CREAR ${enlace} -> ${origen}`);continue;}
  // Windows: junction (sin privilegios de administrador, igual que las skills de Remotion); otros: symlink.
  symlinkSync(origen,enlace,process.platform==='win32'?'junction':'dir');
  if(realpathSync(enlace)!==realpathSync(origen))throw Error('Enlace no resuelve al origen.');
  console.log(`CREADO ${e.name}`);
}
