import type {MASCOTAS} from "../mascotas/catalogo.ts";
import {FPS, STORYBOARD, type EscenaId} from "./tiempo.ts";

type CodigoMascota = (typeof MASCOTAS)[number]["codigo"];
type ValorContrato = string | number | boolean | null | readonly ValorContrato[] | {[clave: string]: ValorContrato};

/** §12.1: intervalo global en segundos; datos audiovisuales, no estructuras del BIOS. */
export type ContratoEscena = {
  id: EscenaId;
  nombre: string;
  duracionSegundos: number;
  intervalo: {inicio: number; fin: number};
  personajes: readonly CodigoMascota[];
  /** Elenco que actúa sin voz propia; el resto debe aparecer en los cues en el mismo orden. */
  personajesSinVoz?: readonly CodigoMascota[];
  requisitos: readonly `RF-${number}`[];
  prerrequisitos: readonly string[];
  entrada: {[clave: string]: ValorContrato};
  operacion: {[clave: string]: ValorContrato};
  salida: {[clave: string]: ValorContrato};
  verificaciones: readonly string[];
  siguienteEscena: EscenaId | null;
  estado: "implementada" | "contrato";
};

/** §6.1: niveles lógicos, sin asignarles voltajes universales. */
export const SENALES_ALIMENTACION = {
  "PS_ON#": {
    1: "No se solicita el encendido de las salidas principales.",
    0: "La placa solicita su activación.",
    activaEnBajo: true,
  },
  "PWR_OK": {
    0: "La fuente todavía no confirma las condiciones eléctricas requeridas.",
    1: "La fuente informa que las condiciones eléctricas son satisfactorias.",
  },
} as const;

/**
 * «implementada» identifica los contratos de datos S01/S02 pedidos para este
 * lote. No afirma que existan componentes React, voces ni escenas renderizadas.
 * S01 presenta la cadena de energía; S02 detalla la solicitud que habilita A05.
 */
function tiempoContrato(id: EscenaId) {
  const escena = STORYBOARD.find(e => e.id === id)!;
  return {duracionSegundos: Math.round((escena.finSegundos - escena.inicioSegundos) * FPS) / FPS, intervalo: {inicio: escena.inicioSegundos, fin: escena.finSegundos}};
}

