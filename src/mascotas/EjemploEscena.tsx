import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {Mascota} from "./Mascota";

/** Demostración opcional de dos turnos de diálogo. No es el video definitivo. */
export const EjemploEscenaMascotas: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: "#F4F0E9", flexDirection: "row", alignItems: "center", justifyContent: "space-around"}}>
    <Sequence durationInFrames={90} layout="none">
      <Mascota id="voltio" tamano={450} hablando entrada />
    </Sequence>
    <Sequence from={90} durationInFrames={90} layout="none">
      <Mascota id="cipu" tamano={450} hablando entrada />
    </Sequence>
  </AbsoluteFill>
);
