import {desfaseEscenas} from "../src/arranque/tiempo.ts";
const reloj = origen => `desfaseEscenas("S10", "${origen}")`;
import {duracionEscena} from "../src/arranque/anclas.ts";
import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {crearMotor} from "../src/arranque/cine/motor.ts";
import {ALTURA_DISQUI,RUTAS_S06} from "../src/arranque/cine/guion/S06.ts";
import {ALTURAS_S05} from "../src/arranque/cine/guion/S05.ts";
import {visibilidadPaqueteS08,anchoEtiqueta,ETIQUETA_PAQUETE,OCLUSORES_S08} from "../src/arranque/cine/guion/S08.ts";
import {GUION_S09,MEBRE_LUGAR,ALTURA_MEBRE} from "../src/arranque/cine/guion/S09.ts";
import {GUION_S10,GRUBI_LUGAR,ALTURA_GRUBI,MEBRE_DESPLAZAMIENTO_S10,ETAPAS_GRUB,MENU_LST,ARCHIVOS_EXT2,RUTAS_S10,PANEL_DISCO,PANEL_MENU,fasesS10} from "../src/arranque/cine/guion/S10.ts";
import {crearCamara,proyectar,LUGARES} from "../src/arranque/cine/mundo.ts";
import {puntoDeRuta} from "../src/arranque/cine/rutas.ts";
import {anclasDeEscena,cuesDeEscena} from "../src/arranque/recursos.ts";
import {ESCENAS} from "../src/arranque/escenas.ts";
import {CUES_DIALOGO} from "../src/arranque/dialogo.ts";
import {validarVozGenerada} from "./comun-voces.mjs";

const cues=cuesDeEscena("S10"),a=anclasDeEscena("S10",cues),b=fasesS10(a),N=duracionEscena("S10");
const fin=crearMotor(GUION_S09,anclasDeEscena("S09",cuesDeEscena("S09")),30).en(duracionEscena("S09") - 1),m=crearMotor(GUION_S10,a,30),estados=Array.from({length:N},(_,f)=>m.en(f));
for(const k of ["cam","mundo","bios","romi","cmosi","cipu","postin","spedi","rami","secu","pulso","disqui","mebre"])assert.deepEqual(estados[0][k],fin[k],`S09:último→S10:0 ${k}`);
// Persistencia: solo el mapa del MBR cede su lugar al mapa del disco.
for(const[k,v]of Object.entries(fin.capa))if(k!=="mbrPanel")for(let f=0;f<N;f++)assert.equal(estados[f].capa[k],v,`persistente ${k} f${f}`);
assert.equal(estados[N-1].capa.mbrPanel,0);
const otro=crearMotor(GUION_S10,a,30);for(let i=0;i<N;i++){const f=i*137%N;assert.deepEqual(otro.en(f),estados[f],`seek ${f}`);}

const spec=JSON.parse(readFileSync(new URL("./fixtures/boot-contract.json",import.meta.url),"utf8")).dialogue.S10;
assert.equal(cues.map(c=>c.cue.displayText).join(" "),spec);assert.deepEqual(cues.map(c=>c.cue.mascotId),["grubi"]);
assert.ok(CUES_DIALOGO.filter(c=>c.sceneId==="S10").every(c=>validarVozGenerada(c)&&c.rampaLabialFrames===(c.cueId==="S10-C01"||c.cueId==="S12-C02"?2:undefined)));
const contrato=ESCENAS.find(e=>e.id==="S10");assert.deepEqual([...contrato.personajes],["M13"]);assert.equal(contrato.siguienteEscena,"S11");
// §6.10: instalación de referencia, sin GRUB 2, core.img ni initrd.
assert.deepEqual(ETAPAS_GRUB.map(e=>e.nombre),["Stage 1","Stage 1.5","Stage 2"]);
assert.equal(ETAPAS_GRUB[1].archivo,"e2fs_stage1_5");assert.equal(ETAPAS_GRUB[1].ubicacion,"espacio de inserción");
assert.ok(ARCHIVOS_EXT2.every(f=>f.startsWith("/boot/")));assert.deepEqual([...contrato.operacion.configuracion.lineas],[...MENU_LST.lineas]);
assert.ok(MENU_LST.lineas.some(l=>l.startsWith("kernel "+MENU_LST.nucleo)));assert.ok(!MENU_LST.lineas.some(l=>/initrd/.test(l)),"sin initrd");
const fuentes=["../src/arranque/cine/guion/S10.ts","../src/arranque/cine/CargadorMaterial.tsx","../src/arranque/escenas/S10GrubLegacy.tsx"].map(p=>readFileSync(new URL(p,import.meta.url),"utf8")).join("\n");
assert.ok(!/core\.img|GRUB ?2|grub\.cfg|UEFI|initrd/i.test(fuentes),"sin GRUB 2 ni initrd");
assert.ok(RUTAS_S10.solicitud[0]===RUTAS_S06.ide[0]&&RUTAS_S10.solicitud.at(-1)===RUTAS_S06.cinta.at(-1));
assert.ok(GRUBI_LUGAR[0]<8.5&&Math.abs(GRUBI_LUGAR[2])<5.5&&MEBRE_LUGAR[0]+MEBRE_DESPLAZAMIENTO_S10.x<8.5&&Math.abs(MEBRE_LUGAR[2]+MEBRE_DESPLAZAMIENTO_S10.z)<5.5,"Grubi y Mebre sobre la PCB");
assert.ok(MEBRE_LUGAR[0]+MEBRE_DESPLAZAMIENTO_S10.x>7.22,"Mebre fuera de los zócalos DIMM");

