import type {CueDialogo} from "./dialogo.ts";
import {segmentosDeCue, type SegmentoSubtitulo} from "./subtitulos.ts";
import {STORYBOARD, segundosAFrames, type EscenaId} from "./tiempo.ts";

/**
 * El evento sucede cuando se pronuncia la palabra: posición proporcional dentro
 * de la frase visible que la contiene. Así dos anclas de una misma frase quedan
 * ordenadas (p. ej. PWR_OK antes que RESET) y se mueven con la alineación real.
 */
export function anclaEnCue(cue: CueDialogo, palabra: string, segmentos: readonly SegmentoSubtitulo[] = segmentosDeCue(cue)): number {
  const normalizar = (texto: string) => texto.replace(/\s+/gu, " ").trim().toLocaleLowerCase("es");
  const buscada = normalizar(palabra);
  const indice = buscada ? segmentos.findIndex((item) => normalizar(item.texto).includes(buscada)) : -1;
  if (indice < 0) throw new Error(`Ancla «${palabra}» ausente en ${cue.cueId}`);
  const texto = normalizar(segmentos[indice].texto);
  // Un alineado real con silencios divide la frase en tramos consecutivos con el mismo texto:
  // la posición proporcional se reparte sobre el habla de todos ellos, no solo del primero.
  const tramos = [segmentos[indice]];
  for (let i = indice + 1; i < segmentos.length && segmentos[i].texto === segmentos[indice].texto; i++) tramos.push(segmentos[i]);
  const habla = tramos.reduce((suma, tramo) => suma + tramo.finFrame - tramo.inicioFrame, 0);
  let restante = Math.floor(texto.indexOf(buscada) / texto.length * habla);
  for (const tramo of tramos) {
    const duracion = tramo.finFrame - tramo.inicioFrame;
    if (restante < duracion) return tramo.inicioFrame + restante;
    restante -= duracion;
  }
  return tramos[tramos.length - 1].finFrame - 1;
}

export function duracionEscena(id: EscenaId): number {
  const escena = STORYBOARD.find((item) => item.id === id)!;
  return segundosAFrames(escena.finSegundos - escena.inicioSegundos);
}

