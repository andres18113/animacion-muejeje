import {desfaseEscenas} from "../src/arranque/tiempo.ts";
const reloj = origen => `desfaseEscenas("S08", "${origen}")`;
import {duracionEscena} from "../src/arranque/anclas.ts";
import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {crearMotor} from "../src/arranque/cine/motor.ts";
import {ALTURA_DISQUI,RUTAS_S06} from "../src/arranque/cine/guion/S06.ts";
import {ALTURAS_S05} from "../src/arranque/cine/guion/S05.ts";
import {GUION_S07,panelBios} from "../src/arranque/cine/guion/S07.ts";
import {GUION_S08,LECTURA_S08,RUTAS_S08,PLATO_S08,fasesS08,bytesRecibidosS08,lecturaDiscoS08,panelRamS08,visibilidadPaqueteS08,OCLUSORES_S08,ETIQUETA_PAQUETE} from "../src/arranque/cine/guion/S08.ts";
import {crearCamara,proyectar,LUGARES} from "../src/arranque/cine/mundo.ts";
import {puntoDeRuta} from "../src/arranque/cine/rutas.ts";
import {anclasDeEscena,cuesDeEscena} from "../src/arranque/recursos.ts";
import {ESCENAS} from "../src/arranque/escenas.ts";
import {CUES_DIALOGO} from "../src/arranque/dialogo.ts";
import {validarVozGenerada} from "./comun-voces.mjs";

const cues=cuesDeEscena("S08"),a=anclasDeEscena("S08",cues),b=fasesS08(a);
const fin=crearMotor(GUION_S07,anclasDeEscena("S07",cuesDeEscena("S07")),30).en(duracionEscena("S07") - 1),m=crearMotor(GUION_S08,a,30),estados=Array.from({length:duracionEscena("S08")},(_,f)=>m.en(f));
// Continuidad S07:último → S08:0.
for(const k of ["cam","mundo","bios","romi","cmosi","cipu","postin","spedi","rami","secu","pulso","disqui"])assert.deepEqual(estados[0][k],fin[k],`S07:último→S08:0 ${k}`);
for(const[k,v]of Object.entries(fin.capa))for(let f=0;f<duracionEscena("S08");f++)assert.equal(estados[f].capa[k],v,`estado S06/S07 persistente ${k} f${f}`);
assert.equal(estados[0].bios.desplazX,3.4);
const otro=crearMotor(GUION_S08,a,30);for(let i=0;i<duracionEscena("S08");i++){const f=i*137%duracionEscena("S08");assert.deepEqual(otro.en(f),estados[f],`seek ${f}`);}

// Diálogo §8 literal: Bios inicia la lectura; Disqui actúa sin voz y no se le reasignan acciones BIOS.
const spec=JSON.parse(readFileSync(new URL("./fixtures/boot-contract.json",import.meta.url),"utf8")).dialogue.S08;
assert.equal(cues.map(c=>c.cue.displayText).join(" "),spec);assert.deepEqual(cues.map(c=>c.cue.mascotId),["bios"]);
assert.ok(CUES_DIALOGO.filter(c=>c.sceneId==="S08").every(c=>validarVozGenerada(c)&&c.rampaLabialFrames===undefined));
const contrato=ESCENAS.find(e=>e.id==="S08");
assert.deepEqual([...contrato.personajes],["M06","M11"]);assert.deepEqual([...contrato.personajesSinVoz],["M11"]);
assert.ok(["RF-16","RF-17","RF-18"].every(r=>contrato.requisitos.includes(r)));
assert.deepEqual(contrato.entrada,{dispositivoBIOS:"0x80",sector:0});
assert.equal(contrato.operacion.servicio,"INT 13h");assert.equal(contrato.operacion.cantidadBytes,512);assert.equal(contrato.salida.destinoRAM,"0x7C00");
const chs=contrato.operacion.ejemploCHS;assert.deepEqual([chs.AH,chs.AL,chs.CH,chs.CL,chs.DH,chs.DL,chs.ESBX],["0x02","0x01","0x00","0x01","0x00","0x80","0000:7C00"]);
// Valores técnicos: DL=0x80, sector lógico 0 = CHS 0/0/1, 0000:7C00 → 0x7C00..0x7DFF.
assert.equal(LECTURA_S08.dl,0x80);assert.equal(LECTURA_S08.sectorLogico,0);assert.deepEqual(LECTURA_S08.chs,{cilindro:0,cabeza:0,sector:1});
assert.ok(LECTURA_S08.chs.sector>=1,"nunca sector CHS 0");
assert.equal(LECTURA_S08.segmento*16+LECTURA_S08.desplazamiento,LECTURA_S08.inicio);
assert.equal(LECTURA_S08.inicio,0x7C00);assert.equal(LECTURA_S08.fin,LECTURA_S08.inicio+LECTURA_S08.bytes-1);assert.equal(LECTURA_S08.fin,0x7DFF);
// Rutas físicas: solicitud termina en la unidad; respuesta vuelve al controlador; el BIOS la lleva a SDRAM.
const igual=(p,q)=>p.every((v,k)=>Math.abs(v-q[k])<1e-9);
assert.ok(igual(RUTAS_S08.solicitud.at(-1),RUTAS_S06.cinta.at(-1)));assert.ok(igual(RUTAS_S08.datos[0],RUTAS_S06.cinta.at(-1)));
assert.ok(igual(RUTAS_S08.datos.at(-1),RUTAS_S06.ide[0]));assert.ok(igual(RUTAS_S08.transferencia[0],RUTAS_S06.ide[0]));
assert.ok(igual(RUTAS_S08.transferencia.at(-1),RUTAS_S06.ram.at(-1)),"destino en el módulo SDRAM");
assert.ok(PLATO_S08.sector.hasta>PLATO_S08.sector.desde);

