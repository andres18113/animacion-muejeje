import React from "react";
import type {PerspectiveCamera} from "three";
import {Actor} from "./Actor";
import {proyectar,LUGARES} from "./mundo.ts";
import type {Cuerpo} from "./guion/comun.ts";
import type {CueVisual} from "../recursos.ts";
import {displayPostinS05} from "./postin-display.ts";
import {ALTURAS_S05} from "./guion/S05.ts";

/** Reusa el rig aprobado. Parche de pantalla local, sin fork ni modificación de mascotas. */
export const PostinActivo:React.FC<{camara:PerspectiveCamera;cuerpo:Cuerpo;frame:number;frameAmbiente?:number;fps:number;cue?:CueVisual;codigo:string}>=({camara,cuerpo,frame,frameAmbiente=frame,fps,cue,codigo})=>{
  const pie=proyectar(camara,LUGARES.postin),tam=pie.escala*ALTURAS_S05.postin;
  const d=displayPostinS05(cuerpo,frame,fps,frameAmbiente);
  return <>
    <Actor id="postin" camara={camara} lugar={LUGARES.postin} alto={ALTURAS_S05.postin} cuerpo={cuerpo} frame={frame} frameAmbiente={frameAmbiente} fps={fps} cue={cue} />
    {cuerpo.visible>0?<svg viewBox="0 0 512 512" width={tam} height={tam} style={{position:"absolute",left:pie.x-tam/2,top:pie.y-tam*455/512,opacity:Math.min(1,cuerpo.visible),overflow:"visible",pointerEvents:"none"}}>
      <g transform={d.transformacion}>
        <rect x={d.rect.x} y={d.rect.y} width={d.rect.ancho} height={d.rect.alto} rx={7} fill="#38475C" stroke="#22344A" strokeWidth={4} />
        <text x={257} y={224} textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize={16} fontWeight={900} letterSpacing={2} fill="#A5F2BD">{codigo}</text>
      </g>
    </svg>:null}
  </>;
};
