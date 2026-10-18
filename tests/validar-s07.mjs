import {desfaseEscenas} from "../src/arranque/tiempo.ts";
const reloj = origen => `desfaseEscenas("S07", "${origen}")`;
import {duracionEscena} from "../src/arranque/anclas.ts";
import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {crearMotor} from "../src/arranque/cine/motor.ts";
import {GUION_S06,ALTURA_DISQUI,PROPS_S06} from "../src/arranque/cine/guion/S06.ts";
import {ALTURAS_S05} from "../src/arranque/cine/guion/S05.ts";
import {GUION_S07,PROPS_S07,RUTAS_S07,ORDEN_ARRANQUE,BIOS_EFECTIVA,fasesS07,panelOrdenS07,lecturaDisqueteraS07,panelBios} from "../src/arranque/cine/guion/S07.ts";
import {crearCamara,proyectar,LUGARES} from "../src/arranque/cine/mundo.ts";
import {cajaVolumenS06} from "../src/arranque/cine/servicios-geometria.ts";
import {anclasDeEscena,cuesDeEscena} from "../src/arranque/recursos.ts";
import {estaHablando} from "../src/arranque/subtitulos.ts";
import {ESCENAS} from "../src/arranque/escenas.ts";
import {CUES_DIALOGO} from "../src/arranque/dialogo.ts";
import {validarVozGenerada} from "./comun-voces.mjs";

const cues=cuesDeEscena("S07"),a=anclasDeEscena("S07",cues),b=fasesS07(a);
const fin=crearMotor(GUION_S06,anclasDeEscena("S06",cuesDeEscena("S06")),30).en(duracionEscena("S06") - 1),m=crearMotor(GUION_S07,a,30),estados=Array.from({length:duracionEscena("S07")},(_,f)=>m.en(f));
// Continuidad S06:último → S07:0 sin reconstrucción manual.
for(const k of ["cam","mundo","bios","romi","cmosi","cipu","postin","spedi","rami","secu","pulso","disqui"])assert.deepEqual(estados[0][k],fin[k],`S06:último→S07:0 ${k}`);
for(const[k,v]of Object.entries(fin.capa))for(let f=0;f<duracionEscena("S07");f++)assert.equal(estados[f].capa[k],v,`estado S06 persistente sin redisparo ${k} f${f}`);
assert.equal(estados[0].bios.desplazX,3.4,"Bios conserva su desplazamiento real");
assert.deepEqual(BIOS_EFECTIVA,[LUGARES.bios[0]+3.4,LUGARES.bios[1],LUGARES.bios[2]]);
const otro=crearMotor(GUION_S07,a,30);for(let i=0;i<duracionEscena("S07");i++){const f=i*137%duracionEscena("S07");assert.deepEqual(otro.en(f),estados[f],`seek ${f}`);}

// Diálogo §8 literal repartido Cmosi→Bios, con pausa y sin bocas simultáneas.
const spec=JSON.parse(readFileSync(new URL("./fixtures/boot-contract.json",import.meta.url),"utf8")).dialogue.S07;
assert.equal(cues.map(c=>c.cue.displayText).join(" "),spec);
assert.deepEqual(cues.map(c=>c.cue.mascotId),["cmosi","bios"]);
assert.ok(cues[1].cue.startFrame-(cues[0].cue.startFrame+cues[0].cue.durationFrames)>=8,"pausa entre hablantes");
for(let f=0;f<duracionEscena("S07");f++)assert.ok(!(estaHablando(cues[0].cue,cues[0].segmentos,f)&&estaHablando(cues[1].cue,cues[1].segmentos,f)),`dos bocas ${f}`);
assert.ok(CUES_DIALOGO.filter(c=>c.sceneId==="S07").every(c=>validarVozGenerada(c)&&c.rampaLabialFrames===undefined));
const contrato=ESCENAS.find(e=>e.id==="S07");
assert.deepEqual([...contrato.personajes],["M07","M06"]);assert.ok(["RF-15","RF-16"].every(r=>contrato.requisitos.includes(r)));
assert.deepEqual([...contrato.entrada.orden],[...ORDEN_ARRANQUE]);assert.deepEqual([...ORDEN_ARRANQUE],["Disquetera","Disco IDE"]);
assert.equal(contrato.siguienteEscena,"S08");