// Causalidad: INT 13h → DL → solicitud → lectura → respuesta → transferencia → recepción.
function causal(anclas){
 const t=fasesS08(anclas),n=crearMotor(GUION_S08,anclas,30);
 assert.ok(t.fila13<anclas.int13&&t.fila80<anclas.dl80&&t.solicitudInicio>anclas.dl80&&t.solicitudFin<t.lecturaInicio&&t.lecturaFin<t.datosInicio&&t.datosFin<t.transferenciaInicio&&t.transferenciaFin<t.recepcionFin&&t.recepcionFin<anclas.prepara&&t.finVoz<t.alternativaInicio&&t.alternativaFin<duracionEscena("S08"),"orden causal");
 let previo=0;
 for(let f=0;f<duracionEscena("S08");f++){const c=n.en(f).capa,bytes=bytesRecibidosS08(f,t);
  if(c.fila13>0)assert.equal(c.rutina19,1,"INT 13h llamado desde la rutina de arranque");
  if(c.solicitud>0){assert.equal(c.fila13,1);assert.equal(c.fila80,1,"DL fijado antes de solicitar");}
  if(c.solicitudRecibida>0){assert.equal(c.solicitud,1);assert.ok(f>=t.solicitudFin);}
  if(c.sectorLectura>0)assert.equal(c.solicitudRecibida,1,"la unidad lee porque recibió la orden");
  if(c.datos>0)assert.equal(c.sectorLectura,1,"responde tras leer");
  if(c.transferencia>0)assert.equal(c.datos,1,"transferencia tras llegar al controlador");
  if(bytes>0){assert.equal(c.transferencia,1);assert.ok(igual(puntoDeRuta(RUTAS_S08.transferencia,c.transferencia),RUTAS_S08.transferencia.at(-1)),"escritura con el frente en SDRAM");}
  if(f<=t.transferenciaFin)assert.equal(bytes,0,"sin bytes en RAM durante el transporte");
  assert.ok(bytes>=previo);previo=bytes;
  if(f>=t.recepcionFin)assert.equal(bytes,512);
  if(c.preparado>0)assert.equal(bytes,512,"preparado solo con 512 B");
  if(c.alternativaSector>0)assert.ok(f>=t.alternativaInicio&&f<t.alternativaFin&&c.preparado===1,"alternativa simulada fuera del habla, tras el caso exitoso");
 }
}
causal(a);for(const delta of[-12,12])causal(Object.fromEntries(Object.entries(a).map(([k,v])=>[k,v+delta])));
const ultimo=estados.at(-1).capa;
assert.deepEqual([ultimo.solicitud,ultimo.datos,ultimo.transferencia,ultimo.preparado,ultimo.alternativaSector,bytesRecibidosS08(duracionEscena("S08")-1,b)],[1,1,1,1,0,512],"cierre: 512 B en 0x7C00, caso exitoso retomado");

