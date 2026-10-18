# Local voices with ElevenLabs

Generation takes place outside Remotion using the installed and authenticated `elevenlabs` CLI (1.6.1). Node 24 runs the scripts and pure TypeScript modules; no SDK or other dependency is needed. Scripts do not read, print, or save keys. Remotion consumes only local files and static data. The initial registry is empty: without an approved take, each cue retains `provider: "none"` and null paths.

## Cast and configuration

`src/arranque/voces.ts` fixes the fifteen identities. Complete each `publicOwnerId` there with the public owner identifier of the shared voice; it is not a credential. It cannot be inferred from the voice ID. Check the actual syntax on the host with `elevenlabs voices share --help`: the script also queries that help before adding and accepts `--new-name` or `--name` according to the installed version.

| Mascot | Voice | Voice ID |
|---|---|---|
| voltio | Sebastian | p7cwnUviDFhhX9y8sG2Q |
| pulso | Thorthugo | WOY6pnQ1WCg0mrOZ54lM |
| secu | Rada | HJmys3t5KLr6DUWl0kSe |
| cipu | Mario | tomkxGQGz4b1kE0EM722 |
| romi | Tatiana Martin | 2rigMbVWLdqtBSCahJFX |
| bios | Juan Limón | zsNrTi54AOcO2sUuJpdJ |
| cmosi | Carolina | cIBxLwfshLYhRB9lCXEg |
| spedi | Blackie | iFhPOZcajR7W3sDL39qJ |
| rami | Sandra | rEVYTKPqwSMhytFPayIb |
| postin | Nelson | zQZEXxkYK67Wxt8JAph5 |
| disqui | Brian | U9TSK9KHMlMU2qkeXlQP |
| mebre | Lumina | x5IDPSl4ZUbhosMmVFTk |
| grubi | Antonio | htFfPSZGJwjBv1CL0aMD |
| nucleo | Enrique M. Nieto | gbTn1bmCvNgk0QEAVyfM |
| init | Leo | ihKwLOjVUMG4lgUI6meZ |

Default model: `eleven_v4`; stability 0.5, similarity 0.75. V4 receives only those two settings. To speed up a take, choose `--modelo eleven_v3` or `eleven_multilingual_v2`; they support `speed` from 0.7 to 1.2 and `style` if configured in the cast. `AJUSTES_CUE`, initially empty, allows `{model, speed}` per cue and overrides `--modelo`. For example: `"S03-C01": {model: "eleven_v3", speed: 1.1}`. V4 omits speed/style even if they appear in the configuration.

`displayText` retains the script literally; `speechText` contains pronunciations. In S04–S12, only these substitutions are made: BIOS→bios, CPU→ce pe u, POST→post, EEPROM→e e prom, SDRAM→ese de ram, RAM→ram, IDE→i de e, ATA→ata, CMOS→ce mos, MBR→eme be erre, GRUB→grub, and PID→pe i de. S08 and S12-C01 require no changes. Stage, ext dos, proper names, and all other words remain the same.

## Work order on the host

Run from the `arranque-so` root. Starter has 40,000 monthly characters, ten slots, and up to 65 monthly additions/edits. The example needs at most fifteen additions if none of the cast's voices were already added. `--estado` reports actual usage; other account voices may require splitting batches into smaller groups. The script deletes only cast IDs and never removes unrelated voices to make space.

First review the account and complete public owners in `voces.ts`:

```powershell
node scripts/voces-biblioteca.mjs --estado
elevenlabs voices share --help
node scripts/voces-biblioteca.mjs --agregar voltio,pulso,secu,cipu,romi,bios,cmosi --dry-run
node scripts/voces-biblioteca.mjs --agregar voltio,pulso,secu,cipu,romi,bios,cmosi
node scripts/generar-voces.mjs --escena S01,S02,S03,S04 --dry-run
node scripts/generar-voces.mjs --escena S01,S02,S03,S04
node scripts/generar-voces.mjs --escena S01,S02,S03,S04 --verificar
```

The second run with `--verificar` uses cached MP3s: it performs STT without repeating TTS. Listen to the takes and review their `.stt.json`. Then release the five voices that do not return and add the remaining eight (Bios and Cmosi are retained):

```powershell
node scripts/voces-biblioteca.mjs --quitar voltio,pulso,secu,cipu,romi
node scripts/voces-biblioteca.mjs --estado
node scripts/voces-biblioteca.mjs --agregar postin,spedi,rami,disqui,mebre,grubi,nucleo,init
node scripts/generar-voces.mjs --escena S05,S06,S07,S08,S09,S10,S11,S12 --dry-run
node scripts/generar-voces.mjs --escena S05,S06,S07,S08,S09,S10,S11,S12
node scripts/generar-voces.mjs --escena S05,S06,S07,S08,S09,S10,S11,S12 --verificar
node scripts/voces-biblioteca.mjs --quitar bios,cmosi,postin,spedi,rami,disqui,mebre,grubi,nucleo,init
```

