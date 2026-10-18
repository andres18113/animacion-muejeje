import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {resolve, relative, dirname, isAbsolute} from 'node:path';
import {argumentos, cargar, raiz} from './comun.mjs';

const o = argumentos({id:'valor',nombre:'valor',componente:'valor',salida:'valor','dry-run':'bool'},
  'Uso: node RUTA/scripts/nueva-escena.mjs --id S03 --nombre "Primera instrucción" --componente S03PrimeraInstruccion [--salida out/tmp-scaffold] [--dry-run]\nSin --salida escribe en src; nunca sobrescribe ni registra automáticamente. La salida temporal conserva la estructura src/.');
if (!/^S(?:0[1-9]|1[0-2])$/.test(o.id ?? '') || !new RegExp(`^${o.id}[A-Z][A-Za-z0-9]*$`).test(o.componente ?? '') || !o.nombre?.trim()) throw Error('Indica id, nombre y componente válidos.');
const {ESCENAS} = await cargar('src/arranque/escenas.ts');
const {MASCOTAS} = await cargar('src/mascotas/catalogo.ts');
const {cuesDeEscena, anclasDeEscena} = await cargar('src/arranque/recursos.ts');
const contrato = ESCENAS.find(e=>e.id === o.id);
if (!contrato) throw Error(`Falta ContratoEscena ${o.id}; completar gate 0 antes de generar.`);
const cues = cuesDeEscena(o.id), anclas = anclasDeEscena(o.id,cues);
if (!cues.length) throw Error('Faltan cues; completar gate 0.');
const actores = contrato.personajes.map(c=>MASCOTAS.find(m=>m.codigo===c));
if (actores.some(a=>!a)) throw Error('Personaje del contrato ausente del catálogo.');
const destino = resolve(raiz, o.salida ?? '.');
const rel = relative(raiz, destino);
if (rel.startsWith('..') || isAbsolute(rel)) throw Error('--salida debe quedar dentro del repo.');
const guion = resolve(destino,`src/arranque/cine/guion/${o.id}.ts`);
const escena = resolve(destino,`src/arranque/escenas/${o.componente}.tsx`);
if ([guion,escena].some(existsSync)) throw Error('Se rechaza sobrescribir una escena o guion existente.');
const imp = (desde,p) => {const r=relative(dirname(desde),resolve(raiz,p)).replaceAll('\\','/');return r.startsWith('.')?r:`./${r}`;};
const q = JSON.stringify;
const sitios = {cipu:'cpu'};
const {LUGARES} = await cargar('src/arranque/cine/mundo.ts');
const lugar = id=>`LUGARES.${sitios[id] ?? id}`;
if (actores.some(a=>!((sitios[a.id] ?? a.id) in LUGARES))) throw Error('Añade ubicación del personaje en mundo.ts antes de generar.');
const beats = cues.map(({cue})=>`// ${cue.cueId}: frames ${cue.startFrame}..${cue.startFrame+cue.durationFrames-1}: ${cue.displayText}`).join('\n');
const eventos = Object.entries(anclas).map(([k,v])=>`// a.${k} = ${v}; enlazar acción causal aprobada en la hoja de beats.`).join('\n');
const textoGuion = `import {CAMARA_PUENTE} from ${q(imp(guion,'src/arranque/cine/mundo.ts'))};
import {CUERPO_BASE, type Guion} from ${q(imp(guion,'src/arranque/cine/guion/comun.ts'))};

/** Esqueleto: ${o.nombre.replaceAll('*/','')}.
 * PENDIENTE: sustituir cámara y estados por los del corte anterior validado.
 * No constituye una escena implementada ni aprobada.
 */
${beats}
${eventos || '// Sin anclas: añadir palabras exactas al registro ANCLAS_VISUALES antes de animar.'}
const inicial = () => ({
  cam: {...CAMARA_PUENTE},
${actores.map(a=>`  ${a.id}: {...CUERPO_BASE},`).join('\n')}
});
export const GUION_${o.id}: Guion<ReturnType<typeof inicial>> = {
  inicial,
  construir: (_tl, _s, _f, _a) => {
    // Completar solo después de aprobar beats, anclas y continuidad.
  },
};
`;
const imports = [
  ['{cuesDeEscena, anclasDeEscena}','src/arranque/recursos.ts'],
  ['{useCoreografia}','src/arranque/cine/coreografia.ts'],
  ['{Mundo3D}','src/arranque/cine/Mundo3D.tsx'],
  ['{Actor}','src/arranque/cine/Actor.tsx'],
  ['{SubtituloCine}','src/arranque/cine/SubtituloCine.tsx'],
  ['{CapaAudio}','src/arranque/componentes/CapaAudio.tsx'],
  ['{LUGARES, crearCamara}','src/arranque/cine/mundo.ts'],
].map(([s,p])=>`import ${s} from ${q(imp(escena,p))};`).join('\n');
let guionRel=relative(dirname(escena),guion).replaceAll('\\','/');if(!guionRel.startsWith('.'))guionRel='./'+guionRel;
const textoEscena = `import React, {useMemo} from "react";
import {AbsoluteFill, Interactive, useCurrentFrame, useVideoConfig} from "remotion";
${imports}
import {GUION_${o.id}} from ${q(guionRel)};

const ${o.componente}Inner: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cues = useMemo(() => cuesDeEscena(${q(o.id)}), []);
  const a = useMemo(() => anclasDeEscena(${q(o.id)}, cues), [cues]);
  const e = useCoreografia(GUION_${o.id}, a);
  const camara = crearCamara(e.cam);
  // PENDIENTE: heredar estados persistentes y diseñar señales de la hoja de beats.
  return <AbsoluteFill>
    <Mundo3D camara={e.cam} estado={{luzRed: 1, espera: 1, rieles: 1, rizado: 0, reloj: 1, resetRetenido: 0, cpuLista: 1, frame}} />
${actores.map(a=>`    <Actor id=${q(a.id)} camara={camara} lugar={${lugar(a.id)}} alto={2.3} cuerpo={e.${a.id}} frame={frame} fps={fps} cue={cues.find(c => c.cue.mascotId === ${q(a.id)} && frame >= c.cue.startFrame && frame < c.cue.startFrame + c.cue.durationFrames)} />`).join('\n')}
    <SubtituloCine cues={cues} />
    <CapaAudio cues={cues} />
  </AbsoluteFill>;
};
export const ${o.componente} = Interactive.create({Component: ${o.componente}Inner, layout: "absolute-fill"});
`;
console.log(JSON.stringify({archivos:[guion,escena],cues:cues.map(c=>c.cue.cueId),anclas,modo:o['dry-run']?'plan':'escritura'},null,2));
console.log(`\nRoot.tsx (conservar CRLF), import y dentro del Folder del hito:\nimport {${o.componente}} from "./arranque/escenas/${o.componente}";\n<Composition id="${o.componente}" component={${o.componente}} durationInFrames={duracionEscena("${o.id}")} fps={FPS} width={1920} height={1080} />`);
console.log(`\nANCLAS_VISUALES (anclas.ts): escoger palabras presentes en un solo segmento; orden estricto.\n${JSON.stringify({sceneId:o.id,cueId:cues[0].cue.cueId,evento:'presentacion',palabra:cues[0].segmentos[0].texto.split(/\s+/).slice(0,2).join(' ')})},`);
console.log(`\nregistro.ts (consume validar-cine):\nimport {GUION_${o.id}} from "./${o.id}.ts";\n{id: "${o.id}", composicion: "${o.componente}", guion: GUION_${o.id}, frames: ${contrato.duracionSegundos*30}, actores: [\n${actores.map(a=>`{id: "${a.id}", clave: "${a.id}", lugar: ${lugar(a.id)}, alto: 2.3},`).join('\n')}\n]},\nEn el registro anterior añadir continuidad: {hacia: "${o.id}", frameCamara: FRAMES_ANTERIOR, frameActores: FRAMES_ANTERIOR - 1, actores: [/* compartidos */], maxSalto: 0.2, persistentes: [/* {desde: "grupo.campo", hasta: "grupo.campo"} */]}.`);
if (!o['dry-run']) for (const [p,texto] of [[guion,textoGuion],[escena,textoEscena]]) {mkdirSync(dirname(p),{recursive:true});writeFileSync(p,texto,{flag:'wx'});}
