import {duracionEscena} from "../src/arranque/anclas.ts";
import assert from "node:assert/strict";
import {RUTA_FIRMWARE, puntoDeRuta} from "../src/arranque/cine/rutas.ts";
import {RIGS} from "../src/personajes/rigs.generated.ts";
import {geometriaBrazo} from "../src/personajes/geometria.ts";
import {crearMotor} from "../src/arranque/cine/motor.ts";
import {GUION_S03} from "../src/arranque/cine/guion/S03.ts";
import {GUION_S04, BLOQUES_FLASH, VIAJE_CODIGO, SECCION_FLASH, puntoCodigoS04, referenciaCodigoS04} from "../src/arranque/cine/guion/S04.ts";
import {crearCamara, proyectar, LUGARES} from "../src/arranque/cine/mundo.ts";
import {anclasDeEscena, cuesDeEscena} from "../src/arranque/recursos.ts";
const a = anclasDeEscena("S04", cuesDeEscena("S04"));
const m = crearMotor(GUION_S04, a, 30);
const fin = crearMotor(GUION_S03, anclasDeEscena("S03", cuesDeEscena("S03")), 30).en(duracionEscena("S03") - 1);
const inicio = m.en(0);
for (const k of ["cam", "cipu", "secu", "pulso", "mundo"]) assert.deepEqual(inicio[k], fin[k], `corte visible ${k}`);
for (const k of Object.keys(fin.capa)) assert.equal(inicio.capa[k], fin.capa[k], `capa heredada ${k}`);
assert.equal(BLOQUES_FLASH.length, 8);
assert.equal(BLOQUES_FLASH[0].inicio, 0);
assert.equal(BLOQUES_FLASH.at(-1).fin, 0x7ffff);
for (const [i,b] of BLOQUES_FLASH.entries()) {
  assert.equal(b.fin-b.inicio+1,65536);
  if(i) assert.equal(b.inicio,BLOQUES_FLASH[i-1].fin+1);
  assert.equal(b.funcion, i===7 ? "Boot Block" : i===1 ? "Tolerancia a fallos" : i===0 ? "Respaldo" : "BIOS principal");
}
const estados = Array.from({length:duracionEscena("S04")},(_,f)=>m.en(f));
const seek = crearMotor(GUION_S04,a,30);
for(let i=0;i<duracionEscena("S04");i++) {const f=i*137%duracionEscena("S04");assert.deepEqual(seek.en(f),estados[f],`seek ${f}`);}
const llegada=a.programa+VIAJE_CODIGO.inicioRespectoPrograma+VIAJE_CODIGO.duracion;
assert.equal(estados[llegada-1].cipu.salto,fin.cipu.salto,"CPU no reacciona antes de recepción");
assert.ok(estados[llegada+1].cipu.salto>estados[llegada].cipu.salto,"CPU reacciona tras llegada");
let lectura=0;
for(const e of estados) {
  if(e.capa.seccion<=0.96) continue;
  const c=crearCamara(e.cam),top=proyectar(c,[SECCION_FLASH.x,SECCION_FLASH.base+7*SECCION_FLASH.paso,SECCION_FLASH.z]),bottom=proyectar(c,[SECCION_FLASH.x,SECCION_FLASH.base,SECCION_FLASH.z]);
  assert.ok(top.x-255>=0&&top.x+277<=1920&&top.y-92>=0,"lectura de flash dentro de cuadro");
  assert.ok(bottom.y+(e.capa.detalle>0.99?136:82)<885,"detalle de flash libre de subtítulos");lectura++;
}
assert.ok(lectura>=90,"Corte didáctico legible durante al menos tres segundos");
assert.notDeepEqual(LUGARES.cmosi,[-1.6,0.12,-0.2],"CMOS no está dentro de pila");
console.log(`VALIDADO S04: continuidad visible,8 bloques contiguos512KiB,${duracionEscena("S04")} seeks,CPU recibe f${llegada},lectura flash${lectura}f y CMOS separada de pila.`);

// Regiones de lectura: cajas conservadoras de personajes visibles, incluido margen del sprite.
const actores = [["romi",LUGARES.romi,2.3],["bios",LUGARES.bios,2.3],["cmosi",LUGARES.cmosi,2.3],["cipu",[1.6,.36,-2.6],3],["secu",LUGARES.secu,2.3],["pulso",LUGARES.pulso,2.3]];
const caja = (c,p,h,cuerpo) => {const q=proyectar(c,p),u=q.escala*h/512;return [q.x-216*u,q.y-(395+cuerpo.salto)*u,q.x+216*u,q.y+15*u];};
const solapa = (a,b) => a[0]<b[2]&&a[2]>b[0]&&a[1]<b[3]&&a[3]>b[1];
for(let f=0;f<(duracionEscena("S04") - 16);f++) {
  const e=estados[f],c=crearCamara(e.cam);
  const zonas=[];
  if(e.capa.seccion>.96) {
    for(const b of BLOQUES_FLASH) {const q=proyectar(c,[SECCION_FLASH.x,SECCION_FLASH.base+b.indice*SECCION_FLASH.paso*e.capa.seccion,SECCION_FLASH.z]);zonas.push([q.x-255,q.y-26,q.x+255,q.y+26]);}
  }
  if(e.capa.configuracion>0) {
    const base=proyectar(c,[3.7,.72,5.15]);zonas.push([base.x-195,base.y+16,base.x+195,base.y+60]);
    const grid=Array.from({length:32},(_,i)=>proyectar(c,[3.1+i%8*.18,1+Math.floor(i/8)*.22,5.15]));zonas.push([Math.min(...grid.map(p=>p.x))-30,Math.min(...grid.map(p=>p.y))-40,Math.max(...grid.map(p=>p.x))+30,Math.max(...grid.map(p=>p.y))+30]);
    if(e.capa.reloj>.99) {const q=proyectar(c,[3.5,2.8,5]);zonas.push([q.x-90,q.y-105,q.x+90,q.y+70]);}
  }
  for(const zona of zonas) for(const [id,p,h]of actores) {
    if(e[id].visible<=.01)continue;
    assert.ok(!solapa(zona,caja(c,p,h,e[id])),`f${f}: ${id} invade lectura material`);
  }
}
console.log("VALIDADO S04: regiones materiales libres de todos los actores visibles durante sus cues.");

