import React from "react";
import {AbsoluteFill} from "remotion";
import {Mascota} from "./Mascota";
import {MASCOTAS} from "./catalogo";

/**
 * Lámina de referencia (docs/mascotas/lamina-15-mascotas.png).
 * Fotograma fijo 2400x1720 generado a partir de los SVG de public/mascotas.
 */
export const LaminaMascotas: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#F4F0E9",
        padding: "56px 96px 64px",
        color: "#1A2E45",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{fontWeight: 900, fontSize: 62, letterSpacing: 1}}>
        ARRANQUE BIOS · BIBLIA VISUAL DE MASCOTAS
      </div>
      <div style={{fontSize: 28, color: "#536276", marginTop: 10, marginBottom: 36}}>
        15 personajes, 3 expresiones vectoriales por personaje · Línea base SO-ARR-BIOS-001 v2.0.0
      </div>
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gridTemplateRows: "repeat(3, minmax(0, 1fr))",
          gap: 28,
          minHeight: 0,
        }}
      >
        {MASCOTAS.map((personaje) => (
          <div
            key={personaje.id}
            style={{
              background: "#FFFFFF",
              border: "2px solid #DDE3E6",
              borderRadius: 18,
              display: "flex",
              flexDirection: "column",
              padding: "16px 22px 20px",
              minWidth: 0,
            }}
          >
            <div
              style={{
                alignSelf: "flex-start",
                fontSize: 21,
                fontWeight: 800,
                color: "#1A2E45",
                background: personaje.acento,
                borderRadius: 9,
                padding: "4px 12px",
              }}
            >
              {personaje.codigo}
            </div>
            <div style={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0}}>
              <Mascota id={personaje.id} tamano={300} animar={false} />
            </div>
            <div style={{fontWeight: 800, fontSize: 32, lineHeight: 1.15}}>{personaje.nombre}</div>
            <div style={{fontSize: 23, color: "#4A5870", marginTop: 4}}>{personaje.componente}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
