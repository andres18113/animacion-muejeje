import React from "react";

/** Fondo del interior del gabinete: degradado profundo y un halo cálido o frío según la escena. */
export const FondoGabinete: React.FC<{calido?: number}> = ({calido = 0}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: `radial-gradient(ellipse 70% 60% at 70% 30%, rgba(255,170,80,${0.18 * calido}) 0%, rgba(255,170,80,0) 60%), radial-gradient(ellipse 120% 90% at 50% 20%, #1E4A63 0%, #0F2A3B 45%, #071521 100%)`,
    }}
  />
);

/** Viñeta suave para dirigir la mirada al centro de la acción. */
export const Vineta: React.FC = () => (
  <div style={{position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 85% 75% at 50% 45%, rgba(0,0,0,0) 55%, rgba(2,8,14,0.55) 100%)"}} />
);
