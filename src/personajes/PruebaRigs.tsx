import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CUES_DIALOGO } from "../arranque/dialogo.ts";
import { segmentosDeCue } from "../arranque/subtitulos.ts";
import type { MascotaId } from "../mascotas/catalogo.ts";
import { obtenerMascota } from "../mascotas/catalogo.ts";
import { Personaje, POSE_BASE } from "./Personaje";
import { bocaEnFrame, parpadeoEnFrame, respiracionEnFrame } from "./labios.ts";

const DEMOSTRACIONES = [
  { id: "voltio", cueId: "S01-C01" },
  { id: "pulso", cueId: "S02-C01" },
  { id: "secu", cueId: "S02-C02" },
] as const;
const DATOS = DEMOSTRACIONES.map((demo) => {
  const cue = CUES_DIALOGO.find((c) => c.cueId === demo.cueId);
  if (!cue) throw new Error(`Cue ausente: ${demo.cueId}`);
  return { ...demo, cue, segmentos: segmentosDeCue(cue) };
});

export const PruebaRigs = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0E1B2A", color: "#ECF1ED", fontFamily: "Arial, Helvetica, sans-serif", padding: "70px 80px" }}>
      <div style={{ fontSize: 56, fontWeight: 700 }}>Los personajes cobran vida</div>
      <div style={{ marginTop: 14, fontSize: 26, color: "#AEC2CA" }}>Rigs SVG · voces estimadas por texto · 30 fps</div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30 }}>
        {DATOS.map(({ id, cue, segmentos }, i) => {
          const respiracion = respiracionEnFrame(frame, id, fps);
          const segmento = segmentos.find((s) => frame >= s.inicioFrame && frame < s.finFrame);
          const boca = bocaEnFrame({ cue, segmentos, frame, fps });
          // El máximo de la pulsación ocurre exactamente en el frame 84.
          const presion = Math.pow(Math.max(0, 1 - Math.abs(frame - 84) / 9), 2);
          return (
            <div key={id} style={{ width: 560, textAlign: "center" }}>
              <Personaje id={id} tamano={540} pose={{
                boca, ojo: parpadeoEnFrame(frame, id, fps),
                squash: (respiracion - 0.5) * 0.015,
                inclinacion: Math.sin(frame / fps * 1.4 + i) * 1.1,
                brazoIzq: Math.sin(frame / fps * 2.2 + i) * (2 + 7 * Math.min(1, boca.apertura / 0.4)),
                brazoDer: -Math.sin(frame / fps * 1.8 + i) * (3 + 11 * Math.min(1, boca.apertura / 0.4)),
                ventilador: frame * 9, boton: presion,
                led: (1 + Math.sin(frame / fps * Math.PI * 2)) / 2,
              }} />
              <div style={{ fontSize: 36, fontWeight: 700, color: obtenerMascota(id).acento }}>{obtenerMascota(id).nombre}</div>
              <div style={{ marginTop: 10, fontSize: 19, color: "#AEC2CA" }}>{cue.cueId} · {id === "voltio" ? "Ventilador" : id === "pulso" ? "Pulsación en f84" : "LED"}</div>
              <div style={{ marginTop: 24, fontSize: 25, lineHeight: 1.4, whiteSpace: "pre-line", minHeight: 130 }}>{segmento?.texto ?? ""}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", bottom: 48, left: 80, fontSize: 21, color: "#AEC2CA" }}>Sin audio · los tiempos de Secu continúan más allá de esta prueba de 600 frames.</div>
    </AbsoluteFill>
  );
};

// Selección fija reproducible; incluye rostros desplazados (Cipu/Postín).
const COMPARADOS: readonly MascotaId[] = ["voltio", "pulso", "secu", "cipu", "postin", "grubi"];
export const ComparacionRigs = () => (
  <AbsoluteFill style={{ backgroundColor: "#0E1B2A", color: "#ECF1ED", fontFamily: "Arial, Helvetica, sans-serif", padding: "48px 70px" }}>
    <div style={{ fontSize: 44, fontWeight: 700 }}>Identidad original · pose de reposo</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px 35px", marginTop: 32 }}>
      {COMPARADOS.map((id) => (
        <div key={id} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, color: obtenerMascota(id).acento }}>{obtenerMascota(id).nombre}</div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
            <div><Img src={staticFile(`mascotas/${id}-neutral.svg`)} style={{ width: 270, height: 270 }} /><div style={{ fontSize: 20, color: "#AEC2CA" }}>SVG original</div></div>
            <div><Personaje id={id} pose={POSE_BASE} tamano={270} /><div style={{ fontSize: 20, color: "#AEC2CA" }}>Rig · POSE_BASE</div></div>
          </div>
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
