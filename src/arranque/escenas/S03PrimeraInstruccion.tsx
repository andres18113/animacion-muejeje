import {duracionEscena} from "../anclas.ts";
import React, {useMemo} from "react";
import {AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {cuesDeEscena, anclasDeEscena} from "../recursos.ts";
import {useCoreografia} from "../cine/coreografia.ts";
import {Mundo3D, CHIPS_FIRMWARE, RUTA_FIRMWARE} from "../cine/Mundo3D";
import {Actor, manoEnPantalla} from "../cine/Actor";
import {SubtituloCine} from "../cine/SubtituloCine";
import {CapaAudio} from "../componentes/CapaAudio";
import {FondoGabinete, Vineta} from "../cine/Atmosfera";
import {FiltrosBrillo, SenalViajera, trazar} from "../cine/capas";
import {AnalizadorS02, PlacaEncendida} from "../cine/PlacaEncendida";
import {MapaMemoria} from "../cine/MapaMemoria";
import {LUGARES, crearCamara, proyectar} from "../cine/mundo.ts";
import {puntoDeRuta, recorteDeRuta} from "../cine/rutas.ts";
import {CIPU_LUGAR, GUION_S03, RETORNO_FIRMWARE} from "../cine/guion/S03.ts";

/**
 * S03 · Primera instrucción (25 s). El cartucho encendido de S02 cobra vida
 * como Cipu. Sus registros de reinicio (CS.BASE, EIP) forman la dirección
 * física 0xFFFFFFF0 —en hexadecimal y binario mientras la nombra (§9.3)— que no
 * se obtiene con CS×16+IP (§6.2). La búsqueda recorre Slot 1 → 82443BX →
 * PIIX4E → flash; vuelven instrucciones del firmware (violeta, color de Bios)
 * y Cipu las ejecuta. La SDRAM aún no está inicializada; Linux no está cargado. El chipset
 * hace que la región alta del espacio de direcciones responda (B01).
 */
const FRAMES_S01 = duracionEscena("S01");
const FRAMES_S02 = duracionEscena("S02");
const HOLO = {ancho: 900, alto: 500};
const MONO = "'Courier New', monospace";
const ANCHO_CARACTER = 0.6;

/** Texto monoespaciado con un tramo resaltado [desde, hasta). */
const Hex: React.FC<{x: number; y: number; texto: string; tam: number; resaltar?: [number, number]; color?: string; opacidad?: number}> = ({x, y, texto, tam, resaltar, color = "#BFEFFF", opacidad = 1}) => (
  <g opacity={opacidad}>
    {resaltar ? <rect x={x + resaltar[0] * tam * ANCHO_CARACTER - 4} y={y - tam * 0.82} width={(resaltar[1] - resaltar[0]) * tam * ANCHO_CARACTER + 8} height={tam * 1.05} rx={6} fill="#FFD27A" fillOpacity={0.22} /> : null}
    <text x={x} y={y} fill={color} fontFamily={MONO} fontSize={tam} fontWeight={700} xmlSpace="preserve">{texto}</text>
  </g>
);

const S03Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cues = useMemo(() => cuesDeEscena("S03"), []);
  const a = useMemo(() => anclasDeEscena("S03", cues), [cues]);
  const aS02 = useMemo(() => anclasDeEscena("S02", cuesDeEscena("S02")) as Record<"psOn" | "pwr" | "reset", number>, []);
  const e = useCoreografia(GUION_S03, a);
  const camara = crearCamara(e.cam);

  // — Holograma de registros, nacido de la mano izquierda de Cipu —
  const mano = manoEnPantalla("cipu", camara, CIPU_LUGAR, 3.0, e.cipu, 0);
  const holoX = Math.max(50, Math.min(1920 - HOLO.ancho - 50, mano.x - HOLO.ancho - 50));
  const holoY = Math.max(50, Math.min(840 - HOLO.alto, mano.y - HOLO.alto * 0.55));
  const tam = 52;
  const col = 250; // columna de los valores hexadecimales
  const yBase = 92;
  const yEip = 170;
  const yFisica = 290;
  const s = e.capa.suma;
  // Las mitades viajan a la fila de resultado: FFFF (de CS.BASE) y FFF0 (de EIP).
  const vuelo = interpolate(s, [0, 0.75], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const resultado = interpolate(s, [0.7, 1], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const anchoCar = tam * ANCHO_CARACTER;

  // — Búsqueda hacia el firmware y respuesta —
  const tRuta = trazar(camara, RUTA_FIRMWARE, 6);
  const avanceBusqueda = e.capa.busqueda;
  const estela = avanceBusqueda > 0 ? trazar(camara, recorteDeRuta(RUTA_FIRMWARE, avanceBusqueda), 6) : null;
  const cabeza = proyectar(camara, puntoDeRuta(RUTA_FIRMWARE, avanceBusqueda));
  const rutaInversa = [...RUTA_FIRMWARE].reverse();
  // Rótulo de chip (centrado, 32 px mono) cruzado por la cápsula «0xFFFFFFF0» en vuelo.
  // Devuelve 0..1 según cuánto lo cubre, para atenuarlo sin saltos.
  const cruzaPaquete = (x: number, base: number, letras: number) => {
    if (avanceBusqueda <= 0 || avanceBusqueda >= 1) return 0;
    const ancho = Math.max(0, Math.min(x + letras * 10, cabeza.x + 214) - Math.max(x - letras * 10, cabeza.x + 18));
    const alto = Math.max(0, Math.min(base + 6, cabeza.y - 4) - Math.max(base - 28, cabeza.y - 44));
    return Math.min(1, (ancho / (letras * 20)) * (alto / 34) * 4);
  };
  const paquetes = [0, 1, 2].map((k) => Math.max(0, Math.min(1, e.capa.retorno * RETORNO_FIRMWARE.factor - k * RETORNO_FIRMWARE.separacion)));
  const pulsoEjecucion = e.capa.ejecucion > 0 && e.capa.ejecucion < 1 ? 0.5 + 0.5 * Math.cos(e.capa.ejecucion * Math.PI * 6) : 0;
  const pie = proyectar(camara, CIPU_LUGAR);
  const tamCipu = pie.escala * 3.0;

  // — Linux aún no cargado: contorno del módulo SDRAM instalado —
  const esquinasRam = [[5.83, 1.5, -4.8], [5.97, 1.5, -4.8], [5.97, 1.5, 0.0], [5.83, 1.5, 0.0], [5.83, 0.3, 0.0], [5.83, 0.3, -4.8]].map((p) => proyectar(camara, p as [number, number, number]));

  const rotuloRam = {
    derecha: Math.min(1880, Math.max(360, esquinasRam[2].x + 14)),
    base: esquinasRam[2].y + 8,
    ancho: 320,
    alto: 46,
  };

  return (
    <AbsoluteFill>
      <FondoGabinete calido={0.4} />
      <Mundo3D
        camara={e.cam}
        estado={{luzRed: 1, espera: 1, rieles: 1, rizado: 0, reloj: 1, resetRetenido: 0, cpuLista: 1, exterior: false, cartucho: e.mundo.cartucho, chips: {norte: e.mundo.norte, sur: e.mundo.sur, flash: e.mundo.flash}, frame}}
      />
      <svg width={1920} height={1080} style={{position: "absolute", inset: 0}}>
        <FiltrosBrillo />
        <PlacaEncendida camara={camara} frameGlobal={frame + FRAMES_S01 + FRAMES_S02} frameRelojS02={frame + FRAMES_S02} pwrS02={aS02.pwr} intensidad={e.capa.placa} ecosS02={interpolate(frame, [0, 18], [1, 0], {extrapolateRight: "clamp"})} />
        {/* Estela de la búsqueda (dirección) y paquete con la dirección física */}
        {estela ? <path d={estela.d} fill="none" stroke="#FFD27A" strokeWidth={5} strokeOpacity={0.8 * (1 - e.capa.repaso)} strokeLinecap="round" strokeLinejoin="round" filter="url(#brillo)" /> : null}
        {/* Instrucciones del firmware de vuelta hacia la CPU */}
        {paquetes.map((t, k) => {
          if (t <= 0 || t >= 1) return null;
          const p = proyectar(camara, puntoDeRuta(rutaInversa, t));
          return <rect key={k} x={p.x - 16} y={p.y - 10} width={32} height={20} rx={6} fill="#C9BEFF" stroke="#A49BD9" strokeWidth={3} filter="url(#brillo)" />;
        })}
        {pulsoEjecucion > 0 ? <ellipse cx={pie.x} cy={pie.y - tamCipu * 0.48} rx={tamCipu * 0.42} ry={tamCipu * 0.5} fill="none" stroke="#A49BD9" strokeWidth={6} opacity={pulsoEjecucion * 0.8} filter="url(#brillo)" /> : null}
        {/* Cierre: la búsqueda y su respuesta se repiten en un destello */}
        {e.capa.repaso > 0 && e.capa.repaso < 1 ? (
          <>
            <SenalViajera trazo={tRuta} avance={Math.min(1, e.capa.repaso * 2)} color="#FFD27A" persistente={false} grosor={7} />
            <SenalViajera trazo={trazar(camara, rutaInversa, 6)} avance={Math.max(0, e.capa.repaso * 2 - 1)} color="#C9BEFF" persistente={false} grosor={7} />
          </>
        ) : null}
        {/* El contenido físico de SDRAM es indeterminado; Linux no está cargado. */}
        {e.capa.ramVacia > 0 ? (
          <g>
            <polygon opacity={e.capa.ramVacia} points={esquinasRam.map((p) => `${p.x},${p.y}`).join(" ")} fill="#0B1620" fillOpacity={0.35} stroke="#9AA7B4" strokeWidth={3} strokeDasharray="10 8" />
            {/* Superficie técnica opaca: el ATX no atraviesa la lectura del DIMM. */}
            <line x1={esquinasRam[1].x} y1={esquinasRam[1].y} x2={rotuloRam.derecha} y2={rotuloRam.base - 34} stroke="#C8D2DC" strokeWidth={2} />
            <rect x={rotuloRam.derecha - rotuloRam.ancho + 14} y={rotuloRam.base - 34} width={rotuloRam.ancho} height={rotuloRam.alto} rx={8} fill="#061923" stroke="#9AA7B4" strokeWidth={2} />
            <text x={rotuloRam.derecha} y={rotuloRam.base} textAnchor="end" fill="#C8D2DC" fontFamily="Arial, Helvetica, sans-serif" fontSize={26} fontWeight={700}>Linux aún no cargado</text>
          </g>
        ) : null}
        {/* Etiquetas técnicas de los chips (§7: componentes secundarios rotulados) */}
        {e.capa.etiquetas > 0
          ? CHIPS_FIRMWARE.map((chip) => {
              const p = proyectar(camara, [chip.p[0], chip.alto, chip.p[2]]);
              const brillo = chip.nombre === "norte" ? e.mundo.norte : chip.nombre === "sur" ? e.mundo.sur : e.mundo.flash;
              return (
                <g key={chip.nombre} opacity={e.capa.etiquetas * (1 - 0.75 * cruzaPaquete(p.x, p.y - 74, chip.etiqueta.length))}>
                  <line x1={p.x} y1={p.y} x2={p.x} y2={p.y - 64} stroke="#FFFFFF" strokeOpacity={0.7} strokeWidth={2} />
                  <text x={p.x} y={p.y - 74} textAnchor="middle" fill={brillo > 0.5 ? chip.color : "#FFFFFF"} fontFamily={MONO} fontSize={32} fontWeight={700} stroke="#06111B" strokeWidth={5} paintOrder="stroke">{chip.etiqueta}</text>
                </g>
              );
            })
          : null}
        {/* El paquete de dirección va encima de los rótulos de chips (antes «PIIX4E» lo tapaba). */}
        {avanceBusqueda > 0 && avanceBusqueda < 1 ? (
          <g>
            <circle cx={cabeza.x} cy={cabeza.y} r={13} fill="#FFF6D8" filter="url(#brillo)" />
            <rect x={cabeza.x + 18} y={cabeza.y - 44} width={196} height={40} rx={10} fill="#1A1405" fillOpacity={0.75} stroke="#FFD27A" strokeWidth={2} />
            <text x={cabeza.x + 30} y={cabeza.y - 15} fill="#FFD27A" fontFamily={MONO} fontSize={28} fontWeight={700}>0xFFFFFFF0</text>
          </g>
        ) : null}
        <MapaMemoria x={150} y={170} alto={460} progreso={e.capa.mapa} destacar={e.mundo.flash} />
        {e.capa.mapa > 0.6 ? (() => {
          const flash = proyectar(camara, [CHIPS_FIRMWARE[2].p[0], CHIPS_FIRMWARE[2].alto, CHIPS_FIRMWARE[2].p[2]]);
          // Sale bajo «firmware» y entra a la flash por la izquierda: no tacha los rótulos del mapa ni «Flash 4 Mbit».
          return <path d={`M196 246 C 300 330, ${flash.x - 220} ${flash.y + 30}, ${flash.x - 16} ${flash.y + 4}`} fill="none" stroke="#A49BD9" strokeWidth={4} strokeDasharray="12 10" strokeDashoffset={-frame * 2} opacity={Math.min(1, (e.capa.mapa - 0.6) * 2.5)} filter="url(#brillo)" />;
        })() : null}
      </svg>
      {/* Los oyentes continúan el reloj ambiental de S02; Cipu usa el reloj local de su cue. */}
      <Actor id="secu" camara={camara} lugar={LUGARES.secu} alto={2.3} cuerpo={e.secu} frame={frame + FRAMES_S02} fps={fps} />
      <Actor id="pulso" camara={camara} lugar={LUGARES.pulso} alto={2.3} cuerpo={e.pulso} frame={frame + FRAMES_S02} fps={fps} />
      <Actor id="cipu" camara={camara} lugar={CIPU_LUGAR} alto={3.0} cuerpo={e.cipu} frame={frame} fps={fps} cue={cues[0]} />
      {e.capa.holo > 0.01 ? (
        <>
          <svg width={1920} height={1080} style={{position: "absolute", inset: 0}}>
            <FiltrosBrillo />
            <polygon points={`${mano.x},${mano.y} ${holoX + HOLO.ancho},${holoY + 30} ${holoX + HOLO.ancho},${holoY + HOLO.alto - 30}`} fill="#7FE7FF" opacity={0.3 * e.capa.holo} filter="url(#brilloSuave)" />
          </svg>
          <div style={{position: "absolute", left: holoX, top: holoY, width: HOLO.ancho, height: HOLO.alto, transformOrigin: "100% 55%", transform: `perspective(1400px) rotateY(-12deg) scale(${e.capa.holo})`, opacity: Math.min(1, e.capa.holo * 1.3)}}>
            <svg width={HOLO.ancho} height={HOLO.alto} style={{overflow: "visible"}}>
              <FiltrosBrillo />
              <rect x={0} y={0} width={HOLO.ancho} height={HOLO.alto} rx={22} fill="#0A3A4E" fillOpacity={0.45} stroke="#7FE7FF" strokeOpacity={0.55} strokeWidth={2} />
              {/* Sustrato del instrumento: los datos no transmiten el PCI del fondo. */}
              <rect x={16} y={24} width={HOLO.ancho - 32} height={HOLO.alto - 48} rx={12} fill="#061923" />
              {Array.from({length: 27}, (_, i) => <line key={i} x1={4} x2={HOLO.ancho - 4} y1={8 + i * 16} y2={8 + i * 16} stroke="#7FE7FF" strokeOpacity={0.06} />)}
              <text x={36} y={yBase} fill="#9FD7FF" fontFamily="Arial, Helvetica, sans-serif" fontSize={30} fontWeight={700}>CS.BASE</text>
              <Hex x={col} y={yBase} texto="0xFFFF0000" tam={tam} resaltar={s > 0 ? [2, 6] : undefined} />
              <text x={36} y={yEip} fill="#9FD7FF" fontFamily="Arial, Helvetica, sans-serif" fontSize={30} fontWeight={700}>EIP</text>
              <Hex x={col} y={yEip} texto="0x0000FFF0" tam={tam} resaltar={s > 0 ? [6, 10] : undefined} />
              <text x={col - 44} y={yEip + 2} fill="#FFFFFF" fontFamily={MONO} fontSize={40} fontWeight={700} opacity={Math.min(1, s * 3)}>+</text>
              <line x1={col - 10} x2={col + 10 * anchoCar + 10} y1={yEip + 34} y2={yEip + 34} stroke="#FFFFFF" strokeOpacity={Math.min(1, s * 3)} strokeWidth={3} />
              {/* Mitades en vuelo hacia el resultado */}
              {s > 0 && resultado < 1 ? (
                <>
                  <Hex x={col + 2 * anchoCar} y={yBase + (yFisica - yBase) * vuelo} texto="FFFF" tam={tam} color="#FFD27A" opacidad={1 - resultado} />
                  <Hex x={col + 6 * anchoCar} y={yEip + (yFisica - yEip) * vuelo} texto="FFF0" tam={tam} color="#FFD27A" opacidad={1 - resultado} />
                </>
              ) : null}
              <text x={36} y={yFisica} fill="#FFD27A" fontFamily="Arial, Helvetica, sans-serif" fontSize={30} fontWeight={700} opacity={resultado}>física</text>
              <Hex x={col} y={yFisica} texto="0xFFFFFFF0" tam={tam} color="#FFD27A" opacidad={resultado} />
              <Hex x={36} y={yFisica + 64} texto="11111111 11111111 11111111 11110000" tam={30} color="#FFE6A8" opacidad={e.capa.binario} />
              <g opacity={e.capa.advertencia}>
                <text x={36} y={HOLO.alto - 30} fill="#FF8A95" fontFamily={MONO} fontSize={30} fontWeight={700}>CS × 16 + IP</text>
                <line x1={30} x2={36 + 12 * 18} y1={HOLO.alto - 40} y2={HOLO.alto - 40} stroke="#FF5A6A" strokeWidth={4} />
                <text x={36 + 12 * 18 + 26} y={HOLO.alto - 30} fill="#FFC2C8" fontFamily="Arial, Helvetica, sans-serif" fontSize={26}>no tras el reinicio</text>
              </g>
            </svg>
          </div>
        </>
      ) : null}
      <AnalizadorS02 opacidad={e.capa.analizador} anclasS02={aS02} />
      <Vineta />
      <SubtituloCine cues={cues} contornoNombre />
      <CapaAudio cues={cues} />
    </AbsoluteFill>
  );
};

export const S03PrimeraInstruccion = Interactive.create({Component: S03Inner, layout: "absolute-fill"});
