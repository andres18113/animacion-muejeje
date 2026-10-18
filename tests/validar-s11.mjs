import {desfaseEscenas} from "../src/arranque/tiempo.ts";
const reloj = origen => `desfaseEscenas("S11", "${origen}")`;
import {duracionEscena} from "../src/arranque/anclas.ts";
import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {crearMotor} from "../src/arranque/cine/motor.ts";
import {ALTURA_DISQUI} from "../src/arranque/cine/guion/S06.ts";
import {ALTURAS_S05} from "../src/arranque/cine/guion/S05.ts";
import {visibilidadPaqueteS08,anchoEtiqueta,ETIQUETA_PAQUETE,OCLUSORES_S08} from "../src/arranque/cine/guion/S08.ts";
import {MEBRE_LUGAR,ALTURA_MEBRE} from "../src/arranque/cine/guion/S09.ts";
import {GUION_S10,GRUBI_LUGAR,ALTURA_GRUBI,RUTAS_S10,PANEL_DISCO,PANEL_MENU} from "../src/arranque/cine/guion/S10.ts";
import {GUION_S11,CABECERA_LINUX,CR0,PARAMETROS_LINUX,PANEL_NUCLEO,PANEL_CR0,fasesS11} from "../src/arranque/cine/guion/S11.ts";
import {crearCamara,proyectar,LUGARES} from "../src/arranque/cine/mundo.ts";
import {puntoDeRuta} from "../src/arranque/cine/rutas.ts";
import {anclasDeEscena,cuesDeEscena} from "../src/arranque/recursos.ts";
import {ESCENAS} from "../src/arranque/escenas.ts";
import {CUES_DIALOGO} from "../src/arranque/dialogo.ts";
import {validarVozGenerada} from "./comun-voces.mjs";
import {ov,zona,actorBox,sinMazoDelante,comprobarRelojes} from "./comun-escenas.mjs";

const cues=cuesDeEscena("S11"),a=anclasDeEscena("S11",cues),b=fasesS11(a),N=duracionEscena("S11");
const fin=crearMotor(GUION_S10,anclasDeEscena("S10",cuesDeEscena("S10")),30).en(duracionEscena("S10") - 1),m=crearMotor(GUION_S11,a,30),estados=Array.from({length:N},(_,f)=>m.en(f));
for(const k of ["cam","mundo","bios","romi","cmosi","cipu","postin","spedi","rami","secu","pulso","disqui","mebre","grubi"])assert.deepEqual(estados[0][k],fin[k],`S10:último→S11:0 ${k}`);
// Persistencia: solo menu.lst cede su lugar al panel del núcleo; `ejecuta` pasa a Linux en la entrada.
for(const[k,v]of Object.entries(fin.capa))if(!["menuPanel","ejecuta"].includes(k))for(let f=0;f<N;f++)assert.equal(estados[f].capa[k],v,`persistente ${k} f${f}`);
const otro=crearMotor(GUION_S11,a,30);for(let i=0;i<N;i++){const f=i*137%N;assert.deepEqual(otro.en(f),estados[f],`seek ${f}`);}

const spec=JSON.parse(readFileSync(new URL("./fixtures/boot-contract.json",import.meta.url),"utf8")).dialogue.S11;
assert.equal(cues.map(c=>c.cue.displayText).join(" "),spec);assert.deepEqual(cues.map(c=>c.cue.mascotId),["grubi"]);
assert.ok(CUES_DIALOGO.filter(c=>c.sceneId==="S11").every(c=>validarVozGenerada(c)&&c.rampaLabialFrames===undefined));
const contrato=ESCENAS.find(e=>e.id==="S11");assert.deepEqual([...contrato.personajes],["M13"]);assert.equal(contrato.siguienteEscena,"S12");
assert.ok(["RF-20","RF-21"].every(r=>contrato.requisitos.includes(r)));
// §6.11/§6.12: valores exactos.
assert.equal(String.fromCharCode(...CABECERA_LINUX.bytes),CABECERA_LINUX.firma);assert.deepEqual([...CABECERA_LINUX.bytes],[0x48,0x64,0x72,0x53]);
assert.deepEqual([...contrato.operacion.cabecera.hex],["0x48","0x64","0x72","0x53"]);
assert.deepEqual([CR0.pe.bit,CR0.pe.antes,CR0.pe.despues,CR0.pg.bit,CR0.pg.valor],[0,0,1,31,0]);
assert.equal(PARAMETROS_LINUX.lineaOrdenes,"root=/dev/hda1");assert.deepEqual([...PARAMETROS_LINUX.estructuras],["setup_header","boot_params"]);
const fuentes=["../src/arranque/cine/guion/S11.ts","../src/arranque/cine/LinuxMaterial.tsx","../src/arranque/escenas/S11TransferenciaNucleo.tsx"].map(p=>readFileSync(new URL(p,import.meta.url),"utf8")).join("\n");
assert.ok(!/0x1000\b|0x100000|0x90000|initrd|GRUB ?2|core\.img/i.test(fuentes),"sin direcciones de entrada inventadas, initrd ni GRUB 2");

