import {desfaseEscenas} from "../tiempo.ts";
import React, {useMemo} from "react";
import {AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {cuesDeEscena, anclasDeEscena} from "../recursos.ts";
import {CapaAudio} from "../componentes/CapaAudio";
import {SubtituloCine} from "../cine/SubtituloCine";
import {Mundo3D, COLORES_ATX, MAZO_ATX, PISTAS, recorridoEspera, recorridoMazo} from "../cine/Mundo3D";
import {LUGARES, crearCamara, type Punto3D} from "../cine/mundo.ts";
import {useCoreografia} from "../cine/coreografia.ts";
import {GUION_S02} from "../cine/guion/S02.ts";
import {FondoGabinete, Vineta} from "../cine/Atmosfera";
import {FiltrosBrillo, FlujoContinuo, SenalViajera, trazar} from "../cine/capas";
import {Trazas, escalon, type Canal} from "../cine/instrumentos";
import {Actor} from "../cine/Actor";

/**
 * S02 · Control de encendido (25 s). Cadena causal visible y en orden:
 * pulsación (Pulso) → Secu lleva PS_ON# a 0 → la fuente entrega las salidas
 * (con rizado hasta estabilizarse) → PWR_OK = 1 llega a Secu → arranca el
 * reloj → Secu libera RESET → la CPU queda habilitada (ejecuta en S03).
 * Cada señal recorre su pista o su hilo ATX real; el analizador lógico
 * registra los mismos instantes.
 */
const hilo = (nombre: string): Punto3D[] => recorridoMazo(MAZO_ATX.find((h) => h.nombre === nombre)!.desfase);
const CABLE_PULSO: Punto3D[] = [[-8.4, 0.4, 2.9], [-7.2, 0.5, 2.8], [-6.4, 0.3, 2.6], ...PISTAS.boton.slice(1)];

const S02Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cues = useMemo(() => cuesDeEscena("S02"), []);
  const a = useMemo(() => anclasDeEscena("S02", cues), [cues]);

  const e = useCoreografia(GUION_S02, a);

  const camara = crearCamara(e.cam);
  const tBoton = trazar(camara, CABLE_PULSO, 4);
  const tPsOn = trazar(camara, PISTAS.psOn, 2);
  const tPsOnHilo = trazar(camara, hilo("psOn"), 6);
  const tRieles = [hilo("v33"), hilo("v5"), hilo("v12")].map((h) => trazar(camara, [...h].reverse(), 6));
  const tRielesPista = trazar(camara, PISTAS.rieles, 2);
  const tPwrOk = trazar(camara, PISTAS.pwrOk, 2);
  const tReset = trazar(camara, PISTAS.reset, 2);
  const tReloj = trazar(camara, PISTAS.reloj, 2);

  const xa = (fr: number) => (fr - (a.psOn - 30)) / (740 - (a.psOn - 30));
  const canales: Canal[] = [
    {nombre: "PS_ON#", color: COLORES_ATX.psOn, valor: (x) => 1 - escalon(x, xa(a.psOn)), estado: (x) => (x < xa(a.psOn) ? "1" : "0")},
    {nombre: "PWR_OK", color: COLORES_ATX.pwrOk, valor: (x) => escalon(x, xa(a.pwr + 30)), estado: (x) => (x < xa(a.pwr + 30) ? "0" : "1")},
    {nombre: "RESET", color: "#FF5A6A", valor: (x) => 1 - escalon(x, xa(a.reset + 26)), estado: (x) => (x < xa(a.reset + 26) ? "activo" : "liberado"), grosor: 6},
  ];

  // Repaso: un destello recorre la cadena en el orden causal.
  const etapas = [tBoton, tPsOn, tRielesPista, tPwrOk, tReset];
  const repaso = e.senal.repaso * etapas.length;
  // Pulsos periódicos del reloj hacia la CPU.
  const fasesReloj = [0, 1, 2].map((k) => ((frame - (a.pwr + 40) + k * 8) % 24) / 24);

  return (
    <AbsoluteFill>
      <FondoGabinete calido={0.4 * e.mundo.rieles} />
      <Mundo3D camara={e.cam} estado={{luzRed: 1, espera: 1, rieles: e.mundo.rieles, rizado: e.mundo.rizado, reloj: e.mundo.reloj, resetRetenido: e.mundo.resetRetenido, cpuLista: e.mundo.cpuLista, exterior: false, frame}} />
      <svg width={1920} height={1080} style={{position: "absolute", inset: 0}}>
        <FiltrosBrillo />
        {/* +5VSB permanece presente durante toda la escena (continuidad con S01). */}
        <FlujoContinuo trazo={trazar(camara, recorridoEspera(), 4)} frame={frame+desfaseEscenas("S02", "S01")} avance={1} color={COLORES_ATX.espera} />
        <SenalViajera trazo={tBoton} avance={e.senal.boton} color="#7CF7FF" persistente={false} grosor={6} />
        <SenalViajera trazo={tPsOn} avance={e.senal.psOn} color={COLORES_ATX.psOn} grosor={5} />
        <SenalViajera trazo={tPsOnHilo} avance={e.senal.psOnHilo} color={COLORES_ATX.psOn} grosor={5} />
        {tRieles.map((t, i) => <SenalViajera key={i} trazo={t} avance={e.senal.rielesHilo} color={[COLORES_ATX.v33, COLORES_ATX.v5, COLORES_ATX.v12][i]} grosor={5} intensidad={1 - 0.4 * e.mundo.rizado * (0.5 + 0.5 * Math.sin(frame * 2.3 + i))} />)}
        <SenalViajera trazo={tRielesPista} avance={e.senal.rielesPista} color={COLORES_ATX.v5} grosor={7} intensidad={1 - 0.45 * e.mundo.rizado * (0.5 + 0.5 * Math.sin(frame * 2.3))} />
        <SenalViajera trazo={tPwrOk} avance={e.senal.pwrOk} color="#E6EEF7" grosor={5} />
        <SenalViajera trazo={tReset} avance={e.senal.reset} color="#FF5A6A" persistente={false} grosor={7} />
        {e.mundo.reloj > 0 ? fasesReloj.map((fase, k) => <SenalViajera key={k} trazo={tReloj} avance={fase} color="#7CC8FF" persistente={false} grosor={4} intensidad={e.mundo.reloj * 0.9} />) : null}
        {e.senal.repaso > 0 && e.senal.repaso < 1 ? etapas.map((t, i) => <SenalViajera key={`r${i}`} trazo={t} avance={Math.max(0, Math.min(1.2, repaso - i))} color="#FFFFFF" persistente={false} grosor={8} intensidad={0.9} />) : null}
      </svg>
      <Actor id="secu" camara={camara} lugar={LUGARES.secu} alto={2.3} cuerpo={e.secu} frame={frame} fps={fps} cue={cues[1]} />
      <Actor id="pulso" camara={camara} lugar={LUGARES.pulso} alto={2.3} cuerpo={e.pulso} frame={frame} fps={fps} cue={cues[0]} />
      {e.senal.analizador > 0.01 ? (
        <svg width={940} height={250} style={{position: "absolute", left: 64, top: 54, opacity: e.senal.analizador, translate: `0 ${interpolate(e.senal.analizador, [0, 1], [-20, 0])}px`}}>
          <FiltrosBrillo />
          <Trazas canales={canales} progreso={xa(frame)} ancho={920} altoCanal={40} separacion={28} />
        </svg>
      ) : null}
      <Vineta />
      <SubtituloCine cues={cues} />
      <CapaAudio cues={cues} />
    </AbsoluteFill>
  );
};

export const S02Orden = Interactive.create({Component: S02Inner, layout: "absolute-fill"});