let pilaFrames=0, capsulaFrames=0;
const limitesPila=[Infinity,Infinity,-Infinity,-Infinity];
for(let f=0;f<duracionEscena("S04");f++) {
  const e=estados[f],c=crearCamara(e.cam);
  if(e.capa.bateria>.99) {
    const p=proyectar(c,[-1.6,.12,-.2]);
    const pila=[p.x-46,p.y-21,p.x+46,p.y+21],caption=[p.x-191,p.y+27,p.x+21,p.y+71];
    for(const b of [pila,caption]) assert.ok(b[0]>=0&&b[1]>=0&&b[2]<=1920&&b[3]<=885,`f${f}: pila o caption fuera de cuadro`);
    for(const[id,p0,h]of actores)if(e[id].visible>.01)assert.ok(!solapa(caption,caja(c,p0,h,e[id])),`f${f}: ${id} tapa respaldo RTC`);
    limitesPila[0]=Math.min(limitesPila[0],caption[0],pila[0]); limitesPila[1]=Math.min(limitesPila[1],caption[1],pila[1]);
    limitesPila[2]=Math.max(limitesPila[2],caption[2],pila[2]); limitesPila[3]=Math.max(limitesPila[3],caption[3],pila[3]);
    pilaFrames++;
  }
  const t=e.capa.codigo;
  if(t>0&&t<1) {
    const puntoReal=puntoDeRuta([...RUTA_FIRMWARE].reverse(),t);
    assert.deepEqual(puntoCodigoS04(t),puntoReal,`f${f}: portador abandona coordenadas X/Y/Z de pista`);
    assert.equal(puntoCodigoS04(t)[1],0.02,`f${f}: portador elevado fuera de placa`);
    const frente=proyectar(c,puntoReal),pie=proyectar(c,LUGARES.bios),u=pie.escala*2.3/512;
    const manoRig=geometriaBrazo(RIGS.bios.brazos[1],e.bios.brazoDer,e.bios.codoDer).mano;
    const mano={x:pie.x+(manoRig.x-256)*u,y:pie.y+(manoRig.y-455-e.bios.salto)*u};
    const referencia=referenciaCodigoS04(mano,frente);
    assert.equal(referencia.guia.x2,frente.x,`f${f}: guía no termina en frente físico`);
    assert.equal(referencia.guia.y2,frente.y,`f${f}: guía no termina en frente físico`);
    const b=[referencia.x-1,referencia.y-1,referencia.x+referencia.ancho+1,referencia.y+referencia.alto+1];
    assert.ok(b[0]>=0&&b[1]>=0&&b[2]<=1920&&b[3]<=885,`f${f}: anotación BIOS fuera de cuadro`);
    for(const[id,p0,h]of actores) {
      if(e[id].visible<=.01)continue;
      assert.ok(!solapa(b,caja(c,p0,h,e[id])),`f${f}: ${id} tapa referencia didáctica BIOS`);
    }
    capsulaFrames++;
  }
}
assert.ok(pilaFrames>200&&capsulaFrames>40,"Cobertura sostenida de respaldo y código");
console.log(`LÍMITES PILA/CAPTION: ${limitesPila.map(n=>n.toFixed(2)).join(", ")}`);
for(let f=451;f<(duracionEscena("S04") - 16);f++)assert.ok(caja(crearCamara(estados[f].cam),[1.6,.36,-2.6],3,estados[f].cipu)[0]>1920,`f${f}: Cipu alcanza banda por borde derecho`);
console.log(`VALIDADO S04: bounds/no oclusión pila-caption${pilaFrames}f y frente real/anotación${capsulaFrames}f; guía en frente exactoXYZ y CPU recibe362.`);

assert.deepEqual(puntoCodigoS04(0), RUTA_FIRMWARE.at(-1), "Origen flash real");
assert.deepEqual(puntoCodigoS04(1), RUTA_FIRMWARE[0], "Destino Slot real");
assert.equal(estados[llegada].capa.codigo,1,"Frente llega en el frame previsto");
for(let f=0;f<=llegada;f++)assert.equal(estados[f].cipu.salto,fin.cipu.salto,"No anticipar ejecución CPU");
console.log("VALIDADO S04: soporte físico y referencia didáctica separados; sin portador aéreo.");
