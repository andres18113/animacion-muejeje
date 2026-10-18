import React, {useMemo} from "react";
import {AbsoluteFill, Interactive, useCurrentFrame, useVideoConfig} from "remotion";
import {cuesDeEscena, anclasDeEscena} from "../recursos.ts";
import {CapaAudio} from "../componentes/CapaAudio";
import {SubtituloCine} from "../cine/SubtituloCine";
import {FondoGabinete, Vineta} from "../cine/Atmosfera";
import {Mundo3D, COLORES_ATX, RECORRIDO_RED, recorridoEspera} from "../cine/Mundo3D";
import {LUGARES, crearCamara} from "../cine/mundo.ts";
import {useCoreografia} from "../cine/coreografia.ts";
import {GUION_S01} from "../cine/guion/S01.ts";
import {FiltrosBrillo, FlujoContinuo, OndaAlterna, trazar} from "../cine/capas";
import {Trazas, escalon, subidaEstabilizada, type Canal} from "../cine/instrumentos";
import {Actor, anguloVentilador, manoEnPantalla} from "../cine/Actor";

/**
 * S01 · Alimentación inicial (20 s). La energía cambia de forma ante el
 * espectador: entra como senoide (AC) desde la red, Voltio despierta y su
 * ventilador arranca, y sale como flujo continuo por el hilo morado (+5VSB)
 * hasta el LED de espera de la placa. Las salidas principales y PWR_OK se
 * explican con un osciloscopio holográfico: en S01 todavía no se encienden,
 * porque la orden real de la placa llega en S02 (continuidad causal).
 */
const RECORRIDO_ESPERA = recorridoEspera();

/** Medidas del holograma en píxeles de la composición. */
const HOLO = {ancho: 760, alto: 400};

const S01Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cues = useMemo(() => cuesDeEscena("S01"), []);
  const a = useMemo(() => anclasDeEscena("S01", cues), [cues]);
  const e = useCoreografia(GUION_S01, a);

  const camara = crearCamara(e.cam);
  const red = trazar(camara, RECORRIDO_RED, 8);
  const espera = trazar(camara, RECORRIDO_ESPERA, 4);
  const ventilador = anguloVentilador(frame, a.ac + 30, a.ac + 60, 24);

  // Osciloscopio holográfico: el tiempo del instrumento sigue al diálogo.
  const xh = (fr: number) => (fr - (a.orden - 14)) / (590 - (a.orden - 14));
  const asentamiento = xh(a.estable + 60) - xh(a.principal);
  const canales: Canal[] = [
    {nombre: "PS_ON#", color: COLORES_ATX.psOn, valor: (x) => 1 - escalon(x, xh(a.orden)), estado: (x) => (x < xh(a.orden) ? "1" : "0")},
    {nombre: "+3.3 V", color: COLORES_ATX.v33, valor: (x) => subidaEstabilizada(x, xh(a.principal), 0.05, asentamiento, 0.55)},
    {nombre: "+5 V", color: COLORES_ATX.v5, valor: (x) => subidaEstabilizada(x, xh(a.principal + 3), 0.05, asentamiento, 0.75)},
    {nombre: "+12 V", color: COLORES_ATX.v12, valor: (x) => subidaEstabilizada(x, xh(a.principal + 6), 0.06, asentamiento, 0.92)},
    {nombre: "PWR_OK", color: COLORES_ATX.pwrOk, valor: (x) => escalon(x, xh(a.pwr)), estado: (x) => (x < xh(a.pwr) ? "0" : "1")},
  ];
  // El holograma nace de la mano izquierda alzada de Voltio y se mantiene dentro del encuadre.
  const mano = manoEnPantalla("voltio", camara, LUGARES.voltio, 3.0, e.voltio, 0);
  const holoX = Math.max(60, Math.min(1920 - HOLO.ancho - 60, mano.x - HOLO.ancho - 40));
  const holoY = Math.max(60, Math.min(560 - HOLO.alto, mano.y - HOLO.alto + 40));
  const holoEscala = e.capa.holo * (1 - e.capa.holoSalida);

  return (
    <AbsoluteFill>
      <FondoGabinete calido={e.capa.acLlegada} />
      <Mundo3D camara={e.cam} estado={{luzRed: e.mundo.luzRed, espera: e.mundo.espera, rieles: 0, rizado: 0, reloj: 0, resetRetenido: 1, cpuLista: 0, resaltarReset: 0.15, frame}} />
      <svg width={1920} height={1080} style={{position: "absolute", inset: 0}}>
        <FiltrosBrillo />
        <OndaAlterna trazo={red} frame={frame} amplitud={16 * e.capa.acAmplitud} llegada={e.capa.acLlegada} />
        <FlujoContinuo trazo={espera} frame={frame} avance={e.capa.esperaAvance} color={COLORES_ATX.espera} />
        {holoEscala > 0.01 ? (
          <polygon
            points={`${mano.x},${mano.y} ${holoX + HOLO.ancho},${holoY + 20} ${holoX + HOLO.ancho},${holoY + HOLO.alto - 20}`}
            fill="#7FE7FF"
            opacity={0.32 * holoEscala}
            filter="url(#brilloSuave)"
          />
        ) : null}
      </svg>
      <Actor id="secu" camara={camara} lugar={LUGARES.secu} alto={2.3} cuerpo={e.secu} frame={frame} fps={fps} />
      <Actor id="pulso" camara={camara} lugar={LUGARES.pulso} alto={2.3} cuerpo={e.pulso} frame={frame} fps={fps} />
      <Actor id="voltio" camara={camara} lugar={LUGARES.voltio} alto={3.0} cuerpo={e.voltio} frame={frame} fps={fps} cue={cues[0]} ventilador={ventilador} />
      {holoEscala > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: holoX,
            top: holoY,
            width: HOLO.ancho,
            height: HOLO.alto,
            transformOrigin: "100% 60%",
            transform: `perspective(1400px) rotateY(-14deg) scale(${holoEscala})`,
            opacity: Math.min(1, holoEscala * 1.3) * (0.92 + 0.08 * Math.sin(frame * 0.9)),
          }}
        >
          <svg width={HOLO.ancho} height={HOLO.alto} style={{overflow: "visible"}}>
            <FiltrosBrillo />
            <rect x={0} y={0} width={HOLO.ancho} height={HOLO.alto} rx={22} fill="#0A3A4E" fillOpacity={0.42} stroke="#7FE7FF" strokeOpacity={0.55} strokeWidth={2} />
            {Array.from({length: 25}, (_, i) => <line key={i} x1={4} x2={HOLO.ancho - 4} y1={8 + i * 16} y2={8 + i * 16} stroke="#7FE7FF" strokeOpacity={0.06} />)}
            <g transform="translate(28 34)">
              <Trazas canales={canales} progreso={xh(frame)} ancho={HOLO.ancho - 40} altoCanal={46} separacion={22} />
            </g>
          </svg>
        </div>
      ) : null}
      <Vineta />
      <SubtituloCine cues={cues} />
      <CapaAudio cues={cues} />
    </AbsoluteFill>
  );
};

export const S01Energia = Interactive.create({Component: S01Inner, layout: "absolute-fill"});