function causal(anclas){
 const t=fasesS10(anclas),n=crearMotor(GUION_S10,anclas,30);
 assert.ok(t.s15.transferencia[1]<t.ejecuta15&&t.ejecuta15<t.rutaExt2&&t.rutaExt2+40<=t.s2.solicitud[0]&&t.s2.transferencia[1]<t.ejecuta2&&t.ejecuta2<t.menu.solicitud[0]&&t.menu.transferencia[1]<anclas.kernel,"orden de etapas");
 assert.ok(t.s15.solicitud[0]>anclas.localiza&&t.ejecuta15<=anclas.s15+10&&t.menu.solicitud[0]<anclas.config+12,"cargas durante su mención");
 let previo=1;
 for(let f=0;f<N;f++){const c=n.en(f).capa;
  assert.ok(c.ejecuta>=previo,"la ejecución solo avanza");previo=c.ejecuta;
  if(c.insercion>0)assert.equal(c.mbrStage1,1);
  if(c.s15Solicitud>0)assert.equal(c.insercion,1,"Stage 1 localiza antes de leer");
  for(const p of ["s15","s2","menu"]){if(c[`${p}Datos`]>0)assert.equal(c[`${p}Solicitud`],1,`${p} datos tras solicitud f${f}`);if(c[`${p}Transferencia`]>0)assert.equal(c[`${p}Datos`],1,`${p} copia tras datos f${f}`);}
  if(c.ejecuta>=2)assert.equal(c.s15Transferencia,1,"Stage 1.5 ejecuta ya en RAM");
  if(c.ext2Abierto>0)assert.ok(c.ejecuta>=2,"ext2 lo interpreta Stage 1.5");
  if(c.rutaStage2>0)assert.equal(c.ext2Abierto,1,`ext2 abierto antes de recorrerlo f${f}`);
  if(c.s2Solicitud>0)assert.equal(c.rutaStage2,1,"Stage 2 localizado antes de leerlo");
  if(c.ejecuta>=3)assert.equal(c.s2Transferencia,1);
  if(c.menuSolicitud>0)assert.equal(c.ejecuta,3,"menu.lst lo lee Stage 2");
  if(c.menuPanel>0)assert.ok(c.menuTransferencia>0);
  if(c.nucleoSeleccionado>0)assert.equal(c.menuPanel,1,"selección tras leer la configuración");
 }
}
causal(a);for(const d of[-12,12])causal(Object.fromEntries(Object.entries(a).map(([k,v])=>[k,k==="presenta"?v:v+d])));
const ult=estados[N-1];assert.deepEqual([ult.capa.ejecuta,ult.capa.nucleoSeleccionado,ult.capa.menuPanel,ult.grubi.visible],[3,1,1,1]);
assert.deepEqual([ult.mebre.desplazX,ult.mebre.desplazZ],[MEBRE_DESPLAZAMIENTO_S10.x,MEBRE_DESPLAZAMIENTO_S10.z]);

