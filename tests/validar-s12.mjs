import {desfaseEscenas} from "../src/arranque/tiempo.ts";
const reloj = origen => `desfaseEscenas("S12", "${origen}")`;
import {duracionEscena} from "../src/arranque/anclas.ts";
import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {crearMotor} from "../src/arranque/cine/motor.ts";
import {ALTURA_DISQUI} from "../src/arranque/cine/guion/S06.ts";
import {ALTURAS_S05} from "../src/arranque/cine/guion/S05.ts";
import {MEBRE_LUGAR,ALTURA_MEBRE} from "../src/arranque/cine/guion/S09.ts";
import {GRUBI_LUGAR,ALTURA_GRUBI,PANEL_DISCO} from "../src/arranque/cine/guion/S10.ts";
import {GUION_S11,PANEL_NUCLEO,PANEL_CR0} from "../src/arranque/cine/guion/S11.ts";
import {GUION_S12,NUCLEO_LUGAR,INIT_LUGAR,ALTURA_NUCLEO,ALTURA_INIT,TAREAS_NUCLEO,PRIMER_PROCESO,PANEL_LINUX,PANEL_INIT,fasesS12} from "../src/arranque/cine/guion/S12.ts";
import {crearCamara,LUGARES} from "../src/arranque/cine/mundo.ts";
import {anclasDeEscena,cuesDeEscena} from "../src/arranque/recursos.ts";
import {estaHablando} from "../src/arranque/subtitulos.ts";
import {ESCENAS} from "../src/arranque/escenas.ts";
import {CUES_DIALOGO} from "../src/arranque/dialogo.ts";
import {validarVozGenerada} from "./comun-voces.mjs";
import {ov,zona,actorBox,cuerpoBox,sinMazoDelante,comprobarRelojes} from "./comun-escenas.mjs";

const cues=cuesDeEscena("S12"),a=anclasDeEscena("S12",cues),b=fasesS12(a),N=duracionEscena("S12");
const fin=crearMotor(GUION_S11,anclasDeEscena("S11",cuesDeEscena("S11")),30).en(duracionEscena("S11") - 1),m=crearMotor(GUION_S12,a,30),estados=Array.from({length:N},(_,f)=>m.en(f));
for(const k of ["cam","mundo","bios","romi","cmosi","cipu","postin","spedi","rami","secu","pulso","disqui","mebre","grubi"])assert.deepEqual(estados[0][k],fin[k],`S11:último→S12:0 ${k}`);
// Persistencia: solo se retiran los mapas del cargador al pasar a Linux.
for(const[k,v]of Object.entries(fin.capa))if(!["discoPanel","panelNucleo","panelCr0"].includes(k))for(let f=0;f<N;f++)assert.equal(estados[f].capa[k],v,`persistente ${k} f${f}`);
const otro=crearMotor(GUION_S12,a,30);for(let i=0;i<N;i++){const f=i*137%N;assert.deepEqual(otro.en(f),estados[f],`seek ${f}`);}

const spec=JSON.parse(readFileSync(new URL("./fixtures/boot-contract.json",import.meta.url),"utf8")).dialogue.S12;
assert.equal(cues.map(c=>c.cue.displayText).join(" "),spec);assert.deepEqual(cues.map(c=>c.cue.mascotId),["nucleo","init"]);
assert.ok(cues[1].cue.startFrame-(cues[0].cue.startFrame+cues[0].cue.durationFrames)>=8,"pausa entre hablantes");
for(let f=0;f<N;f++)assert.ok(!(estaHablando(cues[0].cue,cues[0].segmentos,f)&&estaHablando(cues[1].cue,cues[1].segmentos,f)),`dos bocas ${f}`);
assert.ok(CUES_DIALOGO.filter(c=>c.sceneId==="S12").every(c=>validarVozGenerada(c)&&c.rampaLabialFrames===(c.cueId==="S10-C01"||c.cueId==="S12-C02"?2:undefined)));
const contrato=ESCENAS.find(e=>e.id==="S12");assert.deepEqual([...contrato.personajes],["M14","M15"]);assert.equal(contrato.siguienteEscena,null);assert.ok(contrato.requisitos.includes("RF-22"));
assert.deepEqual(TAREAS_NUCLEO.map(t=>t.id),["memoria","interrupciones","controladores","raiz"]);
assert.deepEqual(PRIMER_PROCESO,{ruta:"/sbin/init",pid:1});
const fuentes=["../src/arranque/cine/guion/S12.ts","../src/arranque/cine/LinuxMaterial.tsx","../src/arranque/escenas/S12InicioSistema.tsx"].map(p=>readFileSync(new URL(p,import.meta.url),"utf8")).join("\n");
assert.ok(!/systemd|initramfs|initrd|UEFI/i.test(fuentes),"sin systemd, initramfs ni initrd");

