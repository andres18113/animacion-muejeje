import type {MascotaId} from "../mascotas/catalogo.ts";
import type {EscenaId} from "./tiempo.ts";
import {VOCES_GENERADAS} from "./voces.generado.ts";

export type ProveedorVoz = "none" | "recorded" | "elevenlabs";

export type CueDialogo = {
  cueId: string;
  sceneId: EscenaId;
  mascotId: MascotaId;
  displayText: string;
  speechText: string;
  /** Relativo a la escena: moverla en el storyboard no exige reconstruir cues. */
  startFrame: number;
  durationFrames: number;
  /** Opt-in: rampa de entrada/salida labial en frames; sin valor conserva el modelo anterior. */
  rampaLabialFrames?: number;
  provider: ProveedorVoz;
  /** Rutas locales relativas a public; null conserva el modo silencioso. */
  assetPath: string | null;
  alignmentPath: string | null;
};

/** Texto visible literal de §8; la voz local se activa solo desde el registro generado. */
const CUES_BASE: readonly CueDialogo[] = [
  {
    cueId: "S01-C01",
    sceneId: "S01",
    mascotId: "voltio",
    displayText: "Soy Voltio, la fuente ATX. Recibo corriente alterna y proporciono una tensión de espera llamada cinco voltios standby. Cuando la placa me ordena encender, activo mis salidas. Solo al estabilizarse las tensiones comunico que la alimentación es adecuada mediante PWR_OK.",
    speechText: "Soy Voltio, la fuente a te equis. Recibo corriente alterna y proporciono una tensión de espera llamada cinco voltios standby. Cuando la placa me ordena encender, activo mis salidas. Solo al estabilizarse las tensiones comunico que la alimentación es adecuada mediante power ok.",
    startFrame: 10,
    durationFrames: 539,
    provider: "none",
    assetPath: null,
    alignmentPath: null,
  },
  {
    cueId: "S02-C01",
    sceneId: "S02",
    mascotId: "pulso",
    displayText: "Soy Pulso, el botón de encendido. Mi pulsación solicita iniciar el computador.",
    speechText: "Soy Pulso, el botón de encendido. Mi pulsación solicita iniciar el computador.",
    startFrame: 10,
    durationFrames: 164,
    provider: "none",
    assetPath: null,
    alignmentPath: null,
  },
  {
    cueId: "S02-C02",
    sceneId: "S02",
    mascotId: "secu",
    displayText: "Yo soy Secu, la lógica de control de la placa base. Activo PS_ON# con un cero lógico, espero la confirmación eléctrica y coordino la liberación del reinicio del procesador. La CPU no comienza hasta completar esa secuencia.",
    speechText: "Yo soy Secu, la lógica de control de la placa base. Activo pe ese on negada con un cero lógico, espero la confirmación eléctrica y coordino la liberación del reinicio del procesador. La ce pe u no comienza hasta completar esa secuencia.",
    startFrame: 182,
    durationFrames: 450,
    provider: "none",
    assetPath: null,
    alignmentPath: null,
  },
  {
    cueId: "S03-C01",
    sceneId: "S03",
    mascotId: "cipu",
    displayText: "Hola, soy Cipu, el procesador Pentium II. Cuando termina mi reinicio, obtengo mi primera instrucción en la dirección física hexadecimal FFFFFFF0. Esa dirección conduce al código inicial del BIOS. Todavía no existe ningún proceso Linux: en este momento solo ejecuto instrucciones del firmware. El chipset facilita que esa región responda a mi primera búsqueda.",
    // Siete dígitos F seguidos del dígito 0: mismo valor, sin recortar contenido.
    speechText: "Hola, soy Cipu, el procesador Pentium dos. Cuando termina mi reinicio, obtengo mi primera instrucción en la dirección física hexadecimal siete efes, cero. Esa dirección conduce al código inicial del bios. Todavía no existe ningún proceso Linux: en este momento solo ejecuto instrucciones del firmware. El chipset facilita que esa región responda a mi primera búsqueda.",
    startFrame: 10,
    durationFrames: 666,
    provider: "none",
    assetPath: null,
    alignmentPath: null,
  },
  {"cueId": "S04-C01", "sceneId": "S04", "mascotId": "romi", "displayText": "Soy Romi, la memoria flash que almacena el BIOS. Tengo quinientos doce kibibytes organizados en ocho bloques.", "speechText": "Soy Romi, la memoria flash que almacena el bios. Tengo quinientos doce kibibytes organizados en ocho bloques.", "startFrame": 16, "durationFrames": 234, "provider": "none", "assetPath": null, "alignmentPath": null},
  {"cueId": "S04-C02", "sceneId": "S04", "mascotId": "bios", "displayText": "Yo soy Bios, el programa que ejecuta la CPU para preparar el computador.", "speechText": "Yo soy Bios, el programa que ejecuta la ce pe u para preparar el computador.", "startFrame": 260, "durationFrames": 147, "provider": "none", "assetPath": null, "alignmentPath": null},
  {"cueId": "S04-C03", "sceneId": "S04", "mascotId": "cmosi", "displayText": "Y yo soy Cmosi: conservo parámetros de configuración y el reloj mediante memoria respaldada por batería; no almaceno el programa BIOS. Mis datos y el programa de Romi cumplen funciones diferentes.", "speechText": "Y yo soy Cmosi: conservo parámetros de configuración y el reloj mediante memoria respaldada por batería; no almaceno el programa bios. Mis datos y el programa de Romi cumplen funciones diferentes.", "startFrame": 451, "durationFrames": 356, "provider": "none", "assetPath": null, "alignmentPath": null},
  {"cueId": "S05-C01", "sceneId": "S05", "mascotId": "postin", "displayText": "Soy Postín. Durante POST inicializo y compruebo recursos esenciales: procesador, caché, memoria y controladores. Puedo comunicar diagnósticos mediante códigos del puerto ochenta hexadecimal.", "speechText": "Soy Postín. Durante post inicializo y compruebo recursos esenciales: procesador, caché, memoria y controladores. Puedo comunicar diagnósticos mediante códigos del puerto ochenta hexadecimal.", "startFrame": 20, "durationFrames": 407, "provider": "none", "assetPath": null, "alignmentPath": null},
  {"cueId": "S05-C02", "sceneId": "S05", "mascotId": "spedi", "displayText": "Yo soy Spedi, una pequeña EEPROM del módulo de memoria. Entrego datos sobre tamaño y velocidad.", "speechText": "Yo soy Spedi, una pequeña e e prom del módulo de memoria. Entrego datos sobre tamaño y velocidad.", "startFrame": 525, "durationFrames": 231, "provider": "none", "assetPath": null, "alignmentPath": null},
  {"cueId": "S05-C03", "sceneId": "S05", "mascotId": "rami", "displayText": "Y yo soy Rami, la SDRAM: el controlador debe configurarme y verificar que puedo almacenar información. Si falla una comprobación crítica, el arranque puede detenerse.", "speechText": "Y yo soy Rami, la ese de ram: el controlador debe configurarme y verificar que puedo almacenar información. Si falla una comprobación crítica, el arranque puede detenerse.", "startFrame": 857, "durationFrames": 347, "provider": "none", "assetPath": null, "alignmentPath": null},
  {"cueId": "S06-C01", "rampaLabialFrames": 2, "sceneId": "S06", "mascotId": "bios", "displayText": "Ahora preparo los servicios de interrupción y las áreas de datos BIOS en RAM. También inicializo el video, el teclado y el controlador IDE.", "speechText": "Ahora preparo los servicios de interrupción y las áreas de datos bios en ram. También inicializo el video, el teclado y el controlador i de e.", "startFrame": 36, "durationFrames": 263, "provider": "none", "assetPath": null, "alignmentPath": null},
  {"cueId": "S06-C02", "sceneId": "S06", "mascotId": "disqui", "displayText": "Soy Disqui, el disco duro. El BIOS me detecta mediante el controlador ATA y comprueba que puede comunicarse conmigo antes de buscar el sistema operativo.", "speechText": "Soy Disqui, el disco duro. El bios me detecta mediante el controlador ata y comprueba que puede comunicarse conmigo antes de buscar el sistema operativo.", "startFrame": 384, "durationFrames": 272, "provider": "none", "assetPath": null, "alignmentPath": null},
  {"cueId": "S07-C01", "sceneId": "S07", "mascotId": "cmosi", "displayText": "Mis parámetros CMOS ayudan al BIOS a conocer su configuración de arranque. En nuestra computadora se intenta primero la disquetera y después el disco IDE.", "speechText": "Mis parámetros ce mos ayudan al bios a conocer su configuración de arranque. En nuestra computadora se intenta primero la disquetera y después el disco i de e.", "startFrame": 14, "durationFrames": 296, "provider": "none", "assetPath": null, "alignmentPath": null},
  {"cueId": "S07-C02", "sceneId": "S07", "mascotId": "bios", "displayText": "Como no hay un disquete arrancable, el BIOS selecciona el disco y activa la rutina de inicio, representada por la interrupción diecinueve hexadecimal.", "speechText": "Como no hay un disquete arrancable, el bios selecciona el disco y activa la rutina de inicio, representada por la interrupción diecinueve hexadecimal.", "startFrame": 386, "durationFrames": 263, "provider": "none", "assetPath": null, "alignmentPath": null},
  {"cueId": "S08-C01", "sceneId": "S08", "mascotId": "bios", "displayText": "Para leer el disco utilizo servicios de la interrupción trece hexadecimal. Identifico el primer disco duro con el valor ochenta hexadecimal y leo su sector inicial de quinientos doce bytes. Coloco esos bytes en memoria, en la dirección siete C cero cero hexadecimal, para preparar su ejecución.", "speechText": "Para leer el disco utilizo servicios de la interrupción trece hexadecimal. Identifico el primer disco duro con el valor ochenta hexadecimal y leo su sector inicial de quinientos doce bytes. Coloco esos bytes en memoria, en la dirección siete C cero cero hexadecimal, para preparar su ejecución.", "startFrame": 12, "durationFrames": 527, "provider": "none", "assetPath": null, "alignmentPath": null},
  {"cueId": "S09-C01", "sceneId": "S09", "mascotId": "mebre", "displayText": "Soy Mebre, el registro maestro de arranque o MBR. Mis quinientos doce bytes contienen un área de código, una tabla de cuatro entradas de partición y la firma final cincuenta y cinco, A A. En nuestro disco, el área ejecutable contiene la primera etapa de GRUB, que recibe el control cuando termina la lectura BIOS.", "speechText": "Soy Mebre, el registro maestro de arranque o eme be erre. Mis quinientos doce bytes contienen un área de código, una tabla de cuatro entradas de partición y la firma final cincuenta y cinco, A A. En nuestro disco, el área ejecutable contiene la primera etapa de grub, que recibe el control cuando termina la lectura bios.", "startFrame": 20, "durationFrames": 642, "provider": "none", "assetPath": null, "alignmentPath": null},
  {"cueId": "S10-C01", "rampaLabialFrames": 2, "sceneId": "S10", "mascotId": "grubi", "displayText": "Soy Grubi, GRUB Legacy. Mi primera etapa está instalada en el MBR y localiza una etapa intermedia, llamada Stage uno punto cinco. Esta comprende el sistema de archivos ext dos y abre el camino hacia Stage dos. Allí leo mi configuración y selecciono el núcleo de Linux que voy a cargar.", "speechText": "Soy Grubi, grub Legacy. Mi primera etapa está instalada en el eme be erre y localiza una etapa intermedia, llamada Stage uno punto cinco. Esta comprende el sistema de archivos ext dos y abre el camino hacia Stage dos. Allí leo mi configuración y selecciono el núcleo de Linux que voy a cargar.", "startFrame": 24, "durationFrames": 591, "provider": "none", "assetPath": null, "alignmentPath": null},
  {"cueId": "S11-C01", "sceneId": "S11", "mascotId": "grubi", "displayText": "Cargo la imagen del kernel desde el disco hacia RAM y preparo sus parámetros de arranque. El código de inicio establece el entorno necesario para ejecutar instrucciones de treinta y dos bits, incluido el modo protegido. Finalmente cedo el control al punto de entrada previsto por el protocolo Linux.", "speechText": "Cargo la imagen del kernel desde el disco hacia ram y preparo sus parámetros de arranque. El código de inicio establece el entorno necesario para ejecutar instrucciones de treinta y dos bits, incluido el modo protegido. Finalmente cedo el control al punto de entrada previsto por el protocolo Linux.", "startFrame": 14, "durationFrames": 534, "provider": "none", "assetPath": null, "alignmentPath": null},
  {"cueId": "S12-C01", "sceneId": "S12", "mascotId": "nucleo", "displayText": "Soy Núcleo, el kernel Linux. Inicializo memoria, interrupciones y controladores, y monto el sistema de archivos raíz.", "speechText": "Soy Núcleo, el kernel Linux. Inicializo memoria, interrupciones y controladores, y monto el sistema de archivos raíz.", "startFrame": 12, "durationFrames": 243, "provider": "none", "assetPath": null, "alignmentPath": null},
  {"cueId": "S12-C02", "rampaLabialFrames": 2, "sceneId": "S12", "mascotId": "init", "displayText": "Yo soy Init, el primer proceso de usuario, identificado como PID uno. El BIOS completó su misión: el sistema operativo ya comenzó a funcionar.", "speechText": "Yo soy Init, el primer proceso de usuario, identificado como pe i de uno. El bios completó su misión: el sistema operativo ya comenzó a funcionar.", "startFrame": 263, "durationFrames": 302, "provider": "none", "assetPath": null, "alignmentPath": null},
];

export const CUES_DIALOGO: readonly CueDialogo[] = CUES_BASE.map((cue) => {
  const voz = VOCES_GENERADAS[cue.cueId];
  return voz ? {...cue, provider: "elevenlabs", assetPath: voz.assetPath, alignmentPath: voz.alignmentPath} : cue;
});
