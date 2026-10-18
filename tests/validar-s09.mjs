import {desfaseEscenas} from "../src/arranque/tiempo.ts";
const reloj = origen => `desfaseEscenas("S09", "${origen}")`;
import {duracionEscena} from "../src/arranque/anclas.ts";
import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {crearMotor} from "../src/arranque/cine/motor.ts";
import {ALTURA_DISQUI} from "../src/arranque/cine/guion/S06.ts";
import {ALTURAS_S05} from "../src/arranque/cine/guion/S05.ts";
import {panelBios} from "../src/arranque/cine/guion/S07.ts";
import {GUION_S08,panelRamS08} from "../src/arranque/cine/guion/S08.ts";
import {GUION_S09,MBR,PANEL_MBR,MEBRE_LUGAR,ALTURA_MEBRE,celdaMBR,binario8,palabraFirma,tamanoRegion,fasesS09} from "../src/arranque/cine/guion/S09.ts";
import {crearCamara,proyectar,LUGARES} from "../src/arranque/cine/mundo.ts";
import {anclasDeEscena,cuesDeEscena} from "../src/arranque/recursos.ts";
import {ESCENAS} from "../src/arranque/escenas.ts";
import {CUES_DIALOGO} from "../src/arranque/dialogo.ts";
import {validarVozGenerada} from "./comun-voces.mjs";

const cues=cuesDeEscena("S09"),a=anclasDeEscena("S09",cues),b=fasesS09(a),N=duracionEscena("S09");
const fin=crearMotor(GUION_S08,anclasDeEscena("S08",cuesDeEscena("S08")),30).en(duracionEscena("S08") - 1),m=crearMotor(GUION_S09,a,30),estados=Array.from({length:N},(_,f)=>m.en(f));
for(const k of ["cam","mundo","bios","romi","cmosi","cipu","postin","spedi","rami","secu","pulso","disqui"])assert.deepEqual(estados[0][k],fin[k],`S08:último→S09:0 ${k}`);
// Estados heredados constantes; solo el panel RAM de S08 se transforma en el mapa del MBR.
for(const[k,v]of Object.entries(fin.capa))if(k!=="ramPanel")for(let f=0;f<N;f++)assert.equal(estados[f].capa[k],v,`persistente ${k} f${f}`);
assert.equal(estados[0].capa.ramPanel,1);assert.equal(estados[N-1].capa.ramPanel,0);
const otro=crearMotor(GUION_S09,a,30);for(let i=0;i<N;i++){const f=i*137%N;assert.deepEqual(otro.en(f),estados[f],`seek ${f}`);}

// Diálogo §8 literal; Mebre habla solo de su propio contenido.
const spec=JSON.parse(readFileSync(new URL("./fixtures/boot-contract.json",import.meta.url),"utf8")).dialogue.S09;
assert.equal(cues.map(c=>c.cue.displayText).join(" "),spec);assert.deepEqual(cues.map(c=>c.cue.mascotId),["mebre"]);
assert.ok(CUES_DIALOGO.filter(c=>c.sceneId==="S09").every(c=>validarVozGenerada(c)&&c.rampaLabialFrames===undefined));
const contrato=ESCENAS.find(e=>e.id==="S09");assert.deepEqual([...contrato.personajes],["M12"]);assert.equal(contrato.siguienteEscena,"S10");
// §6.9: valores exactos.
assert.equal(tamanoRegion(MBR.codigo)+tamanoRegion(MBR.particiones)+tamanoRegion(MBR.firma),MBR.bytes);
assert.deepEqual([tamanoRegion(MBR.codigo),tamanoRegion(MBR.particiones),tamanoRegion(MBR.firma)],[446,64,2]);
assert.equal(MBR.particiones.entradas*MBR.particiones.bytesEntrada,64);
assert.deepEqual([MBR.codigo.desde,MBR.codigo.hasta,MBR.particiones.desde,MBR.particiones.hasta,MBR.firma.desde,MBR.firma.hasta],[0,0x1BD,0x1BE,0x1FD,0x1FE,0x1FF]);
assert.deepEqual(MBR.firma.valores.map(binario8),["01010101","10101010"]);assert.equal(palabraFirma(),0xAA55);
const est=contrato.operacion.estructura;assert.equal(est.codigo.bytes,446);assert.equal(est.particiones.bytes,64);assert.deepEqual([...est.firma.binario],["01010101","10101010"]);assert.equal(est.firma.palabraLittleEndian,"0xAA55");
assert.equal(PANEL_MBR.columnas*PANEL_MBR.filas,MBR.bytes,"una celda por byte");
assert.ok(0<=MBR.codigo.hasta,"la referencia de ejecución apunta al offset 0, dentro del código");