function causal(anclas){
 const t=fasesS12(anclas),n=crearMotor(GUION_S12,anclas,30);
 assert.ok(t.tareas.memoria<t.tareas.interrupciones&&t.tareas.interrupciones<t.tareas.controladores&&t.tareas.controladores<t.tareas.raiz&&t.tareas.raiz+8<=t.exec[0]&&t.exec[1]<=t.aparecenInit&&t.aparecenInit<anclas.init+2&&t.pid1<anclas.pid1&&t.bios<=anclas.bios,"orden D07→D09");
 for(let f=0;f<N;f++){const e=n.en(f),c=e.capa;
  if(f<t.aparece)assert.equal(e.nucleo.visible,0,"Linux no aparece antes de la entrada (S11)");
  if(c.memoria>0)assert.ok(e.nucleo.visible>0);
  if(c.interrupciones>0)assert.equal(c.memoria,1);
  if(c.controladores>0)assert.equal(c.interrupciones,1);
  if(c.raiz>0)assert.equal(c.controladores,1,"raíz montada con el controlador IDE/ext2 listo");
  if(c.exec>0)assert.equal(c.raiz,1,"init solo después de montar la raíz");
  if(e.init.visible>0)assert.equal(c.exec,1,"PID 1 creado por el núcleo");
  if(c.pid1>0)assert.equal(e.init.visible,1);
  if(c.biosReposo>0)assert.equal(c.pid1,1);
  assert.equal(e.bios.visible,1,"el BIOS no desaparece");
 }
}
causal(a);for(const d of[-12,12])causal(Object.fromEntries(Object.entries(a).map(([k,v])=>[k,v+d])));
const ult=estados[N-1];assert.deepEqual([ult.capa.raiz,ult.capa.pid1,ult.capa.sistemaListo,ult.capa.biosReposo,ult.nucleo.visible,ult.init.visible,ult.capa.ejecuta],[1,1,1,1,1,1,5]);

