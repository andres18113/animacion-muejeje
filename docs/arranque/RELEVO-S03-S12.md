# Handoff prompt — arranque-so S03–S12 production

Historical handoff: the instructions below retain their original production scope. Clone-local contract tests now use `tests/fixtures/boot-contract.json`; the external specification is an optional authoring reference and is not required to run those tests.

> Production update, 2026-10-17: **S03–S06 approved**. Current scope: hand off only S07–S08 to Claude, with Codex and the existing skills, without requiring sprints, arbiters, loops, or new checkpoints. S09–S12 and the complete edit remain pending. The [new handoff](RELEVO-CLAUDE-S07-S08.md) supersedes this historical assignment. [PRODUCCION.md](PRODUCCION.md) and the dossiers preserve actual evidence, including the supplementary S04 binary-identity limitation (exit 1 preserved; visual and semantic continuity corroborated). Computer use prohibited; PNGs authorized.

You are the agent continuing production of the educational video `arranque-so` (Remotion 4.0.536 + GSAP + Three.js, Windows, Node 24). Work autonomously: implement, render, inspect, and correct without requesting confirmation between steps. Report briefly at each milestone and continue.

## Objective

Finish S03 and produce S04–S12 at the approved audiovisual quality of S01/S02, and leave a composition of the complete video (330 s; maximum 360 s) that can be rendered and verified. Completion means: each scene implemented, reviewed against the rubric, and free of open defects; all validations with exit 0; S01/S02 visual regression intact.

## How to work

Follow the repository skill `.agents/skills/arranque-motion/SKILL.md` (procedure with gates 0–6, 10-point rubric, tools in `scripts/`). It is the single source of the method; read it in full before starting, and read its `references/` when the gate calls for them. Do not duplicate its instructions in other files.

The technical source of truth is `../SO-ARR-BIOS-001 v2.0.0.md` (§4 phases A–D, §6 structures, §8 script, §9 storyboard and synchronization, §12 contract). Baseline: legacy Intel/Phoenix BIOS, Pentium II Slot 1, 82443BX + PIIX4E chipset, 4 Mbit E28F004S5 parallel flash, PC100 SDRAM with SPD, IDE/ATA, 512-byte MBR, GRUB Legacy, and Linux. Never introduce UEFI, GPT, ESP, Secure Boot, NVMe, SPI flash, or later hardware.

## Current state (verified in this session)

- S01 and S02 are approved. Do not modify them. `regresion-visual.mjs` must keep reporting 8/8 identical hashes.
- S03 (`src/arranque/escenas/S03PrimeraInstruccion.tsx`, `src/arranque/cine/guion/S03.ts`) is implemented and registered (Root, `MacroEncendido` = S01–S03, `registro.ts` with S02→S03 continuity). S03 anchors are in `anclas.ts`. `validar-cine`, `validar-h02`, `tsc`, and `eslint` passed, but visual review found defects still open. Correct them first:
  1. **Continuity:** S02 ends with its logic analyzer at 35% opacity, and S03 does not draw it. `AnalizadorS02` already exists in `src/arranque/cine/PlacaEncendida.tsx`. Use it in S03 with `opacidad={e.capa.analizador}` and `anclasS02={aS02}`.
  2. **Opening pace:** the initial camera turn (frames 0–16) is too fast and hides the cartridge's transformation into Cipu. Hold S02's final framing for about 24 frames while the cartridge becomes Cipu, then move the camera closer to `CAMARAS_S03.registros`. Run `validar-cine` again: Secu must not overlap the subtitle band.
  3. **Wide-shot legibility:** S02's persistent signals compete with the search. `PlacaEncendida` already accepts `intensidad`. Bring it from 1 to ~0.3 between frames ~30 and 90 of S03, with a `capa.placa` state in the script.
  4. **Scale:** enlarge the register hologram (~900×500, hexadecimal ~52 px), chip labels (32 px), and map text (28 px).

  Then repeat gates 3–6 for S03: `revisar-escena.mjs --composicion S03PrimeraInstruccion --anclas --secuencias --video --escala 0.5`, inspect the sheets, apply the rubric, and render at 1080p.
- Reusable S03 resources: `cine/rutas.ts` (RUTA_FIRMWARE, CHIPS_FIRMWARE, `recorteDeRuta`, and `puntoDeRuta` in world space), `cine/MapaMemoria.tsx`, `cine/PlacaEncendida.tsx`, and the `cartucho` and `chips` options in `Mundo3D`.

## Restrictions

- Storyboard durations from §9.1 (S04 30 s, S05 50 s, S06–S08 25 s, S09–S10 30 s, S11 25 s, S12 20 s). Do not extend them.
- Each movement must explain a technical fact anchored to a dialogue word. No slide aesthetic (beige backgrounds, cards, static panels, time labels, headings). Mascots act and react; never have two speak at once.
- Continuity: scene N's last camera and states are N+1's first, and persistent states remain present. Register everything in `src/arranque/cine/guion/registro.ts`.
- Prepare audio for ElevenLabs without generating voices: cues retain `provider: "none"`. No network calls, keys, or new dependencies.
- Do not touch `public/mascotas`, `src/mascotas`, or `docs/mascotas`. `src/Root.tsx` uses CRLF.
- If your sandbox cannot run the Remotion CLI (esbuild “Access is denied”), do not bypass it with imports from `@remotion/bundler` or `@remotion/renderer`. Prepare the commands and mark renders as pending for the host. Always use `remotion bundle --out-dir=`.
- If memory is scarce: one bundle per iteration, `--scale=0.5 --concurrency=2` for previews, and 1080p only at the end.

## Recommended order

1. Correct S03's open defects and close it against the rubric.
2. Scene by scene, from S04 to S12: contracts and cues (create missing ones from §8, at ~125–135 wpm, and validate with `validar-h02`), beat sheet, implementation, validation, visual review, and rubric. Each scene's characters come from §8/§7 (for example, S04: Romi, Bios, and Cmosi; S05: Postín, Spedi, and Rami).
3. Complete composition: a `VideoCompleto` with a `Track` of S01–S12 (9900 frames) in Root, plus its regression manifest once approved.
4. Final 1080p render of the complete video and verification of frames extracted from the MP4.

## Final delivery

A report with: completed scenes and their evidence (paths in `out/revision/...`), each validation command's result and exit code, measured total duration, MP4 paths, and actual limitations (for example, estimated lip sync while voices are absent). Do not declare anything approved unless you have rendered and inspected it.