Do not remove a voice until its takes have been accepted or its failures resolved. If generation returns FAIL for duration, the process finishes with code 1: adjust model/speed, preview again, and regenerate only that take. Example:

```powershell
node scripts/generar-voces.mjs --cue S03-C01 --modelo eleven_v3 --forzar --dry-run
node scripts/generar-voces.mjs --cue S03-C01 --modelo eleven_v3 --forzar --verificar
```

The first complete dry-run without cache totals 3,872 characters, excluding retries. Scripts query the subscription before generating/verifying and reject a batch if `character_count + chars_needed > character_limit - 2000`. STT has its own service usage; the character reserve does not certify STT quota. The generator does not add voices: if one is missing, it stops before TTS and refers to `voces-biblioteca.mjs`.

`--escena` accepts commas or repetition (`--escena S04 --escena S05`); `--cue` selects one take; `--todo` selects all twenty. These alternatives are mutually exclusive. `--dry-run` does not run the CLI, query the subscription, measure audio, or write files: it only calculates the plan and checks local cache. For the library, it shows planned commands with placeholders for missing owners; presence, slots, and flags are checked during actual execution.

## Files, cache, and duration

For each cue, `rutaVoz(cue)` fixes the MP3 under `public/`, for example `voces/s04/s04-c01-romi.mp3`. The following are written alongside it:

- `.caracteres.json`: original `speechText` alignment, relative to the audio/cue start. Text, lengths, finite times, and non-overlapping order are validated.
- `.alineacion.json`: one Caption per visible word, with leading space, `timestampMs: null`, and `confidence: null`. Mapping aligns normalized tokens; expansions are grouped: “siete efes, cero” occupies the FFFFFFF0 interval, and “ese de ram” the SDRAM interval. It does not distribute words by length. It preserves silences between units; an expansion uses its group's complete interval. An unknown textual difference produces FAIL.
- `.meta.json`: cue/mascot/voice, model, effective settings, SHA-256 hash, characters, duration, ISO date, CLI version, and contract version.
- `.stt.json`, with `--verificar`: Spanish Scribe v1 response and comparison against `speechText` using word-level Levenshtein distance. WER is reported without an automatic threshold; accents, punctuation, and case are normalized. Listening review remains necessary.

The cache uses `{speechText, voiceId, model, settings, version}` with stable key ordering. It requires the MP3, both alignment JSON files, and metadata; it also checks mapping and alignment. `--forzar` overrides cache-based skipping. An overlong take retains its cache to prevent accidental repeat charges: it keeps returning FAIL until explicitly corrected.

Duration comes from `ffprobe` in PATH, if available; otherwise from the last alignment end. That alternative does not measure the MP3's trailing silence: install ffprobe on the host to measure the actual file. If ffprobe is present and fails, the take is rejected. The gate requires `durationMs <= durationFrames * 1000 / 30 - 100`; it never cuts audio or changes the storyboard. Rejected takes retain their complete diagnostic files, which may exceed the window, and do not enter the active registry.

After generation, even if a take fails, `src/arranque/voces.generado.ts` is rebuilt: deterministic ordering, inline alignments, and only complete, current files within the window. The registry allows other valid takes from previous batches to be retained after removing their voices from the account. It contains no timing metadata or credentials. An interruption between writes must not activate an incomplete take. Do not edit it manually.

## Validation and playback

```powershell
node tests/validar-voces.mjs
node tests/validar-h02.mjs
node tests/validar-cine.mjs
3..12 | ForEach-Object { node ("tests/validar-s{0:D2}.mjs" -f $_); if ($LASTEXITCODE -ne 0) { throw "Fallo de escena $_" } }
npx --no-install tsc
npx --no-install eslint src
node scripts/generar-voces.mjs --todo --dry-run
```

`validar-voces` uses simulated responses and temporary folders, without the service. H02 and scene validators check provider/paths, file existence, deep equality with JSON files, visible words, and duration when a generated entry exists; without an entry they require silence. Scene limits, causality, and anchors are retained. Estimation without audio counts expanded acronyms as one visible-text unit in S04–S12; a generated voice is judged by measured duration. Historical S04–S05 lip fingerprints retain the previous text as algorithm-regression input.

`recursos.ts` takes `ALINEACIONES` and `ALINEACIONES_CARACTERES` from the static registry; `cuesDeEscena` shares them with subtitles, anchors, and mouths. `Actor` passes characters to `bocaEnFrame`. The sentence adapter retains the existing visual distribution: review anchors, animation, and listening with real audio before accepting each batch. No component calls the service.

`CapaAudio` checks assets with `getStaticFiles`, resolves each path with `resolverVoz`, and plays using `Html5Audio` within its Sequence. The generator prevents registering voices that the Sequence might truncate. A missing registered file fails validation; the component retains a silent fallback if it is missing locally.

