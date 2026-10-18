import {desfaseEscenas} from "../tiempo.ts";
import React,{useMemo} from "react";
import {AbsoluteFill,Interactive,useCurrentFrame,useVideoConfig} from "remotion";
import {anclasDeEscena,cuesDeEscena} from "../recursos.ts";
import {useCoreografia} from "../cine/coreografia.ts";
import {GUION_S05,ALTURAS_S05,checkpointS05} from "../cine/guion/S05.ts";
import {CIPU_LUGAR} from "../cine/guion/S03.ts";
import {crearCamara,LUGARES} from "../cine/mundo.ts";
import {Mundo3D} from "../cine/Mundo3D";
import {Actor} from "../cine/Actor";
import {PostinActivo} from "../cine/PostinActivo";
import {PostMaterial} from "../cine/PostMaterial";
import {MemoriaMaterial} from "../cine/MemoriaMaterial";
import {PlacaEncendida} from "../cine/PlacaEncendida";
import {FiltrosBrillo} from "../cine/capas";
import {FondoGabinete,Vineta} from "../cine/Atmosfera";
import {SubtituloCine} from "../cine/SubtituloCine";
import {CapaAudio} from "../componentes/CapaAudio";

const S05Inner:React.FC=()=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const cues=useMemo(()=>cuesDeEscena("S05"),[]),a=useMemo(()=>anclasDeEscena("S05",cues),[cues]);
  const aS02=useMemo(()=>anclasDeEscena("S02",cuesDeEscena("S02")),[]);
  const e=useCoreografia(GUION_S05,a),camara=crearCamara(e.cam);
  return <AbsoluteFill>
    <FondoGabinete calido={0.4}/>
    <Mundo3D camara={e.cam} estado={{luzRed:1,espera:1,rieles:1,rizado:0,reloj:1,resetRetenido:0,cpuLista:1,exterior:false,cartucho:e.mundo.cartucho,chips:{norte:e.mundo.norte,sur:e.mundo.sur,flash:e.mundo.flash},frame:frame+desfaseEscenas("S05", "S03")}}/>
    <svg width={1920} height={1080} style={{position:"absolute",inset:0}}>
      <FiltrosBrillo/>
      <PlacaEncendida camara={camara} frameGlobal={frame+desfaseEscenas("S05", "S01")} frameRelojS02={frame+desfaseEscenas("S05", "S02")} pwrS02={aS02.pwr} ecosS02={0} intensidad={e.capa.placa}/>
      <PostMaterial e={e} frame={frame} a={a}/>
      <MemoriaMaterial e={e} frame={frame} fps={fps} a={a}/>
    </svg>
    {/* Relojes ambientales continuos de los oyentes; los tres cues nuevos usan tiempo local. */}
    <Actor id="secu" camara={camara} lugar={LUGARES.secu} alto={2.3} cuerpo={e.secu} frame={frame+desfaseEscenas("S05", "S02")} fps={fps}/>
    <Actor id="pulso" camara={camara} lugar={LUGARES.pulso} alto={2.3} cuerpo={e.pulso} frame={frame+desfaseEscenas("S05", "S02")} fps={fps}/>
    <Actor id="cipu" camara={camara} lugar={CIPU_LUGAR} alto={3} cuerpo={e.cipu} frame={frame+desfaseEscenas("S05", "S03")} fps={fps}/>
    <Actor id="romi" camara={camara} lugar={LUGARES.romi} alto={2.3} cuerpo={e.romi} frame={frame+desfaseEscenas("S05", "S04")} fps={fps}/>
    <Actor id="bios" camara={camara} lugar={LUGARES.bios} alto={2.3} cuerpo={e.bios} frame={frame+desfaseEscenas("S05", "S04")} fps={fps}/>
    <Actor id="cmosi" camara={camara} lugar={LUGARES.cmosi} alto={2.3} cuerpo={e.cmosi} frame={frame+desfaseEscenas("S05", "S04")} fps={fps}/>
    <PostinActivo camara={camara} cuerpo={e.postin} frame={frame} fps={fps} cue={cues[0]} codigo={checkpointS05(frame,a)}/>
    <Actor id="spedi" camara={camara} lugar={LUGARES.spedi} alto={ALTURAS_S05.spedi} cuerpo={e.spedi} frame={frame} fps={fps} cue={cues[1]}/>
    <Actor id="rami" camara={camara} lugar={LUGARES.rami} alto={ALTURAS_S05.rami} cuerpo={e.rami} frame={frame} fps={fps} cue={cues[2]}/>
    <Vineta/>
    <SubtituloCine cues={cues} contornoNombre/>
    <CapaAudio cues={cues}/>
  </AbsoluteFill>;
};
export const S05PostMemoria=Interactive.create({Component:S05Inner,layout:"absolute-fill"});