function causal(anclas){
 const t=fasesS11(anclas),n=crearMotor(GUION_S11,anclas,30);
 assert.ok(t.nucleo.transferencia[1]<t.parametros&&t.parametros<t.cr0&&t.cr0<t.gdt&&t.gdt<t.pe&&t.pe<t.cedoInicio&&t.cedoFin<anclas.protocolo,"orden D02→D06");
 assert.ok(t.nucleo.transferencia[1]<=anclas.ram+6,"núcleo en RAM durante «hacia RAM»");
 // Todos los tramos de habla de la frase, trasladados junto al ancla perturbada.
 const tramos=cues[0].segmentos.filter(s=>s.texto.replace(/\s+/g," ").includes("modo protegido"));
 const delta=anclas.protegido-a.protegido;
 let flip=null;
 for(let f=0;f<N;f++){const c=n.en(f).capa;
  if(flip===null&&c.pe>=.5)flip=f;
  if(c.nucleoDatos>0)assert.equal(c.nucleoSolicitud,1);
  if(c.nucleoTransferencia>0)assert.equal(c.nucleoDatos,1);
  if(c.panelNucleo>0)assert.equal(c.nucleoTransferencia,1,"panel del núcleo tras copiarlo a RAM");
  if(c.parametrosListos>0)assert.ok(c.panelNucleo>0);
  if(c.gdt>0)assert.equal(c.panelCr0,1);
  if(c.pe>0)assert.equal(c.gdt,1,"GDT/segmentos antes de PE");
  if(c.cesion>0){assert.equal(c.pe,1,"entorno de 32 bits antes de ceder");assert.equal(c.parametrosListos,1);}
  if(c.entradaLinux>0)assert.equal(c.cesion,1);
  if(c.ejecuta===5)assert.equal(c.entradaLinux,1,"Linux ejecuta solo tras la entrada");
  if(f<t.cedoFin)assert.equal(c.ejecuta,3,"Stage 2 ejecuta hasta ceder");
 }
 assert.ok(tramos.some(s=>flip>=s.inicioFrame+delta&&flip<s.finFrame+delta),`PE 0→1 durante «modo protegido» (${flip})`);
}
causal(a);for(const d of[-12,12])causal(Object.fromEntries(Object.entries(a).map(([k,v])=>[k,v+d])));
const ult=estados[N-1].capa;assert.deepEqual([ult.ejecuta,ult.entradaLinux,ult.pe,ult.gdt,ult.panelNucleo,ult.panelCr0],[5,1,1,1,1,1]);