export const ESCENAS = [
  {
    id: "S01",
    nombre: "Alimentación inicial",
    ...tiempoContrato("S01"),
    personajes: ["M01"],
    requisitos: ["RF-01", "RF-02", "RF-03", "RF-14", "RF-23", "RF-24", "RF-25"],
    prerrequisitos: ["La fuente ATX recibe corriente alterna (A01)"],
    entrada: {energia: "AC", solicitudSalidasPrincipales: "Condicionada a PS_ON# = 0 por la placa; detalle en S02"},
    operacion: {
      pasos: ["A01: recepción de energía AC", "A02: establecimiento de +5VSB", "A05: habilitación y estabilización de tensiones principales tras la solicitud de la placa", "A06: PWR_OK = 1 solo con condiciones eléctricas satisfactorias"],
      cadena: "AC → +5VSB → alimentación principal → PWR_OK",
    },
    salida: {energiaEspera: "+5VSB", alimentacionPrincipal: "Estable tras solicitud válida", confirmacion: "PWR_OK = 1"},
    verificaciones: ["+5VSB alimenta la lógica de encendido", "Sin solicitud de placa no se activan las salidas principales", "PWR_OK = 0 si falta confirmación eléctrica; no se libera el inicio de CPU", "PWR_OK = 1 confirma las condiciones eléctricas"],
    siguienteEscena: "S02",
    estado: "implementada",
  },
  {
    id: "S02",
    nombre: "Control de encendido",
    ...tiempoContrato("S02"),
    personajes: ["M02", "M03"],
    requisitos: ["RF-01", "RF-02", "RF-03", "RF-04", "RF-05", "RF-14", "RF-23", "RF-24", "RF-25"],
    prerrequisitos: ["AC recibida y +5VSB disponible para la lógica de encendido"],
    entrada: {pulsacion: "Botón frontal detectado por circuitos de placa", psOnInicial: 1, pwrOkInicial: 0, reinicio: "CPU retenida en RESET"},
    operacion: {
      pasos: ["A03: pulsación solicita iniciar", "A04: la placa lleva PS_ON# a 0 (activa en nivel bajo)", "A05: la fuente habilita y estabiliza las tensiones principales", "A06: la fuente establece PWR_OK = 1", "A07: se completan las condiciones de reloj, alimentación y reinicio; liberación de RESET"],
      psOn: "1 = no solicita; 0 = solicita activación de salidas principales",
      pwrOk: "0 = sin confirmación eléctrica; 1 = condiciones eléctricas satisfactorias",
    },
    salida: {psOn: 0, pwrOk: 1, reinicio: "RESET liberado al completar las condiciones necesarias"},
    verificaciones: ["PS_ON# es activa en bajo", "El botón solicita; la lógica de placa coordina el encendido", "PWR_OK = 0 impide continuar hacia el inicio de CPU", "PWR_OK = 1 es necesario; también se completan reloj y reinicio"],
    siguienteEscena: "S03",
    estado: "implementada",
  },
  {
    id: "S03",
    nombre: "Primera instrucción",
    ...tiempoContrato("S03"),
    personajes: ["M04"],
    requisitos: ["RF-04", "RF-05", "RF-14", "RF-23", "RF-25"],
    prerrequisitos: ["Condiciones de reloj, alimentación y reinicio completadas en S02", "Región de firmware accesible gracias al hardware"],
    entrada: {procesador: "Intel Pentium II x86 de 32 bits", estado: "Estado arquitectónico de reinicio"},
    operacion: {
      paso: "A08: obtención de la primera instrucción",
      baseCS: "0xFFFF0000",
      eip: "0x0000FFF0",
      direccionFisica: "0xFFFFFFF0",
      binario: "11111111 11111111 11111111 11110000",
      calculo: "CS.BASE + EIP; la base oculta de CS tiene una condición especial tras el reinicio",
      advertencia: "NO es CS × 16 + IP aplicado a los valores visibles de los registros",
    },
    salida: {instruccion: "Código inicial del BIOS en la región de firmware", procesosLinux: "Todavía no existe ningún proceso Linux"},
    verificaciones: ["0xFFFF0000 + 0x0000FFF0 = 0xFFFFFFF0", "Hexadecimal y binario visibles durante el diálogo correspondiente (§9.3)", "La CPU obtiene instrucciones del firmware; el chipset facilita la respuesta de esa región"],
    siguienteEscena: "S04",
    estado: "implementada",
  },
  {
    id: "S04", nombre: "BIOS, flash y CMOS", ...tiempoContrato("S04"), personajes: ["M05", "M06", "M07"],
    requisitos: ["RF-06", "RF-07", "RF-08", "RF-14", "RF-23", "RF-25"],
    prerrequisitos: ["La CPU ejecuta instrucciones del firmware tras su primera búsqueda"],
    entrada: {flash: "Intel E28F004S5 paralela, 4 Mbit", plataforma: "Intel SE440BX-2"},
    operacion: {capacidadKiB: 512, bloques: 8, bloqueKiB: 64, direcciones: "Desplazamientos internos 0x00000–0x7FFFF; no direcciones físicas CPU", distribucion: "7 Boot Block; 2–6 BIOS principal; 1 tolerancia a fallos (8+8+48 KiB); 0 respaldo", cmos: "256 bytes RTC/CMOS, parámetros y reloj respaldados por batería"},
    salida: {ejecutor: "CPU", programa: "BIOS conservado en flash", configuracion: "CMOS separada del programa BIOS"},
    verificaciones: ["512 = 8 × 64 KiB", "Flash no requiere batería para conservar el programa", "CMOS no almacena el programa BIOS"],
    siguienteEscena: "S05", estado: "implementada",
  },
  {
    id: "S05", nombre: "POST e inicialización de memoria", ...tiempoContrato("S05"), personajes: ["M10", "M08", "M09"],
    requisitos: ["RF-09", "RF-10", "RF-11", "RF-14", "RF-23", "RF-24", "RF-25"],
    prerrequisitos: ["CPU ejecuta el BIOS almacenado en flash", "RTC/CMOS diferenciada del programa BIOS"],
    entrada: {cpu: "Intel Pentium II", memoria: "128 MiB SDRAM PC100; DIMM168 contactos", spd: "EEPROM de características consultada por SMBus"},
    operacion: {pasos: ["B02–B03 POST e identificación CPU", "B04 integridad de regiones BIOS, sin algoritmo numérico inventado", "B05 consulta y consistencia CMOS", "B06 consulta EEPROM SPD por SMBus", "B07 configuración controlador82443BX", "B08 preparación refresco/temporización/acceso", "B09 pruebas de memoria"], checkpoints: "20h prueba refrescoDRAM;28h dimensionaDRAM;2Ch fallo línea dirección", fuentePOST: "Intel721632-001,BIOS4S4EB2X0.86A,tabla66pp83–84", ejemploRAM: "0x00001000:10100101=0xA5=165; didáctico, no contenidoSPD"},
    salida: {principal: "SDRAM preparada y pruebas exitosas, permite continuar", alternativa: "Caso didáctico independiente de fallo crítico en línea de dirección:2Ch,POST detenido"},
    verificaciones: ["POST son rutinas BIOS ejecutadas por CPU", "CMOS se consulta antes de SPD", "Datos SPD preceden configurar controlador e inicializar RAM", "20h y28h son checkpoints, no errores incondicionales", "2Ch no es fallo de bit de datos", "Alternativa detenida no altera placa del caso exitoso"],
    siguienteEscena: "S06", estado: "implementada",
  },
  {
    id:"S06",nombre:"Inicialización de dispositivos y servicios",...tiempoContrato("S06"),personajes:["M06","M11"],requisitos:["RF-12","RF-13","RF-14","RF-23","RF-25"],
    prerrequisitos:["SDRAM configurada y disponible; pruebas de S05 exitosas", "CPU ejecuta BIOS"],
    entrada:{memoria:"SDRAM ya inicializada",programa:"BIOS ejecutado por CPU"},
    operacion:{pasos:["B10 preparar servicios de interrupción", "B11 inicializar adaptador gráfico y video", "B12 inicializar teclado PS/2", "B13 inicializar controlador IDE/ATA y detectar disco", "B14 preparar servicios BIOS y datos de funcionamiento"],ivt:{inicio:"0x00000",fin:"0x003FF",entradas:256,bytesEntrada:4,desplazamientoBytes:2,segmentoBytes:2},bda:{inicio:"0x00400",fin:"0x004FF",bytes:256},alcance:"Esquema parcial de datos/punteros, no direcciones de manejadores ni contenido inventado"},
    salida:{memoria:"IVT y BDA en la misma SDRAM",dispositivos:"video/teclado/IDE disponibles y disco responde",limite:"No selección de arranque ni lectura de MBR/sector todavía"},
    verificaciones:["256×4=1024B, regiones contiguas en RAM", "BIOS sigue ejecutándose en CPU", "VGA pertenece a tarjeta AGP; teclado va a PS/2 trasero", "IDE/ATA confirma comunicación antes de buscar SO"],siguienteEscena:"S07",estado:"implementada",
  },
  {
    id:"S07",nombre:"Selección del dispositivo de arranque",...tiempoContrato("S07"),personajes:["M07","M06"],requisitos:["RF-15","RF-16","RF-23","RF-25"],
    prerrequisitos:["RAM, servicios BIOS y periféricos disponibles tras S06", "Disco IDE identificado y comunicación confirmada", "CPU ejecuta BIOS"],
    entrada:{configuracion:"Parámetros de arranque conservados en CMOS (RTC/CMOS)",orden:["Disquetera","Disco IDE"],disquete:"Ninguno arrancable en la unidad"},
    operacion:{pasos:["C01 consultar el orden de arranque configurado", "C02 intentar la disquetera y continuar con el primer disco IDE", "C03 activar la rutina de bootstrap representada por INT 19h"],int19h:"Rutina de inicio (bootstrap); no es el servicio que lee el sector",alcance:"Orden predeterminado de la placa de referencia; sin fallo físico del disco"},
    salida:{dispositivo:"Primer disco duro IDE seleccionado",bootstrap:"Rutina INT 19h activa y lista para leer",limite:"Ningún sector leído ni ejecutándose; sin GRUB, MBR, núcleo ni procesos"},
    verificaciones:["CMOS aporta parámetros, no el programa BIOS", "Orden disquetera → disco IDE", "La disquetera responde sin disquete arrancable", "INT 19h representa la rutina bootstrap, INT 13h llega en S08"],siguienteEscena:"S08",estado:"implementada",
  },
  {
    id:"S08",nombre:"Lectura del primer sector",...tiempoContrato("S08"),personajes:["M06","M11"],personajesSinVoz:["M11"],requisitos:["RF-16","RF-17","RF-18","RF-23","RF-24","RF-25"],
    prerrequisitos:["POST completado", "Disco IDE detectado", "Dispositivo de arranque seleccionado en S07"],
    entrada:{dispositivoBIOS:"0x80",sector:0},
    operacion:{servicio:"INT 13h",funcion:"Lectura de sector",cantidadBytes:512,pasos:["C04 solicitar el servicio de disco INT 13h", "C05 leer el sector lógico 0 del primer disco (DL=0x80)", "C06 transferir los 512 bytes a RAM física 0x7C00–0x7DFF"],ejemploCHS:{AH:"0x02",AL:"0x01",CH:"0x00",CL:"0x01",DH:"0x00",DL:"0x80",ESBX:"0000:7C00",nota:"Cilindro 0, cabeza 0, sector 1 = sector lógico 0; ejemplo didáctico"},alternativa:"Sector no arrancable: el BIOS no entrega el control y no se llega a GRUB; se retoma la lectura exitosa"},
    salida:{destinoRAM:"0x7C00",rango:"0x7C00–0x7DFF",segmentoDesplazamiento:"0000:7C00",bytes:512,contenido:"Sector inicial (MBR) cargado, todavía sin ejecutar",limite:"La ejecución y transferencia de control pertenecen a S09"},
    verificaciones:["Lectura satisfactoria", "0x7C00 + 512 − 1 = 0x7DFF", "El disco responde a la solicitud; el BIOS coloca los bytes en RAM", "El BIOS sigue ejecutándose durante la lectura", "Sin análisis 446+64+2 ni VBR en S08"],siguienteEscena:"S09",estado:"implementada",
  },
  {
    id:"S09",nombre:"Estructura y ejecución del MBR",...tiempoContrato("S09"),personajes:["M12"],requisitos:["RF-14","RF-18","RF-19","RF-23","RF-25"],
    prerrequisitos:["512 bytes del sector lógico 0 cargados en 0x7C00–0x7DFF por S08", "BIOS todavía en ejecución, sin transferir el control"],
    entrada:{sector:"MBR completo en RAM física 0x7C00",bytes:512},
    operacion:{estructura:{codigo:{desde:"0x000",hasta:"0x1BD",bytes:446},particiones:{desde:"0x1BE",hasta:"0x1FD",bytes:64,entradas:4,bytesEntrada:16},firma:{desde:"0x1FE",hasta:"0x1FF",bytes:2,valores:["0x55","0xAA"],binario:["01010101","10101010"],palabraLittleEndian:"0xAA55"}},pasos:["C07 la lectura terminó y el sector conserva la firma 55 AA", "C08 el BIOS entrega el control al código del MBR, no a la tabla de particiones", "C09 el área ejecutable contiene GRUB Stage 1"],alcance:"La firma no acredita un sistema operativo válido; sin VBR intermedio (§10.2)"},
    salida:{ejecucion:"CPU ejecuta GRUB Stage 1 desde 0x7C00",limite:"Stage 1 todavía no carga Stage 1.5 (S10)"},
    verificaciones:["446 + 64 + 2 = 512", "4 × 16 = 64", "0x55 = 01010101, 0xAA = 10101010, palabra little-endian 0xAA55", "El control va al código, no a la tabla", "MBR es un sector y su contenido, no un dispositivo"],siguienteEscena:"S10",estado:"implementada",
  },
  {
    id:"S10",nombre:"Ejecución de GRUB Legacy",...tiempoContrato("S10"),personajes:["M13"],requisitos:["RF-14","RF-19","RF-23","RF-25"],
    prerrequisitos:["GRUB Stage 1 recibió el control en S09", "Disco IDE y servicios BIOS disponibles"],
    entrada:{stage1:"MBR (sector lógico 0)",disco:"Primer disco IDE (hd0)"},
    operacion:{etapas:[{nombre:"Stage 1",ubicacion:"MBR",accion:"Localiza Stage 1.5 con información instalada previamente"},{nombre:"Stage 1.5",archivo:"e2fs_stage1_5",ubicacion:"Espacio de inserción posterior al MBR",accion:"Interpreta ext2 y localiza Stage 2"},{nombre:"Stage 2",ubicacion:"Partición ext2 (/boot/grub/stage2)",accion:"Lee /boot/grub/menu.lst y selecciona el núcleo"}],configuracion:{archivo:"/boot/grub/menu.lst",lineas:["title Linux 2.6","root (hd0,0)","kernel /boot/vmlinuz root=/dev/hda1"]},alcance:"Stage 1.5 forma parte de esta instalación, no es universal; sin GRUB 2 ni initrd"},
    salida:{seleccion:"Núcleo Linux /boot/vmlinuz seleccionado en la partición ext2",limite:"Sin cargar ni transferir al núcleo todavía (S11) y sin procesos Linux"},
    verificaciones:["Orden Stage 1 → Stage 1.5 → Stage 2", "Stage 1.5 en el espacio de inserción, Stage 2/configuración/núcleo en ext2", "Cada etapa la ejecuta la CPU", "Ningún núcleo activo"],siguienteEscena:"S11",estado:"implementada",
  },
  {
    id:"S11",nombre:"Transferencia al núcleo",...tiempoContrato("S11"),personajes:["M13"],requisitos:["RF-14","RF-20","RF-21","RF-23","RF-25"],
    prerrequisitos:["Stage 2 seleccionó /boot/vmlinuz en S10", "Stage 2 en ejecución en RAM"],
    entrada:{nucleo:"/boot/vmlinuz en la partición ext2 (hd0,0)",lineaOrdenes:"root=/dev/hda1"},
    operacion:{pasos:["D01 localizar el archivo del núcleo", "D02 leer la imagen desde el disco", "D03 colocar imagen e información de arranque en RAM", "D04 suministrar línea de órdenes y mapa de memoria", "D05 preparar el entorno de 32 bits: GDT, segmentos y CR0.PE", "D06 ejecutar el punto de entrada del protocolo Linux/x86"],cabecera:{firma:"HdrS",hex:["0x48","0x64","0x72","0x53"]},estructuras:["setup_header","boot_params","mapa de memoria"],cr0:{registro:"CR0",bit:0,nombre:"PE",antes:0,despues:1,paginacion:"deshabilitada en la entrada de 32 bits"},alcance:"PE=1 no es por sí solo toda la transición; la preparación depende de la ruta (cargador o código inicial del núcleo); sin direcciones de entrada inventadas"},
    salida:{ejecucion:"CPU en el punto de entrada de 32 bits de Linux",limite:"Kernel sin inicializar subsistemas ni PID 1 todavía (S12)"},
    verificaciones:["Cargar, preparar y entrar son hechos distintos", "HdrS = 48 64 72 53 identifica la cabecera, no es una dirección", "CR0 bit 0 = PE: 0 → 1", "Modo protegido requiere también GDT/segmentos", "Paginación deshabilitada en la entrada"],siguienteEscena:"S12",estado:"implementada",
  },
  {
    id:"S12",nombre:"Inicio del sistema operativo",...tiempoContrato("S12"),personajes:["M14","M15"],requisitos:["RF-22","RF-23","RF-25"],
    prerrequisitos:["S11 entregó la CPU al punto de entrada de Linux"],
    entrada:{nucleo:"Linux 2.6 con controladores IDE y ext2 integrados",raiz:"/dev/hda1 (ext2)"},
    operacion:{pasos:["D07 inicializar memoria, interrupciones y controladores", "D08 montar el sistema de archivos raíz", "D09 ejecutar /sbin/init como PID 1"],alcance:"Sin initrd adicional ni systemd/initramfs; el BIOS deja de dirigir la secuencia, no desaparece físicamente (§10.3)"},
    salida:{proceso:"/sbin/init en ejecución como PID 1",estado:"Sistema operativo en funcionamiento"},
    verificaciones:["Init solo después de montar la raíz", "El kernel crea PID 1, no el BIOS", "El hardware y el BIOS permanecen, sin dirigir"],siguienteEscena:null,estado:"implementada",
  },
] as const satisfies readonly ContratoEscena[];