// Causalidad: consulta → parámetros → disquetera → respuesta → selección → INT 19h.
function causal(anclas){
 const t=fasesS07(anclas),n=crearMotor(GUION_S07,anclas,30);
 assert.ok(t.consultaFin<=t.respuestaInicio&&t.respuestaFin<t.peticionInicio&&t.peticionFin<t.unidadFin&&t.unidadFin<t.regresoFin&&t.regresoFin<=anclas.sinDisquete&&anclas.sinDisquete<anclas.selecciona&&anclas.selecciona<anclas.activa,"orden causal de fases");
 assert.ok(t.finOrden<=t.peticionInicio,"plano de orden antes de la consulta a disquetera");
 assert.ok(t.movLectura>anclas.selecciona&&t.finLectura<=t.insignia,"selección vista en plano de orden; INT 19h con la cámara asentada");
 for(let f=0;f<duracionEscena("S07");f++){const c=n.en(f).capa;
  if(c.ordenPanel>0)assert.equal(c.consultaCmos,1,`orden mostrado sin consulta f${f}`);
  if(c.respuestaCmos>0)assert.equal(c.consultaCmos,1);
  if(c.disqueteraPeticion>0){assert.equal(c.respuestaCmos,1,"BIOS conoce el orden antes de intentar");assert.ok(c.fila1>0);}
  if(c.disqueteraActiva>0)assert.equal(c.disqueteraPeticion,1,"la unidad actúa tras recibir la consulta");
  if(c.disqueteraRespuesta>0){assert.equal(c.disqueteraPeticion,1);assert.ok(f>=t.unidadFin);}
  if(c.sinDisquete>0)assert.equal(c.disqueteraRespuesta,1,"conclusión tras la respuesta");
  if(c.fila2>0)assert.equal(c.disqueteraPeticion,1,"el disco IDE va después de la disquetera");
  if(c.discoSeleccionado>0)assert.equal(c.sinDisquete,1,"disco seleccionado solo sin disquete arrancable");
  if(c.rutina19>0)assert.equal(c.discoSeleccionado,1,"INT 19h tras seleccionar");
  if(c.codigo19>0)assert.ok(c.rutina19>0);
 }
}
causal(a);for(const delta of[-12,12])causal(Object.fromEntries(Object.entries(a).map(([k,v])=>[k,k==="parametros"?v:v+delta])));
const ultimo=estados.at(-1).capa;
assert.deepEqual([ultimo.discoSeleccionado,ultimo.sinDisquete,ultimo.rutina19,ultimo.codigo19,ultimo.bootstrap,ultimo.ordenPanel],[1,1,1,1,1,0],"cierre: disco elegido y bootstrap preparado");
for(const k of Object.keys(ultimo))assert.ok(!/sector|lectura|solicitud|transfer|ram|grub|mbr/i.test(k)||k in fin.capa,`S07 no lee ni ejecuta sector: ${k}`);

