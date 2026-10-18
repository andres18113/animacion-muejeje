import type {Cuerpo} from "./guion/comun.ts";
import {respiracionEnFrame} from "../../personajes/labios.ts";
/** Misma transformación corporal usada por Personaje/Actor; solo cubre el arte fijo28h. */
export function displayPostinS05(c:Cuerpo,frame:number,fps:number,frameAmbiente=frame) {
  const escalaY=Math.max(0.5,Math.min(1.7,1+c.squash+0.018*(respiracionEnFrame(frameAmbiente,"postin",fps)-0.5)));
  const salto=Math.max(0,c.salto);
  return {escalaY,salto,rect:{x:198,y:206,ancho:119,alto:24},transformacion:`translate(0 ${-salto}) translate(256 455) rotate(${c.inclinacion}) scale(${1/escalaY} ${escalaY}) translate(-256 -455)`};
}

export function puntoDisplayPostinS05(pie:{x:number;y:number;escala:number},c:Cuerpo,frame:number,fps:number,alto:number,frameAmbiente=frame) {
  const d=displayPostinS05(c,frame,fps,frameAmbiente),u=pie.escala*alto/512,ang=c.inclinacion*Math.PI/180;
  const dx=(257-256)/d.escalaY,dy=(218-455)*d.escalaY;
  return {x:pie.x+(dx*Math.cos(ang)-dy*Math.sin(ang))*u,y:pie.y+(dx*Math.sin(ang)+dy*Math.cos(ang)-d.salto)*u};
}
