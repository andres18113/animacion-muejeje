import {getStaticFiles, Html5Audio, Sequence, staticFile} from "remotion";
import {detectarSolapes, resolverVoz, volumenMusica, type PistaAudio} from "../audio.ts";
import type {CueVisual} from "../recursos.ts";

export const MUSICA: readonly PistaAudio[] = [];
export const SFX: readonly PistaAudio[] = [];

// Migrar al Audio del paquete de medios recomendado por las skills requiere
// aprobar una dependencia adicional. Html5Audio del núcleo no está deprecado.
export const CapaAudio = ({cues}: {cues: readonly CueVisual[]}) => {
  const archivos = new Set(getStaticFiles().map((archivo) => archivo.name));
  const voces: PistaAudio[] = cues.flatMap(({cue}) => {
    const voz = resolverVoz(cue, cue.assetPath !== null && archivos.has(cue.assetPath));
    return voz.modo === "silencio" ? [] : [{id: cue.cueId, tipo: "voz" as const, src: voz.src, desdeFrame: cue.startFrame, duracionFrames: cue.durationFrames, volumenBase: 1}];
  });
  const conflictos = detectarSolapes([...voces, ...SFX]);
  if (conflictos.length) throw new Error(`Solapes de audio: ${JSON.stringify(conflictos)}`);
  const intervalos = voces.map((voz) => ({inicioFrame: voz.desdeFrame, finFrame: voz.desdeFrame + voz.duracionFrames}));
  if (voces.length + MUSICA.length + SFX.length === 0) return null;
  return <>
    {voces.map((voz) => <Sequence key={voz.id} name={voz.id} from={voz.desdeFrame} durationInFrames={voz.duracionFrames} layout="none"><Html5Audio src={staticFile(voz.src)} volume={1} /></Sequence>)}
    {MUSICA.map((pista) => <Sequence key={pista.id} name={pista.id} from={pista.desdeFrame} durationInFrames={pista.duracionFrames} layout="none"><Html5Audio src={staticFile(pista.src)} loop volume={(frame) => volumenMusica(frame + pista.desdeFrame, intervalos) * pista.volumenBase} /></Sequence>)}
    {SFX.map((pista) => <Sequence key={pista.id} name={pista.id} from={pista.desdeFrame} durationInFrames={pista.duracionFrames} layout="none"><Html5Audio src={staticFile(pista.src)} volume={pista.volumenBase} /></Sequence>)}
  </>;
};