function causal(anclas){
 const t=fasesS09(anclas),n=crearMotor(GUION_S09,anclas,30);
 assert.ok(t.codigo<anclas.codigo&&t.tabla<anclas.tabla&&t.firma<=anclas.firma&&t.valor<anclas.valor&&t.stage1<anclas.stage1&&t.entregaInicio<anclas.control&&t.entregaFin<anclas.lectura&&t.finMbr<=anclas.bytes+10,"fases ancladas");
 for(let f=0;f<N;f++){const c=n.en(f).capa;
  if(c.regionCodigo>0)assert.ok(c.mbrPanel>0);
  if(c.regionTabla>0)assert.equal(c.regionCodigo,1,"tabla después del código");
  if(c.regionFirma>0)assert.equal(c.regionTabla,1,"firma después de la tabla");
  if(c.firmaValor>0)assert.ok(c.regionFirma>0);
  if(c.stage1>0)assert.equal(c.regionFirma,1);
  if(c.entrega>0)assert.equal(c.stage1,1,"control tras identificar Stage 1");
  if(c.ejecutaStage1>0){assert.equal(c.entrega,1,"ejecución solo tras la entrega");assert.ok(f>=t.entregaFin);}
 }
 // §9.3: 55 AA iluminados durante la frase que menciona la firma.
 // La frase real tiene varios tramos: comprobar habla, no solo el primer fragmento.
 // La perturbación traslada también la ventana pronunciada del ancla.
 const tramos=cues[0].segmentos.filter(s=>s.texto.replace(/\s+/g," ").includes("firma final"));
 const delta=anclas.firma-a.firma,frame=anclas.firma+2;
 assert.ok(n.en(frame).capa.regionFirma>0&&tramos.some(s=>frame>=s.inicioFrame+delta&&frame<s.finFrame+delta),"firma iluminada durante su mención");
}
causal(a);for(const d of[-12,12])causal(Object.fromEntries(Object.entries(a).map(([k,v])=>[k,k==="presenta"?v:v+d])));
assert.deepEqual([estados[N-1].capa.ejecutaStage1,estados[N-1].capa.mbrPanel,estados[N-1].capa.biosPanelFuera],[1,1,1]);
assert.equal(estados[N-1].mebre.visible,1);

