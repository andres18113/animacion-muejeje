import React, {useMemo} from "react";
import {useThree} from "@react-three/fiber";
import {CatmullRomCurve3, PerspectiveCamera, Vector3} from "three";
import {ThreeCanvas} from "@remotion/three";
import {ALTO, ANCHO, LUGARES, aplicarCamara, type Camara, type Punto3D} from "./mundo.ts";
import {CHIPS_FIRMWARE} from "./rutas.ts";

export {CHIPS_FIRMWARE, RUTA_FIRMWARE} from "./rutas.ts";

/** Intensidades 0..1 que la coreografía controla; cada una corresponde a un hecho técnico. */
export type EstadoMundo = {
  /** Muestra la red eléctrica exterior (tomacorriente y cable): solo en S01. */
  exterior?: boolean;
  /** Opacidad del cartucho Slot 1 (1 = sólido). En S03 Cipu emerge de él. */
  cartucho?: number;
  /** Brillo 0..1 de los chips que atienden la primera búsqueda (S03): 82443BX, PIIX4E y flash. */
  chips?: {norte: number; sur: number; flash: number};
  /** 0..1: cuánto se destaca la retención de RESET (tenue en S01, protagonista en S02). */
  resaltarReset?: number;
  luzRed: number; // corriente alterna disponible en el enchufe
  espera: number; // +5VSB presente (hilo morado, LED de espera)
  rieles: number; // salidas principales +3.3/+5/+12 V
  rizado: number; // inestabilidad mientras las tensiones se estabilizan (0 = estable)
  reloj: number; // generador de reloj funcionando
  resetRetenido: number; // 1 = RESET mantiene a la CPU detenida; 0 = liberado
  cpuLista: number; // CPU habilitada para comenzar (sin ejecutar aún: S03)
  frame: number;
};

export const COLORES_ATX = {
  v33: "#F28C28", // naranja: +3.3 V
  v5: "#E5383B", // rojo: +5 V
  v12: "#F2D13A", // amarillo: +12 V
  espera: "#9B5DE5", // morado: +5VSB
  psOn: "#2DC653", // verde: PS_ON#
  pwrOk: "#B8C0CC", // gris: PWR_OK
} as const;

const SincronizarCamara: React.FC<{camara: Camara}> = ({camara}) => {
  const {camera} = useThree();
  // En el cuerpo del render: la cámara queda fijada antes de que ThreeCanvas avance el frame.
  aplicarCamara(camera as PerspectiveCamera, camara);
  return null;
};

