---
name: arranque-motion
description: Design, implement, render, review or improve animated S03–S12 scenes in arranque-so, or remake S01/S02, with characters, cameras, signals, a 3D world and dialogue synchronization. Use when working on cinematic choreography and validating technical fidelity and continuity.
---

# Arranque motion

Work from the repository root with Node 24 and dependencies installed. Implementers follow the gates; directors validate the rubric before approval. Preserve S01/S02 as the approved reference. Implement only scenes authorized by the user.

In references, `repo:path#symbol` cites a file relative to the root and its export; open it locally. The references/scripts/assets links are relative to this skill.

Single source: `.agents/skills/arranque-motion/` (Codex discovery). Claude Code discovers it through the `.claude/skills/arranque-motion` junction; if missing in a fresh clone, run [enlazar-skills](repo:scripts/enlazar-skills.mjs). Edit only the single source; do not copy this content to other files or edit skills-lock.json (which records remote skills).

## 0. Contract

The historical external specification `../SO-ARR-BIOS-001 v2.0.0.md` (§8 scene, §9, §12 and technical operation) is optional authoring context and is not included in this repository. For checks in a fresh clone, use the local contracts and `tests/fixtures/boot-contract.json` for dialogue/storyboard reference data. Read `src/arranque/escenas.ts` (ContratoEscena/ESCENAS), `tiempo.ts`, `dialogo.ts`, `subtitulos.ts`, `anclas.ts`, `recursos.ts`, `audio.ts` under `src/arranque/`, and `docs/arranque/README.md` / `VOCES.md`.
Check inputs, outputs, duration, characters and prerequisites against the BIOS baseline. If a contract/cue is missing, create it before generating an authorized scene. Add ANCLAS_VISUALES using complete words within a segment; run `node tests/validar-h02.mjs`.
**Pass:** traceable contract, nonoverlapping relative cues, anchors present and strictly ordered per scene. Read [signals and power](references/senales-y-energia.md).

## 1. Beat sheet

Copy [the template](assets/hoja-beats.md) into the review record. Fill in beat → technical fact from the spec (A0x or B/C/D depending on phase) → action → anchor word → frame calculated with anclasDeEscena. Associate anticipation, reaction and settling with each action. Review [acting](references/coreografia-y-actuacion.md) and [cameras](references/camaras-y-encuadre.md).
Use `node .agents/skills/arranque-motion/scripts/buscar-camara.mjs --help`; run the [search tool](scripts/buscar-camara.mjs) with speaker and target regions (Secu in front / target behind).
**Pass:** every movement explains a fact; no slide aesthetic: beige backgrounds, cards, static panels, time labels or headers. The director can compare each beat with its word/frame.

## 2. Implementation

Read [deterministic architecture](references/arquitectura-determinista.md). Generate the plan first:

```powershell
node .agents/skills/arranque-motion/scripts/nueva-escena.mjs --id S03 --nombre "Primera instrucción" --componente S03PrimeraInstruccion --dry-run
```

The [generator](scripts/nueva-escena.mjs) creates pure `cine/guion/Sxx.ts` and `escenas/SxxNombre.tsx` under `src/arranque/` only for an authorized scene. It prints registration entries; it does not modify Root. The skeleton lacks approved choreography: replace the example camera/states with the previous cut. Register in `src/Root.tsx`, inside the corresponding milestone's Folder, preserving CRLF; add anchors in `src/arranque/anclas.ts` and an entry/link in `src/arranque/cine/guion/registro.ts` for validar-cine and the tools.
Reuse Mundo3D, Actor, SubtituloCine, CapaAudio, useCoreografia; capas provides trazar/puntoEn/dParcial, SenalViajera, OndaAlterna, FlujoContinuo and FiltrosBrillo; instrumentos provides Trazas/escalon/subidaEstabilizada. Actor provides manoEnPantalla/anguloVentilador. Consult references for actual signatures and sources.
**Pass:** script independent of DOM and React; f converts frames to seconds; shared projected camera; persistent states and actors linked at the cut. Do not alter mascot files or dependencies.

## 3. Numerical validation

```powershell
node tests/validar-cine.mjs
node tests/validar-h02.mjs
npx --no-install tsc
npx --no-install eslint src
```

**Pass:** all exit 0. validar-cine traverses frames, measures full speakers ≥200 px, band y≤885, determinism with out-of-order seeks and registered links. h02 checks contract, dialogue, subtitles, anchors, technical values and audio. tsc/eslint check integration. These checks do not replace visual inspection.

## 4. Render and inspection

Read [performance and rendering](references/rendimiento-y-render.md). On the host:

```powershell
node .agents/skills/arranque-motion/scripts/revisar-escena.mjs --composicion MacroEncendido --anclas --secuencias --video --escala 0.5 --dry-run
node .agents/skills/arranque-motion/scripts/revisar-escena.mjs --composicion MacroEncendido --anclas --secuencias --video --escala 0.5
```

The [reviewer](scripts/revisar-escena.mjs) saves PNGs, paginated HTML/Chrome sheets, optional MP4, index and manifest (frames, hashes, arguments) in `out/revision/COMPOSICION/FECHA-HORA/`. By default it includes anchors, start/end and both sides of cuts. Inspect complete ±radius sequences around actions; expand radius or frames to include anticipation and settling. Reuse `--bundle RUTA` when iterating; then generate 1080p with `--escala 1 --video --bundle RUTA`. For HTML without rendering, use `--hoja manifest.json` with existing PNGs.
**Pass:** every anchor/cut has evidence; every action has a sequence, and preview and 1080p were reviewed. Render a frame twice on this GPU and compare SHA-256. In the sandbox, do not run Remotion CLI (esbuild Access denied); do not substitute bundler/renderer imports. Deliver the plan to the host and mark renders pending.

## 5. Critique and correction

Apply the [rubric](references/rubrica.md), item by item: PASS/FAIL and evidence file/frame in the beat sheet. Correct failures and repeat gates 3–5 for affected areas until all pass. Do not declare approval if video, contrast measurement or director validation is missing.

## 6. Regression and delivery

```powershell
node .agents/skills/arranque-motion/scripts/regresion-visual.mjs --manifiesto .agents/skills/arranque-motion/assets/regresion/macro-encendido.json --bundle out/bundle
node tests/validar-rigs.mjs
node tests/verificar-mascotas.mjs
node tests/validar-svg-mascotas.mjs
node .agents/skills/arranque-motion/scripts/validar-skill.mjs
```

The [comparator](scripts/regresion-visual.mjs) uses [eight approved frames](assets/regresion/macro-encendido.json). **Pass:** identical hashes on the reference machine/GPU and all commands exit 0. Use `--actualizar` only after approved visual changes, retaining previous evidence and rationale. The [skill validator](scripts/validar-skill.mjs) checks structure, citations, help and discovery; `--permitir-pendiente` validates provisionally without claiming that the junction is installed. [comun.mjs](scripts/comun.mjs) centralizes CLI, catalog and HTML sheets; do not animate with the clock of its records.
Deliver changed files, sheet/rubric, manifests, commands with exit codes, comparison and host-pending items. Do not turn numerical tests into visual-quality claims.
