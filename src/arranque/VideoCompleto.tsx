import {MusicaGlobal} from "./componentes/MusicaGlobal";
import {Track} from "remotion";
import {duracionEscena} from "./anclas.ts";
import type {EscenaId} from "./tiempo.ts";
import {S01Energia} from "./escenas/S01Energia";
import {S02Orden} from "./escenas/S02Orden";
import {S03PrimeraInstruccion} from "./escenas/S03PrimeraInstruccion";
import {S04BiosFlashCmos} from "./escenas/S04BiosFlashCmos";
import {S05PostMemoria} from "./escenas/S05PostMemoria";
import {S06ServiciosDispositivos} from "./escenas/S06ServiciosDispositivos";
import {S07SeleccionDispositivo} from "./escenas/S07SeleccionDispositivo";
import {S08LecturaSector} from "./escenas/S08LecturaSector";
import {S09EstructuraMbr} from "./escenas/S09EstructuraMbr";
import {S10GrubLegacy} from "./escenas/S10GrubLegacy";
import {S11TransferenciaNucleo} from "./escenas/S11TransferenciaNucleo";
import {S12InicioSistema} from "./escenas/S12InicioSistema";

const IDS: readonly EscenaId[] = ["S01", "S02", "S03", "S04", "S05", "S06", "S07", "S08", "S09", "S10", "S11", "S12"];
/** Inicio global de cada escena derivado del storyboard, en frames enteros. */
const inicio = (id: EscenaId) => IDS.slice(0, IDS.indexOf(id)).reduce((suma, previa) => suma + duracionEscena(previa), 0);
export const DURACION_VIDEO = IDS.reduce((suma, id) => suma + duracionEscena(id), 0);
const t = (id: EscenaId) => ({from: inicio(id), durationInFrames: duracionEscena(id)});

/** Video completo S01–S12 (9002 frames): cada escena arranca con la cámara y los estados con que termina la anterior. */
export const VideoCompleto = () => <>
<MusicaGlobal />
<Track name="Arranque BIOS → Linux">
  <S01Energia name="S01: Alimentación inicial" {...t("S01")} />
  <S02Orden name="S02: Control de encendido" {...t("S02")} />
  <S03PrimeraInstruccion name="S03: Primera instrucción" {...t("S03")} />
  <S04BiosFlashCmos name="S04: BIOS, ROM y CMOS" {...t("S04")} />
  <S05PostMemoria name="S05: POST e inicialización de memoria" {...t("S05")} />
  <S06ServiciosDispositivos name="S06: Dispositivos y servicios" {...t("S06")} />
  <S07SeleccionDispositivo name="S07: Selección del dispositivo" {...t("S07")} />
  <S08LecturaSector name="S08: Lectura del primer sector" {...t("S08")} />
  <S09EstructuraMbr name="S09: Estructura y ejecución del MBR" {...t("S09")} />
  <S10GrubLegacy name="S10: GRUB Legacy" {...t("S10")} />
  <S11TransferenciaNucleo name="S11: Transferencia al núcleo" {...t("S11")} />
  <S12InicioSistema name="S12: Inicio del sistema operativo" {...t("S12")} />
</Track>
</>;
