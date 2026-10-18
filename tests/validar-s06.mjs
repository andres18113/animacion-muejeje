import {desfaseEscenas} from "../src/arranque/tiempo.ts";
const reloj = origen => `desfaseEscenas("S06", "${origen}")`;
import {duracionEscena} from "../src/arranque/anclas.ts";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {CUES_DIALOGO} from "../src/arranque/dialogo.ts";
import {segmentosDeCue} from "../src/arranque/subtitulos.ts";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {crearMotor} from "../src/arranque/cine/motor.ts";
import {GUION_S05,ALTURAS_S05,checkpointS05} from "../src/arranque/cine/guion/S05.ts";
import {GUION_S06,ALTURA_DISQUI,ESTRUCTURAS_S06,PROPS_S06,RUTAS_S06,fasesS06,lecturasS06,transferenciaRamS06} from "../src/arranque/cine/guion/S06.ts";
import {crearCamara,proyectar,LUGARES} from "../src/arranque/cine/mundo.ts";
import {puntoDeRuta} from "../src/arranque/cine/rutas.ts";
import {cajaVolumenS06} from "../src/arranque/cine/servicios-geometria.ts";
import {anclasDeEscena,cuesDeEscena} from "../src/arranque/recursos.ts";
import {displayPostinS05} from "../src/arranque/cine/postin-display.ts";
import {RIGS} from "../src/personajes/rigs.generated.ts";
import {bocaEnFrame,respiracionEnFrame} from "../src/personajes/labios.ts";
import {estaHablando} from "../src/arranque/subtitulos.ts";
const cues=cuesDeEscena("S06"),a=anclasDeEscena("S06",cues),b=fasesS06(a),aS05=anclasDeEscena("S05",cuesDeEscena("S05"));
const fin=crearMotor(GUION_S05,aS05,30).en(duracionEscena("S05") - 1),m=crearMotor(GUION_S06,a,30),estados=Array.from({length:duracionEscena("S06")},(_,f)=>m.en(f));
for(const k of ["cam","mundo","bios","romi","cmosi","cipu","postin","spedi","rami","secu","pulso"])assert.deepEqual(estados[0][k],fin[k],`S05:último→S06:0 ${k}`);
for(const[k,v]of Object.entries(fin.capa))assert.equal(estados[0].capa[k],v,`capa persistente ${k}`);
assert.equal(estados[0].capa.perifericosPresentes,0);assert.equal(estados[0].capa.discoPresente,0);
const otro=crearMotor(GUION_S06,a,30);for(let i=0;i<duracionEscena("S06");i++){const f=i*137%duracionEscena("S06");assert.deepEqual(otro.en(f),estados[f],`seek ${f}`);}
const {ivt,bda}=ESTRUCTURAS_S06;assert.equal(ivt.fin-ivt.inicio+1,ivt.entradas*ivt.bytesEntrada);assert.equal(ivt.entradas,256);assert.equal(ivt.bytesEntrada,4);
assert.equal(bda.inicio,ivt.fin+1);assert.equal(bda.fin-bda.inicio+1,256);assert.equal(ivt.inicio,0);assert.equal(bda.fin,0x4ff);
assert.deepEqual(ivt.campos.map(c=>[c.nombre,c.bytes,c.inicio]),[["Desplazamiento",2,0],["Segmento",2,2]]);
for(let i=0;i<256;i++)assert.ok(i*4+3<=0x3ff,"Entrada IVT dentro de región, sin valores inventados");
function causal(anclas){const t=fasesS06(anclas),n=crearMotor(GUION_S06,anclas,30);assert.ok(t.ivtFin<t.bdaInicio&&t.bdaFin<t.videoInicio&&t.videoFin<t.tecladoInicio&&t.tecladoFin<t.ideInicio&&t.ideFin<t.peticionInicio&&t.llegadaDisco<t.respuestaInicio&&t.respuestaFin<t.salida);assert.ok(t.corteDisqui>=t.finTextoBios&&t.finTextoDisqui<duracionEscena("S06"));
 for(let f=0;f<duracionEscena("S06");f++){const e=n.en(f);
  for(const [inicio,fin,campo,total]of [[t.ivtInicio,t.ivtFin,"ivtPreparacion",256],[t.bdaInicio,t.bdaFin,"bdaPreparacion",1]]){
   const envio=transferenciaRamS06(f,inicio,fin),destino=RUTAS_S06.ram.at(-1);
   if(e.capa[campo]>0){assert.ok(envio.recibido&&envio.frente===1,`${campo} escrito antes recepcion f${f}`);assert.deepEqual(envio.posicion,destino,"escritura solo con frente entregado en SDRAM");}
   if(f<=envio.recepcion)assert.equal(e.capa[campo],0,"sin escritura durante transporte ni al llegar");
   assert.ok(Math.abs(e.capa[campo]/total-envio.escritura)<1/total+.000002,"render y guion comparten progreso tras entrega");
   if(f>=fin)assert.equal(e.capa[campo],total,"estructura completa en final contractual");
   if(f>inicio&&f<envio.recepcion)assert.notDeepEqual(envio.posicion,destino,"frente aun en pista antes de recepcion");
  }
  if(e.capa.bdaPreparacion>0)assert.equal(e.capa.ivtPreparacion,256);
  if(e.capa.videoPeticion>0)assert.equal(e.capa.bdaPreparacion,1);
  if(e.capa.videoDisponible>0){assert.equal(e.capa.videoPeticion,1);assert.ok(puntoDeRuta(RUTAS_S06.vga,1).every((v,k)=>Math.abs(v-RUTAS_S06.vga.at(-1)[k])<1e-9));assert.ok(f>t.videoFin,"respuesta monitor despues llegada VGA");}
  if(f<=t.videoFin)assert.equal(e.capa.videoDisponible,0);
  if(e.capa.tecladoPeticion>0)assert.equal(e.capa.videoDisponible,1);
  if(e.capa.tecladoDisponible>0){assert.ok(puntoDeRuta(RUTAS_S06.ps2,1).every((v,k)=>Math.abs(v-RUTAS_S06.ps2.at(-1)[k])<1e-9));assert.ok(f>t.tecladoFin,"respuesta teclado despues llegada PS2");}
  if(f<=t.tecladoFin)assert.equal(e.capa.tecladoDisponible,0);
  if(e.capa.idePreparado>0)assert.equal(e.capa.tecladoDisponible,1);
  if(e.capa.discoDetectado>0)assert.equal(e.capa.discoPeticion,1);
  if(e.capa.discoRespuesta>0)assert.equal(e.capa.discoDetectado,1);
  if(e.capa.comunicacionDisponible>0){assert.equal(e.capa.discoRespuesta,1);assert.ok(f>t.respuestaFin,"BIOS confirma solo tras ACK recibido");}
  if(f<=t.llegadaDisco)assert.equal(e.capa.discoDetectado,0,"unidad no responde antes consulta");
  if(f<=t.respuestaFin)assert.equal(e.capa.comunicacionDisponible,0,"estado local disco no confirma recepcion CPU");
 }
}
causal(a);for(const delta of[-12,12])causal(Object.fromEntries(Object.entries(a).map(([k,v])=>[k,["preparar","disqui"].includes(k)?v:v+delta])));
const actores=[["bios",LUGARES.bios,2.3],["disqui",LUGARES.disqui,ALTURA_DISQUI],["romi",LUGARES.romi,2.3],["cmosi",LUGARES.cmosi,2.3],["cipu",[1.6,.36,-2.6],3],["postin",LUGARES.postin,ALTURAS_S05.postin],["spedi",LUGARES.spedi,ALTURAS_S05.spedi],["rami",LUGARES.rami,ALTURAS_S05.rami],["secu",LUGARES.secu,2.3],["pulso",LUGARES.pulso,2.3]];
const ov=(a,b)=>a[0]<b[2]&&a[2]>b[0]&&a[1]<b[3]&&a[3]>b[1],visible=b=>ov(b,[0,0,1920,1080]);
const actorBox=(cam,p,h,c)=>{const q=proyectar(cam,[p[0]+c.desplazX,p[1],p[2]]),u=q.escala*h/512;return[q.x-216*u,q.y-(395+c.salto)*u,q.x+216*u,q.y+15*u];};
let lecturas=0;const bandas=cues.flatMap(c=>c.segmentos.map(s=>[s.inicioFrame,s.finFrame+6]));
for(let f=0;f<duracionEscena("S06");f++){
 const e=estados[f],c=crearCamara(e.cam),ram=proyectar(c,LUGARES.rami),disk=proyectar(c,LUGARES.disqui),l=lecturasS06(ram,disk),boxes=actores.map(([id,p,h])=>[id,actorBox(c,p,h,e[id])]),zonas=[];
 if(e.capa.ramDetalle>0)zonas.push([l.ram.x-3,l.ram.y-16,l.ram.x+1020,l.ram.y+223]);
 if(e.capa.discoDetalle>0)zonas.push([l.disco.x-3,l.disco.y-9,l.disco.x+373,l.disco.y+103]);
 if(e.capa.perifericosPresentes>0&&f>=b.cortePerifericos&&f<b.corteDisqui){for(const[n,v]of [["VGA",PROPS_S06.monitor],["PS2",PROPS_S06.teclado]]){const q=cajaVolumenS06(c,v);zonas.push([q[0]+2,q[3]+5,q[0]+(n==="VGA"?106:126),q[3]+43]);}}
 for(const zone of zonas){assert.ok(zone[0]>=0&&zone[1]>=0&&zone[2]<=1920&&zone[3]<=885,`lectura fuera ${f}`);for(const[id,q]of boxes){if(e[id].visible>.01)assert.ok(!ov(zone,q),`${id} tapa lectura ${f}`);}lecturas++;}
 for(let i=0;i<zonas.length;i++)for(let j=i+1;j<zonas.length;j++)assert.ok(!ov(zonas[i],zonas[j]),`lecturas se tapan ${f}`);
 if(bandas.some(([desde,hasta])=>f>=desde&&f<hasta)){for(const[id,q]of boxes){if(e[id].visible>.01&&visible(q))assert.ok(q[3]<=885,`${id} invade subtítulo con cola f${f}`);}}
 for(const {cue,segmentos}of cues){const hasta=Math.max(...segmentos.map(s=>s.finFrame+6));if(f<cue.startFrame||f>=hasta)continue;const q=boxes.find(([id])=>id===cue.mascotId)[1];assert.ok(q[0]>=0&&q[1]>=0&&q[2]<=1920&&q[3]<=885);for(const[id,r]of boxes){if(id!==cue.mascotId&&e[id].visible>.01)assert.ok(!ov(q,r),`${id} tapa protagonista ${cue.mascotId} ${f}`);}}
}
// Revelación: cada anexo ya está montado, aparece fuera del plano previo, no se inserta.
const viewport=[0,0,1920,1080],cRAM=crearCamara(estados[32].cam),cPer=crearCamara(estados[b.ideInicio-2].cam);
for(const v of [PROPS_S06.tarjeta,PROPS_S06.monitor,PROPS_S06.teclado,PROPS_S06.mesa,PROPS_S06.pedestal,...[-4,1].flatMap(x=>[5.8,9.2].map(z=>({p:[x,0,z],t:[.18,.9,.18]}))),{p:RUTAS_S06.vga[0],t:[.28,.2,.5]}])assert.ok(!ov(cajaVolumenS06(cRAM,v),viewport),"revelación de periférico a la vista parece instalación");
for(const ruta of [RUTAS_S06.vga,RUTAS_S06.ps2])for(let i=0;i<=1000;i++){const q=proyectar(cRAM,puntoDeRuta(ruta,i/1000));assert.ok(q.profundidad<=0||q.x<0||q.x>1920||q.y<0||q.y>1080,"cables también revelados fuera de campo");}
assert.ok(!ov(cajaVolumenS06(cPer,PROPS_S06.disco),viewport),"disco debe revelarse fuera de campo");
for(let f=32;f<b.cortePerifericos;f++)assert.equal(estados[f].capa.perifericosPresentes,1);
assert.equal(PROPS_S06.tarjeta.p[1],.32,"tarjeta asentada sobre ranura, no flotante");
assert.ok(PROPS_S06.disco.p[0]-PROPS_S06.disco.t[0]/2>8.5,"disco exterior aPCB");
assert.ok(PROPS_S06.monitor.p[2]-PROPS_S06.monitor.t[2]/2>5.5,"CRT exterior al borde posterior");
assert.ok(PROPS_S06.teclado.p[2]-PROPS_S06.teclado.t[2]/2>5.5,"teclado exterior");
const mon=PROPS_S06.monitor;const dentro=p=>p[0]>mon.p[0]-mon.t[0]/2+1e-8&&p[0]<mon.p[0]+mon.t[0]/2-1e-8&&p[1]>mon.p[1]+1e-8&&p[1]<mon.p[1]+mon.t[1]-1e-8&&p[2]>mon.p[2]-mon.t[2]/2+1e-8&&p[2]<mon.p[2]+mon.t[2]/2-1e-8;
for(let i=1;i<RUTAS_S06.vga.length;i++)for(let j=0;j<=100;j++){const p=RUTAS_S06.vga[i-1].map((v,k)=>v+(RUTAS_S06.vga[i][k]-v)*j/100);assert.ok(!dentro(p),"VGA atraviesa CRT");}
assert.deepEqual(RUTAS_S06.vga.at(-1),[mon.p[0]-mon.t[0]/2,1.8,mon.p[2]]);
// Estación externa material: contactos físicos y separación en el encuadre de servicios.
assert.ok(PROPS_S06.mesa.p[2]-PROPS_S06.mesa.t[2]/2>=5.5,"mesa fuera huella PCB");
for(const ruta of [RUTAS_S06.vga,RUTAS_S06.ps2])for(let i=1;i<ruta.length;i++)for(let j=0;j<=100;j++){const p=ruta[i-1].map((v,k)=>v+(ruta[i][k]-v)*j/100),m=PROPS_S06.mesa;assert.ok(!(Math.abs(p[0]-m.p[0])<m.t[0]/2&&Math.abs(p[2]-m.p[2])<m.t[2]/2&&p[1]>m.p[1]&&p[1]<m.p[1]+m.t[1]),"cable atraviesa tablero");}
assert.equal(PROPS_S06.mesa.p[1]+PROPS_S06.mesa.t[1],PROPS_S06.teclado.p[1]);
assert.equal(PROPS_S06.mesa.p[1]+PROPS_S06.mesa.t[1],PROPS_S06.pedestal.p[1]);
assert.equal(PROPS_S06.pedestal.p[1]+PROPS_S06.pedestal.t[1],PROPS_S06.monitor.p[1]);
for(const v of [PROPS_S06.monitor,PROPS_S06.teclado,PROPS_S06.pedestal])for(const k of [0,2])assert.ok(Math.abs(v.p[k]-PROPS_S06.mesa.p[k])+v.t[k]/2<=PROPS_S06.mesa.t[k]/2,"huella apoyada dentro mesa");
for(let f=b.cortePerifericos;f<b.corteDisqui;f++){const c=crearCamara(estados[f].cam),agp=cajaVolumenS06(c,PROPS_S06.tarjeta),mon=cajaVolumenS06(c,PROPS_S06.monitor),key=cajaVolumenS06(c,PROPS_S06.teclado);assert.ok(!ov(agp,mon)&&!ov(agp,key)&&!ov(mon,key),`destinos separados de AGP ${f}`);for(const [id,p,h]of actores)if(estados[f][id].visible>.01)for(const box of [mon,key])assert.ok(!ov(box,actorBox(c,p,h,estados[f][id])),`${id} tapa periférico ${f}`);for(const box of [mon,key,cajaVolumenS06(c,PROPS_S06.mesa)])assert.ok(box[0]>=0&&box[1]>=0&&box[2]<=1920&&box[3]<=885,"estación íntegra en plano");}
// Voz local y ambiente continuo: defaults y máscara POST permanecen equivalentes.
for(let f=0;f<duracionEscena("S06");f++){const p=estados[f].postin;assert.deepEqual(displayPostinS05(p,f,30),displayPostinS05(p,f,30,f));assert.deepEqual(displayPostinS05(p,f,30,f+desfaseEscenas("S06", "S05")),displayPostinS05(p,f+desfaseEscenas("S06", "S05"),30));assert.equal(checkpointS05(f+desfaseEscenas("S06", "S05"),aS05),"28h");}
assert.ok(estaHablando(cues[0].cue,cues[0].segmentos,cues[0].segmentos[0].inicioFrame));assert.ok(!estaHablando(cues[0].cue,cues[0].segmentos,2436));
const escena=readFileSync(new URL("../src/arranque/escenas/S06ServiciosDispositivos.tsx",import.meta.url),"utf8"),actor=readFileSync(new URL("../src/arranque/cine/Actor.tsx",import.meta.url),"utf8");
assert.ok(actor.includes("frameAmbiente = frame")&&actor.includes("respiracionEnFrame(frameAmbiente")&&actor.includes("parpadeoEnFrame(frameAmbiente")&&actor.includes("estaHablando(cue.cue, cue.segmentos, frame)"));
assert.ok(escena.includes("<MemoriaMaterial e={e} frame={frame+desfaseEscenas(\"S06\", \"S05\")} fps={fps} a={aS05}"));
const postin=escena.split("\n").find(l=>l.includes("<PostinActivo"));assert.ok(postin.includes("frameAmbiente={frame+desfaseEscenas(\"S06\", \"S05\")}")&&!postin.includes("cue="),"no repetir cueS05");
for(const[id,offset]of [["bios",reloj("S04")],["romi",reloj("S04")],["cmosi",reloj("S04")],["cipu",reloj("S03")],["secu",reloj("S02")],["pulso",reloj("S02")],["spedi",reloj("S05")],["rami",reloj("S05")]])assert.ok(escena.split("\n").some(l=>l.includes(`id="${id}"`)&&l.includes(`frameAmbiente={frame+${offset}}`)),`fase ${id}`);
const alturas={};for(const {cue}of cues){const id=cue.mascotId,rig=RIGS[id],ys=[...rig.cuerpo.matchAll(/(?: y| cy)="([\d.]+)"/g)].map(m=>+m[1]),altoArte=Math.max(...rig.pies.map(p=>p.cy+p.ry))-Math.min(...ys),h=id==="bios"?2.3:ALTURA_DISQUI;let minimo=Infinity;
 for(let f=cue.startFrame;f<cue.startFrame+cue.durationFrames;f++){const e=estados[f],q=proyectar(crearCamara(e.cam),[LUGARES[id][0]+e[id].desplazX,LUGARES[id][1],LUGARES[id][2]]),amb=id==="bios"?f+2400:f;const size=q.escala*h*altoArte/512*(1+e[id].squash+.018*(respiracionEnFrame(amb,id,30)-.5));assert.ok(size>=200,`${id} figura real estimada pequeña ${f}`);minimo=Math.min(minimo,size);}alturas[id]=Number(minimo.toFixed(2));}