// Disquetera exclusiva de S07: fuera de la placa, en el piso del gabinete, sin tocar disco ni mazo ATX.
const fdd=PROPS_S07.disquetera,cab=PROPS_S07.cabecera,disco=PROPS_S06.disco;
assert.ok(fdd.p[0]-fdd.t[0]/2>8.5,"disquetera exterior a la PCB");assert.equal(fdd.p[1],disco.p[1],"apoyada al nivel del disco");
const sep=(u,v,k)=>Math.abs(u.p[k]-v.p[k])>=(u.t[k]+v.t[k])/2;
assert.ok(sep(fdd,disco,0)||sep(fdd,disco,2),"disquetera no atraviesa el disco");
// Mundo3D.tsx no es importable desde Node: se leen las x del recorrido del mazo en su fuente.
const mazo=readFileSync(new URL("../src/arranque/cine/Mundo3D.tsx",import.meta.url),"utf8").split("export function recorridoMazo")[1].split("}")[0],xsMazo=[...mazo.matchAll(/\[(\d+\.\d+),/g)].map(x=>+x[1]);
assert.equal(xsMazo.length,4);assert.ok(Math.max(...xsMazo)<fdd.p[0]-fdd.t[0]/2,"mazo ATX libre");
assert.ok(cab.p[0]+cab.t[0]/2<=8.5&&cab.p[0]-cab.t[0]/2>7.65,"cabecera en placa, junto a los IDE");
assert.deepEqual(RUTAS_S07.disquetera.at(-1),[fdd.p[0],.45,fdd.p[2]-fdd.t[2]/2],"cinta entra por la cara trasera");
assert.deepEqual(RUTAS_S07.consulta.at(-1),[...LUGARES.cmosi],"consulta llega al puente sur con CMOS");
assert.deepEqual(RUTAS_S07.disco.at(-1),[10.2,.65,-.1],"enlace al disco por la cinta IDE existente");
// Revelación fuera de campo: la unidad ya montada entra en estado cuando no está en cuadro.
const viewport=[0,0,1920,1080],ov=(p,q)=>p[0]<q[2]&&p[2]>q[0]&&p[1]<q[3]&&p[3]>q[1];
assert.ok(!ov(cajaVolumenS06(crearCamara(estados[b.revelado].cam),fdd),viewport),"disquetera fuera de cuadro al revelarse");
for(let f=b.revelado;f<duracionEscena("S07");f++)assert.equal(estados[f].capa.disqueteraPresente,1,"persistente tras revelarse");

// Lecturas: dentro del cuadro, sobre la banda, sin tapar actores ni taparse.
const actores=[["bios",LUGARES.bios,2.3],["cmosi",LUGARES.cmosi,2.3],["disqui",LUGARES.disqui,ALTURA_DISQUI],["romi",LUGARES.romi,2.3],["cipu",[1.6,.36,-2.6],3],["postin",LUGARES.postin,ALTURAS_S05.postin],["spedi",LUGARES.spedi,ALTURAS_S05.spedi],["rami",LUGARES.rami,ALTURAS_S05.rami],["secu",LUGARES.secu,2.3],["pulso",LUGARES.pulso,2.3]];
const actorBox=(cam,p,h,c)=>{const q=proyectar(cam,[p[0]+c.desplazX,p[1],p[2]]),u=q.escala*h/512;return[q.x-216*u,q.y-(395+c.salto)*u,q.x+216*u,q.y+15*u];};
const zona=r=>[r.x-3,r.y-10,r.x+r.ancho+13,r.y+r.alto+3];
let lecturas=0;
for(let f=0;f<duracionEscena("S07");f++){
 const e=estados[f],c=crearCamara(e.cam),boxes=actores.map(([id,p,h])=>[id,actorBox(c,p,h,e[id])]),zonas=[];
 if(e.capa.ordenPanel>0)zonas.push(["orden",zona(panelOrdenS07(e.capa.panelK))]);
 if(e.capa.disqueteraPeticion>0&&f<b.movLectura+12)zonas.push(["disquetera",zona(lecturaDisqueteraS07(c))]);
 if(e.capa.rutina19>0)zonas.push(["rutina",zona(panelBios(c,1))]);
 for(const[n,z]of zonas){assert.ok(z[0]>=0&&z[1]>=0&&z[2]<=1920&&z[3]<=885,`${n} fuera f${f}: ${z.map(Math.round)}`);for(const[id,q]of boxes)if(e[id].visible>.01)assert.ok(!ov(z,q),`${id} tapa ${n} f${f}`);lecturas++;}
 for(let i=0;i<zonas.length;i++)for(let j=i+1;j<zonas.length;j++)assert.ok(!ov(zonas[i][1],zonas[j][1]),`${zonas[i][0]}/${zonas[j][0]} se tapan f${f}`);
 for(const {cue,segmentos}of cues){const hasta=Math.max(...segmentos.map(s=>s.finFrame+6));if(f<cue.startFrame||f>=hasta)continue;const q=boxes.find(([id])=>id===cue.mascotId)[1];assert.ok(q[0]>=0&&q[1]>=0&&q[2]<=1920&&q[3]<=885,`${cue.mascotId} completo f${f}`);assert.ok(q[3]-q[1]>=200*410/512,`${cue.mascotId} legible f${f}`);}
}
// El plano de orden muestra a la vez CMOS, Bios, disquetera y disco durante la consulta a la unidad.
for(let f=b.peticionInicio;f<=b.regresoFin;f++){const c=crearCamara(estados[f].cam);for(const v of [fdd,disco]){const q=cajaVolumenS06(c,v);assert.ok(q[0]>=0&&q[2]<=1920&&q[1]>=0&&q[3]<=885,`hardware en cuadro f${f}`);}}

// Relojes: ambiente acumulado, voz local, persistencias con anclas y relojes propios.
const escena=readFileSync(new URL("../src/arranque/escenas/S07SeleccionDispositivo.tsx",import.meta.url),"utf8"),lineas=escena.split("\n");
for(const[id,offset]of [["secu",reloj("S02")],["pulso",reloj("S02")],["cipu",reloj("S03")],["romi",reloj("S04")],["bios",reloj("S04")],["cmosi",reloj("S04")],["spedi",reloj("S05")],["rami",reloj("S05")],["disqui",reloj("S06")]])assert.ok(lineas.some(l=>l.includes(`id="${id}"`)&&l.includes(`frameAmbiente={frame+${offset}}`)&&l.includes("frame={frame}")),`reloj ${id}`);
assert.ok(lineas.some(l=>l.includes('id="bios"')&&l.includes("cue={cues[1]}"))&&lineas.some(l=>l.includes('id="cmosi"')&&l.includes("cue={cues[0]}"))&&!lineas.some(l=>l.includes('id="disqui"')&&l.includes("cue=")));
const postin=lineas.find(l=>l.includes("<PostinActivo"));assert.ok(postin.includes("frameAmbiente={frame+desfaseEscenas(\"S07\", \"S05\")}")&&postin.includes("checkpointS05(frame+desfaseEscenas(\"S07\", \"S05\"),aS05)")&&!postin.includes("cue="));
for(const t of ["<MemoriaMaterial e={e} frame={frame+desfaseEscenas(\"S07\", \"S05\")} fps={fps} a={aS05}/>","<ServiciosMaterial e={e} frame={frame+desfaseEscenas(\"S07\", \"S06\")} a={aS06}/>","frame:frame+desfaseEscenas(\"S07\", \"S03\")","frameGlobal={frame+desfaseEscenas(\"S07\", \"S01\")} frameRelojS02={frame+desfaseEscenas(\"S07\", \"S02\")}","<SeleccionMaterial e={e} frame={frame} a={a}/>"])assert.ok(escena.includes(t),t);
assert.ok(!escena.includes("LecturaMaterial")&&!/GRUB|MBR|INT 13h/.test(escena),"S07 no muestra lectura, MBR ni GRUB");

mkdirSync(new URL("../out/produccion/S07/",import.meta.url),{recursive:true});
writeFileSync(new URL("../out/produccion/S07/evidencia-numerica.json",import.meta.url),JSON.stringify({frames:duracionEscena("S07"),anclas:a,fases:b,lecturas,continuidad:"S06:último=S07:0",version:"S07-v1"},null,2));
console.log(`VALIDADO S07: ${duracionEscena("S07")} seeks, continuidad S06:último, diálogo literal Cmosi→Bios, causalidad perturbada, ${lecturas} lecturas, disquetera exterior revelada fuera de campo y relojes acumulados.`);
