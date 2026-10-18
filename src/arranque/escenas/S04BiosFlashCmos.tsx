import {desfaseEscenas} from "../tiempo.ts";
import React, {useMemo} from "react";
import {AbsoluteFill, Interactive, useCurrentFrame, useVideoConfig} from "remotion";
import {anclasDeEscena, cuesDeEscena} from "../recursos.ts";
import {useCoreografia} from "../cine/coreografia.ts";
import {GUION_S04, puntoCodigoS04, referenciaCodigoS04, RUTA_CODIGO_S04} from "../cine/guion/S04.ts";
import {CIPU_LUGAR} from "../cine/guion/S03.ts";
import {Mundo3D, CHIPS_FIRMWARE} from "../cine/Mundo3D";
import {Actor, manoEnPantalla} from "../cine/Actor";
import {SubtituloCine} from "../cine/SubtituloCine";
import {CapaAudio} from "../componentes/CapaAudio";
import {FondoGabinete, Vineta} from "../cine/Atmosfera";
import {FiltrosBrillo, trazar} from "../cine/capas";
import {PlacaEncendida} from "../cine/PlacaEncendida";
import {MapaMemoria} from "../cine/MapaMemoria";
import {RtcMaterial} from "../cine/RtcMaterial";
import {FlashFisica} from "../cine/FlashFisica";
import {recorteDeRuta} from "../cine/rutas.ts";
import {crearCamara, LUGARES, proyectar} from "../cine/mundo.ts";