// Lecturas y encuadre.
const actores=[["bios",LUGARES.bios,2.3],["cmosi",LUGARES.cmosi,2.3],["disqui",LUGARES.disqui,ALTURA_DISQUI],["romi",LUGARES.romi,2.3],["cipu",[1.6,.36,-2.6],3],["postin",LUGARES.postin,ALTURAS_S05.postin],["spedi",LUGARES.spedi,ALTURAS_S05.spedi],["rami",LUGARES.rami,ALTURAS_S05.rami],["secu",LUGARES.secu,2.3],["pulso",LUGARES.pulso,2.3]];
const actorBox=(cam,p,h,c)=>{const q=proyectar(cam,[p[0]+c.desplazX,p[1],p[2]]),u=q.escala*h/512;return[q.x-216*u,q.y-(395+c.salto)*u,q.x+216*u,q.y+15*u];};
const ov=(p,q)=>p[0]<q[2]&&p[2]>q[0]&&p[1]<q[3]&&p[3]>q[1],zona=r=>[r.x-3,r.y-10,r.x+r.ancho+13,r.y+r.alto+3];
let lecturas=0;const bandas=cues.flatMap(c=>c.segmentos.map(s=>[s.inicioFrame,s.finFrame+6]));
for(let f=0;f<duracionEscena("S08");f++){
 const e=estados[f],c=crearCamara(e.cam),boxes=actores.map(([id,p,h])=>[id,actorBox(c,p,h,e[id])]),zonas=[];
 const filas=1+(e.capa.fila13>0)+(e.capa.fila80>0);
 {const pb=panelBios(c,filas,e.capa.planoRam);if(pb.opacidad>0)zonas.push(["rutina",zona(pb)]);}
 if(e.capa.discoLectura>0)zonas.push(["disco",zona(lecturaDiscoS08(c))]);
 if(e.capa.ramPanel>0)zonas.push(["ram",zona(panelRamS08(c))]);
 for(const[n,z]of zonas){assert.ok(z[0]>=0&&z[1]>=0&&z[2]<=1920&&z[3]<=885,`${n} fuera f${f}: ${z.map(Math.round)}`);for(const[id,q]of boxes)if(e[id].visible>.01)assert.ok(!ov(z,q),`${id} tapa ${n} f${f}`);lecturas++;}
 for(let i=0;i<zonas.length;i++)for(let j=i+1;j<zonas.length;j++)assert.ok(!ov(zonas[i][1],zonas[j][1]),`${zonas[i][0]}/${zonas[j][0]} se tapan f${f}`);
 const bios=boxes.find(([id])=>id==="bios")[1];
 if(f>=cues[0].cue.startFrame&&f<cues[0].cue.startFrame+cues[0].cue.durationFrames+6){assert.ok(bios[0]>=0&&bios[1]>=0&&bios[2]<=1920&&bios[3]<=885,`Bios completa f${f}`);assert.ok(bios[3]-bios[1]>=200*410/512);}
 if(bandas.some(([d,h])=>f>=d&&f<h))for(const[id,q]of boxes)if(e[id].visible>.01&&ov(q,[0,0,1920,1080]))assert.ok(q[3]<=885,`${id} invade subtítulos f${f}`);
 // Disqui reacciona en cuadro mientras recibe la orden y responde.
 if(f>=b.solicitudFin&&f<=b.datosFin){const q=boxes.find(([id])=>id==="disqui")[1];assert.ok(q[0]>=0&&q[2]<=1920&&q[1]>=0,`Disqui visible f${f}`);}
}
// Paquete rotulado «512 B»: visible solo si ningún personaje situado delante toca su rótulo (sin texto recortado).
let ocultos=0,visibles=0;
for(let f=0;f<duracionEscena("S08");f++){const e=estados[f],c=crearCamara(e.cam);
 for(const[ruta,t]of [[RUTAS_S08.datos,e.capa.datos],[RUTAS_S08.transferencia,e.capa.transferencia]]){if(t<=0||t>=1)continue;
  const punto=puntoDeRuta(ruta,t),p=proyectar(c,punto),v=visibilidadPaqueteS08(c,e,punto),r=[p.x-ETIQUETA_PAQUETE.ancho/2,p.y-ETIQUETA_PAQUETE.alto/2,p.x+ETIQUETA_PAQUETE.ancho/2,p.y+ETIQUETA_PAQUETE.alto/2];
  if(v>0){visibles++;assert.ok(r[3]<=885,`rótulo sobre subtítulos f${f}`);for(const[id,l,h]of OCLUSORES_S08){const q=proyectar(c,[l[0]+e[id].desplazX,l[1],l[2]]);if(q.profundidad>=p.profundidad||e[id].visible<=.01)continue;const u=q.escala*h/512;assert.ok(!ov(r,[q.x-170*u,q.y-(380+e[id].salto)*u,q.x+170*u,q.y+10*u]),`rótulo 512 B recortado por ${id} f${f}`);}}else ocultos++;
 }}