/** Orden narrativo que valida el mismo registro que consumen las escenas. */
export const ANCLAS_VISUALES = [
  {sceneId: "S01", cueId: "S01-C01", evento: "ac", palabra: "corriente alterna"},
  {sceneId: "S01", cueId: "S01-C01", evento: "espera", palabra: "tensión de espera"},
  {sceneId: "S01", cueId: "S01-C01", evento: "orden", palabra: "me ordena encender"},
  {sceneId: "S01", cueId: "S01-C01", evento: "principal", palabra: "activo mis salidas"},
  {sceneId: "S01", cueId: "S01-C01", evento: "estable", palabra: "estabilizarse"},
  {sceneId: "S01", cueId: "S01-C01", evento: "pwr", palabra: "PWR_OK"},
  {sceneId: "S02", cueId: "S02-C01", evento: "boton", palabra: "Mi pulsación"},
  {sceneId: "S02", cueId: "S02-C02", evento: "psOn", palabra: "PS_ON#"},
  {sceneId: "S02", cueId: "S02-C02", evento: "pwr", palabra: "confirmación eléctrica"},
  {sceneId: "S02", cueId: "S02-C02", evento: "reset", palabra: "liberación del reinicio"},
  {sceneId: "S02", cueId: "S02-C02", evento: "cpu", palabra: "La CPU no comienza"},
  {sceneId: "S03", cueId: "S03-C01", evento: "presentacion", palabra: "soy Cipu"},
  {sceneId: "S03", cueId: "S03-C01", evento: "reinicio", palabra: "termina mi reinicio"},
  {sceneId: "S03", cueId: "S03-C01", evento: "instruccion", palabra: "primera instrucción"},
  {sceneId: "S03", cueId: "S03-C01", evento: "direccion", palabra: "FFFFFFF0"},
  {sceneId: "S03", cueId: "S03-C01", evento: "bios", palabra: "código inicial del BIOS"},
  {sceneId: "S03", cueId: "S03-C01", evento: "linux", palabra: "ningún proceso Linux"},
  {sceneId: "S03", cueId: "S03-C01", evento: "firmware", palabra: "instrucciones del firmware"},
  {sceneId: "S03", cueId: "S03-C01", evento: "chipset", palabra: "El chipset facilita"},
  {sceneId: "S03", cueId: "S03-C01", evento: "region", palabra: "primera búsqueda"},
  {"sceneId": "S04", "cueId": "S04-C01", "evento": "romi", "palabra": "Soy Romi"},
  {"sceneId": "S04", "cueId": "S04-C01", "evento": "flash", "palabra": "memoria flash"},
  {"sceneId": "S04", "cueId": "S04-C01", "evento": "capacidad", "palabra": "quinientos doce kibibytes"},
  {"sceneId": "S04", "cueId": "S04-C01", "evento": "bloques", "palabra": "ocho bloques"},
  {"sceneId": "S04", "cueId": "S04-C02", "evento": "bios", "palabra": "Yo soy Bios"},
  {"sceneId": "S04", "cueId": "S04-C02", "evento": "programa", "palabra": "programa que ejecuta"},
  {"sceneId": "S04", "cueId": "S04-C02", "evento": "prepara", "palabra": "preparar el computador"},
  {"sceneId": "S04", "cueId": "S04-C03", "evento": "cmosi", "palabra": "Y yo soy Cmosi"},
  {"sceneId": "S04", "cueId": "S04-C03", "evento": "configuracion", "palabra": "parámetros de configuración"},
  {"sceneId": "S04", "cueId": "S04-C03", "evento": "reloj", "palabra": "reloj"},
  {"sceneId": "S04", "cueId": "S04-C03", "evento": "bateria", "palabra": "batería"},
  {"sceneId": "S04", "cueId": "S04-C03", "evento": "noBios", "palabra": "no almaceno"},
  {"sceneId": "S04", "cueId": "S04-C03", "evento": "diferentes", "palabra": "funciones diferentes"},
  {"sceneId": "S05", "cueId": "S05-C01", "evento": "postin", "palabra": "Soy Postín"},
  {"sceneId": "S05", "cueId": "S05-C01", "evento": "inicio", "palabra": "Durante POST"},
  {"sceneId": "S05", "cueId": "S05-C01", "evento": "comprobacion", "palabra": "compruebo recursos esenciales"},
  {"sceneId": "S05", "cueId": "S05-C01", "evento": "cpu", "palabra": "procesador"},
  {"sceneId": "S05", "cueId": "S05-C01", "evento": "cache", "palabra": "caché"},
  {"sceneId": "S05", "cueId": "S05-C01", "evento": "memoria", "palabra": "memoria y controladores"},
  {"sceneId": "S05", "cueId": "S05-C01", "evento": "diagnosticos", "palabra": "comunicar diagnósticos"},
  {"sceneId": "S05", "cueId": "S05-C01", "evento": "puerto", "palabra": "puerto ochenta hexadecimal"},
  {"sceneId": "S05", "cueId": "S05-C02", "evento": "spedi", "palabra": "Yo soy Spedi"},
  {"sceneId": "S05", "cueId": "S05-C02", "evento": "eeprom", "palabra": "pequeña EEPROM"},
  {"sceneId": "S05", "cueId": "S05-C02", "evento": "modulo", "palabra": "módulo de memoria"},
  {"sceneId": "S05", "cueId": "S05-C02", "evento": "datos", "palabra": "Entrego datos"},
  {"sceneId": "S05", "cueId": "S05-C02", "evento": "tamano", "palabra": "tamaño y velocidad"},
  {"sceneId": "S05", "cueId": "S05-C03", "evento": "rami", "palabra": "Y yo soy Rami"},
  {"sceneId": "S05", "cueId": "S05-C03", "evento": "controlador", "palabra": "el controlador"},
  {"sceneId": "S05", "cueId": "S05-C03", "evento": "verificar", "palabra": "verificar"},
  {"sceneId": "S05", "cueId": "S05-C03", "evento": "almacenar", "palabra": "almacenar información"},
  {"sceneId": "S05", "cueId": "S05-C03", "evento": "critica", "palabra": "comprobación crítica"},
  {"sceneId": "S05", "cueId": "S05-C03", "evento": "detencion", "palabra": "arranque puede detenerse"},
  {"sceneId": "S06", "cueId": "S06-C01", "evento": "preparar", "palabra": "Ahora preparo"},
  {"sceneId": "S06", "cueId": "S06-C01", "evento": "servicios", "palabra": "servicios de interrupción"},
  {"sceneId": "S06", "cueId": "S06-C01", "evento": "ram", "palabra": "áreas de datos BIOS en RAM"},
  {"sceneId": "S06", "cueId": "S06-C01", "evento": "video", "palabra": "video"},
  {"sceneId": "S06", "cueId": "S06-C01", "evento": "teclado", "palabra": "teclado"},
  {"sceneId": "S06", "cueId": "S06-C01", "evento": "ide", "palabra": "controlador IDE"},
  {"sceneId": "S06", "cueId": "S06-C02", "evento": "disqui", "palabra": "Soy Disqui"},
  {"sceneId": "S06", "cueId": "S06-C02", "evento": "detecta", "palabra": "BIOS me detecta"},
  {"sceneId": "S06", "cueId": "S06-C02", "evento": "ata", "palabra": "controlador ATA"},
  {"sceneId": "S06", "cueId": "S06-C02", "evento": "comprueba", "palabra": "comprueba"},
  {"sceneId": "S06", "cueId": "S06-C02", "evento": "comunicacion", "palabra": "comunicarse conmigo"},
  {"sceneId": "S06", "cueId": "S06-C02", "evento": "limite", "palabra": "antes de buscar"},
  {"sceneId": "S07", "cueId": "S07-C01", "evento": "parametros", "palabra": "Mis parámetros CMOS"},
  {"sceneId": "S07", "cueId": "S07-C01", "evento": "configuracion", "palabra": "configuración de arranque"},
  {"sceneId": "S07", "cueId": "S07-C01", "evento": "disquetera", "palabra": "primero la disquetera"},
  {"sceneId": "S07", "cueId": "S07-C01", "evento": "ide", "palabra": "después el disco IDE"},
  {"sceneId": "S07", "cueId": "S07-C02", "evento": "sinDisquete", "palabra": "no hay un disquete arrancable"},
  {"sceneId": "S07", "cueId": "S07-C02", "evento": "selecciona", "palabra": "selecciona el disco"},
  {"sceneId": "S07", "cueId": "S07-C02", "evento": "activa", "palabra": "activa la rutina de inicio"},
  {"sceneId": "S07", "cueId": "S07-C02", "evento": "int19", "palabra": "diecinueve hexadecimal"},
  {"sceneId": "S08", "cueId": "S08-C01", "evento": "servicio", "palabra": "utilizo servicios"},
  {"sceneId": "S08", "cueId": "S08-C01", "evento": "int13", "palabra": "trece hexadecimal"},
  {"sceneId": "S08", "cueId": "S08-C01", "evento": "identifica", "palabra": "Identifico el primer disco duro"},
  {"sceneId": "S08", "cueId": "S08-C01", "evento": "dl80", "palabra": "ochenta hexadecimal"},
  {"sceneId": "S08", "cueId": "S08-C01", "evento": "lee", "palabra": "leo su sector inicial"},
  {"sceneId": "S08", "cueId": "S08-C01", "evento": "bytes512", "palabra": "quinientos doce bytes"},
  {"sceneId": "S08", "cueId": "S08-C01", "evento": "coloca", "palabra": "Coloco esos bytes"},
  {"sceneId": "S08", "cueId": "S08-C01", "evento": "direccion", "palabra": "siete C cero cero hexadecimal"},
  {"sceneId": "S08", "cueId": "S08-C01", "evento": "prepara", "palabra": "preparar su ejecución"},
  {"sceneId": "S09", "cueId": "S09-C01", "evento": "presenta", "palabra": "Soy Mebre"},
  {"sceneId": "S09", "cueId": "S09-C01", "evento": "bytes", "palabra": "quinientos doce bytes"},
  {"sceneId": "S09", "cueId": "S09-C01", "evento": "codigo", "palabra": "área de código"},
  {"sceneId": "S09", "cueId": "S09-C01", "evento": "tabla", "palabra": "cuatro entradas de partición"},
  {"sceneId": "S09", "cueId": "S09-C01", "evento": "firma", "palabra": "firma final"},
  {"sceneId": "S09", "cueId": "S09-C01", "evento": "valor", "palabra": "cincuenta y cinco, A A"},
  {"sceneId": "S09", "cueId": "S09-C01", "evento": "ejecutable", "palabra": "área ejecutable"},
  {"sceneId": "S09", "cueId": "S09-C01", "evento": "stage1", "palabra": "primera etapa de GRUB"},
  {"sceneId": "S09", "cueId": "S09-C01", "evento": "control", "palabra": "recibe el control"},
  {"sceneId": "S09", "cueId": "S09-C01", "evento": "lectura", "palabra": "termina la lectura BIOS"},
  {"sceneId": "S10", "cueId": "S10-C01", "evento": "presenta", "palabra": "Soy Grubi"},
  {"sceneId": "S10", "cueId": "S10-C01", "evento": "stage1", "palabra": "instalada en el MBR"},
  {"sceneId": "S10", "cueId": "S10-C01", "evento": "localiza", "palabra": "localiza una etapa intermedia"},
  {"sceneId": "S10", "cueId": "S10-C01", "evento": "s15", "palabra": "Stage uno punto cinco"},
  {"sceneId": "S10", "cueId": "S10-C01", "evento": "ext2", "palabra": "sistema de archivos ext dos"},
  {"sceneId": "S10", "cueId": "S10-C01", "evento": "s2", "palabra": "hacia Stage dos"},
  {"sceneId": "S10", "cueId": "S10-C01", "evento": "config", "palabra": "leo mi configuración"},
  {"sceneId": "S10", "cueId": "S10-C01", "evento": "kernel", "palabra": "selecciono el núcleo"},
  {"sceneId": "S11", "cueId": "S11-C01", "evento": "cargo", "palabra": "Cargo la imagen del kernel"},
  {"sceneId": "S11", "cueId": "S11-C01", "evento": "ram", "palabra": "hacia RAM"},
  {"sceneId": "S11", "cueId": "S11-C01", "evento": "parametros", "palabra": "parámetros de arranque"},
  {"sceneId": "S11", "cueId": "S11-C01", "evento": "inicio", "palabra": "código de inicio"},
  {"sceneId": "S11", "cueId": "S11-C01", "evento": "bits32", "palabra": "treinta y dos bits"},
  {"sceneId": "S11", "cueId": "S11-C01", "evento": "protegido", "palabra": "modo protegido"},
  {"sceneId": "S11", "cueId": "S11-C01", "evento": "cedo", "palabra": "cedo el control"},
  {"sceneId": "S11", "cueId": "S11-C01", "evento": "entrada", "palabra": "punto de entrada"},
  {"sceneId": "S11", "cueId": "S11-C01", "evento": "protocolo", "palabra": "protocolo Linux"},
  {"sceneId": "S12", "cueId": "S12-C01", "evento": "presenta", "palabra": "Soy Núcleo"},
  {"sceneId": "S12", "cueId": "S12-C01", "evento": "memoria", "palabra": "memoria"},
  {"sceneId": "S12", "cueId": "S12-C01", "evento": "interrupciones", "palabra": "interrupciones"},
  {"sceneId": "S12", "cueId": "S12-C01", "evento": "controladores", "palabra": "controladores"},
  {"sceneId": "S12", "cueId": "S12-C01", "evento": "raiz", "palabra": "monto el sistema de archivos raíz"},
  {"sceneId": "S12", "cueId": "S12-C02", "evento": "init", "palabra": "Yo soy Init"},
  {"sceneId": "S12", "cueId": "S12-C02", "evento": "pid1", "palabra": "PID uno"},
  {"sceneId": "S12", "cueId": "S12-C02", "evento": "bios", "palabra": "El BIOS completó su misión"},
  {"sceneId": "S12", "cueId": "S12-C02", "evento": "funcionar", "palabra": "comenzó a funcionar"},
] as const;