`MUSICA` and `SFX` remain empty. `volumenMusica` uses `MUSICA_PAUSA` 0.22 during pauses, `MUSICA_VOZ` 0.04 during speech, and `RAMPA_MUSICA` of 12 frames (see `src/arranque/audio.ts`). `detectarSolapes` blocks voice/voice and SFX/voice overlaps unless the effect has explicit permission. No dependencies or generation within the render are added.

<a id="producción-real-2026-10-18"></a>

## Real production (2026-10-18)

The 20 voices are generated in `public/voces/`, registered in `src/arranque/voces.generado.ts`, and verified with STT (`*.stt.json`). Differences contain only acronyms and numbers that STT writes compactly (“CPU”, “MBR”, “512”, “55 AA”) and invented names (“Romy”, “Speedy”). Model `eleven_v4` is used for every cue except one, registered in `AJUSTES_CUE`: S12-C02 uses `eleven_multilingual_v2` at speed 1.12 to leave time for S12's final celebration.

Decisions made with actual audio:

- **Windows extended within their scenes**, without changing any scene's duration: S04-C01 234, S05-C01 407, S05-C02 231, and S05-C03 347. Pulso (S02-C01) starts at frame 10 and lasts 164; Secu (S02-C02) starts at 182, with the same ending. In S12: Núcleo 12/243 and Init 263/302, ending at 565.
- **Núcleo changed voice.** “El Faraón” (9TcPbUAhHnAV8mzFDAWU) was discarded because its slow pace did not fit in S12-C01, even with `multilingual_v2` at 1.15. “Enrique M. Nieto” is used.
- **Discarded `eleven_v3` failure:** with `speed` 1.08, it extended Pulso to 6.4 s. That model adds expressive pauses.
- **Alignment tolerance:** ElevenLabs closes the last character (punctuation) about 80 ms after the MP3 ends. `recortarCola` trims those times to the measured duration, with a tolerance of up to 150 ms. `--reconstruir` rebuilds `meta.json` from files already paid for, without calling the API.
- **Subtitles:** `SubtituloCine` shows each sentence as a block, from its first segment to its last, without flickering during internal silences. Its fade shortens for brief blocks.
- **Measured synchronization** in the complete render (`silencedetect`): all 20 voices begin between 22 and 89 ms after the planned frame, meaning fewer than 3 frames.

Video with voices: `out/video-completo/2026-10-18-voces/arranque-S01-S12-voces-1080.mp4` (H.264 + AAC 48 kHz stereo, 330 s). Usage: 5,240 of 40,000 characters in October 2026. The bios, cmosi, disqui, mebre, grubi, nucleo, and init voices remain in the account; to regenerate others, use `voces-biblioteca --agregar`.

## User review (2026-10-18, v3)

- **Voltio, Bios, and Disqui changed voices**, because they sounded deep and unfriendly, and Voltio and Bios were hard to distinguish. Median F0 was measured before selection. In the generated voices, they move from 112 to 208 Hz (Voltio, Sebastian), 143 to 160 Hz (Bios, Dan), and 98 to 142 Hz (Disqui, Brian).
- **Pauses:** `scripts/medir-silencios.mjs` measures each voiceless interval exactly. Codex applied a min-max reduction with cap C = 3.58 s, the minimum keeping the video at 300.07 s (RNF-10, 5:00–6:00). Details in `docs/arranque/RETIMING.md`.
- **Music:** `public/musica/fondo.mp3`, composed with ElevenLabs Music: 300 s, instrumental, −15.5 LUFS. `MusicaGlobal` places it in `VideoCompleto` with 0.25/0.08 attenuation under voices.
- **Video:** `out/video-completo/2026-10-18-v3/arranque-S01-S12-voces-musica-1080.mp4`. All 20 voices enter at their planned instant, with a +5 to +74 dB level jump. Integrated loudness: −20.6 LUFS.

## User review (2026-10-18, v4)

- **Bios** changes to “Juan Limón” (zsNrTi54AOcO2sUuJpdJ), verified as having only a Latin American accent and 154 Hz. “Dan” (es-US) was discarded: his accent sounded like Spanish from Spain.
- **Music:** `MUSICA_PAUSA` 0.22, `MUSICA_VOZ` 0.04 (≈ −15 dB under speech), and `RAMPA_MUSICA` of 12 frames. It gains presence during pauses and animation changes.
- **Pauses:** the min-max reduction was recalculated with the new audio (C = 3.647 s; total becomes 9,000 frames, exactly 300 s). S07-C02 extends its window to 263 frames. In S06, the keyboard request waits until the monitor finishes responding.
- **Video:** `out/video-completo/2026-10-18-v4/arranque-S01-S12-v4-1080.mp4`. Integrated loudness: −21.0 LUFS. All 20 voices enter at their planned instant.
