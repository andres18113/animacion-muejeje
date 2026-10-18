import {duracionEscena} from "../../anclas.ts";
import type {Anclas} from "./comun.ts";
import type {Estado} from "../motor.ts";
import {LUGARES, type Punto3D} from "../mundo.ts";
import type {EscenaId} from "../../tiempo.ts";
import type {MascotaId} from "../../../mascotas/catalogo.ts";
import {GUION_S01} from "./S01.ts";
import {GUION_S02} from "./S02.ts";
import {CIPU_LUGAR, GUION_S03} from "./S03.ts";
import {GUION_S04} from "./S04.ts";
import {GUION_S05,ALTURAS_S05} from "./S05.ts";
import {GUION_S06,ALTURA_DISQUI} from "./S06.ts";
import {GUION_S07} from "./S07.ts";
import {GUION_S08} from "./S08.ts";
import {GUION_S09,MEBRE_LUGAR,ALTURA_MEBRE} from "./S09.ts";
import {GUION_S10,GRUBI_LUGAR,ALTURA_GRUBI} from "./S10.ts";
import {GUION_S11} from "./S11.ts";
import {GUION_S12,NUCLEO_LUGAR,INIT_LUGAR,ALTURA_NUCLEO,ALTURA_INIT} from "./S12.ts";

export type RegistroCine = {
  id: EscenaId;
  composicion: string;
  guion: {
    inicial(): Record<string, Estado>;
    construir(tl: gsap.core.Timeline, s: Record<string, Estado>, f: (frames: number) => number, a: Anclas): void;
  };
  frames: number;
  actores: {id: MascotaId; lugar: Punto3D; alto: number; clave: string}[];
  continuidad?: {
    hacia: EscenaId;
    frameCamara: number;
    frameActores: number;
    actores: string[];
    maxSalto: number;
    /** Pares de rutas grupo.campo que deben conservar su valor. */
    persistentes?: {desde: string; hasta: string}[];
  };
};