const actores=[["grubi",GRUBI_LUGAR,ALTURA_GRUBI],["mebre",MEBRE_LUGAR,ALTURA_MEBRE],["bios",LUGARES.bios,2.3],["cmosi",LUGARES.cmosi,2.3],["disqui",LUGARES.disqui,ALTURA_DISQUI],["romi",LUGARES.romi,2.3],["cipu",[1.6,.36,-2.6],3],["postin",LUGARES.postin,ALTURAS_S05.postin],["spedi",LUGARES.spedi,ALTURAS_S05.spedi],["rami",LUGARES.rami,ALTURAS_S05.rami],["secu",LUGARES.secu,2.3],["pulso",LUGARES.pulso,2.3]];
const actorBox=(cam,p,h,c)=>{const q=proyectar(cam,[p[0]+c.desplazX,p[1],p[2]+(c.desplazZ??0)]),u=q.escala*h/512;return[q.x-216*u,q.y-(395+c.salto)*u,q.x+216*u,q.y+15*u];};
const ov=(p,q)=>p[0]<q[2]&&p[2]>q[0]&&p[1]<q[3]&&p[3]>q[1],zona=r=>[r.x-3,r.y-10,r.x+r.ancho+13,r.y+r.alto+3];
const extra=[["mebre",MEBRE_LUGAR,ALTURA_MEBRE],["grubi",GRUBI_LUGAR,ALTURA_GRUBI]];
// Mazo ATX (Mundo3D, no importable): ningún personaje nuevo se pinta sobre el tramo que tiene delante.
const fuenteMazo=readFileSync(new URL("../src/arranque/cine/Mundo3D.tsx",import.meta.url),"utf8").split("export function recorridoMazo")[1].split("}")[0];
const baseMazo=[...fuenteMazo.matchAll(/\[([\d.]+), ([\d.]+), ([\d.]+) \+ desfase(?: \* ([\d.]+))?\]/g)].map(x=>[+x[1],+x[2],+x[3],x[4]?+x[4]:1]);
assert.equal(baseMazo.length,4,"recorrido del mazo leído");
const puntosMazo=[];for(const d of [-.35,0,.35])for(let i=0;i<=30;i++){const s=i/30*3,k=Math.min(2,Math.floor(s)),t=s-k,A=baseMazo[k],B=baseMazo[k+1];puntosMazo.push([A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,A[2]+d*A[3]+((B[2]+d*B[3])-(A[2]+d*A[3]))*t]);}
let lecturas=0,visibles=0;const bandas=cues.flatMap(c=>c.segmentos.map(s=>[s.inicioFrame,s.finFrame+6]));
for(let f=0;f<N;f++){
 const e=estados[f],c=crearCamara(e.cam),boxes=actores.map(([id,p,h])=>[id,actorBox(c,p,h,e[id])]),zonas=[];
 if(e.capa.discoPanel>0)zonas.push(["disco",zona(PANEL_DISCO)]);
 if(e.capa.menuPanel>0)zonas.push(["menu",zona(PANEL_MENU)]);
 for(const id of ["mebre","grubi"]){const[,l,h]=actores.find(x=>x[0]===id),cu=e[id];if(cu.visible<=.01)continue;const q=proyectar(c,[l[0]+cu.desplazX,l[1],l[2]+(cu.desplazZ??0)]),u=q.escala*h/512,r=[q.x-150*u,q.y-380*u,q.x+150*u,q.y+12*u];
  for(const pm of puntosMazo){const w=proyectar(c,pm);if(w.profundidad<q.profundidad)assert.ok(!(w.x>r[0]&&w.x<r[2]&&w.y>r[1]&&w.y<r[3]),`${id} pintado sobre el mazo ATX f${f}`);}}
 for(const[n,z]of zonas){assert.ok(z[0]>=0&&z[1]>=0&&z[2]<=1920&&z[3]<=885,`${n} fuera f${f}`);for(const[id,q]of boxes)if(e[id].visible>.01)assert.ok(!ov(z,q),`${id} tapa ${n} f${f}`);lecturas++;}
 if(e.capa.mbrPanel>0&&e.capa.discoPanel>0)assert.fail(`mapas MBR y disco simultáneos f${f}`);
 const q=boxes[0][1];
 if(f>=cues[0].cue.startFrame&&f<cues[0].cue.startFrame+cues[0].cue.durationFrames+6){assert.ok(q[0]>=0&&q[1]>=0&&q[2]<=1920&&q[3]<=885,`Grubi completo f${f}`);assert.ok(q[3]-q[1]>=200*410/512);}
 if(bandas.some(([d,h])=>f>=d&&f<h))for(const[id,r]of boxes)if(e[id].visible>.01&&ov(r,[0,0,1920,1080]))assert.ok(r[3]<=885,`${id} invade subtítulos f${f}`);
 // Paquetes rotulados: nunca recortados por un personaje situado delante.
 for(const[pre,et]of [["s15","Stage 1.5"],["s2","Stage 2"],["menu","menu.lst"]])for(const ruta of ["datos","transferencia"]){
  const t=e.capa[`${pre}${ruta==="datos"?"Datos":"Transferencia"}`];if(t<=0||t>=1)continue;
  const punto=puntoDeRuta(RUTAS_S10[ruta],t),p=proyectar(c,punto),w=anchoEtiqueta(et),v=visibilidadPaqueteS08(c,e,punto,extra,w);if(v<=0)continue;visibles++;
  const r=[p.x-w/2,p.y-ETIQUETA_PAQUETE.alto/2,p.x+w/2,p.y+ETIQUETA_PAQUETE.alto/2];
  assert.ok(r[3]<=885&&r[0]>=0&&r[2]<=1920,`${et} sobre la banda de subtítulos o fuera f${f}`);
  for(const[id,l,h]of [...OCLUSORES_S08,...extra]){const o=proyectar(c,[l[0]+e[id].desplazX,l[1],l[2]]);if(o.profundidad>=p.profundidad||e[id].visible<=.01)continue;const u=o.escala*h/512;assert.ok(!ov(r,[o.x-170*u,o.y-(380+e[id].salto)*u,o.x+170*u,o.y+10*u]),`${et} recortado por ${id} f${f}`);}
 }
}
assert.ok(visibles>30,"los paquetes se ven");
const escena=readFileSync(new URL("../src/arranque/escenas/S10GrubLegacy.tsx",import.meta.url),"utf8"),lineas=escena.split("\n");
for(const[id,o]of [["secu",reloj("S02")],["pulso",reloj("S02")],["cipu",reloj("S03")],["romi",reloj("S04")],["bios",reloj("S04")],["cmosi",reloj("S04")],["spedi",reloj("S05")],["rami",reloj("S05")],["disqui",reloj("S06")],["mebre",reloj("S09")]])assert.ok(lineas.some(l=>l.includes(`id="${id}"`)&&l.includes(`frameAmbiente={frame+${o}}`)&&l.includes("frame={frame}")&&!l.includes("cue=")),`reloj ${id}`);
assert.ok(lineas.some(l=>l.includes('id="grubi"')&&l.includes("cue={cues[0]}")));
{const i=id=>lineas.findIndex(l=>l.includes(`id="${id}"`));assert.ok(i("grubi")<i("bios")&&i("grubi")>i("cipu")&&i("grubi")>i("postin"),"orden de dibujo según profundidad: Cipu/Postín < Grubi < Bios");}
for(const t of ["frame={frame+desfaseEscenas(\"S10\", \"S05\")} fps={fps} a={aS05}","<ServiciosMaterial e={e} frame={frame+desfaseEscenas(\"S10\", \"S06\")} a={aS06}/>","<SeleccionMaterial e={e} frame={frame+desfaseEscenas(\"S10\", \"S07\")} a={aS07}/>","<LecturaMaterial e={e} frame={frame+desfaseEscenas(\"S10\", \"S08\")} a={aS08}/>","frame:frame+desfaseEscenas(\"S10\", \"S03\")","frameGlobal={frame+desfaseEscenas(\"S10\", \"S01\")} frameRelojS02={frame+desfaseEscenas(\"S10\", \"S02\")}","checkpointS05(frame+desfaseEscenas(\"S10\", \"S05\"),aS05)"])assert.ok(escena.includes(t),t);
mkdirSync(new URL("../out/produccion/S10/",import.meta.url),{recursive:true});
writeFileSync(new URL("../out/produccion/S10/evidencia-numerica.json",import.meta.url),JSON.stringify({frames:N,anclas:a,fases:b,lecturas,paquetesVisibles:visibles,continuidad:"S09:último=S10:0"},null,2));
console.log(`VALIDADO S10: ${N} seeks, continuidad S09:último, diálogo literal, Stage 1 → 1.5 → 2 con causalidad ±12, menu.lst antes de elegir núcleo, sin GRUB 2/initrd, ${lecturas} lecturas, paquetes sin recorte y relojes acumulados.`);
