# H02 — data, scenes, and validation

Publication note: this guide retains the original production-stage record below. Clone-local contract tests now read the independent reference data in `tests/fixtures/boot-contract.json`, which records the original specification's filename and hash, storyboard names, and dialogue. The external specification remains an optional authoring reference; it is not required to run those tests from a clone. Later production and timing updates are recorded in [PRODUCCION.md](PRODUCCION.md), [VOCES.md](VOCES.md), and [RETIMING.md](RETIMING.md).

Source of truth: `../SO-ARR-BIOS-001 v2.0.0.md`, sections 4 (Phase A), 6.1, 6.2, 8, 9.1, 9.3, 12.1, and 12.3. BATCH 1 retains the pure logic; BATCH 2 adds S01/S02 and MacroEncendido in the H02-Encendido folder, at 1920×1080 and 30 fps, without voices or changes to H01.

The scenes (`escenas/S01Energia.tsx`, `escenas/S02Orden.tsx`) use `Interactive.create({layout: "absolute-fill"})`, registered with the same references consumed by MacroEncendido's `Track`. These APIs are present in 4.0.536; the Series/Sequence fallback is unnecessary for the macro. The 600/750/1350 durations come from STORYBOARD through `duracionEscena`. `Html5Audio` uses Sequence only to bound future tracks.

`recursos.ts` resolves the segments shared by mouths, subtitles, and `anclaEnCue`. Each anchor is placed within the segment containing its word, proportionally to its position in the text, so that two events in the same sentence remain ordered (PWR_OK = 1 before releasing RESET). The validator requires strict ordering per scene (RNF-03) and fails if an anchor word is split between two subtitles. Timing is recalculated when actual alignments are registered.

Estimated subtitles: one sentence per subtitle if it fits in two lines of 42 characters; otherwise grouped clauses; only then balanced word blocks, preferably breaking before a connective or article and never ending a line with an unstressed word. See [VOCES.md](VOCES.md) for generation beforehand, recordings, and mixing.

Evidence: `out/h02/cine/` (test video `MacroEncendido-1080p.mp4`, without audio, and frames). The compositions retain their IDs (`S01Alimentacion`, `S02ControlEncendido`, `MacroEncendido`).

## Audiovisual direction (S01/S02 refactoring)

