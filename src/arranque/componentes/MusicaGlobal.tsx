import {getStaticFiles, Html5Audio, staticFile} from "remotion";
import {gananciaMusica, RUTA_MUSICA} from "../musica.ts";

/** Una sola pista continua: sin archivo local no se monta ningún elemento de audio. */
export const MusicaGlobal = () => {
  if (!getStaticFiles().some(archivo => archivo.name === RUTA_MUSICA)) return null;
  return <Html5Audio src={staticFile(RUTA_MUSICA)} loop loopVolumeCurveBehavior="extend" volume={gananciaMusica} />;
};