const S04Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cues = useMemo(() => cuesDeEscena("S04"), []);
  const a = useMemo(() => anclasDeEscena("S04", cues), [cues]);
  const aS02 = useMemo(() => anclasDeEscena("S02", cuesDeEscena("S02")), []);
  const e = useCoreografia(GUION_S04, a);
  const camara = crearCamara(e.cam);
  const cpu = proyectar(camara, CIPU_LUGAR);
  const manoBios = manoEnPantalla("bios", camara, LUGARES.bios, 2.3, e.bios, 1);
  const pCodigo = proyectar(camara, puntoCodigoS04(e.capa.codigo));
  const referencia = referenciaCodigoS04(manoBios, pCodigo);
  const tRuta = trazar(camara, recorteDeRuta(RUTA_CODIGO_S04, e.capa.codigo), 6);
  return <AbsoluteFill>
    <FondoGabinete calido={0.4} />
    <Mundo3D camara={e.cam} estado={{luzRed: 1, espera: 1, rieles: 1, rizado: 0, reloj: 1, resetRetenido: 0, cpuLista: 1, exterior: false, cartucho: e.mundo.cartucho, chips: {norte: e.mundo.norte, sur: e.mundo.sur, flash: e.mundo.flash}, frame: frame+desfaseEscenas("S04", "S03")}} />
    <svg width={1920} height={1080} style={{position: "absolute", inset: 0}}>
      <FiltrosBrillo />
      <PlacaEncendida camara={camara} frameGlobal={frame+desfaseEscenas("S04", "S01")} frameRelojS02={frame+desfaseEscenas("S04", "S02")} pwrS02={aS02.pwr} ecosS02={0} intensidad={e.capa.placa} />
      {e.capa.etiquetas > 0 ? CHIPS_FIRMWARE.map(chip => {
        const p = proyectar(camara, [chip.p[0], chip.alto, chip.p[2]]);
        const brillo = e.mundo[chip.nombre];
        return <g key={chip.nombre} opacity={e.capa.etiquetas}>
          <line x1={p.x} y1={p.y} x2={p.x} y2={p.y-64} stroke="#FFFFFF" strokeOpacity={0.7} strokeWidth={2} />
          <text x={p.x} y={p.y-74} textAnchor="middle" fill={brillo > 0.5 ? chip.color : "#FFFFFF"} fontFamily="'Courier New', monospace" fontSize={32} fontWeight={700} stroke="#06111B" strokeWidth={5} paintOrder="stroke">{chip.etiqueta}</text>
        </g>;
      }) : null}
      <MapaMemoria x={150} y={170} alto={460} progreso={e.capa.mapa} destacar={e.mundo.flash} />
      <FlashFisica camara={camara} apertura={e.capa.seccion} conteo={e.capa.conteo} detalle={e.capa.detalle} />
      {e.capa.codigo > 0 && e.capa.codigo < 1 ? <g>
        {/* El frente físico permanece sobre las pistas; la guía punteada es anotación. */}
        <path d={tRuta.d} fill="none" stroke="#A49BD9" strokeWidth={4} strokeOpacity={0.65} />
        <rect x={pCodigo.x-16} y={pCodigo.y-9} width={32} height={18} rx={5} fill="#D8D0FF" stroke="#A49BD9" strokeWidth={2} />
        <rect x={pCodigo.x-7} y={pCodigo.y-3} width={14} height={6} rx={2} fill="#FFFFFF" />
        {/* Proyección desde el gesto de Bios: nunca aparenta un paquete material aéreo. */}
        <path d={`M${manoBios.x} ${manoBios.y} L${referencia.x} ${referencia.y+referencia.alto} L${referencia.x+referencia.ancho} ${referencia.y+referencia.alto} Z`} fill="#A49BD9" fillOpacity={0.08} />
        <line {...referencia.guia} stroke="#C7BFF2" strokeWidth={2} strokeDasharray="5 7" strokeOpacity={0.7} />
        <rect x={referencia.x} y={referencia.y} width={referencia.ancho} height={referencia.alto} rx={12} fill="#17112B" stroke="#BDB1F4" strokeWidth={2} />
        <text x={referencia.x+referencia.ancho/2} y={referencia.y+33} textAnchor="middle" fill="#F0EBFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={28} fontWeight={700}>Instrucciones</text>
        <text x={referencia.x+referencia.ancho/2} y={referencia.y+66} textAnchor="middle" fill="#F0EBFF" fontFamily="Arial, Helvetica, sans-serif" fontSize={30} fontWeight={700}>BIOS</text>
      </g> : null}
      {e.capa.codigo >= 1 && frame < a.prepara + 28 ? <ellipse cx={cpu.x} cy={cpu.y-100} rx={80} ry={110} fill="none" stroke="#A49BD9" strokeWidth={5} opacity={0.6 + 0.3 * Math.sin(frame * 0.5)} /> : null}
      <RtcMaterial camara={camara} frame={frame} configuracion={e.capa.configuracion} reloj={e.capa.reloj} bateria={e.capa.bateria} distincion={e.capa.distincion} />
    </svg>
    {/* Oyentes conservan fase ambiental; los tres cues nuevos usan frame local. */}
    <Actor id="secu" camara={camara} lugar={LUGARES.secu} alto={2.3} cuerpo={e.secu} frame={frame+desfaseEscenas("S04", "S02")} fps={fps} />
    <Actor id="pulso" camara={camara} lugar={LUGARES.pulso} alto={2.3} cuerpo={e.pulso} frame={frame+desfaseEscenas("S04", "S02")} fps={fps} />
    <Actor id="cipu" camara={camara} lugar={CIPU_LUGAR} alto={3} cuerpo={e.cipu} frame={frame+desfaseEscenas("S04", "S03")} fps={fps} />
    <Actor id="romi" camara={camara} lugar={LUGARES.romi} alto={2.3} cuerpo={e.romi} frame={frame} fps={fps} cue={cues[0]} />
    <Actor id="bios" camara={camara} lugar={LUGARES.bios} alto={2.3} cuerpo={e.bios} frame={frame} fps={fps} cue={cues[1]} />
    <Actor id="cmosi" camara={camara} lugar={LUGARES.cmosi} alto={2.3} cuerpo={e.cmosi} frame={frame} fps={fps} cue={cues[2]} />
    <Vineta />
    <SubtituloCine cues={cues} contornoNombre />
    <CapaAudio cues={cues} />
  </AbsoluteFill>;
};
export const S04BiosFlashCmos = Interactive.create({Component: S04Inner, layout: "absolute-fill"});
