// Utilidades compartidas por los validadores de escenas S11–S12 (geometría de pantalla y mazo ATX).
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {proyectar} from "../src/arranque/cine/mundo.ts";

export const ov=(p,q)=>p[0]<q[2]&&p[2]>q[0]&&p[1]<q[3]&&p[3]>q[1];
export const zona=r=>[r.x-3,r.y-10,r.x+r.ancho+13,r.y+r.alto+3];
export const actorBox=(cam,p,h,c)=>{const q=proyectar(cam,[p[0]+c.desplazX,p[1],p[2]+(c.desplazZ??0)]),u=q.escala*h/512;return[q.x-216*u,q.y-(395+c.salto)*u,q.x+216*u,q.y+15*u];};
export const cuerpoBox=(cam,p,h,c)=>{const q=proyectar(cam,[p[0]+c.desplazX,p[1],p[2]+(c.desplazZ??0)]),u=q.escala*h/512;return {caja:[q.x-150*u,q.y-380*u,q.x+150*u,q.y+12*u],profundidad:q.profundidad};};

// Mazo ATX (Mundo3D, no importable): se lee su recorrido en la fuente.
const fuenteMazo=readFileSync(new URL("../src/arranque/cine/Mundo3D.tsx",import.meta.url),"utf8").split("export function recorridoMazo")[1].split("}")[0];
const baseMazo=[...fuenteMazo.matchAll(/\[([\d.]+), ([\d.]+), ([\d.]+) \+ desfase(?: \* ([\d.]+))?\]/g)].map(x=>[+x[1],+x[2],+x[3],x[4]?+x[4]:1]);
assert.equal(baseMazo.length,4,"recorrido del mazo leído");
export const puntosMazo=[];
for(const d of [-.35,0,.35])for(let i=0;i<=30;i++){const s=i/30*3,k=Math.min(2,Math.floor(s)),t=s-k,A=baseMazo[k],B=baseMazo[k+1];puntosMazo.push([A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,A[2]+d*A[3]+((B[2]+d*B[3])-(A[2]+d*A[3]))*t]);}
/** Falla si el cuerpo del personaje se pintaría sobre un tramo del mazo situado delante de él. */
export function sinMazoDelante(cam,id,lugar,alto,cuerpo,f){
 if(cuerpo.visible<=.01)return;
 const {caja:r,profundidad}=cuerpoBox(cam,lugar,alto,cuerpo);
 for(const pm of puntosMazo){const w=proyectar(cam,pm);if(w.profundidad<profundidad)assert.ok(!(w.x>r[0]&&w.x<r[2]&&w.y>r[1]&&w.y<r[3]),`${id} pintado sobre el mazo ATX f${f}`);}
}
/** Relojes declarados en el componente de escena: frame local y ambiente acumulado. */
export function comprobarRelojes(lineas,relojes){
 for(const[id,o]of relojes)assert.ok(lineas.some(l=>l.includes(`id="${id}"`)&&l.includes(`frameAmbiente={frame+${o}}`)&&l.includes("frame={frame}")),`reloj ${id}`);
}
