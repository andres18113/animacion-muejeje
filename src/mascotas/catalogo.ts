/**
 * Línea base SO-ARR-BIOS-001 v2.0.0
 * H01: catálogo de las 15 mascotas. Solo tecnología BIOS heredada.
 * Los textos definen el rol; la representación visual es didáctica.
 */
export type CategoriaMascota = "hardware" | "firmware" | "datos" | "software";

export type ExpresionMascota = "neutral" | "hablando" | "alerta";

export interface DefinicionMascota {
  readonly id: string;
  readonly codigo: string;
  readonly nombre: string;
  readonly categoria: CategoriaMascota;
  readonly componente: string;
  readonly funcion: string;
  readonly acento: string;
}

export const MASCOTAS = [
  {
    id: "voltio",
    codigo: "M01",
    nombre: "Voltio",
    categoria: "hardware",
    componente: "Fuente ATX",
    funcion: "Alimentación, +5VSB, PS_ON# y PWR_OK",
    acento: "#86AFBD",
  },
  {
    id: "pulso",
    codigo: "M02",
    nombre: "Pulso",
    categoria: "hardware",
    componente: "Botón de encendido",
    funcion: "Solicitud de encendido de la placa base",
    acento: "#EB8F6E",
  },
  {
    id: "secu",
    codigo: "M03",
    nombre: "Secu",
    categoria: "hardware",
    componente: "Lógica de placa base",
    funcion: "Control de alimentación y liberación de RESET",
    acento: "#74AE9F",
  },
  {
    id: "cipu",
    codigo: "M04",
    nombre: "Cipu",
    categoria: "hardware",
    componente: "Pentium II x86",
    funcion: "Obtención y ejecución de instrucciones",
    acento: "#90A7C4",
  },
  {
    id: "romi",
    codigo: "M05",
    nombre: "Romi",
    categoria: "hardware",
    componente: "Flash paralela BIOS",
    funcion: "512 KiB; ocho bloques de 64 KiB",
    acento: "#8E99AD",
  },
  {
    id: "bios",
    codigo: "M06",
    nombre: "Bios",
    categoria: "firmware",
    componente: "Firmware BIOS",
    funcion: "Código de arranque, rutinas y servicios BIOS",
    acento: "#A49BD9",
  },
  {
    id: "cmosi",
    codigo: "M07",
    nombre: "Cmosi",
    categoria: "datos",
    componente: "CMOS / RTC",
    funcion: "Memoria respaldada por batería, configuración",
    acento: "#D8B577",
  },
  {
    id: "spedi",
    codigo: "M08",
    nombre: "Spedi",
    categoria: "datos",
    componente: "EEPROM SPD",
    funcion: "Características del módulo SDRAM",
    acento: "#E5BE71",
  },
  {
    id: "rami",
    codigo: "M09",
    nombre: "Rami",
    categoria: "hardware",
    componente: "SDRAM PC100",
    funcion: "128 MiB de memoria temporal (línea base)",
    acento: "#72B5A0",
  },
  {
    id: "postin",
    codigo: "M10",
    nombre: "Postín",
    categoria: "firmware",
    componente: "Rutinas POST",
    funcion: "Inicialización, comprobaciones y diagnóstico",
    acento: "#D8B88C",
  },
  {
    id: "disqui",
    codigo: "M11",
    nombre: "Disqui",
    categoria: "hardware",
    componente: "Disco IDE / ATA",
    funcion: "Lectura de sectores de 512 bytes",
    acento: "#9DA9BE",
  },
  {
    id: "mebre",
    codigo: "M12",
    nombre: "Mebre",
    categoria: "datos",
    componente: "Sector MBR",
    funcion: "Código inicial, cuatro entradas y firma 55 AA",
    acento: "#E5BA81",
  },
  {
    id: "grubi",
    codigo: "M13",
    nombre: "Grubi",
    categoria: "software",
    componente: "GRUB Legacy",
    funcion: "Stage 1 → Stage 1.5 → Stage 2",
    acento: "#9C9BD1",
  },
  {
    id: "nucleo",
    codigo: "M14",
    nombre: "Núcleo",
    categoria: "software",
    componente: "Kernel Linux",
    funcion: "Toma el control, inicializa subsistemas",
    acento: "#93BDD3",
  },
  {
    id: "init",
    codigo: "M15",
    nombre: "Init",
    categoria: "software",
    componente: "Proceso PID 1",
    funcion: "Primer proceso del espacio de usuario",
    acento: "#A5CB96",
  },
 ] as const satisfies readonly DefinicionMascota[];

export type MascotaId = (typeof MASCOTAS)[number]["id"];

export function obtenerMascota(id: MascotaId) {
  return MASCOTAS.find((mascota) => mascota.id === id)!;
}