const actores=[["nucleo",NUCLEO_LUGAR,ALTURA_NUCLEO],["init",INIT_LUGAR,ALTURA_INIT],["grubi",GRUBI_LUGAR,ALTURA_GRUBI],["mebre",MEBRE_LUGAR,ALTURA_MEBRE],["bios",LUGARES.bios,2.3],["cmosi",LUGARES.cmosi,2.3],["disqui",LUGARES.disqui,ALTURA_DISQUI],["romi",LUGARES.romi,2.3],["cipu",[1.6,.36,-2.6],3],["postin",LUGARES.postin,ALTURAS_S05.postin],["spedi",LUGARES.spedi,ALTURAS_S05.spedi],["rami",LUGARES.rami,ALTURAS_S05.rami],["secu",LUGARES.secu,2.3],["pulso",LUGARES.pulso,2.3]];
let lecturas=0;const bandas=cues.flatMap(c=>c.segmentos.map(s=>[s.inicioFrame,s.finFrame+6]));
for(let f=0;f<N;f++){
 const e=estados[f],c=crearCamara(e.cam),boxes=actores.map(([id,p,h])=>[id,actorBox(c,p,h,e[id])]),zonas=[];
 if(e.capa.discoPanel>0)zonas.push(["disco",zona(PANEL_DISCO)]);
 if(e.capa.panelNucleo>0)zonas.push(["nucleoS11",zona(PANEL_NUCLEO)]);
 if(e.capa.panelCr0>0)zonas.push(["cr0",zona(PANEL_CR0)]);
 if(e.capa.panelLinux>0)zonas.push(["linux",zona(PANEL_LINUX)]);
 if(e.capa.panelInit>0)zonas.push(["init",zona(PANEL_INIT)]);
 for(const[id,l,h]of actores.slice(0,4))sinMazoDelante(c,id,l,h,e[id],f);
 assert.ok(Math.abs(GRUBI_LUGAR[0]+e.grubi.desplazX)<8.5&&Math.abs(GRUBI_LUGAR[2]+e.grubi.desplazZ)<5.5,"Grubi sobre la PCB");
 for(const[n,z]of zonas){assert.ok(z[0]>=0&&z[1]>=0&&z[2]<=1920&&z[3]<=885,`${n} fuera f${f}`);for(const[id,q]of boxes)if(e[id].visible>.01)assert.ok(!ov(z,q),`${id} tapa ${n} f${f}`);lecturas++;}
 for(let i=0;i<zonas.length;i++)for(let j=i+1;j<zonas.length;j++)assert.ok(!ov(zonas[i][1],zonas[j][1]),`${zonas[i][0]}/${zonas[j][0]} f${f}`);
 for(const {cue,segmentos}of cues){const hasta=Math.max(...segmentos.map(s=>s.finFrame+6));if(f<cue.startFrame||f>=hasta)continue;const q=boxes.find(([id])=>id===cue.mascotId)[1];assert.ok(q[0]>=0&&q[1]>=0&&q[2]<=1920&&q[3]<=885,`${cue.mascotId} completo f${f}`);assert.ok(q[3]-q[1]>=200*410/512);}
 if(bandas.some(([d,h])=>f>=d&&f<h))for(const[id,r]of boxes)if(e[id].visible>.01&&ov(r,[0,0,1920,1080]))assert.ok(r[3]<=885,`${id} invade subtítulos f${f}`);
 // Tras apartarse, Grubi queda visible: ningún personaje delante cubre más del 20 % de su cuerpo.
 if(f>=b.aparece+62){const g=cuerpoBox(c,GRUBI_LUGAR,ALTURA_GRUBI,e.grubi),area=(g.caja[2]-g.caja[0])*(g.caja[3]-g.caja[1]);let tapado=0;
  for(const[id,l,h]of actores){if(id==="grubi"||e[id].visible<=.01)continue;const o=cuerpoBox(c,l,h,e[id]);if(o.profundidad<g.profundidad)tapado+=Math.max(0,Math.min(g.caja[2],o.caja[2])-Math.max(g.caja[0],o.caja[0]))*Math.max(0,Math.min(g.caja[3],o.caja[3])-Math.max(g.caja[1],o.caja[1]));}
  assert.ok(tapado/area<.2,`Grubi tapado ${Math.round(100*tapado/area)}% f${f}`);}
 // Núcleo e Init no se tapan entre sí.
 if(e.nucleo.visible>.01&&e.init.visible>.01){const[n,i]=[boxes[0][1],boxes[1][1]];const solape=Math.max(0,Math.min(n[2],i[2])-Math.max(n[0],i[0]));assert.ok(solape<60,`Núcleo/Init solapados f${f}`);}
}
const escena=readFileSync(new URL("../src/arranque/escenas/S12InicioSistema.tsx",import.meta.url),"utf8"),lineas=escena.split("\n");
comprobarRelojes(lineas,[["secu",reloj("S02")],["pulso",reloj("S02")],["cipu",reloj("S03")],["romi",reloj("S04")],["bios",reloj("S04")],["cmosi",reloj("S04")],["spedi",reloj("S05")],["rami",reloj("S05")],["disqui",reloj("S06")],["mebre",reloj("S09")],["grubi",reloj("S10")]]);
assert.ok(lineas.some(l=>l.includes('id="nucleo"')&&l.includes("cue={cues[0]}"))&&lineas.some(l=>l.includes('id="init"')&&l.includes("cue={cues[1]}"))&&lineas.filter(l=>l.includes("cue=")).length===2);
for(const t of ["frame={frame+desfaseEscenas(\"S12\", \"S05\")} fps={fps} a={aS05}","<ServiciosMaterial e={e} frame={frame+desfaseEscenas(\"S12\", \"S06\")} a={aS06}/>","<SeleccionMaterial e={e} frame={frame+desfaseEscenas(\"S12\", \"S07\")} a={aS07}/>","<LecturaMaterial e={e} frame={frame+desfaseEscenas(\"S12\", \"S08\")} a={aS08}/>","frame:frame+desfaseEscenas(\"S12\", \"S03\")","frameGlobal={frame+desfaseEscenas(\"S12\", \"S01\")} frameRelojS02={frame+desfaseEscenas(\"S12\", \"S02\")}","checkpointS05(frame+desfaseEscenas(\"S12\", \"S05\"),aS05)","<SistemaMaterial e={e}/>"])assert.ok(escena.includes(t),t);
mkdirSync(new URL("../out/produccion/S12/",import.meta.url),{recursive:true});
writeFileSync(new URL("../out/produccion/S12/evidencia-numerica.json",import.meta.url),JSON.stringify({frames:N,anclas:a,fases:b,lecturas,continuidad:"S11:último=S12:0"},null,2));
console.log(`VALIDADO S12: ${N} seeks, continuidad S11:último, diálogo literal Núcleo→Init, memoria→interrupciones→controladores→raíz→/sbin/init PID 1 (±12), BIOS presente en reposo, sin systemd/initrd, ${lecturas} lecturas y relojes.`);
