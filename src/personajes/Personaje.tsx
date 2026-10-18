import { useId } from "react";
import type { SVGProps } from "react";
import type { MascotaId } from "../mascotas/catalogo.ts";
import { geometriaBrazo, geometriaBoca } from "./geometria.ts";
import { interpolar, limitar, mezclarPoses, POSE_BASE } from "./poses.ts";
import type { PoseParcial } from "./poses.ts";
import { RIGS } from "./rigs.generated.ts";
import type { Circulo, Curva, Elipse, Trazo } from "./tipos.ts";

export { EXPRESIONES, mezclarPoses, POSE_BASE } from "./poses.ts";
export type { Boca, Pose, PoseParcial } from "./poses.ts";

export type PersonajeProps = { id: MascotaId; pose?: PoseParcial; tamano?: number };
type AtributosTrazo = Pick<SVGProps<SVGPathElement>, "stroke" | "strokeWidth" | "strokeLinecap" | "strokeLinejoin">;
const atributosTrazo = (trazo: Trazo | null): AtributosTrazo => trazo ? {
  stroke: trazo.color, strokeWidth: trazo.grosor,
  strokeLinecap: trazo.remate as SVGProps<SVGPathElement>["strokeLinecap"],
  strokeLinejoin: trazo.union as SVGProps<SVGPathElement>["strokeLinejoin"],
} : {};
const ElipseRig = ({ datos }: { datos: Elipse }) => (
  <ellipse cx={datos.cx} cy={datos.cy} rx={datos.rx} ry={datos.ry} fill={datos.color} opacity={datos.opacidad} {...atributosTrazo(datos.trazo)} />
);
const CirculoRig = ({ datos }: { datos: Circulo }) => (
  <circle cx={datos.cx} cy={datos.cy} r={datos.r} fill={datos.color} {...atributosTrazo(datos.trazo)} />
);

function caminoCeja(neutral: Curva, alerta: Curva, altura: number, angulo: number): string {
  if (altura === 0 && angulo === 0) return neutral.d;
  const t = limitar(angulo, -1, 1);
  const punto = (clave: "inicio" | "control" | "fin") => `${interpolar(neutral[clave].x, alerta[clave].x, t)} ${interpolar(neutral[clave].y, alerta[clave].y, t) - 10 * limitar(altura, -1, 1)}`;
  return `M${punto("inicio")} Q${punto("control")} ${punto("fin")}`;
}

