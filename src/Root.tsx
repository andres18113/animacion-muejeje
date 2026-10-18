import { Composition, Folder, Still } from "remotion";
import { MyComposition } from "./Composition";
import { CatalogoMascotas } from "./mascotas/CatalogoMascotas";
import { EjemploEscenaMascotas } from "./mascotas/EjemploEscena";
import { LaminaMascotas } from "./mascotas/LaminaMascotas";
import { S01Energia } from "./arranque/escenas/S01Energia";
import { S02Orden } from "./arranque/escenas/S02Orden";
import { S03PrimeraInstruccion } from "./arranque/escenas/S03PrimeraInstruccion";
import { S04BiosFlashCmos } from "./arranque/escenas/S04BiosFlashCmos";
import { S05PostMemoria } from "./arranque/escenas/S05PostMemoria";
import { S06ServiciosDispositivos } from "./arranque/escenas/S06ServiciosDispositivos";
import { S07SeleccionDispositivo } from "./arranque/escenas/S07SeleccionDispositivo";
import { S08LecturaSector } from "./arranque/escenas/S08LecturaSector";
import { S09EstructuraMbr } from "./arranque/escenas/S09EstructuraMbr";
import { S10GrubLegacy } from "./arranque/escenas/S10GrubLegacy";
import { S11TransferenciaNucleo } from "./arranque/escenas/S11TransferenciaNucleo";
import { S12InicioSistema } from "./arranque/escenas/S12InicioSistema";
import { MacroEncendido } from "./arranque/MacroEncendido";
import { VideoCompleto, DURACION_VIDEO } from "./arranque/VideoCompleto";
import { duracionEscena } from "./arranque/anclas.ts";
import { FPS } from "./arranque/tiempo.ts";
import { ComparacionRigs, PruebaRigs } from "./personajes/PruebaRigs";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Folder name="H01-Mascotas">
        <Composition
          id="CatalogoMascotas"
          component={CatalogoMascotas}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="EjemploEscenaMascotas"
          component={EjemploEscenaMascotas}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
        />
        <Still
          id="LaminaMascotas"
          component={LaminaMascotas}
          width={2400}
          height={1720}
        />
      </Folder>
      <Folder name="H02-Encendido">
        <Composition id="S01Alimentacion" component={S01Energia} durationInFrames={duracionEscena("S01")} fps={FPS} width={1920} height={1080} />
        <Composition id="S02ControlEncendido" component={S02Orden} durationInFrames={duracionEscena("S02")} fps={FPS} width={1920} height={1080} />
        <Composition id="MacroEncendido" component={MacroEncendido} durationInFrames={duracionEscena("S01") + duracionEscena("S02") + duracionEscena("S03")} fps={FPS} width={1920} height={1080} />
        <Composition id="S03PrimeraInstruccion" component={S03PrimeraInstruccion} durationInFrames={duracionEscena("S03")} fps={FPS} width={1920} height={1080} />
      </Folder>
      <Folder name="H03-Firmware">
        <Composition id="S04BiosFlashCmos" component={S04BiosFlashCmos} durationInFrames={duracionEscena("S04")} fps={FPS} width={1920} height={1080} />
      </Folder>
      <Folder name="H04-POST">
        <Composition id="S05PostMemoria" component={S05PostMemoria} durationInFrames={duracionEscena("S05")} fps={FPS} width={1920} height={1080} />
      </Folder>
      <Folder name="H05-Servicios">
        <Composition id="S06ServiciosDispositivos" component={S06ServiciosDispositivos} durationInFrames={duracionEscena("S06")} fps={FPS} width={1920} height={1080} />
      </Folder>
      <Folder name="H06-Arranque">
        <Composition id="S07SeleccionDispositivo" component={S07SeleccionDispositivo} durationInFrames={duracionEscena("S07")} fps={FPS} width={1920} height={1080} />
        <Composition id="S08LecturaSector" component={S08LecturaSector} durationInFrames={duracionEscena("S08")} fps={FPS} width={1920} height={1080} />
      </Folder>
      <Folder name="H07-Cargador">
        <Composition id="S09EstructuraMbr" component={S09EstructuraMbr} durationInFrames={duracionEscena("S09")} fps={FPS} width={1920} height={1080} />
        <Composition id="S10GrubLegacy" component={S10GrubLegacy} durationInFrames={duracionEscena("S10")} fps={FPS} width={1920} height={1080} />
      </Folder>
      <Folder name="H08-Sistema">
        <Composition id="S11TransferenciaNucleo" component={S11TransferenciaNucleo} durationInFrames={duracionEscena("S11")} fps={FPS} width={1920} height={1080} />
        <Composition id="S12InicioSistema" component={S12InicioSistema} durationInFrames={duracionEscena("S12")} fps={FPS} width={1920} height={1080} />
      </Folder>
      <Folder name="Video">
        <Composition id="VideoCompleto" component={VideoCompleto} durationInFrames={DURACION_VIDEO} fps={FPS} width={1920} height={1080} />
      </Folder>
      <Folder name="Rigs">
        <Composition id="PruebaRigs" component={PruebaRigs} durationInFrames={600} fps={30} width={1920} height={1080} />
        <Composition id="ComparacionRigs" component={ComparacionRigs} durationInFrames={1} fps={30} width={1920} height={1080} />
      </Folder>
    </>
  );
};
