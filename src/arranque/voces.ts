import type {MascotaId} from "../mascotas/catalogo.ts";

export type AjustesVoz = {stability: number; similarityBoost: number; speed?: number; style?: number};
export type VozReparto = {voiceId: string; nombre: string; publicOwnerId: string | null; ajustes: AjustesVoz};
export const MODELO_TTS = "eleven_v4";
const ajustes = {stability: .5, similarityBoost: .75};

/** Identidades estables de la biblioteca compartida de ElevenLabs (español latinoamericano).
 * 2026-10-18: Voltio, Bios y Disqui pasan a voces más agudas y amigables (F0 mediana 188/178/157 Hz frente a 105/134/82 Hz). */
export const REPARTO_VOCES: Record<MascotaId, VozReparto> = {
  voltio: {voiceId: "p7cwnUviDFhhX9y8sG2Q", nombre: "Sebastian", publicOwnerId: "5eef60c8dd3b53b289bde9bb1a636e292cbde5e2b54e605e013bf710e39936b1", ajustes: {...ajustes}},
  pulso: {voiceId: "WOY6pnQ1WCg0mrOZ54lM", nombre: "Thorthugo", publicOwnerId: "f752db3e53978dcded72e4a905529fe0e9e8b16d3eaff6349e1e8f83fa0afb8a", ajustes: {...ajustes}},
  secu: {voiceId: "HJmys3t5KLr6DUWl0kSe", nombre: "Rada", publicOwnerId: "546431aa1b7704f7c6e0a0e05ab0d1e4cc0591936c66a16e34747bff093917fb", ajustes: {...ajustes}},
  cipu: {voiceId: "tomkxGQGz4b1kE0EM722", nombre: "Mario", publicOwnerId: "027c973dc3f5795166a060701677e1a8542f48d44104dc42fc0325deae59bf17", ajustes: {...ajustes}},
  romi: {voiceId: "2rigMbVWLdqtBSCahJFX", nombre: "Tatiana Martin", publicOwnerId: "e9a6840c69b79812b77ea81fa11d55aaf80dcf1938fa0137bf7f514f67f75c99", ajustes: {...ajustes}},
  // Dan (9F4C8ztpNUmXkdDDbz3J, es-US) se descartó: su acento sonaba a español de España.
  bios: {voiceId: "zsNrTi54AOcO2sUuJpdJ", nombre: "Juan Limón", publicOwnerId: "22147379e00b87caffbf0f8a16c1b5f78333a84abf53c101c950aa746e0e0751", ajustes: {...ajustes}},
  cmosi: {voiceId: "cIBxLwfshLYhRB9lCXEg", nombre: "Carolina", publicOwnerId: "d60dc327339fe004f1ee2d327e904907c167e123e79a586670370f4314003dfe", ajustes: {...ajustes}},
  spedi: {voiceId: "iFhPOZcajR7W3sDL39qJ", nombre: "Blackie", publicOwnerId: "45eaba593a102df1aacaa3651ee99ee7216c7330248e6c6fba970d8143b66db3", ajustes: {...ajustes}},
  rami: {voiceId: "rEVYTKPqwSMhytFPayIb", nombre: "Sandra", publicOwnerId: "82b1c4f7ee1267d77884b20e464fcb78eed54c08210f725c3f319d76bf308c63", ajustes: {...ajustes}},
  postin: {voiceId: "zQZEXxkYK67Wxt8JAph5", nombre: "Nelson", publicOwnerId: "3a9cc4b92dbfa20ff6ffee53bb8dd1bb7a322494f5986e605d6c70de95ef4a48", ajustes: {...ajustes}},
  disqui: {voiceId: "U9TSK9KHMlMU2qkeXlQP", nombre: "Brian", publicOwnerId: "0cd6eb6cd6a1b423d700542a846b19e9c6ce7dd9a36bc74ae15e1f4d89af064d", ajustes: {...ajustes}},
  mebre: {voiceId: "x5IDPSl4ZUbhosMmVFTk", nombre: "Lumina", publicOwnerId: "3ed9c95fe4d7df1c1a2905fa50f907fd5a4cb32b17815fe43a66e21e12432a61", ajustes: {...ajustes}},
  grubi: {voiceId: "htFfPSZGJwjBv1CL0aMD", nombre: "Antonio", publicOwnerId: "b8cf26021a2ac6dc9844a696dd285d45cf08a600b354a29300f25de0ee898f4d", ajustes: {...ajustes}},
  // «El Faraón» (9TcPbUAhHnAV8mzFDAWU) se descartó: su ritmo pausado no cabía en S12-C01 ni a velocidad 1,15.
  nucleo: {voiceId: "gbTn1bmCvNgk0QEAVyfM", nombre: "Enrique M. Nieto", publicOwnerId: "e9a6840c69b79812b77ea81fa11d55aaf80dcf1938fa0137bf7f514f67f75c99", ajustes: {...ajustes}},
  init: {voiceId: "ihKwLOjVUMG4lgUI6meZ", nombre: "Leo", publicOwnerId: "604b5d67b5749541f10763dc143bf1721e3ab6598a068f1a7d885d85b9c6f9f2", ajustes: {...ajustes}},
};

/** Ajustes puntuales; prevalecen sobre --modelo y el reparto. */
export const AJUSTES_CUE: Record<string, {model?: string; speed?: number}> = {
  // Con eleven_v4 Init duraba 11,1 s y dejaba sin tiempo la celebración final de S12 (la escena dura 20 s).
  "S12-C02": {model: "eleven_multilingual_v2", speed: 1.12},
};
