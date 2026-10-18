import {desfaseEscenas} from "../tiempo.ts";
import React,{useMemo} from "react";
import {AbsoluteFill,Interactive,useCurrentFrame,useVideoConfig} from "remotion";
import {anclasDeEscena,cuesDeEscena} from "../recursos.ts";
import {useCoreografia} from "../cine/coreografia.ts";
import {GUION_S12} from "../cine/guion/S12.ts";
import {NUCLEO_LUGAR,INIT_LUGAR,ALTURA_NUCLEO,ALTURA_INIT} from "../cine/guion/S12.ts";
import {NucleoMaterial,SistemaMaterial} from "../cine/LinuxMaterial";

import {lugarMebre,ALTURA_MEBRE} from "../cine/guion/S09.ts";
import {lugarGrubi,ALTURA_GRUBI} from "../cine/guion/S10.ts";
import {MbrMaterial,GrubMaterial} from "../cine/CargadorMaterial";

import {ALTURA_DISQUI} from "../cine/guion/S06.ts";
import {ALTURAS_S05,checkpointS05} from "../cine/guion/S05.ts";
import {CIPU_LUGAR} from "../cine/guion/S03.ts";
import {crearCamara,LUGARES} from "../cine/mundo.ts";
import {Mundo3D} from "../cine/Mundo3D";
import {Actor} from "../cine/Actor";
import {PostinActivo} from "../cine/PostinActivo";
import {MemoriaMaterial} from "../cine/MemoriaMaterial";
import {ServiciosMaterial} from "../cine/ServiciosMaterial";
import {DisqueteraMaterial, SeleccionMaterial, LecturaMaterial} from "../cine/ArranqueMaterial";
import {PlacaEncendida} from "../cine/PlacaEncendida";
import {FiltrosBrillo} from "../cine/capas";
import {FondoGabinete,Vineta} from "../cine/Atmosfera";
import {SubtituloCine} from "../cine/SubtituloCine";
import {CapaAudio} from "../componentes/CapaAudio";
const S12Inner:React.FC=()=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 const cues=useMemo(()=>cuesDeEscena("S12"),[]),a=useMemo(()=>anclasDeEscena("S12",cues),[cues]);
 const aS05=useMemo(()=>anclasDeEscena("S05",cuesDeEscena("S05")),[]);
 const aS06=useMemo(()=>anclasDeEscena("S06",cuesDeEscena("S06")),[]);
 const aS07=useMemo(()=>anclasDeEscena("S07",cuesDeEscena("S07")),[]);
 const aS08=useMemo(()=>anclasDeEscena("S08",cuesDeEscena("S08")),[]);
 const aS02=useMemo(()=>anclasDeEscena("S02",cuesDeEscena("S02")),[]);
 const e=useCoreografia(GUION_S12,a),c=crearCamara(e.cam);
 return <AbsoluteFill>
  <FondoGabinete calido={.4}/>
  <Mundo3D camara={e.cam} estado={{luzRed:1,espera:1,rieles:1,rizado:0,reloj:1,resetRetenido:0,cpuLista:1,exterior:false,cartucho:e.mundo.cartucho,chips:{norte:e.mundo.norte,sur:e.mundo.sur,flash:e.mundo.flash},frame:frame+desfaseEscenas("S12", "S03")}}/>
  <svg width={1920} height={1080} style={{position:"absolute",inset:0}}>
   <FiltrosBrillo/>
   <PlacaEncendida camara={c} frameGlobal={frame+desfaseEscenas("S12", "S01")} frameRelojS02={frame+desfaseEscenas("S12", "S02")} pwrS02={aS02.pwr} ecosS02={0} intensidad={e.capa.placa}/>
   {/* Persistencias con SUS relojes y SUS anclas: no reinician POST ni la preparación S06. */}
   <MemoriaMaterial e={e} frame={frame+desfaseEscenas("S12", "S05")} fps={fps} a={aS05}/>
   <DisqueteraMaterial e={e}/>
   <ServiciosMaterial e={e} frame={frame+desfaseEscenas("S12", "S06")} a={aS06}/>
   <SeleccionMaterial e={e} frame={frame+desfaseEscenas("S12", "S07")} a={aS07}/>
   <LecturaMaterial e={e} frame={frame+desfaseEscenas("S12", "S08")} a={aS08}/>
   <MbrMaterial e={e}/>
   <GrubMaterial e={e}/>
   <NucleoMaterial e={e}/>
   <SistemaMaterial e={e}/>
  </svg>
  <Actor id="secu" camara={c} lugar={LUGARES.secu} alto={2.3} cuerpo={e.secu} frame={frame} frameAmbiente={frame+desfaseEscenas("S12", "S02")} fps={fps}/>
  <Actor id="pulso" camara={c} lugar={LUGARES.pulso} alto={2.3} cuerpo={e.pulso} frame={frame} frameAmbiente={frame+desfaseEscenas("S12", "S02")} fps={fps}/>
  <Actor id="cipu" camara={c} lugar={CIPU_LUGAR} alto={3} cuerpo={e.cipu} frame={frame} frameAmbiente={frame+desfaseEscenas("S12", "S03")} fps={fps}/>
  <Actor id="romi" camara={c} lugar={LUGARES.romi} alto={2.3} cuerpo={e.romi} frame={frame} frameAmbiente={frame+desfaseEscenas("S12", "S04")} fps={fps}/>
  <Actor id="grubi" camara={c} lugar={lugarGrubi(e.grubi)} alto={ALTURA_GRUBI} cuerpo={e.grubi} frame={frame} frameAmbiente={frame+desfaseEscenas("S12", "S10")} fps={fps}/>
  <Actor id="bios" camara={c} lugar={LUGARES.bios} alto={2.3} cuerpo={e.bios} frame={frame} frameAmbiente={frame+desfaseEscenas("S12", "S04")} fps={fps}/>
  <Actor id="cmosi" camara={c} lugar={LUGARES.cmosi} alto={2.3} cuerpo={e.cmosi} frame={frame} frameAmbiente={frame+desfaseEscenas("S12", "S04")} fps={fps}/>
  <PostinActivo camara={c} cuerpo={e.postin} frame={frame} frameAmbiente={frame+desfaseEscenas("S12", "S05")} fps={fps} codigo={checkpointS05(frame+desfaseEscenas("S12", "S05"),aS05)}/>
  <Actor id="spedi" camara={c} lugar={LUGARES.spedi} alto={ALTURAS_S05.spedi} cuerpo={e.spedi} frame={frame} frameAmbiente={frame+desfaseEscenas("S12", "S05")} fps={fps}/>
  <Actor id="rami" camara={c} lugar={LUGARES.rami} alto={ALTURAS_S05.rami} cuerpo={e.rami} frame={frame} frameAmbiente={frame+desfaseEscenas("S12", "S05")} fps={fps}/>
  <Actor id="disqui" camara={c} lugar={LUGARES.disqui} alto={ALTURA_DISQUI} cuerpo={e.disqui} frame={frame} frameAmbiente={frame+desfaseEscenas("S12", "S06")} fps={fps}/>
  <Actor id="mebre" camara={c} lugar={lugarMebre(e.mebre)} alto={ALTURA_MEBRE} cuerpo={e.mebre} frame={frame} frameAmbiente={frame+desfaseEscenas("S12", "S09")} fps={fps}/>
  <Actor id="nucleo" camara={c} lugar={NUCLEO_LUGAR} alto={ALTURA_NUCLEO} cuerpo={e.nucleo} frame={frame} frameAmbiente={frame} fps={fps} cue={cues[0]}/>
  <Actor id="init" camara={c} lugar={INIT_LUGAR} alto={ALTURA_INIT} cuerpo={e.init} frame={frame} frameAmbiente={frame} fps={fps} cue={cues[1]}/>
  <Vineta/>
  <SubtituloCine cues={cues} contornoNombre/>
  <CapaAudio cues={cues}/>
 </AbsoluteFill>;
};
export const S12InicioSistema=Interactive.create({Component:S12Inner,layout:"absolute-fill"});