- **Remotion** composes and synchronizes; **Three.js** (`@remotion/three`) draws the case interior and motherboard in `cine/Mundo3D.tsx`; **GSAP** choreographs characters, camera, and signals in `cine/guion/S01.ts` and `cine/guion/S02.ts`.
- Determinism: each GSAP timeline is paused and positioned with `seek(frame / fps)` (`cine/motor.ts`); GSAP only interpolates numbers. Three.js does not use `useFrame`: the camera is set during render, and the same mathematics (`cine/mundo.ts`) projects the 3D points for the 2D layers, keeping characters and signals anchored to the set.
- Meaning of each animation: AC enters as a sine wave and leaves Voltio as a continuous purple flow (+5VSB, standardized ATX color) to the standby LED, which wakes Secu (A02). In S02, each signal follows its actual trace or ATX wire (green PS_ON#, orange/red/yellow outputs, gray PWR_OK, red RESET), the clock pulses when power is stable, and the RESET locks open before the CPU lights up. The logic analyzer and Voltio's hologram record the same instants.
- Characters: rigs generated from the SVGs (`src/personajes/`, `scripts/generar-rigs.mjs`) with arms, legs, blinking, gaze, eyebrows, squash & stretch, and a parametric mouth. Lip sync (`personajes/labios.ts`) uses visemes derived from the text and accepts ElevenLabs character timestamps without changing the scenes.
- Continuity: S01's closing camera matches S02's opening camera, and Pulso/Secu end S01 in S02's initial state (`tests/validar-cine.mjs` checks this).

Browser-free validation: `node tests/validar-cine.mjs` runs the choreographies frame by frame and checks speaker framing, subtitle band, continuity, and determinism.

## Running and configuration

Run from the root, with Node 24.19:

```powershell
node tests/validar-h02.mjs
node tests/verificar-mascotas.mjs
node tests/validar-svg-mascotas.mjs
npx tsc
npx eslint src
```

The validator uses only built-in Node modules and imports `.ts` data modules with explicit extensions. Node strips types without prior compilation. Type-only imports use `import type`; there is no JSX, enums, decorators, or syntax requiring transformation. Only `allowImportingTsExtensions: true` was added to `tsconfig.json`, valid with the existing `noEmit: true`. `module: Preserve`, `moduleResolution: Bundler`, `lib: ["es2015"]`, `strict`, and `noUnusedLocals` are retained. Existing H01 import resolution was not changed.

Node may emit `MODULE_TYPELESS_PACKAGE_JSON` when detecting ESM in `.ts` files: this is an informational warning, with exit 0. `package.json` is not changed to silence it. No dependencies are added, and no transitive media, subtitle, or voice-generation packages are imported.

## Timing and narrative contract

- `tiempo.ts`: 30 FPS, twelve literal storyboard rows, 330 s / 9900 frames; maximum 360 s / 10800 frames. Rounding to the nearest frame.
- `escenas.ts`: contracts for incorporated scenes, with their data implementation status. That field does not certify audiovisual quality, voices, or renders. Current approval and evidence are maintained in [PRODUCCION.md](PRODUCCION.md). Contract intervals are global seconds.
- `dialogo.ts`: all frames are relative to the scene. Moving a scene changes only its global position, without rebuilding cues. An interval is half-open: `[startFrame, startFrame + durationFrames)`.
- Visible text reproduces §8 literally; the validator compares it with the source file. `speechText` pronounces acronyms and preserves meaning with a minimal paraphrase in S01. In S03, “siete efes, cero” describes the seven F digits followed by 0 in `FFFFFFF0`; the screen retains the literal hexadecimal. Spelling each F separately would produce 61 words and require 26.143 s at 140 wpm, compared with 24.333 s available after entry and exit. The chosen wording uses 56 words, 138.08 wpm, slightly above the preferred 125–135 estimate and below the 140 limit; the scene is not extended.
- Wpm is calculated by counting space-separated words in `speechText` across the complete cue interval, including its estimated pauses. Actual duration will be checked when a recording exists; this estimate does not replace that check.
- S01 introduces the power chain and explicitly conditions the main outputs on the motherboard's request. S02 details that mechanism; its beginning does not assume PWR_OK is already high because the S01 introduction has ended.
- The §12.3 matrix jointly assigns RF-01–RF-03 to S01/S02 and RF-04/RF-05 to S02/S03. The contracts retain that group traceability; S03 is where the reset vector is detailed.

| Cue | Mascot | Relative start–end (frames) | Relative start–end (s) | Duration (s) | Spoken words | wpm |
| --- | --- | --- | --- | --- | --- | --- |
| S01-C01 | Voltio | 10–590 | 0.333–19.667 | 19.333 | 43 | 133.45 |
| S02-C01 | Pulso | 12–172 | 0.400–5.733 | 5.333 | 12 | 135.00 |
| S02-C02 | Secu | 180–740 | 6.000–24.667 | 18.667 | 42 | 135.00 |
| S03-C01 | Cipu | 10–740 | 0.333–24.667 | 24.333 | 56 | 138.08 |

Minimum entry: 10 frames; minimum exit: 10 frames. Pulso precedes Secu with an 8-frame gap. All providers are `none`; asset and alignment paths are `null`.

## Subtitles and expression

`segmentosDeCue(cue, alineacion?)` returns `{texto, inicioFrame, finFrame}` relative to the scene. Without alignment, it splits visible text at sentences and commas, fits it into two lines of up to 42 characters, and distributes the interval by equivalent spoken length, with 6-frame pauses between sentences. The weighting expands acronyms and the address according to their pronunciation; it is a heuristic, not a transcript.

The local `Caption` shape contains `text`, `startMs`, `endMs`, `timestampMs`, `confidence`, and optional `pageBreakAfter`, without importing external packages. Alignment times are relative to the original voice file: millisecond 0 is the cue's beginning. The storyboard's global offset is not added. `timestampMs` and `confidence` are compatible metadata, not timing boundaries.

With alignment, the adapter retains visible sentences and projects their spoken lengths onto the aligned intervals. Phonetic words do not replace visible technical text. Alignment gaps produce separate intervals with the same sentence, allowing `estaHablando` to be false during pauses. This correspondence between phonetic and visible text is proportional; it will require review with actual voices for word-level precision. An empty alignment `[]` expresses no speech; `null` or `undefined` selects estimation. Unordered, overlapping, or out-of-cue alignments are rejected.

`expresionEnFrame` returns `hablando` within spoken intervals and the base expression `neutral` or `alerta` during silences. The same function drives the mouth in a silent preview.

## Local audio and mixing

The functions receive the cue identity and return lowercase paths relative to `public`:

```text
voces/s01/s01-c01-voltio.mp3          # also .wav
voces/s01/s01-c01-voltio.alineacion.json
subtitulos/s01/s01-c01-voltio.json
```

These are conventions; no files or empty audio folders have been created. `recorded` and `elevenlabs` read only local assets. `elevenlabs` only labels the origin of a file generated outside the render and subsequently versioned; this batch does not include generation scripts or calls.

`resolverVoz(cue)` returns silence with provider `none` or `assetPath: null`; with a declared asset it returns `{modo: "audio", src}`. As a pure function, it does not query the filesystem. A consumer that has checked the file is missing passes `resolverVoz(cue, false)` to obtain silence. The validator performs that local check: a missing recording produces ERROR; a missing voice labeled `elevenlabs` produces WARN “pending generation” and checks the fallback. A path violating the convention is ERROR for any provider, even when the file has yet to be generated.

`volumenMusica` uses a 0.25 base and 0.08 during speech, with 8-frame ramps before and after. It combines nearby intervals using the lower gain. `detectarSolapes` reports voice/voice and sfx/voice overlaps; an SFX may overlap only if it has `permitirDuranteVoz: true`. All tracks and intervals passed to these functions must share the same clock.

## Coverage and pending work

The validator checks storyboard and dialogue against the specification; duration, continuity, contracts, signals, and direction; identity, cast, paths, and availability; speeds and gaps; subtitles and pauses; expression; mixing and fallback. If the declared alignment exists, it reads its JSON and checks the resulting segments. It scans all of `src` for prohibited network, key, and transitive-package expressions. Twelve negative self-tests exercise the same validator as the real data, including overlap, overflow, unknown mascot, and invalid alignment, without writing fictitious files.

S01/S02 are the approved reference. S03 is implemented and approved with preview, 1080p render, tests, and independent arbitration; S04–S12 are produced through checkpoints recorded in [PRODUCCION.md](PRODUCCION.md). Local recordings and actual phonetic alignment remain pending; timing is estimated until the voice is measured.

The original batch's independent review found no critical or major issues. It noted one minor limitation in the generic helper: a spaceless token longer than 42 characters is split visually and is not reconstructed as a single token when line breaks are normalized to spaces. The validator checks exact reconstruction for integrated cues. If such a token is introduced, its splitting must be reviewed before acceptance.

## Procedure for new scenes

Use the `arranque-motion` skill (`.agents/skills/arranque-motion/SKILL.md`; Claude Code discovers it through the `.claude/skills/arranque-motion` junction). This README describes the architecture; the procedure lives only in the skill.
