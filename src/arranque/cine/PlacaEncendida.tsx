import React from "react";
import {interpolate} from "remotion";
import type {PerspectiveCamera} from "three";
import {COLORES_ATX, MAZO_ATX, PISTAS, recorridoEspera, recorridoMazo} from "./Mundo3D";
import {FiltrosBrillo, FlujoContinuo, SenalViajera, trazar} from "./capas";
import {Trazas, escalon, type Canal} from "./instrumentos";
import type {Punto3D} from "./mundo.ts";

const hilo = (nombre: string): Punto3D[] => recorridoMazo(MAZO_ATX.find((h) => h.nombre === nombre)!.desfase);
const CABLE_PULSO: Punto3D[] = [[-8.4, 0.4, 2.9], [-7.2, 0.5, 2.8], [-6.4, 0.3, 2.6], ...PISTAS.boton.slice(1)];

/**
 * Estado eléctrico persistente tras S02: +5VSB, PS_ON# = 0, salidas
 * principales estables, PWR_OK = 1 y reloj en marcha. Las escenas S03+ lo
 * dibujan para que el corte con S02 sea continuo (mismas trazas, misma fase).
 *
 * `frameGlobal`: frame del video completo (fase del flujo +5VSB).
 * `frameRelojS02`: frame equivalente en la línea de tiempo de S02 y
 * `pwrS02` su ancla, para continuar exactamente la fase de los pulsos de reloj.
 * `ecosS02`: 1 → 0, desvanece los pulsos de evento que S02 deja al final de su
 * recorrido (pulsación y RESET). `intensidad` 0..1 atenúa el conjunto.
 */
export const PlacaEncendida: React.FC<{camara: PerspectiveCamera; frameGlobal: number; frameRelojS02: number; pwrS02: number; ecosS02: number; intensidad?: number}> = ({camara, frameGlobal, frameRelojS02, pwrS02, ecosS02, intensidad = 1}) => {
  const tReloj = trazar(camara, PISTAS.reloj, 2);
  const fasesReloj = [0, 1, 2].map((k) => ((frameRelojS02 - (pwrS02 + 40) + k * 8) % 24) / 24);
  // intensidad < 1: el estado sigue presente pero cede el protagonismo a la acción de la escena.
  return (
    <g opacity={intensidad}>
      <FlujoContinuo trazo={trazar(camara, recorridoEspera(), 4)} frame={frameGlobal} avance={1} color={COLORES_ATX.espera} />
      <SenalViajera trazo={trazar(camara, PISTAS.psOn, 2)} avance={1} color={COLORES_ATX.psOn} grosor={5} />
      <SenalViajera trazo={trazar(camara, hilo("psOn"), 6)} avance={1} color={COLORES_ATX.psOn} grosor={5} />
      {(["v33", "v5", "v12"] as const).map((n) => <SenalViajera key={n} trazo={trazar(camara, [...hilo(n)].reverse(), 6)} avance={1} color={COLORES_ATX[n]} grosor={5} />)}
      <SenalViajera trazo={trazar(camara, PISTAS.rieles, 2)} avance={1} color={COLORES_ATX.v5} grosor={7} />
      <SenalViajera trazo={trazar(camara, PISTAS.pwrOk, 2)} avance={1} color="#E6EEF7" grosor={5} />
      {fasesReloj.map((fase, k) => <SenalViajera key={k} trazo={tReloj} avance={fase} color="#7CC8FF" persistente={false} grosor={4} intensidad={0.9} />)}
      {ecosS02 > 0 ? (
        <>
          <SenalViajera trazo={trazar(camara, CABLE_PULSO, 4)} avance={1} color="#7CF7FF" persistente={false} grosor={6} intensidad={ecosS02} />
          <SenalViajera trazo={trazar(camara, PISTAS.reset, 2)} avance={1} color="#FF5A6A" persistente={false} grosor={7} intensidad={ecosS02} />
        </>
      ) : null}
    </g>
  );
};

/**
 * Analizador lógico con que termina S02 (PS_ON#, PWR_OK, RESET), mismo trazado
 * y posición. Las escenas siguientes lo heredan en el corte y lo desvanecen.
 */
export const AnalizadorS02: React.FC<{anclasS02: {psOn: number; pwr: number; reset: number}; opacidad: number}> = ({anclasS02: a, opacidad}) => {
  if (opacidad <= 0.01) return null;
  const xa = (fr: number) => (fr - (a.psOn - 30)) / (740 - (a.psOn - 30));
  const canales: Canal[] = [
    {nombre: "PS_ON#", color: COLORES_ATX.psOn, valor: (x) => 1 - escalon(x, xa(a.psOn)), estado: (x) => (x < xa(a.psOn) ? "1" : "0")},
    {nombre: "PWR_OK", color: COLORES_ATX.pwrOk, valor: (x) => escalon(x, xa(a.pwr + 30)), estado: (x) => (x < xa(a.pwr + 30) ? "0" : "1")},
    {nombre: "RESET", color: "#FF5A6A", valor: (x) => 1 - escalon(x, xa(a.reset + 26)), estado: (x) => (x < xa(a.reset + 26) ? "activo" : "liberado"), grosor: 6},
  ];
  return (
    <svg width={940} height={250} style={{position: "absolute", left: 64, top: 54, opacity: opacidad, translate: `0 ${interpolate(opacidad, [0, 1], [-20, 0])}px`}}>
      <FiltrosBrillo />
      <Trazas canales={canales} progreso={1} ancho={920} altoCanal={40} separacion={28} />
    </svg>
  );
};
