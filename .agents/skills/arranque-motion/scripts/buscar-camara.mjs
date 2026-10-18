import {readFileSync} from 'node:fs';
import {argumentos, cargar, numero} from './comun.mjs';
const o=argumentos({config:'valor',sujetos:'valor',top:'valor','dry-run':'bool'},
  'Uso: node RUTA/scripts/buscar-camara.mjs [--config archivo.json] [--sujetos secu,cpu] [--top 5] [--dry-run]\nJSON: {camara:{px:[-6,-2,2],py:[2,3,1],pz:[6,10,2],tx:[0],ty:[0.5],tz:[0],fov:[38,42,2]}, sujetos:[{lugar:"secu" o [x,y,z],alto:2.3,region:[xmin,ymin,xmax,ymax],altura:[200,700],caja:true}], ordenProfundidad:[0,1]}. Rangos [inicio,fin,paso]; un elemento fija valor. Región en píxeles 1920x1080. Orden: primer plano → fondo.');
const {LUGARES,crearCamara,proyectar}=await cargar('src/arranque/cine/mundo.ts');
const config=o.config?JSON.parse(readFileSync(o.config,'utf8')):{
  camara:{px:[-6,0,2],py:[2,4,1],pz:[6,10,2],tx:[-1,1,1],ty:[0.5],tz:[0],fov:[36,44,4]},
  sujetos:(o.sujetos??'secu,cpu').split(',').map(lugar=>({lugar,alto:2.3,region:[0,0,1920,885],altura:[200,800],caja:true}))};
const campos=['px','py','pz','tx','ty','tz','fov'];
function rango(a,k){
  if(!Array.isArray(a)||![1,3].includes(a.length)||a.some(n=>!Number.isFinite(n)))throw Error(`Rango inválido: ${k}`);
  if(k==='fov'&&a.some((v,i)=>i<2&&(v<=0||v>=180)))throw Error('FOV fuera de rango.');
  if(a.length===1)return a;
  const [inicio,fin,paso]=a;if(paso<=0||fin<inicio)throw Error(`Rango inválido: ${k}`);
  const n=Math.floor((fin-inicio)/paso)+1;if(n>1000)throw Error('Demasiados valores por parámetro.');
  return Array.from({length:n},(_,i)=>inicio+i*paso);
}
const rangos=campos.map(k=>rango(config.camara[k],k));
const cantidad=rangos.reduce((n,a)=>n*a.length,1);if(cantidad>2000000)throw Error('Máximo 2 millones de candidatos; reduce la malla.');
if(!config.sujetos?.length)throw Error('Faltan sujetos.');
const sujetos=config.sujetos.map(s=>{
  const p=typeof s.lugar==='string'?LUGARES[s.lugar]:s.lugar;
  if(!Array.isArray(p)||p.length!==3||p.some(n=>!Number.isFinite(n)))throw Error('Lugar desconocido o coordenadas inválidas.');
  const region=s.region??[0,0,1920,885], altura=s.altura??[200,800];
  if(region.length!==4||region.some(n=>!Number.isFinite(n))||region[0]>=region[2]||region[1]>=region[3]||altura.length!==2||altura.some(n=>!Number.isFinite(n))||altura[0]>altura[1])throw Error('Restricciones inválidas.');
  return {...s,p,region,altura,alto:numero(s.alto,2.3,0.01,100)};
});
const orden=config.ordenProfundidad??(sujetos.length>1?[0,1]:[]);
if(orden.some(i=>!Number.isInteger(i)||i<0||i>=sujetos.length))throw Error('ordenProfundidad inválido.');
const top=numero(o.top,5,1,100,true), mejores=[];
if(o['dry-run']){console.log(JSON.stringify({candidatos:cantidad,sujetos},null,2));process.exit(0);}
function probar(cam){
  const c=crearCamara(cam), vector=c.getWorldDirection(c.position.clone()), ps=sujetos.map(s=>proyectar(c,s.p));
  let score=0;
  for(let i=0;i<sujetos.length;i++){
    const s=sujetos[i],p=ps[i],h=p.escala*s.alto,u=h/512;
    // proyectar.profundidad es distancia euclídea; comprobar el semiespacio explícitamente.
    const delante=vector.x*(s.p[0]-cam.px)+vector.y*(s.p[1]-cam.py)+vector.z*(s.p[2]-cam.pz)>0;
    const [x0,y0,x1,y1]=s.region;
    const caja=s.caja===false?[p.x,p.y,p.x,p.y]:[p.x-216*u,p.y-395*u,p.x+216*u,p.y+15*u];
    if(!delante||h<s.altura[0]||h>s.altura[1]||caja[0]<x0||caja[1]<y0||caja[2]>x1||caja[3]>y1)return;
    score+=Math.hypot((p.x-(x0+x1)/2)/(x1-x0),((caja[1]+caja[3])/2-(y0+y1)/2)/(y1-y0));
  }
  for(let i=1;i<orden.length;i++)if(ps[orden[i-1]].profundidad>=ps[orden[i]].profundidad)return;
  mejores.push({camara:{...cam},score,alturas:ps.map((p,i)=>p.escala*sujetos[i].alto)});mejores.sort((a,b)=>a.score-b.score);mejores.length=Math.min(mejores.length,top);
}
function recorrer(i,cam){if(i===campos.length){probar(cam);return;}for(const n of rangos[i])recorrer(i+1,{...cam,[campos[i]]:n});}
recorrer(0,{});
if(!mejores.length){console.error('Sin candidatos válidos; amplía la malla o revisa restricciones.');process.exitCode=1;}
for(const m of mejores)console.log(`// score=${m.score.toFixed(4)} alturas=${m.alturas.map(n=>n.toFixed(0)).join(',')}\n${JSON.stringify(m.camara)} satisfies Camara;`);
