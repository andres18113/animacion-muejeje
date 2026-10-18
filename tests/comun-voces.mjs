import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {VOCES_GENERADAS, ALINEACIONES_GENERADAS, CARACTERES_GENERADOS} from "../src/arranque/voces.generado.ts";
import {rutaVoz, rutaAlineacion, rutaCaracteres, resolverVoz} from "../src/arranque/audio.ts";
import {REPARTO_VOCES} from "../src/arranque/voces.ts";
import {mapearPalabras, normalizar, validarCaracteres, hashVoz} from "../scripts/voces-comun.mjs";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export function validarVozGenerada(cue) {
  const voz = VOCES_GENERADAS[cue.cueId];
  if (!voz) {
    assert.equal(cue.provider, "none");
    assert.equal(cue.assetPath, null);
    assert.equal(cue.alignmentPath, null);
    assert.deepEqual(resolverVoz(cue), {modo: "silencio"});
    return true;
  }
  assert.equal(cue.provider, "elevenlabs");
  assert.equal(voz.assetPath, rutaVoz(cue));
  assert.equal(voz.alignmentPath, rutaAlineacion(cue));
  assert.equal(voz.caracteresPath, rutaCaracteres(cue));
  assert.equal(cue.assetPath, voz.assetPath);
  assert.equal(cue.alignmentPath, voz.alignmentPath);
  for (const ruta of [voz.assetPath, voz.alignmentPath, voz.caracteresPath]) assert.ok(fs.statSync(path.join(raiz, "public", ruta)).size > 0, `${cue.cueId}: archivo local ${ruta}`);
  const leer = ruta => JSON.parse(fs.readFileSync(path.join(raiz, "public", ruta), "utf8"));
  const captions = leer(voz.alignmentPath), caracteres = leer(voz.caracteresPath);
  assert.deepEqual(ALINEACIONES_GENERADAS[voz.alignmentPath], captions);
  assert.deepEqual(CARACTERES_GENERADOS[voz.caracteresPath], caracteres);
  validarCaracteres(cue.speechText, caracteres);
  assert.ok(Number.isFinite(voz.durationMs) && voz.durationMs > 0 && voz.durationMs <= cue.durationFrames * 1000 / 30 - 100);
  const meta = leer(voz.assetPath.replace(/\.mp3$/u, ".meta.json"));
  assert.equal(meta.cueId, cue.cueId); assert.equal(meta.mascotId, cue.mascotId);
  assert.equal(meta.durationMs, voz.durationMs);
  assert.equal(meta.voiceId, REPARTO_VOCES[cue.mascotId].voiceId);
  assert.equal(meta.hash, hashVoz({speechText: cue.speechText, voiceId: meta.voiceId, model: meta.model, settings: meta.settings}));
  assert.deepEqual(captions, mapearPalabras(cue.speechText, cue.displayText, caracteres));
  assert.deepEqual(captions.map(c => c.text.trim()), cue.displayText.split(/\s+/u));
  assert.equal(normalizar(captions.map(c => c.text).join("")), normalizar(cue.displayText));
  let anterior = 0;
  for (const c of captions) {
    assert.ok(c.startMs >= anterior && c.endMs > c.startMs && c.endMs <= voz.durationMs);
    assert.equal(c.timestampMs, null); assert.equal(c.confidence, null);
    anterior = c.endMs;
  }
  assert.ok(caracteres.character_end_times_seconds.every(t => t * 1000 <= voz.durationMs + 1));
  assert.deepEqual(resolverVoz(cue), {modo: "audio", src: voz.assetPath});
  return true;
}
