import {desfaseEscenas} from "../src/arranque/tiempo.ts";
const reloj = origen => `desfaseEscenas("S05", "${origen}")`;
import {duracionEscena} from "../src/arranque/anclas.ts";
import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {puntoDeRuta} from "../src/arranque/cine/rutas.ts";
import {crearMotor} from "../src/arranque/cine/motor.ts";
import {GUION_S04} from "../src/arranque/cine/guion/S04.ts";
import {GUION_S05,fasesS05,checkpointS05,ALTURAS_S05,lecturasS05,EEPROM_SPD,POST_VERIFICADO,EJEMPLO_RAM,RUTA_SMBUS,lecturasPostS05,consultaCMOSS05,alternativaS05,formaAlternativaS05,barridoFirmwareS05} from "../src/arranque/cine/guion/S05.ts";
import {crearCamara,proyectar,LUGARES} from "../src/arranque/cine/mundo.ts";
import {anclasDeEscena,cuesDeEscena} from "../src/arranque/recursos.ts";
import {displayPostinS05} from "../src/arranque/cine/postin-display.ts";
import {respiracionEnFrame} from "../src/personajes/labios.ts";
import {geometriaBrazo} from "../src/personajes/geometria.ts";
import {RIGS} from "../src/personajes/rigs.generated.ts";
const a=anclasDeEscena("S05",cuesDeEscena("S05")),b=fasesS05(a);
const m=crearMotor(GUION_S05,a,30),estados=Array.from({length:duracionEscena("S05")},(_,f)=>m.en(f));
const fin=crearMotor(GUION_S04,anclasDeEscena("S04",cuesDeEscena("S04")),30).en(duracionEscena("S04") - 1);
for(const k of ["cam","mundo","cipu","secu","pulso","romi","bios","cmosi"])assert.deepEqual(estados[0][k],fin[k],`continuidad ${k}`);
for(const[k,v]of Object.entries(fin.capa))assert.equal(estados[0].capa[k],v,`capa ${k}`);
const seek=crearMotor(GUION_S05,a,30);for(let i=0;i<duracionEscena("S05");i++){const f=i*137%duracionEscena("S05");assert.deepEqual(seek.en(f),estados[f],`seek ${f}`);}
assert.deepEqual(Object.values(POST_VERIFICADO).map(c=>c.codigo),["20h","28h","2Ch"]);
assert.equal(POST_VERIFICADO.direccion.funcion,"Fallo en línea de dirección");
assert.equal(parseInt(EJEMPLO_RAM.binario,2),EJEMPLO_RAM.decimal);assert.equal(Number(EJEMPLO_RAM.hex),EJEMPLO_RAM.decimal);
assert.notDeepEqual(EEPROM_SPD,LUGARES.rami,"EEPROM SPD y SDRAM son componentes distintos");
assert.deepEqual(RUTA_SMBUS.at(-1),EEPROM_SPD);
function causal(anclas){
 const t=fasesS05(anclas),motor=crearMotor(GUION_S05,anclas,30);
 assert.ok(t.integridadFin<t.cmosInicio&&t.cmosFin<t.spdInicio);
 assert.ok(t.spdFin<t.configInicio&&t.configFin<t.refrescoInicio&&t.refrescoFin<t.dimensionado&&t.dimensionado<t.escritura&&t.escritura+32<t.lectura&&t.lectura+32<t.alternativa);
 assert.ok(t.alternativa<t.cierreAlternativa&&t.cierreAlternativa+12<duracionEscena("S05"));
 for(let f=0;f<duracionEscena("S05");f++){
  const e=motor.en(f);
  if(e.capa.configControlador>0)assert.equal(e.capa.spdRespuesta,1,`config antes de recepciónSPD ${f}`);
  if(e.capa.refresco>0)assert.equal(e.capa.configControlador,1,`refresco prematuro ${f}`);
  if(e.capa.escritura>0)assert.equal(e.capa.refresco,1,`escritura prematura ${f}`);
  if(e.capa.lectura>0)assert.equal(e.capa.escritura,8,`lectura antes de escritura ${f}`);
  if(e.capa.alternativa>0){assert.equal(e.capa.lectura,8);assert.equal(checkpointS05(f,anclas),"28h","caso principal no falla por alternativa2Ch");}
  if(checkpointS05(f,anclas)!=="POST")assert.equal(e.capa.configControlador,1,"checkpointDRAM exige controlador configurado");
 }
}
causal(a);
for(const delta of[-24,24]){const movidas=Object.fromEntries(Object.entries(a).map(([k,v])=>[k,["postin","spedi","rami"].includes(k)?v:v+delta]));causal(movidas);}
// Perturbación independiente moderada dentro del orden válido: SPD entrega tarde.
causal({...a,datos:a.datos+16,tamano:a.tamano+20,almacenar:a.almacenar+12,critica:a.critica+18});
const actores=[["postin",LUGARES.postin,ALTURAS_S05.postin],["spedi",LUGARES.spedi,ALTURAS_S05.spedi],["rami",LUGARES.rami,ALTURAS_S05.rami],["cipu",[1.6,.36,-2.6],3],["secu",LUGARES.secu,2.3],["pulso",LUGARES.pulso,2.3],["romi",LUGARES.romi,2.3],["bios",LUGARES.bios,2.3],["cmosi",LUGARES.cmosi,2.3]];
const solapa=(x,y)=>x[0]<y[2]&&x[2]>y[0]&&x[1]<y[3]&&x[3]>y[1];
const caja=(cam,p,h,c)=>{const q=proyectar(cam,p),u=q.escala*h/512;return[q.x-216*u,q.y-(395+c.salto)*u,q.x+216*u,q.y+15*u];};
// Preflight2F4: caras, pines y cuerpo de Romi/Bios no pueden quedar detrás de otro actor.
const margenCuerpo=b=>[b[0]-6,b[1]-6,b[2]+6,b[3]+6];
// El inserto empieza después de los segmentos reales y su cola, no en el antiguo f344.
for(let f=b.corteFirmware;f<b.cmosInicio-5;f++){
 const e=estados[f],cam=crearCamara(e.cam);
 for(const objetivo of["romi","bios"]){
  const actor=actores.find(([id])=>id===objetivo),c=margenCuerpo(caja(cam,actor[1],actor[2],e[objetivo]));
  assert.ok(c[0]>=0&&c[1]>=0&&c[2]<=1920&&c[3]<=885,`${objetivo} incompleto en inserto firmware ${f}`);
  for(const[id,p,h]of actores){if(id===objetivo||e[id].visible<=.01)continue;assert.ok(!solapa(c,margenCuerpo(caja(cam,p,h,e[id]))),`${id} oculta cuerpo/cara de ${objetivo} en firmware ${f}`);}
 }
}
// La reserva de subtítulos usa los mismos segmentos y cola+6 que SubtituloCine.
const visualesS05=cuesDeEscena("S05");
const bandas=visualesS05.flatMap(({segmentos})=>segmentos.map(s=>({desde:s.inicioFrame,hasta:s.finFrame+6})));
const finTextoPostin=Math.max(...visualesS05[0].segmentos.map(s=>s.finFrame+6));
const finCuePostin=visualesS05[0].cue.startFrame+visualesS05[0].cue.durationFrames;
const camaraCola=estados[finCuePostin-1].cam;
const corteTrasPostin=estados.findIndex((e,f)=>f>=finCuePostin&&Object.keys(camaraCola).some(k=>e.cam[k]!==camaraCola[k]));
assert.ok(corteTrasPostin>=finTextoPostin,"El inserto no puede preceder al fin real de los segmentos y su cola");
for(let f=0;f<duracionEscena("S05");f++){
 if(!bandas.some(b=>f>=b.desde&&f<b.hasta))continue;
 const e=estados[f],cam=crearCamara(e.cam);
 for(const[id,p,h]of actores){
  if(e[id].visible<=.01)continue;
  const c=caja(cam,p,h,e[id]);
  const visible=c[2]>0&&c[0]<1920&&c[3]>0&&c[1]<1080;
  assert.ok(!visible||c[3]<=885,`${id} invade banda de subtítulo (segmento+cola6) f${f}`);
 }
}
let lecturas=0,cubiertos=0;const codigos={POST:0,"20h":0,"28h":0};
for(let f=0;f<duracionEscena("S05");f++){
 const e=estados[f],cam=crearCamara(e.cam),spd=proyectar(cam,EEPROM_SPD),ram=proyectar(cam,LUGARES.rami),post=proyectar(cam,LUGARES.postin),l=lecturasS05(spd,ram,post,f,a),zonas=[];
 const cpu=proyectar(cam,[1.6,.36,-2.6]),flash=proyectar(cam,[-1.2,.12,3.8]),rtc=proyectar(cam,[3.7,.72,5.15]),postLecturas=lecturasPostS05(cpu,flash,rtc);
 if(f>=a.comprobacion-8&&f<a.memoria+60)zonas.push(["CPU/caché",postLecturas.cpu]);
 if(f>=b.integridadInicio&&f<b.cmosInicio-5)zonas.push(["regiones BIOS",postLecturas.firmware]);
 if(f>=b.cmosInicio-5&&f<b.cmosInicio+Math.floor((b.cmosFin-b.cmosInicio)*.6)){
  zonas.push(["CMOS datos",{x:rtc.x-195,y:rtc.y+16,ancho:390,alto:108-16}]);
  const pts=Array.from({length:32},(_,i)=>proyectar(cam,[3.1+i%8*.18,1+Math.floor(i/8)*.22,5.15]));zonas.push(["CMOS celdas",{x:Math.min(...pts.map(p=>p.x))-30,y:Math.min(...pts.map(p=>p.y))-40,ancho:Math.max(...pts.map(p=>p.x))-Math.min(...pts.map(p=>p.x))+60,alto:Math.max(...pts.map(p=>p.y))-Math.min(...pts.map(p=>p.y))+70}]);
 }
 if(e.capa.spdDatos>0)zonas.push(["SPD",l.spd]);
 if(e.capa.ejemplo>0)zonas.push(["RAM",l.ram]);
 if(e.capa.alternativa>0)zonas.push(["alternativa",l.alternativa]);
 if((f>=a.inicio&&f<a.cpu+60)||(f>=a.puerto-8&&f<b.corteFirmware)||(f>=b.refrescoInicio&&f<b.alternativa))zonas.push(["80h",l.puerto]);
 if(e.capa.configControlador>0&&(f<b.corteRami||(f>=a.controlador-12&&f<a.controlador+40))){const mc=proyectar(cam,[3.6,.17,-.4]);zonas.push(["82443BX",{x:mc.x-340,y:mc.y+28,ancho:260,alto:42}]);}
 for(let i=0;i<zonas.length;i++)for(let j=i+1;j<zonas.length;j++){
  const x=zonas[i][1],y=zonas[j][1];assert.ok(!solapa([x.x,x.y,x.x+x.ancho,x.y+x.alto],[y.x,y.y,y.x+y.ancho,y.y+y.alto]),`instrumentos ${zonas[i][0]}/${zonas[j][0]} se tapan ${f}`);
 }
 for(const[nombre,r]of zonas){const box=[r.x-3,r.y-3,r.x+r.ancho+3,r.y+r.alto+3];assert.ok(box[0]>=0&&box[1]>=0&&box[2]<=1920&&box[3]<=885,`bounds ${nombre} ${f}`);for(const[id,p,h]of actores){if(e[id].visible<=.01)continue;assert.ok(!solapa(box,caja(cam,p,h,e[id])),`${id} tapa ${nombre} ${f}`);}lecturas++;}
 if(e.postin.visible>0){
  const d=displayPostinS05(e.postin,f,30),sy=Math.max(.5,Math.min(1.7,1+e.postin.squash+.018*(respiracionEnFrame(f,"postin",30)-.5)));
  assert.equal(d.escalaY,sy);assert.equal(d.salto,Math.max(0,e.postin.salto));
  assert.ok(d.rect.x<=224&&d.rect.y<=208&&d.rect.x+d.rect.ancho>=291&&d.rect.y+d.rect.alto>=227,"parche cubre glifo28h con margen");
  for(let lado=0;lado<2;lado++){
    const mano=geometriaBrazo(RIGS.postin.brazos[lado],lado?e.postin.brazoDer:e.postin.brazoIzq,lado?e.postin.codoDer:e.postin.codoIzq).mano;
    assert.ok(!(mano.x+20>198&&mano.x-20<317&&mano.y+20>206&&mano.y-20<230),"parche no debe pintar sobre mano del rig");
  }
  cubiertos++;codigos[checkpointS05(f,a)]++;
 }
}
assert.ok(RIGS.postin.capasCuerpo.some(c=>c.markup.includes(">28h</text>")),"test contra arte fijo real");
const escena=readFileSync(new URL("../src/arranque/escenas/S05PostMemoria.tsx",import.meta.url),"utf8");
for(const[id,offset]of [["secu",reloj("S02")],["pulso",reloj("S02")],["cipu",reloj("S03")],["romi",reloj("S04")],["bios",reloj("S04")],["cmosi",reloj("S04")]])assert.ok(escena.split("\n").some(l=>l.includes(`id="${id}"`)&&l.includes(`frame={frame+${offset}}`)),`fase ${id}`);
assert.equal(cubiertos,estados.filter(e=>e.postin.visible>0).length,"cada frame visible verifica la cobertura del arte fijo");
assert.ok(lecturas>500,"cobertura sostenida de instrumentos tras comprimir los insertos");
assert.ok(estados[a.cpu].capa.cpuPreparacion>0&&estados[a.cpu].capa.cpuPreparacion<1,"B03 CPU debe estar operando en su palabra");
assert.ok(estados[a.cache].capa.cachePreparacion>0&&estados[a.cache].capa.cachePreparacion<1,"B03 caché debe estar operando en su palabra");
assert.equal(estados[a.memoria+24].capa.recursosPreparacion,1,"Preparación de recursos completa");
assert.ok(consultaCMOSS05(.1).pedido>0&&consultaCMOSS05(.1).lectura===0);
assert.ok(consultaCMOSS05(.4).lectura>0&&consultaCMOSS05(.4).respuesta===0);
assert.equal(consultaCMOSS05(1).respuesta,1);
const altA=alternativaS05(b.alternativa+20,a),altB=alternativaS05(b.alternativa+40,a),altStop=alternativaS05(a.detencion,a);
assert.ok(altA.direccionA>0&&altA.direccionB===0,"Primera dirección antes de segunda");
assert.ok(altB.direccionA===1&&altB.direccionB>0,"Segunda dirección repite celda ya alcanzada");
assert.ok(altStop.detenida&&altStop.diagnostico,"Detención/2Ch tras demostrar alias");
assert.ok(!alternativaS05(b.alternativa,a).diagnostico,"No diagnosticar2Ch antes de alias");
// Geometría usada por el render: verificar contornos frente a regiones de texto, no constantes de prueba.
for(let f=0;f<duracionEscena("S05");f++){
 const e=estados[f],c=crearCamara(e.cam),l=lecturasS05(proyectar(c,EEPROM_SPD),proyectar(c,LUGARES.rami),proyectar(c,LUGARES.postin),f,a);
 if(e.capa.alternativa>0){const v=formaAlternativaS05(l.alternativa);assert.ok(!solapa(v.base.caja,v.diagnosticoCaja),"contorno sobre diagnóstico2Ch");assert.ok(!solapa(v.base.caja,v.parada.caja),"contorno sobre POST detenido");}
 if(e.capa.integridad>=.18&&e.capa.integridad<.8){const r=lecturasPostS05(proyectar(c,[1.6,.36,-2.6]),proyectar(c,[-1.2,.12,3.8]),proyectar(c,[3.7,.72,5.15])).firmware,v=barridoFirmwareS05(r,e.capa.integridad),scan=[v.x,v.y,v.x+v.ancho,v.y+v.alto];
  for(const texto of[v.titulo,v.descripcion])assert.ok(!solapa(scan,[texto.x,texto.y-texto.tamano,texto.x+350,texto.y+4]),"barrido sobre leyenda de integridad");
 }
}
const alturas={};
for(const {cue}of cuesDeEscena("S05")){
 const id=cue.mascotId,rig=RIGS[id],ys=[...rig.cuerpo.matchAll(/(?: y| cy)="([\d.]+)"/g)].map(m=>+m[1]);
 const altoArte=Math.max(...rig.pies.map(p=>p.cy+p.ry))-Math.min(...ys);
 let minimo=Infinity;
 for(let f=cue.startFrame;f<cue.startFrame+cue.durationFrames;f++){
  const e=estados[f],q=proyectar(crearCamara(e.cam),LUGARES[id]);
  const escalaY=1+e[id].squash+.018*(respiracionEnFrame(f,id,30)-.5);
  const visible=q.escala*ALTURAS_S05[id]*altoArte/512*escalaY;
  assert.ok(visible>=200,`${id} figura artística pequeña ${f}`);minimo=Math.min(minimo,visible);
 }
 alturas[id]=Number(minimo.toFixed(2));
}
for(let f=0;f<duracionEscena("S05");f++){
 const e=estados[f],c=crearCamara(e.cam);
 for(const[t,ruta]of [[e.capa.spdConsulta,RUTA_SMBUS],[e.capa.spdRespuesta,[...RUTA_SMBUS].reverse()]]){
  if(t<=0||t>=1)continue;const p=proyectar(c,puntoDeRuta(ruta,t));
  assert.ok(p.x-13>=0&&p.x+13<=1920&&p.y-8>=0&&p.y+8<=885,`portador SMBus fuera ${f}`);
 }
}
mkdirSync(new URL("../out/produccion/S05/",import.meta.url),{recursive:true});
const evidencia={frames:duracionEscena("S05"),overlayCubierto:cubiertos,codigos,lecturasVerificadas:lecturas,fases:b,perturbaciones:[-24,24,"SPD+16/20"],alturaArtisticaMinimaEstimada:alturas,bandasSubtituloIncluidaCola6:bandas,finTextoPostin,corteTrasPostin};
writeFileSync(new URL("../out/produccion/S05/evidencia-numerica.json",import.meta.url),JSON.stringify(evidencia,null,2));
console.log(`VALIDADO S05: continuidad visible,${duracionEscena("S05")} seeks,causalidad perturbada,${lecturas} regiones libres,overlay28h cubierto${cubiertos}f y alternativa2Ch separada.`);