/** Registro de pruebas y herramientas; no cambia las composiciones renderizadas. */
export const REGISTRO_CINE: RegistroCine[] = [
  {id: "S01", composicion: "S01Alimentacion", guion: GUION_S01, frames: duracionEscena("S01"),
    actores: [
      {id: "voltio", lugar: LUGARES.voltio, alto: 3.0, clave: "voltio"},
      {id: "pulso", lugar: LUGARES.pulso, alto: 2.3, clave: "pulso"},
      {id: "secu", lugar: LUGARES.secu, alto: 2.3, clave: "secu"},
    ],
    continuidad: {hacia: "S02", frameCamara: duracionEscena("S01") - 1, frameActores: duracionEscena("S01") - 1, actores: ["pulso", "secu"], maxSalto: 0.2}},
  {id: "S02", composicion: "S02ControlEncendido", guion: GUION_S02, frames: duracionEscena("S02"),
    actores: [
      {id: "pulso", lugar: LUGARES.pulso, alto: 2.3, clave: "pulso"},
      {id: "secu", lugar: LUGARES.secu, alto: 2.3, clave: "secu"},
    ],
    continuidad: {hacia: "S03", frameCamara: duracionEscena("S02") - 1, frameActores: duracionEscena("S02") - 1, actores: ["pulso", "secu"], maxSalto: 0.2, persistentes: [{desde: "senal.analizador", hasta: "capa.analizador"}]}},
  {id: "S03", composicion: "S03PrimeraInstruccion", guion: GUION_S03, frames: duracionEscena("S03"),
    actores: [
      {id: "cipu", lugar: CIPU_LUGAR, alto: 3.0, clave: "cipu"},
      {id: "secu", lugar: LUGARES.secu, alto: 2.3, clave: "secu"},
      {id: "pulso", lugar: LUGARES.pulso, alto: 2.3, clave: "pulso"},
    ], continuidad: {hacia: "S04", frameCamara: duracionEscena("S03") - 1, frameActores: duracionEscena("S03") - 1, actores: ["cipu", "secu", "pulso"], maxSalto: 0.2,
      persistentes: [
        ...["cartucho", "norte", "sur", "flash"].map(k => ({desde: `mundo.${k}`, hasta: `mundo.${k}`})),
        ...["analizador", "placa", "holo", "etiquetas", "busqueda", "ramVacia", "retorno", "ejecucion", "mapa", "repaso"].map(k => ({desde: `capa.${k}`, hasta: `capa.${k}`})),
      ]}},
  {id: "S04", composicion: "S04BiosFlashCmos", guion: GUION_S04, frames: duracionEscena("S04"),
    actores: [
      {id: "romi", lugar: LUGARES.romi, alto: 2.3, clave: "romi"},
      {id: "bios", lugar: LUGARES.bios, alto: 2.3, clave: "bios"},
      {id: "cmosi", lugar: LUGARES.cmosi, alto: 2.3, clave: "cmosi"},
      {id: "cipu", lugar: CIPU_LUGAR, alto: 3, clave: "cipu"},
      {id: "secu", lugar: LUGARES.secu, alto: 2.3, clave: "secu"},
      {id: "pulso", lugar: LUGARES.pulso, alto: 2.3, clave: "pulso"},
    ], continuidad:{hacia:"S05",frameCamara:duracionEscena("S04") - 1,frameActores:duracionEscena("S04") - 1,actores:["cipu","secu","pulso","romi","bios","cmosi"],maxSalto:0.2,
      persistentes:[...["cartucho","norte","sur","flash"].map(k=>({desde:`mundo.${k}`,hasta:`mundo.${k}`})),...["placa","mapa","seccion","configuracion","reloj","bateria","distincion"].map(k=>({desde:`capa.${k}`,hasta:`capa.${k}`}))]}},
  {id:"S05",composicion:"S05PostMemoria",guion:GUION_S05,frames:duracionEscena("S05"),
    actores:[
      {id:"postin",lugar:LUGARES.postin,alto:ALTURAS_S05.postin,clave:"postin"},
      {id:"spedi",lugar:LUGARES.spedi,alto:ALTURAS_S05.spedi,clave:"spedi"},
      {id:"rami",lugar:LUGARES.rami,alto:ALTURAS_S05.rami,clave:"rami"},
      {id:"cipu",lugar:CIPU_LUGAR,alto:3,clave:"cipu"},
      {id:"secu",lugar:LUGARES.secu,alto:2.3,clave:"secu"},
      {id:"pulso",lugar:LUGARES.pulso,alto:2.3,clave:"pulso"},
      {id:"romi",lugar:LUGARES.romi,alto:2.3,clave:"romi"},
      {id:"bios",lugar:LUGARES.bios,alto:2.3,clave:"bios"},
      {id:"cmosi",lugar:LUGARES.cmosi,alto:2.3,clave:"cmosi"},
    ],continuidad:{hacia:"S06",frameCamara:duracionEscena("S05") - 1,frameActores:duracionEscena("S05") - 1,actores:["cipu","secu","pulso","romi","bios","cmosi","postin","spedi","rami"],maxSalto:.2,
      persistentes:[...["cartucho","norte","sur","flash"].map(k=>({desde:`mundo.${k}`,hasta:`mundo.${k}`})),...["placa","mapa","seccion","spdConsulta","spdRespuesta","spdDatos","configControlador","refresco","dimensionado","ejemplo","escritura","lectura","alternativa"].map(k=>({desde:`capa.${k}`,hasta:`capa.${k}`}))]}},
  {id:"S06",composicion:"S06ServiciosDispositivos",guion:GUION_S06,frames:duracionEscena("S06"),
    actores:[
      {id:"bios",lugar:LUGARES.bios,alto:2.3,clave:"bios"},
      {id:"disqui",lugar:LUGARES.disqui,alto:ALTURA_DISQUI,clave:"disqui"},
      {id:"cipu",lugar:CIPU_LUGAR,alto:3,clave:"cipu"},
      {id:"secu",lugar:LUGARES.secu,alto:2.3,clave:"secu"},
      {id:"pulso",lugar:LUGARES.pulso,alto:2.3,clave:"pulso"},
      {id:"romi",lugar:LUGARES.romi,alto:2.3,clave:"romi"},
      {id:"cmosi",lugar:LUGARES.cmosi,alto:2.3,clave:"cmosi"},
      {id:"postin",lugar:LUGARES.postin,alto:ALTURAS_S05.postin,clave:"postin"},
      {id:"spedi",lugar:LUGARES.spedi,alto:ALTURAS_S05.spedi,clave:"spedi"},
      {id:"rami",lugar:LUGARES.rami,alto:ALTURAS_S05.rami,clave:"rami"},
    ],continuidad:{hacia:"S07",frameCamara:duracionEscena("S06") - 1,frameActores:duracionEscena("S06") - 1,actores:["bios","disqui","cmosi","cipu","secu","pulso","romi","postin","spedi","rami"],maxSalto:.2,
      persistentes:[...["cartucho","norte","sur","flash"].map(k=>({desde:`mundo.${k}`,hasta:`mundo.${k}`})),...["placa","perifericosPresentes","discoPresente","videoDisponible","tecladoDisponible","idePreparado","comunicacionDisponible","ivtPreparacion","bdaPreparacion","discoDetalle","ramDetalle"].map(k=>({desde:`capa.${k}`,hasta:`capa.${k}`}))]}},
  {id:"S07",composicion:"S07SeleccionDispositivo",guion:GUION_S07,frames:duracionEscena("S07"),
    actores:[
      {id:"cmosi",lugar:LUGARES.cmosi,alto:2.3,clave:"cmosi"},
      {id:"bios",lugar:LUGARES.bios,alto:2.3,clave:"bios"},
      {id:"disqui",lugar:LUGARES.disqui,alto:ALTURA_DISQUI,clave:"disqui"},
      {id:"cipu",lugar:CIPU_LUGAR,alto:3,clave:"cipu"},
      {id:"secu",lugar:LUGARES.secu,alto:2.3,clave:"secu"},
      {id:"pulso",lugar:LUGARES.pulso,alto:2.3,clave:"pulso"},
      {id:"romi",lugar:LUGARES.romi,alto:2.3,clave:"romi"},
      {id:"postin",lugar:LUGARES.postin,alto:ALTURAS_S05.postin,clave:"postin"},
      {id:"spedi",lugar:LUGARES.spedi,alto:ALTURAS_S05.spedi,clave:"spedi"},
      {id:"rami",lugar:LUGARES.rami,alto:ALTURAS_S05.rami,clave:"rami"},
    ],continuidad:{hacia:"S08",frameCamara:duracionEscena("S07") - 1,frameActores:duracionEscena("S07") - 1,actores:["bios","disqui","cmosi","cipu","secu","pulso","romi","postin","spedi","rami"],maxSalto:.2,
      persistentes:[...["cartucho","norte","sur","flash"].map(k=>({desde:`mundo.${k}`,hasta:`mundo.${k}`})),...["placa","perifericosPresentes","discoPresente","videoDisponible","tecladoDisponible","idePreparado","comunicacionDisponible","ivtPreparacion","bdaPreparacion","discoDetalle","ramDetalle","disqueteraPresente","discoSeleccionado","rutina19","codigo19","bootstrap","panelK","ordenPanel","sinDisquete"].map(k=>({desde:`capa.${k}`,hasta:`capa.${k}`}))]}},
  {id:"S08",composicion:"S08LecturaSector",guion:GUION_S08,frames:duracionEscena("S08"),
    actores:[
      {id:"bios",lugar:LUGARES.bios,alto:2.3,clave:"bios"},
      {id:"disqui",lugar:LUGARES.disqui,alto:ALTURA_DISQUI,clave:"disqui"},
      {id:"cmosi",lugar:LUGARES.cmosi,alto:2.3,clave:"cmosi"},
      {id:"cipu",lugar:CIPU_LUGAR,alto:3,clave:"cipu"},
      {id:"secu",lugar:LUGARES.secu,alto:2.3,clave:"secu"},
      {id:"pulso",lugar:LUGARES.pulso,alto:2.3,clave:"pulso"},
      {id:"romi",lugar:LUGARES.romi,alto:2.3,clave:"romi"},
      {id:"postin",lugar:LUGARES.postin,alto:ALTURAS_S05.postin,clave:"postin"},
      {id:"spedi",lugar:LUGARES.spedi,alto:ALTURAS_S05.spedi,clave:"spedi"},
      {id:"rami",lugar:LUGARES.rami,alto:ALTURAS_S05.rami,clave:"rami"},
    ],continuidad:{hacia:"S09",frameCamara:duracionEscena("S08") - 1,frameActores:duracionEscena("S08") - 1,actores:["bios","disqui","cmosi","cipu","secu","pulso","romi","postin","spedi","rami"],maxSalto:.2,
      persistentes:[...["cartucho","norte","sur","flash"].map(k=>({desde:`mundo.${k}`,hasta:`mundo.${k}`})),...["placa","discoPresente","comunicacionDisponible","disqueteraPresente","discoSeleccionado","rutina19","preparado","transferencia","datos","solicitud"].map(k=>({desde:`capa.${k}`,hasta:`capa.${k}`}))]}},
  {id:"S09",composicion:"S09EstructuraMbr",guion:GUION_S09,frames:duracionEscena("S09"),
    actores:[
      {id:"mebre",lugar:MEBRE_LUGAR,alto:ALTURA_MEBRE,clave:"mebre"},
      {id:"bios",lugar:LUGARES.bios,alto:2.3,clave:"bios"},
      {id:"disqui",lugar:LUGARES.disqui,alto:ALTURA_DISQUI,clave:"disqui"},
      {id:"cmosi",lugar:LUGARES.cmosi,alto:2.3,clave:"cmosi"},
      {id:"cipu",lugar:CIPU_LUGAR,alto:3,clave:"cipu"},
      {id:"secu",lugar:LUGARES.secu,alto:2.3,clave:"secu"},
      {id:"pulso",lugar:LUGARES.pulso,alto:2.3,clave:"pulso"},
      {id:"romi",lugar:LUGARES.romi,alto:2.3,clave:"romi"},
      {id:"postin",lugar:LUGARES.postin,alto:ALTURAS_S05.postin,clave:"postin"},
      {id:"spedi",lugar:LUGARES.spedi,alto:ALTURAS_S05.spedi,clave:"spedi"},
      {id:"rami",lugar:LUGARES.rami,alto:ALTURAS_S05.rami,clave:"rami"},
    ],continuidad:{hacia:"S10",frameCamara:duracionEscena("S09") - 1,frameActores:duracionEscena("S09") - 1,actores:["bios","disqui","cmosi","cipu","secu","pulso","romi","postin","spedi","rami","mebre"],maxSalto:.2,
      persistentes:[...["cartucho","norte","sur","flash"].map(k=>({desde:`mundo.${k}`,hasta:`mundo.${k}`})),...["placa","discoPresente","disqueteraPresente","discoSeleccionado","preparado","regionCodigo","regionTabla","regionFirma","firmaValor","stage1","ejecutaStage1","biosPanelFuera"].map(k=>({desde:`capa.${k}`,hasta:`capa.${k}`}))]}},
  {id:"S10",composicion:"S10GrubLegacy",guion:GUION_S10,frames:duracionEscena("S10"),
    actores:[
      {id:"grubi",lugar:GRUBI_LUGAR,alto:ALTURA_GRUBI,clave:"grubi"},
      {id:"mebre",lugar:MEBRE_LUGAR,alto:ALTURA_MEBRE,clave:"mebre"},
      {id:"bios",lugar:LUGARES.bios,alto:2.3,clave:"bios"},
      {id:"disqui",lugar:LUGARES.disqui,alto:ALTURA_DISQUI,clave:"disqui"},
      {id:"cmosi",lugar:LUGARES.cmosi,alto:2.3,clave:"cmosi"},
      {id:"cipu",lugar:CIPU_LUGAR,alto:3,clave:"cipu"},
      {id:"secu",lugar:LUGARES.secu,alto:2.3,clave:"secu"},
      {id:"pulso",lugar:LUGARES.pulso,alto:2.3,clave:"pulso"},
      {id:"romi",lugar:LUGARES.romi,alto:2.3,clave:"romi"},
      {id:"postin",lugar:LUGARES.postin,alto:ALTURAS_S05.postin,clave:"postin"},
      {id:"spedi",lugar:LUGARES.spedi,alto:ALTURAS_S05.spedi,clave:"spedi"},
      {id:"rami",lugar:LUGARES.rami,alto:ALTURAS_S05.rami,clave:"rami"},
    ],continuidad:{hacia:"S11",frameCamara:duracionEscena("S10") - 1,frameActores:duracionEscena("S10") - 1,actores:["bios","disqui","cmosi","cipu","secu","pulso","romi","postin","spedi","rami","mebre","grubi"],maxSalto:.2,
      persistentes:[...["cartucho","norte","sur","flash"].map(k=>({desde:`mundo.${k}`,hasta:`mundo.${k}`})),...["placa","discoPanel","mbrStage1","insercion","ext2Abierto","ejecuta","nucleoSeleccionado","menuPanel","discoSeleccionado"].map(k=>({desde:`capa.${k}`,hasta:`capa.${k}`}))]}},
  {id:"S11",composicion:"S11TransferenciaNucleo",guion:GUION_S11,frames:duracionEscena("S11"),
    actores:[
      {id:"grubi",lugar:GRUBI_LUGAR,alto:ALTURA_GRUBI,clave:"grubi"},
      {id:"mebre",lugar:MEBRE_LUGAR,alto:ALTURA_MEBRE,clave:"mebre"},
      {id:"bios",lugar:LUGARES.bios,alto:2.3,clave:"bios"},
      {id:"disqui",lugar:LUGARES.disqui,alto:ALTURA_DISQUI,clave:"disqui"},
      {id:"cmosi",lugar:LUGARES.cmosi,alto:2.3,clave:"cmosi"},
      {id:"cipu",lugar:CIPU_LUGAR,alto:3,clave:"cipu"},
      {id:"secu",lugar:LUGARES.secu,alto:2.3,clave:"secu"},
      {id:"pulso",lugar:LUGARES.pulso,alto:2.3,clave:"pulso"},
      {id:"romi",lugar:LUGARES.romi,alto:2.3,clave:"romi"},
      {id:"postin",lugar:LUGARES.postin,alto:ALTURAS_S05.postin,clave:"postin"},
      {id:"spedi",lugar:LUGARES.spedi,alto:ALTURAS_S05.spedi,clave:"spedi"},
      {id:"rami",lugar:LUGARES.rami,alto:ALTURAS_S05.rami,clave:"rami"},
    ],continuidad:{hacia:"S12",frameCamara:duracionEscena("S11") - 1,frameActores:duracionEscena("S11") - 1,actores:["bios","disqui","cmosi","cipu","secu","pulso","romi","postin","spedi","rami","mebre","grubi"],maxSalto:.2,
      persistentes:[...["cartucho","norte","sur","flash"].map(k=>({desde:`mundo.${k}`,hasta:`mundo.${k}`})),...["placa","nucleoTransferencia","parametrosListos","gdt","pe","entradaLinux","ejecuta","discoPanel","panelNucleo","panelCr0"].map(k=>({desde:`capa.${k}`,hasta:`capa.${k}`}))]}},
  {id:"S12",composicion:"S12InicioSistema",guion:GUION_S12,frames:duracionEscena("S12"),
    actores:[
      {id:"nucleo",lugar:NUCLEO_LUGAR,alto:ALTURA_NUCLEO,clave:"nucleo"},
      {id:"init",lugar:INIT_LUGAR,alto:ALTURA_INIT,clave:"init"},
      {id:"grubi",lugar:GRUBI_LUGAR,alto:ALTURA_GRUBI,clave:"grubi"},
      {id:"mebre",lugar:MEBRE_LUGAR,alto:ALTURA_MEBRE,clave:"mebre"},
      {id:"bios",lugar:LUGARES.bios,alto:2.3,clave:"bios"},
      {id:"disqui",lugar:LUGARES.disqui,alto:ALTURA_DISQUI,clave:"disqui"},
      {id:"cmosi",lugar:LUGARES.cmosi,alto:2.3,clave:"cmosi"},
      {id:"cipu",lugar:CIPU_LUGAR,alto:3,clave:"cipu"},
      {id:"secu",lugar:LUGARES.secu,alto:2.3,clave:"secu"},
      {id:"pulso",lugar:LUGARES.pulso,alto:2.3,clave:"pulso"},
      {id:"romi",lugar:LUGARES.romi,alto:2.3,clave:"romi"},
      {id:"postin",lugar:LUGARES.postin,alto:ALTURAS_S05.postin,clave:"postin"},
      {id:"spedi",lugar:LUGARES.spedi,alto:ALTURAS_S05.spedi,clave:"spedi"},
      {id:"rami",lugar:LUGARES.rami,alto:ALTURAS_S05.rami,clave:"rami"},
    ]},
];