assert.ok(visibles>40,"el paquete se ve la mayor parte del trayecto");
// Relojes acumulados y persistencias con sus anclas.
const escena=readFileSync(new URL("../src/arranque/escenas/S08LecturaSector.tsx",import.meta.url),"utf8"),lineas=escena.split("\n");
for(const[id,offset]of [["secu",reloj("S02")],["pulso",reloj("S02")],["cipu",reloj("S03")],["romi",reloj("S04")],["bios",reloj("S04")],["cmosi",reloj("S04")],["spedi",reloj("S05")],["rami",reloj("S05")],["disqui",reloj("S06")]])assert.ok(lineas.some(l=>l.includes(`id="${id}"`)&&l.includes(`frameAmbiente={frame+${offset}}`)&&l.includes("frame={frame}")),`reloj ${id}`);
assert.ok(lineas.some(l=>l.includes('id="bios"')&&l.includes("cue={cues[0]}"))&&!lineas.some(l=>/id="(disqui|cmosi)"/.test(l)&&l.includes("cue=")));
const postin=lineas.find(l=>l.includes("<PostinActivo"));assert.ok(postin.includes("frameAmbiente={frame+desfaseEscenas(\"S08\", \"S05\")}")&&postin.includes("checkpointS05(frame+desfaseEscenas(\"S08\", \"S05\"),aS05)")&&!postin.includes("cue="));
for(const t of ["<MemoriaMaterial e={e} frame={frame+desfaseEscenas(\"S08\", \"S05\")} fps={fps} a={aS05}/>","<ServiciosMaterial e={e} frame={frame+desfaseEscenas(\"S08\", \"S06\")} a={aS06}/>","<SeleccionMaterial e={e} frame={frame+desfaseEscenas(\"S08\", \"S07\")} a={aS07}/>","<LecturaMaterial e={e} frame={frame} a={a}/>","frame:frame+desfaseEscenas(\"S08\", \"S03\")","frameGlobal={frame+desfaseEscenas(\"S08\", \"S01\")} frameRelojS02={frame+desfaseEscenas(\"S08\", \"S02\")}"])assert.ok(escena.includes(t),t);
const material=readFileSync(new URL("../src/arranque/cine/ArranqueMaterial.tsx",import.meta.url),"utf8");
assert.ok(!/Stage|VBR|446|core\.img|55 ?AA/i.test(material),"sin análisis MBR, VBR ni etapas de GRUB en S08");
assert.ok(material.includes("aún sin ejecutar")&&material.includes("no se llega a GRUB"));

mkdirSync(new URL("../out/produccion/S08/",import.meta.url),{recursive:true});
writeFileSync(new URL("../out/produccion/S08/evidencia-numerica.json",import.meta.url),JSON.stringify({frames:duracionEscena("S08"),anclas:a,fases:b,lecturas,continuidad:"S07:último=S08:0",version:"S08-v1"},null,2));
console.log(`VALIDADO S08: ${duracionEscena("S08")} seeks, continuidad S07:último, diálogo literal, INT 13h/DL=0x80/sector lógico 0/0x7C00–0x7DFF, causalidad perturbada, ${lecturas} lecturas, paquete visible ${visibles}/oculto ${ocultos} sin rótulo recortado, alternativa §9.4 y relojes acumulados.`);