const actores=[["grubi",GRUBI_LUGAR,ALTURA_GRUBI],["mebre",MEBRE_LUGAR,ALTURA_MEBRE],["bios",LUGARES.bios,2.3],["cmosi",LUGARES.cmosi,2.3],["disqui",LUGARES.disqui,ALTURA_DISQUI],["romi",LUGARES.romi,2.3],["cipu",[1.6,.36,-2.6],3],["postin",LUGARES.postin,ALTURAS_S05.postin],["spedi",LUGARES.spedi,ALTURAS_S05.spedi],["rami",LUGARES.rami,ALTURAS_S05.rami],["secu",LUGARES.secu,2.3],["pulso",LUGARES.pulso,2.3]];
const extra=[["mebre",MEBRE_LUGAR,ALTURA_MEBRE],["grubi",GRUBI_LUGAR,ALTURA_GRUBI]];
let lecturas=0,visibles=0;const bandas=cues.flatMap(c=>c.segmentos.map(s=>[s.inicioFrame,s.finFrame+6]));
for(let f=0;f<N;f++){
 const e=estados[f],c=crearCamara(e.cam),boxes=actores.map(([id,p,h])=>[id,actorBox(c,p,h,e[id])]),zonas=[];
 if(e.capa.discoPanel>0)zonas.push(["disco",zona(PANEL_DISCO)]);
 if(e.capa.menuPanel>0)zonas.push(["menu",zona(PANEL_MENU)]);
 if(e.capa.panelNucleo>0)zonas.push(["nucleo",zona(PANEL_NUCLEO)]);
 if(e.capa.panelCr0>0)zonas.push(["cr0",zona(PANEL_CR0)]);
 for(const[id,l,h]of extra)sinMazoDelante(c,id,l,h,e[id],f);
 for(const[n,z]of zonas){assert.ok(z[0]>=0&&z[1]>=0&&z[2]<=1920&&z[3]<=885,`${n} fuera f${f}`);for(const[id,q]of boxes)if(e[id].visible>.01)assert.ok(!ov(z,q),`${id} tapa ${n} f${f}`);lecturas++;}
 for(let i=0;i<zonas.length;i++)for(let j=i+1;j<zonas.length;j++)assert.ok(!ov(zonas[i][1],zonas[j][1]),`${zonas[i][0]}/${zonas[j][0]} f${f}`);
 const q=boxes[0][1];
 if(f>=cues[0].cue.startFrame&&f<cues[0].cue.startFrame+cues[0].cue.durationFrames+6){assert.ok(q[0]>=0&&q[1]>=0&&q[2]<=1920&&q[3]<=885,`Grubi completo f${f}`);assert.ok(q[3]-q[1]>=200*410/512);}
 if(bandas.some(([d,h])=>f>=d&&f<h))for(const[id,r]of boxes)if(e[id].visible>.01&&ov(r,[0,0,1920,1080]))assert.ok(r[3]<=885,`${id} invade subtítulos f${f}`);
 for(const ruta of ["datos","transferencia"]){const t=e.capa[ruta==="datos"?"nucleoDatos":"nucleoTransferencia"];if(t<=0||t>=1)continue;
  const punto=puntoDeRuta(RUTAS_S10[ruta],t),p=proyectar(c,punto),w=anchoEtiqueta("vmlinuz"),v=visibilidadPaqueteS08(c,e,punto,extra,w);if(v<=0)continue;visibles++;
  const r=[p.x-w/2,p.y-ETIQUETA_PAQUETE.alto/2,p.x+w/2,p.y+ETIQUETA_PAQUETE.alto/2];assert.ok(r[3]<=885&&r[0]>=0&&r[2]<=1920,`vmlinuz en banda f${f}`);
  for(const[id,l,h]of [...OCLUSORES_S08,...extra]){const o=proyectar(c,[l[0]+e[id].desplazX,l[1],l[2]+(e[id].desplazZ??0)]);if(o.profundidad>=p.profundidad||e[id].visible<=.01)continue;const u=o.escala*h/512;assert.ok(!ov(r,[o.x-170*u,o.y-(380+e[id].salto)*u,o.x+170*u,o.y+10*u]),`vmlinuz recortado por ${id} f${f}`);}}
}
const escena=readFileSync(new URL("../src/arranque/escenas/S11TransferenciaNucleo.tsx",import.meta.url),"utf8"),lineas=escena.split("\n");
comprobarRelojes(lineas,[["secu",reloj("S02")],["pulso",reloj("S02")],["cipu",reloj("S03")],["romi",reloj("S04")],["bios",reloj("S04")],["cmosi",reloj("S04")],["spedi",reloj("S05")],["rami",reloj("S05")],["disqui",reloj("S06")],["mebre",reloj("S09")],["grubi",reloj("S10")]]);
assert.ok(lineas.some(l=>l.includes('id="grubi"')&&l.includes("cue={cues[0]}"))&&lineas.filter(l=>l.includes("cue=")).length===1);
for(const t of ["frame={frame+desfaseEscenas(\"S11\", \"S05\")} fps={fps} a={aS05}","<ServiciosMaterial e={e} frame={frame+desfaseEscenas(\"S11\", \"S06\")} a={aS06}/>","<SeleccionMaterial e={e} frame={frame+desfaseEscenas(\"S11\", \"S07\")} a={aS07}/>","<LecturaMaterial e={e} frame={frame+desfaseEscenas(\"S11\", \"S08\")} a={aS08}/>","frame:frame+desfaseEscenas(\"S11\", \"S03\")","frameGlobal={frame+desfaseEscenas(\"S11\", \"S01\")} frameRelojS02={frame+desfaseEscenas(\"S11\", \"S02\")}","checkpointS05(frame+desfaseEscenas(\"S11\", \"S05\"),aS05)","<NucleoMaterial e={e}/>"])assert.ok(escena.includes(t),t);
mkdirSync(new URL("../out/produccion/S11/",import.meta.url),{recursive:true});
writeFileSync(new URL("../out/produccion/S11/evidencia-numerica.json",import.meta.url),JSON.stringify({frames:N,anclas:a,fases:b,lecturas,paquetesVisibles:visibles,continuidad:"S10:último=S11:0"},null,2));
console.log(`VALIDADO S11: ${N} seeks, continuidad S10:último, diálogo literal, HdrS=48 64 72 53, CR0.PE 0→1 tras GDT durante su mención, PG=0, carga→parámetros→entorno→entrada (±12), ${lecturas} lecturas, paquetes ${visibles} sin recorte y relojes.`);
