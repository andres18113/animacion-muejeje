import React from "react";
import {AbsoluteFill} from "remotion";
import {Mascota} from "./Mascota";
import {MASCOTAS} from "./catalogo";

/**
 * Composición de verificación visual: 15 personajes en una pantalla.
 * Resolución recomendada: 1920x1080, 30 fps, 150 fotogramas.
 */
export const CatalogoMascotas: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#F4F0E9",
        padding: "40px 82px",
        color: "#1A2E45",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{fontWeight: 900, fontSize: 46, letterSpacing: -0.5}}>
        Arranque BIOS · Mascotas
      </div>
      <div style={{fontSize: 22, color: "#536276", marginTop: 8, marginBottom: 24}}>
        SO-ARR-BIOS-001 v2.0.0 · 15 personajes · 3 expresiones
      </div>
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gridTemplateRows: "repeat(3, minmax(0, 1fr))",
          gap: 16,
          minHeight: 0,
        }}
      >
        {MASCOTAS.map((personaje, i) => (
          <div
            key={personaje.id}
            style={{
              background: "#fff",
              border: "2px solid #D8E0E4",
              borderRadius: 15,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 10,
              minWidth: 0,
            }}
          >
            <div
              style={{
                alignSelf: "flex-start",
                fontSize: 17,
                fontWeight: 800,
                color: "#1A2E45",
                background: personaje.acento,
                borderRadius: 7,
                padding: "2px 9px",
              }}
            >
              {personaje.codigo}
            </div>
            <div style={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0}}>
              <Mascota
                id={personaje.id}
                tamano={185}
                desfase={i * 3}
                hablando={i % 5 === 0}
              />
            </div>
            <div style={{fontWeight: 800, fontSize: 24, lineHeight: 1.1}}>{personaje.nombre}</div>
            <div style={{fontSize: 19, fontWeight: 600, color: "#3E4C62", textAlign: "center", lineHeight: 1.2}}>
              {personaje.componente}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