assert.ok(estados[4].bios.desplazX<estados[16].bios.desplazX&&estados[16].bios.desplazX<estados[28].bios.desplazX&&estados[16].bios.paso!==0,"locomoción continua con alternancia");
mkdirSync(new URL("../out/produccion/S06/",import.meta.url),{recursive:true});writeFileSync(new URL("../out/produccion/S06/evidencia-numerica.json",import.meta.url),JSON.stringify({frames:duracionEscena("S06"),lecturas,fases:b,alturaArtisticaMinimaEstimada:alturas,continuidad:"S05:último→S06:0",revelacionFueraDeCampo:true,relojesSeparados:true},null,2));
console.log(`VALIDADO S06:${duracionEscena("S06")}seeks,continuidad visible,IVT/BDA,causalidad perturbada,${lecturas}lecturas,protagonistas/colas,anexos externos y relojes independientes.`);

const material=readFileSync(new URL("../src/arranque/cine/ServiciosMaterial.tsx",import.meta.url),"latin1");assert.ok(material.includes("Unidad responde")&&!material.includes("Unidad detectada"),"estado local disco no afirma conocimiento BIOS");

// Compatibilidad exacta: hashes capturados ANTES del opt-in, todas las bocas S01-S05.
const fixtureBocas=JSON.parse(readFileSync(new URL("./fixtures/labios-defaults-s01-s05.json",import.meta.url),"utf8"));
// Estas huellas pertenecen a entradas estimadas anteriores a las voces reales.
// Congelar también sus ventanas: cambiar la duración de una toma no cambia el algoritmo labial.
const ventanasHistoricas=fixtureBocas.ventanasHistoricas;
const actualesBocas=[];
for(const actual of CUES_DIALOGO.filter(c=>/^S0[1-5]$/.test(c.sceneId))){
 // Entrada historica de S04-S05: conservar las huellas del algoritmo con su texto original.
 const ventana=ventanasHistoricas[actual.cueId];
 const cue={...actual,...(ventana?{startFrame:ventana[0],durationFrames:ventana[1]}:{}),speechText:/^S0[45]$/.test(actual.sceneId)?actual.displayText:actual.speechText};
 const hash=createHash("sha256"),segmentos=segmentosDeCue(cue);let muestras=0;
 for(let frame=0;frame<=cue.startFrame+cue.durationFrames+10;frame+=fixtureBocas.pasoFrames){hash.update(JSON.stringify([frame,bocaEnFrame({cue,segmentos,frame,fps:fixtureBocas.fps})]));muestras++;}
 actualesBocas.push({cueId:cue.cueId,muestras,sha256:hash.digest("hex")});
}
assert.deepEqual(actualesBocas,fixtureBocas.cues,"defaults S01-S05 deben conservar todas sus muestras exactas");
// Regresion de la rampa sobre su entrada estimada original, independiente de silencios TTS.
const cueBios=cues[0].cue,segBios=segmentosDeCue(cueBios);assert.equal(cueBios.rampaLabialFrames,2);
assert.deepEqual(CUES_DIALOGO.filter(c=>c.rampaLabialFrames!==undefined).map(c=>c.cueId),["S06-C01","S10-C01","S12-C02"],"rampa exclusivamente opt-in (S10/S12: texto fonético de voz)");
let maxDelta=0,anterior=0,maxApertura=0;
for(let frame=0;frame<=duracionEscena("S06");frame+=.25){const boca=bocaEnFrame({cue:cueBios,segmentos:segBios,frame,fps:30});maxDelta=Math.max(maxDelta,Math.abs(boca.apertura-anterior));maxApertura=Math.max(maxApertura,boca.apertura);anterior=boca.apertura;if(!estaHablando(cueBios,segBios,frame))assert.equal(boca.apertura,0);}
assert.ok(maxDelta<.26&&maxApertura>.2,"entrada A suave sin quitar el habla");
for(const valor of [0,-1,NaN,Infinity,-Infinity,null])assert.throws(()=>bocaEnFrame({cue:{...cueBios,rampaLabialFrames:valor},segmentos:segBios,frame:cueBios.startFrame,fps:30}),RangeError);
const sinOpt={...cueBios};delete sinOpt.rampaLabialFrames;
assert.ok(Math.abs(bocaEnFrame({cue:sinOpt,segmentos:segBios,frame:36.75,fps:30}).apertura-bocaEnFrame({cue:sinOpt,segmentos:segBios,frame:36.5,fps:30}).apertura)>.26,"regresion reproduce la causa A sin opt-in");
mkdirSync(new URL("../out/produccion/S06/correccion3/",import.meta.url),{recursive:true});
writeFileSync(new URL("../out/produccion/S06/correccion3/bocas-despues.json",import.meta.url),JSON.stringify({cues:actualesBocas,compatibilidadExacta:true,maxDeltaS06C01:maxDelta},null,2));
console.log(`VALIDADO LABIOS: ${actualesBocas.length}cues anteriores exactos, rampa2 opt-in, deltaS06=${maxDelta}, negativos rechazados.`);