const actores=[["mebre",MEBRE_LUGAR,ALTURA_MEBRE],["bios",LUGARES.bios,2.3],["cmosi",LUGARES.cmosi,2.3],["disqui",LUGARES.disqui,ALTURA_DISQUI],["romi",LUGARES.romi,2.3],["cipu",[1.6,.36,-2.6],3],["postin",LUGARES.postin,ALTURAS_S05.postin],["spedi",LUGARES.spedi,ALTURAS_S05.spedi],["rami",LUGARES.rami,ALTURAS_S05.rami],["secu",LUGARES.secu,2.3],["pulso",LUGARES.pulso,2.3]];
const actorBox=(cam,p,h,c)=>{const q=proyectar(cam,[p[0]+c.desplazX,p[1],p[2]+(c.desplazZ??0)]),u=q.escala*h/512;return[q.x-216*u,q.y-(395+c.salto)*u,q.x+216*u,q.y+15*u];};
const ov=(p,q)=>p[0]<q[2]&&p[2]>q[0]&&p[1]<q[3]&&p[3]>q[1],zona=r=>[r.x-3,r.y-10,r.x+r.ancho+13,r.y+r.alto+3];
// Mazo ATX (Mundo3D, no importable): ningún personaje nuevo se pinta sobre el tramo que tiene delante.
const fuenteMazo=readFileSync(new URL("../src/arranque/cine/Mundo3D.tsx",import.meta.url),"utf8").split("export function recorridoMazo")[1].split("}")[0];
const baseMazo=[...fuenteMazo.matchAll(/\[([\d.]+), ([\d.]+), ([\d.]+) \+ desfase(?: \* ([\d.]+))?\]/g)].map(x=>[+x[1],+x[2],+x[3],x[4]?+x[4]:1]);
assert.equal(baseMazo.length,4,"recorrido del mazo leído");
const puntosMazo=[];for(const d of [-.35,0,.35])for(let i=0;i<=30;i++){const s=i/30*3,k=Math.min(2,Math.floor(s)),t=s-k,A=baseMazo[k],B=baseMazo[k+1];puntosMazo.push([A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,A[2]+d*A[3]+((B[2]+d*B[3])-(A[2]+d*A[3]))*t]);}
let lecturas=0;const bandas=cues.flatMap(c=>c.segmentos.map(s=>[s.inicioFrame,s.finFrame+6]));
for(let f=0;f<N;f++){
 const e=estados[f],c=crearCamara(e.cam),boxes=actores.map(([id,p,h])=>[id,actorBox(c,p,h,e[id])]),zonas=[];
 if(e.capa.mbrPanel>0)zonas.push(["mbr",zona(PANEL_MBR)]);
 if(e.capa.ramPanel>0)zonas.push(["ram",zona(panelRamS08(c))]);
 {const pb=panelBios(c,3,e.capa.planoRam);if(pb.opacidad*(1-e.capa.biosPanelFuera)>0)zonas.push(["rutina",zona(pb)]);}
 for(const id of ["mebre"]){const[,l,h]=actores.find(x=>x[0]===id),cu=e[id];if(cu.visible<=.01)continue;const q=proyectar(c,[l[0]+cu.desplazX,l[1],l[2]+(cu.desplazZ??0)]),u=q.escala*h/512,r=[q.x-150*u,q.y-380*u,q.x+150*u,q.y+12*u];
  for(const pm of puntosMazo){const w=proyectar(c,pm);if(w.profundidad<q.profundidad)assert.ok(!(w.x>r[0]&&w.x<r[2]&&w.y>r[1]&&w.y<r[3]),`${id} pintado sobre el mazo ATX f${f}`);}}
 for(const[n,z]of zonas){assert.ok(z[0]>=0&&z[1]>=0&&z[2]<=1920&&z[3]<=885,`${n} fuera f${f}`);for(const[id,q]of boxes)if(e[id].visible>.01)assert.ok(!ov(z,q),`${id} tapa ${n} f${f}`);lecturas++;}
 for(let i=0;i<zonas.length;i++)for(let j=i+1;j<zonas.length;j++)assert.ok(!ov(zonas[i][1],zonas[j][1]),`${zonas[i][0]}/${zonas[j][0]} f${f}`);
 const q=boxes[0][1];
 if(f>=cues[0].cue.startFrame&&f<cues[0].cue.startFrame+cues[0].cue.durationFrames+6){assert.ok(q[0]>=0&&q[1]>=0&&q[2]<=1920&&q[3]<=885,`Mebre completa f${f}`);assert.ok(q[3]-q[1]>=200*410/512);}
 if(bandas.some(([d,h])=>f>=d&&f<h))for(const[id,r]of boxes)if(e[id].visible>.01&&ov(r,[0,0,1920,1080]))assert.ok(r[3]<=885,`${id} invade subtítulos f${f}`);
 if(f>=b.entregaInicio&&f<=b.entregaFin+20){const r=boxes[1][1];assert.ok(r[0]>=0&&r[2]<=1920,`Bios en cuadro durante la entrega f${f}`);}
}
assert.ok(celdaMBR(511).x+PANEL_MBR.celda[0]<=PANEL_MBR.x+PANEL_MBR.ancho);
const escena=readFileSync(new URL("../src/arranque/escenas/S09EstructuraMbr.tsx",import.meta.url),"utf8"),lineas=escena.split("\n");
for(const[id,o]of [["secu",reloj("S02")],["pulso",reloj("S02")],["cipu",reloj("S03")],["romi",reloj("S04")],["bios",reloj("S04")],["cmosi",reloj("S04")],["spedi",reloj("S05")],["rami",reloj("S05")],["disqui",reloj("S06")]])assert.ok(lineas.some(l=>l.includes(`id="${id}"`)&&l.includes(`frameAmbiente={frame+${o}}`)&&l.includes("frame={frame}")&&!l.includes("cue=")),`reloj ${id}`);
assert.ok(lineas.some(l=>l.includes('id="mebre"')&&l.includes("cue={cues[0]}")));
for(const t of ["frame={frame+desfaseEscenas(\"S09\", \"S05\")} fps={fps} a={aS05}","<ServiciosMaterial e={e} frame={frame+desfaseEscenas(\"S09\", \"S06\")} a={aS06}/>","<SeleccionMaterial e={e} frame={frame+desfaseEscenas(\"S09\", \"S07\")} a={aS07}/>","<LecturaMaterial e={e} frame={frame+desfaseEscenas(\"S09\", \"S08\")} a={aS08}/>","frame:frame+desfaseEscenas(\"S09\", \"S03\")","frameGlobal={frame+desfaseEscenas(\"S09\", \"S01\")} frameRelojS02={frame+desfaseEscenas(\"S09\", \"S02\")}","checkpointS05(frame+desfaseEscenas(\"S09\", \"S05\"),aS05)"])assert.ok(escena.includes(t),t);
const material=readFileSync(new URL("../src/arranque/cine/CargadorMaterial.tsx",import.meta.url),"utf8");
assert.ok(!/VBR|sistema operativo válido|core\.img|GRUB 2/i.test(material),"sin VBR obligatorio, sin afirmar SO válido");
mkdirSync(new URL("../out/produccion/S09/",import.meta.url),{recursive:true});
writeFileSync(new URL("../out/produccion/S09/evidencia-numerica.json",import.meta.url),JSON.stringify({frames:N,anclas:a,fases:b,lecturas,continuidad:"S08:último=S09:0"},null,2));
console.log(`VALIDADO S09: ${N} seeks, continuidad S08:último, diálogo literal, 446+64+2=512, 4×16, 55AA=01010101/10101010 → 0xAA55, firma durante su mención, entrega al código, causalidad ±12, ${lecturas} lecturas y relojes acumulados.`);