/** Rig sin estado temporal: la pose describe un frame completo y reproducible. */
export const Personaje = ({ id, pose = POSE_BASE, tamano = 512 }: PersonajeProps) => {
  const rig = RIGS[id];
  const p = mezclarPoses(POSE_BASE, pose);
  const identificador = useId().replace(/[^\w-]/g, "");
  const mascaraBoca = `boca-${identificador}`;
  const brilloLed = `led-${identificador}`;
  const salto = Math.max(0, p.salto);
  const escalaY = limitar(1 + p.squash, 0.5, 1.7);
  const cierre = limitar(p.ojo);
  const presion = limitar(p.boton);
  const luminosidad = limitar(p.led);
  const boca = geometriaBoca(rig, p.boca);
  const brazos = rig.brazos.map((brazo, i) => geometriaBrazo(brazo, i === 0 ? p.brazoIzq : p.brazoDer, i === 0 ? p.codoIzq : p.codoDer));
  // Un brazo pasa delante cuando su mano sube por encima del hombro.
  const delante = rig.brazos.map((brazo, i) => brazos[i].mano.y < brazo.inicio.y - 8);
  const boton = rig.partes.boton;
  const transformacionBoton = boton ? `translate(0 ${6 * presion}) translate(${boton.centro.x} ${boton.centro.y}) scale(1 ${1 - 0.06 * presion}) translate(${-boton.centro.x} ${-boton.centro.y})` : "";
  const levantarPie = (i: number) => p.paso === 0 ? 0 : Math.max(0, Math.sin(p.paso + i * Math.PI)) * 12;
  return (
    <svg viewBox="0 0 512 512" width={tamano} height={tamano} role="img" aria-label={`Mascota ${id}`} style={{ overflow: "visible", flexShrink: 0 }}>
      <defs>
        <clipPath id={mascaraBoca}><path d={boca.d} /></clipPath>
        <radialGradient id={brilloLed}>
          <stop offset="0" stopColor="#FFF4BD" stopOpacity={0.8} />
          <stop offset="1" stopColor="#F3D076" stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform={`translate(${p.x} 0) translate(${rig.sombra.cx} ${rig.sombra.cy}) scale(${1 / (1 + salto / 180)} 1) translate(${-rig.sombra.cx} ${-rig.sombra.cy})`} opacity={1 / (1 + salto / 100)}>
        <ElipseRig datos={rig.sombra} />
      </g>
      <g transform={`translate(${p.x} ${p.y - salto}) translate(256 455) rotate(${p.inclinacion}) scale(${1 / escalaY} ${escalaY}) translate(-256 -455)`}>
        {/* El orden original coloca brazos y manos detrás del cuerpo. */}
        {rig.piernas.map((pierna, i) => <path key={`pierna-${i}`} d={pierna.d} fill="none" transform={`translate(0 ${-levantarPie(i)})`} {...atributosTrazo(pierna)} />)}
        {rig.pies.map((pie, i) => <g key={`pie-${i}`} transform={`translate(0 ${-levantarPie(i)})`}><ElipseRig datos={pie} /></g>)}
        {/* Los brazos van detrás del cuerpo (diseño original); al alzarse, solo la mano pasa delante para que el gesto se lea. */}
        {rig.brazos.map((brazo, i) => <path key={`brazo-${i}`} d={brazos[i].d} fill="none" {...atributosTrazo(brazo)} />)}
        {rig.brazos.map((brazo, i) => (delante[i] ? null : <CirculoRig key={`mano-${i}`} datos={{ ...brazo.mano, cx: brazos[i].mano.x, cy: brazos[i].mano.y }} />))}
        {rig.capasCuerpo.map((capa, i) => {
          const ventilador = rig.partes.ventilador;
          const led = rig.partes.led;
          if (capa.tipo === "ventilador" && ventilador) return (
            <g key={i} transform={ventilador.transformacion}>
              <g transform={`rotate(${p.ventilador} ${ventilador.centro.x} ${ventilador.centro.y})`} dangerouslySetInnerHTML={{ __html: ventilador.markup }} />
            </g>
          );
          if (capa.tipo === "boton") return (
            <g key={i} transform={transformacionBoton}>
              <g dangerouslySetInnerHTML={{ __html: capa.markup }} />
              {/* Oscurece el reflejo original sin alterar el resto del botón. */}
              <g opacity={presion * 0.55} style={{ color: "#C88972" }} dangerouslySetInnerHTML={{ __html: capa.markup.slice(capa.markup.indexOf("<path")).replace(/stroke="[^"]+"/, 'stroke="currentColor"') }} />
            </g>
          );
          if (capa.tipo === "led" && led) return (
            <g key={i}>
              <circle cx={led.centro.x} cy={led.centro.y} r={28} fill={`url(#${brilloLed})`} opacity={Math.max(0, luminosidad * 2 - 1)} />
              <g dangerouslySetInnerHTML={{ __html: capa.markup }} />
              <circle cx={led.centro.x} cy={led.centro.y} r={8.5} fill="#423B29" opacity={Math.max(0, 1 - luminosidad * 2)} />
              <circle cx={led.centro.x} cy={led.centro.y} r={8.5} fill="#FFF4BD" opacity={Math.max(0, luminosidad * 2 - 1) * 0.5} />
            </g>
          );
          return <g key={i} dangerouslySetInnerHTML={{ __html: capa.markup }} />;
        })}
        {rig.brazos.map((brazo, i) => (delante[i] ? <CirculoRig key={`mano-delante-${i}`} datos={{ ...brazo.mano, cx: brazos[i].mano.x, cy: brazos[i].mano.y }} /> : null))}
        <g transform={id === "pulso" ? transformacionBoton : undefined}>
          <g transform={rig.rostro.transformacion || undefined}>
            {rig.cejas.map((ceja, i) => <path key={`ceja-${i}`} d={caminoCeja(ceja, rig.alerta.cejas[i], p.cejas.altura, p.cejas.angulo)} fill="none" {...atributosTrazo(ceja)} />)}
            {rig.ojos.map(({ blanco, pupila, brillo }, i) => {
              const margenX = Math.max(0, blanco.rx - pupila.rx - (blanco.trazo?.grosor ?? 0) / 2 - 1);
              const margenY = Math.max(0, blanco.ry - pupila.ry - (blanco.trazo?.grosor ?? 0) / 2 - 1);
              let dx = pupila.cx - blanco.cx + limitar(p.mirada.x, -1, 1) * margenX * 0.55;
              let dy = pupila.cy - blanco.cy + limitar(p.mirada.y, -1, 1) * margenY * 0.55;
              const distancia = Math.hypot(dx / Math.max(1, margenX), dy / Math.max(1, margenY));
              if (distancia > 1) { dx /= distancia; dy /= distancia; }
              const deltaX = blanco.cx + dx - pupila.cx;
              const deltaY = blanco.cy + dy - pupila.cy;
              return (
                <g key={`ojo-${i}`}>
                  <g transform={`translate(0 ${blanco.cy}) scale(1 ${1 - cierre}) translate(0 ${-blanco.cy})`}>
                    <ElipseRig datos={blanco} />
                    <ElipseRig datos={{ ...pupila, cx: pupila.cx + deltaX, cy: pupila.cy + deltaY }} />
                    <CirculoRig datos={{ ...brillo, cx: brillo.cx + deltaX, cy: brillo.cy + deltaY }} />
                  </g>
                  <path d={`M${blanco.cx - blanco.rx} ${blanco.cy} Q${blanco.cx} ${blanco.cy + 2} ${blanco.cx + blanco.rx} ${blanco.cy}`} fill="none" stroke={blanco.trazo?.color ?? "#22344A"} strokeWidth={blanco.trazo?.grosor ?? 5} strokeLinecap="round" opacity={Math.pow(cierre, 12)} />
                </g>
              );
            })}
            {rig.mejillas.map((mejilla, i) => <ElipseRig key={`mejilla-${i}`} datos={{ ...mejilla, opacidad: limitar(p.mejillas) }} />)}
            <path d={boca.d} fill={boca.relleno} {...atributosTrazo(rig.boca)} strokeWidth={boca.grosor} />
            <path d={boca.lengua} fill="none" stroke={rig.hablando.lengua.color} strokeWidth={rig.hablando.lengua.grosor} opacity={boca.opacidadLengua} clipPath={`url(#${mascaraBoca})`} />
          </g>
        </g>
      </g>
    </svg>
  );
};