const Tubo: React.FC<{puntos: readonly Punto3D[]; radio: number; color: string; brillo?: number; segmentos?: number}> = ({puntos, radio, color, brillo = 0, segmentos = 64}) => {
  const curva = useMemo(() => new CatmullRomCurve3(puntos.map((p) => new Vector3(p[0], p[1], p[2]))), [puntos]);
  return (
    <mesh>
      <tubeGeometry args={[curva, segmentos, radio, 10, false]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={brillo} roughness={0.5} metalness={0.1} />
    </mesh>
  );
};

/** Pista de cobre recta por tramos sobre la placa. */
const Pista: React.FC<{puntos: readonly Punto3D[]; ancho?: number}> = ({puntos, ancho = 0.07}) => (
  <group>
    {puntos.slice(1).map((b, i) => {
      const a = puntos[i];
      const dx = b[0] - a[0];
      const dz = b[2] - a[2];
      const largo = Math.hypot(dx, dz);
      return (
        <mesh key={i} position={[(a[0] + b[0]) / 2, 0.012, (a[2] + b[2]) / 2]} rotation={[0, -Math.atan2(dz, dx), 0]}>
          <boxGeometry args={[largo + ancho, 0.012, ancho]} />
          <meshStandardMaterial color="#9C6B3C" roughness={0.35} metalness={0.7} />
        </mesh>
      );
    })}
  </group>
);

/** Recorridos de pistas compartidos con la capa 2D (las señales luminosas los siguen). */
export const PISTAS = {
  boton: [LUGARES.panelFrontal, [-5.2, 0, 2.6], [-4.2, 0, 1.9], [-3.1, 0, 1.9]],
  psOn: [[-2.1, 0, 1.6], [-0.8, 0, 2.4], [3.2, 0, 2.4], [4.65, 0, 2.1]],
  pwrOk: [[4.65, 0, 1.2], [3.4, 0, 0.9], [-0.8, 0, 0.9], [-2.1, 0, 1.2]],
  espera: [[4.65, 0, 2.5], [3.0, 0, 3.4], [-3.2, 0, 3.4], [-3.7, 0, 2.95]],
  reset: [[-2.3, 0, 1.0], [-2.3, 0, -0.4], [-0.2, 0, -1.9], [0.4, 0, -2.25]],
  reloj: [[-0.25, 0, -1.2], [0.6, 0, -1.2], [1.0, 0, -2.2]],
  rieles: [[4.65, 0, 1.6], [3.0, 0, 0.2], [2.6, 0, -1.6], [2.2, 0, -2.2]],
} as const satisfies Record<string, readonly Punto3D[]>;

/** Mazo ATX de la fuente al conector: un hilo por función, con su color normalizado. */
export const MAZO_ATX: {nombre: keyof typeof COLORES_ATX; desfase: number}[] = [
  {nombre: "v33", desfase: -0.27},
  {nombre: "v5", desfase: -0.16},
  {nombre: "v12", desfase: -0.05},
  {nombre: "espera", desfase: 0.06},
  {nombre: "psOn", desfase: 0.17},
  {nombre: "pwrOk", desfase: 0.28},
];

export function recorridoMazo(desfase: number): Punto3D[] {
  return [
    [5.45, 0.3, 1.6 + desfase],
    [6.6, 0.55, 1.55 + desfase * 1.4],
    [8.0, 0.9, 1.4 + desfase * 1.6],
    [9.2, 1.0, 1.35 + desfase * 1.2],
  ];
}

/** +5VSB: hilo morado del mazo (de la fuente al conector) y pista hasta el LED de espera. */
export function recorridoEspera(): Punto3D[] {
  return [...recorridoMazo(MAZO_ATX.find((h) => h.nombre === "espera")!.desfase).slice().reverse(), ...PISTAS.espera];
}

export const RECORRIDO_RED: readonly Punto3D[] = [
  LUGARES.enchufe,
  [15.4, 0.15, -2.2],
  [13.6, 0.1, -0.6],
  [12.1, 0.55, 0.6],
];

const Condensador: React.FC<{p: Punto3D; alto?: number}> = ({p, alto = 0.6}) => (
  <group position={[p[0], alto / 2, p[2]]}>
    <mesh>
      <cylinderGeometry args={[0.18, 0.18, alto, 20]} />
      <meshStandardMaterial color="#1D2E4A" roughness={0.4} metalness={0.3} />
    </mesh>
    <mesh position={[0, alto / 2 + 0.005, 0]}>
      <cylinderGeometry args={[0.16, 0.16, 0.01, 20]} />
      <meshStandardMaterial color="#AEB7C2" metalness={0.8} roughness={0.3} />
    </mesh>
  </group>
);

const Caja: React.FC<{p: Punto3D; t: Punto3D; color: string; metal?: number}> = ({p, t, color, metal = 0.2}) => (
  <mesh position={[p[0], p[1] + t[1] / 2, p[2]]}>
    <boxGeometry args={[t[0], t[1], t[2]]} />
    <meshStandardMaterial color={color} roughness={0.5} metalness={metal} />
  </mesh>
);

/** Decorado fijo de una placa ATX de 1998: ranuras ISA/PCI/AGP, DIMM con SDRAM, IDE, chips y E/S. */
const DetalleEpoca: React.FC = () => (
  <group>
    {/* Ranuras de expansión, lado izquierdo-trasero */}
    {[-7.6, -6.7, -5.8, -4.9].map((x) => <Caja key={"pci" + x} p={[x, 0, -2.2]} t={[0.28, 0.32, 4.6]} color="#EDEBE4" />)}
    <Caja p={[-4.0, 0, -2.5]} t={[0.28, 0.32, 4.0]} color="#6B4A2E" />
    {/* Zócalos DIMM y un módulo SDRAM PC100 instalado */}
    {[5.9, 6.5, 7.1].map((x) => <Caja key={"dimm" + x} p={[x, 0, -2.4]} t={[0.24, 0.3, 5.0]} color="#202328" />)}
    <Caja p={[5.9, 0.3, -2.4]} t={[0.06, 1.2, 4.8]} color="#1E6E4C" />
    {[-1.8, -0.9, 0, 0.9, 1.8].map((dz) => <Caja key={"ram" + dz} p={[5.86, 0.55, -2.4 + dz]} t={[0.08, 0.7, 0.6]} color="#15171B" />)}
    {/* Conectores IDE (cabeceras negras) */}
    <Caja p={[7.4, 0, 2.4]} t={[0.5, 0.35, 2.2]} color="#1B1D22" />
    <Caja p={[6.7, 0, 2.4]} t={[0.5, 0.35, 2.2]} color="#1B1D22" />
    {/* Chips: flash del BIOS, E/S y puente sur */}
    <Caja p={[-1.2, 0, 3.8]} t={[0.9, 0.12, 0.5]} color="#1A1C20" />
    <Caja p={[1.4, 0, 3.6]} t={[1.1, 0.12, 1.1]} color="#1A1C20" />
    <Caja p={[3.0, 0, 3.9]} t={[0.8, 0.12, 0.8]} color="#1A1C20" />
    {/* Bloque de E/S trasero */}
    <Caja p={[-1.0, 0, -5.0]} t={[5.6, 1.0, 0.9]} color="#8E99A6" metal={0.8} />
    {/* Pila de la CMOS */}
    <mesh position={[-1.6, 0.06, -0.2]}>
      <cylinderGeometry args={[0.42, 0.42, 0.1, 32]} />
      <meshStandardMaterial color="#C9CFD6" metalness={0.95} roughness={0.2} />
    </mesh>
  </group>
);

const Escenario: React.FC<{estado: EstadoMundo}> = ({estado}) => {
  const {espera, rieles, rizado, reloj, resetRetenido, cpuLista, luzRed, frame, resaltarReset = 1, exterior = true, cartucho = 1, chips} = estado;
  // Rizado: oscilación rápida que se amortigua al estabilizarse las salidas.
  const parpadeoRieles = rieles * (1 - 0.45 * rizado * (0.5 + 0.5 * Math.sin(frame * 2.3)));
  const tic = reloj * (0.55 + 0.45 * (Math.floor(frame / 2) % 2));
  return (
    <>
      {/* Fondo transparente: el degradado CSS de la escena se ve detrás; la niebla lo funde con la profundidad. */}
      <fog attach="fog" args={["#123447", 18, 52]} />
      <ambientLight intensity={0.35} color="#9CC3E6" />
      <hemisphereLight args={["#9CC8F0", "#14301F", 0.75 + 0.45 * rieles]} />
      <directionalLight position={[-7, 14, 9]} intensity={1.35} color="#E4F0FF" />
      <directionalLight position={[12, 6, -10]} intensity={0.45} color="#5FD3FF" />
      <pointLight position={[11, 3.2, 3]} intensity={10 + 40 * luzRed} distance={14} color="#FFB347" />
      <pointLight position={[-3.7, 0.9, 2.7]} intensity={1.4 * espera} distance={2.4} color="#39FF88" />
      <pointLight position={[1.6, 2.6, -1.4]} intensity={26 * cpuLista} distance={8} color="#7CC8FF" />
      <pointLight position={[3, 2.4, 1]} intensity={16 * parpadeoRieles} distance={10} color="#FFD27A" />

      {/* Suelo metálico del gabinete, separadores y placa base */}
      <mesh position={[4, -0.65, 0]}>
        <boxGeometry args={[44, 0.1, 26]} />
        <meshStandardMaterial color="#2A3D4C" roughness={0.45} metalness={0.65} />
      </mesh>
      {Array.from({length: 7}, (_, i) => (
        <mesh key={"separador" + i} position={[-6 + i * 2.6, -0.3, -4.6 + (i % 2) * 8.8]}>
          <cylinderGeometry args={[0.16, 0.2, 0.6, 12]} />
          <meshStandardMaterial color="#C9A64B" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[17, 0.12, 11]} />
        <meshStandardMaterial color="#17633F" roughness={0.42} metalness={0.2} />
      </mesh>
      <DetalleEpoca />
      {Object.values(PISTAS).map((p, i) => <Pista key={i} puntos={p} />)}

      {/* Panel frontal: cabecera de pines del botón */}
      <mesh position={[LUGARES.panelFrontal[0], 0.12, LUGARES.panelFrontal[2]]}>
        <boxGeometry args={[0.5, 0.2, 1.1]} />
        <meshStandardMaterial color="#15181D" />
      </mesh>
      <Tubo puntos={[[-6.4, 0.3, 2.6], [-7.2, 0.5, 2.8], [-8.4, 0.4, 2.9]]} radio={0.05} color="#D9D9D9" />

      {/* LED de espera alimentado por +5VSB */}
      <mesh position={[LUGARES.ledEspera[0], 0.12, LUGARES.ledEspera[2]]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#1D4F2E" emissive="#2EE07A" emissiveIntensity={0.9 * espera} />
      </mesh>

      {/* Conector ATX de 20 pines y mazo hacia la fuente */}
      <mesh position={[LUGARES.conectorAtx[0], 0.3, LUGARES.conectorAtx[2]]}>
        <boxGeometry args={[0.8, 0.6, 2.4]} />
        <meshStandardMaterial color="#E9E4D6" roughness={0.6} />
      </mesh>
      {MAZO_ATX.map((hilo) => {
        const esPrincipal = hilo.nombre === "v33" || hilo.nombre === "v5" || hilo.nombre === "v12";
        const brillo = esPrincipal ? 0.9 * parpadeoRieles : hilo.nombre === "espera" ? 0.9 * espera : 0.05;
        return <Tubo key={hilo.nombre} puntos={recorridoMazo(hilo.desfase)} radio={0.05} color={COLORES_ATX[hilo.nombre]} brillo={brillo} />;
      })}

      {/* Zona de CPU: Slot 1, cartucho Pentium II, regulador y retención de RESET */}
      <mesh position={[LUGARES.slotCpu[0], 0.18, LUGARES.slotCpu[2]]}>
        <boxGeometry args={[3.5, 0.36, 0.45]} />
        <meshStandardMaterial color="#111317" />
      </mesh>
      <mesh visible={cartucho > 0} position={[LUGARES.cpu[0], 1.25, LUGARES.cpu[2]]}>
        <boxGeometry args={[3.1, 2.0, 0.42]} />
        <meshStandardMaterial color="#262C36" emissive="#7CC8FF" emissiveIntensity={0.25 * cpuLista} roughness={0.45} metalness={0.4} transparent={cartucho < 1} opacity={cartucho} />
      </mesh>
      <mesh visible={cartucho > 0} position={[LUGARES.cpu[0], 1.55, LUGARES.cpu[2] + 0.22]}>
        <boxGeometry args={[1.5, 0.32, 0.02]} />
        <meshStandardMaterial color="#3B4A5E" emissive="#9FD7FF" emissiveIntensity={1.4 * cpuLista} transparent={cartucho < 1} opacity={cartucho} />
      </mesh>
      {/* Retención de RESET: dos cerrojos rojos sujetan el cartucho; al liberarse se abren y se apagan */}
      {[-1, 1].map((lado) => (
        <mesh key={lado} position={[LUGARES.cpu[0] + lado * (1.62 + 0.35 * (1 - resetRetenido)), 0.75, LUGARES.cpu[2]]} rotation={[0, 0, lado * 0.9 * (1 - resetRetenido)]}>
          <boxGeometry args={[0.16, 1.1, 0.5]} />
          <meshStandardMaterial color={resaltarReset > 0.5 ? "#5A1218" : "#2E2226"} emissive="#FF3B4E" emissiveIntensity={resaltarReset * 1.8 * resetRetenido} />
        </mesh>
      ))}
      {[-0.6, -0.1, 0.4].map((dz, i) => <Condensador key={i} p={[-0.2 + i * 0.05, 0, -3.4 + dz]} alto={0.7} />)}
      {[0, 1, 2, 3].map((i) => <Condensador key={`v${i}`} p={[3.6 + (i % 2) * 0.45, 0, 2.6 + Math.floor(i / 2) * 0.45]} alto={0.5} />)}

      {/* Generador de reloj: cristal con pulsos cuando hay alimentación estable */}
      <mesh position={[LUGARES.cristalReloj[0], 0.14, LUGARES.cristalReloj[2]]}>
        <boxGeometry args={[0.75, 0.24, 0.36]} />
        <meshStandardMaterial color="#B9C2CC" metalness={0.9} roughness={0.25} emissive="#7CC8FF" emissiveIntensity={0.9 * tic} />
      </mesh>

      {/* Brillo de los chips que atienden la primera búsqueda (solo cuando una escena lo pide) */}
      {chips ? (
        <>
          {CHIPS_FIRMWARE.map((chip) => (
            <mesh key={chip.nombre} position={[chip.p[0], chip.alto + 0.006, chip.p[2]]}>
              <boxGeometry args={[chip.t[0] * 0.96, 0.01, chip.t[1] * 0.96]} />
              <meshStandardMaterial color="#000000" emissive={chip.color} emissiveIntensity={2.2 * chips[chip.nombre]} transparent opacity={Math.min(1, chips[chip.nombre] * 1.5)} />
            </mesh>
          ))}
          <pointLight position={[1.4, 1.4, 2.6]} intensity={9 * Math.max(chips.norte, chips.sur, chips.flash)} distance={7} color="#B9A8FF" />
        </>
      ) : null}

      {/* Chipset 82443BX (decorado fijo) */}
      <mesh position={[LUGARES.chipset[0], 0.09, LUGARES.chipset[2]]}>
        <boxGeometry args={[1.3, 0.16, 1.3]} />
        <meshStandardMaterial color="#1A1D22" roughness={0.5} />
      </mesh>

      {/* Exterior: tomacorriente de pared, clavija y cable de red hacia la fuente */}
      <group visible={exterior} position={[LUGARES.enchufe[0], 1.0, LUGARES.enchufe[2] - 0.32]}>
        <mesh>
          <boxGeometry args={[1.5, 2.1, 0.12]} />
          <meshStandardMaterial color="#E8E1D0" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[1.0, 1.3, 0.06]} />
          <meshStandardMaterial color="#F4EEE0" roughness={0.4} emissive="#FFB347" emissiveIntensity={0.25 * luzRed} />
        </mesh>
        {[-0.18, 0.18].map((dx) => (
          <mesh key={dx} position={[dx, 0.32, 0.12]}>
            <boxGeometry args={[0.07, 0.26, 0.02]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
        ))}
        <mesh position={[0, -0.05, 0.3]}>
          <boxGeometry args={[0.62, 0.5, 0.42]} />
          <meshStandardMaterial color="#1E2228" roughness={0.6} />
        </mesh>
      </group>
      <mesh position={[3, 4, -9]}>
        <boxGeometry args={[60, 14, 0.2]} />
        <meshStandardMaterial color="#1B3446" roughness={0.8} metalness={0.3} />
      </mesh>
      {exterior ? <Tubo puntos={RECORRIDO_RED} radio={0.11} color="#20242B" brillo={0} /> : null}
    </>
  );
};

export const Mundo3D: React.FC<{camara: Camara; estado: EstadoMundo}> = ({camara, estado}) => (
  <ThreeCanvas width={ANCHO} height={ALTO} camera={{fov: camara.fov, position: [camara.px, camara.py, camara.pz], near: 0.1, far: 400}} gl={{antialias: true, alpha: true}}>
    <SincronizarCamara camara={camara} />
    <Escenario estado={estado} />
  </ThreeCanvas>
);

