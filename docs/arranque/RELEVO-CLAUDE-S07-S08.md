# Handoff to Claude — implement S07 and S08 only

Historical handoff: the instructions and state below describe the original S07–S08 assignment. For clone-local contract tests, `tests/fixtures/boot-contract.json` now supplies the independent specification reference data; the external specification is an optional authoring reference and is not required to run those tests.

Work directly in `<project-root>` (the `arranque-so` repository), Windows/PowerShell, Node 24, Remotion 4.0.536, GSAP, and Three.js. Implement S07 and S08, generate PNG and MP4 evidence, inspect it, correct observed defects, and deliver verifiable results. Do not implement S09–S12 or present the overall video as finished.

**Confirmed starting state:** S01–S06 approved; S06 closed at correction 3. Read [its dossier](produccion/S06.md) and [verdict](produccion/S06-auditoria.md). Final evidence: `out/produccion/S06/certificacion3/` (12 checks with exit 0, preview and 1080p MP4s of 750 frames / 25 s, 750 PNGs extracted from each video, repeated direct canonical 9/9). Approved reference: `docs/arranque/produccion/referencias/S06.json`. Source and bundle remained stable. The supplementary S04 comparison retains the documented 6/9 and exit 1; the other mandatory checks passed. See `out/produccion/S06/cierre-auditado.json`. Do not reopen S06 or redo approved scenes to begin this assignment.

## Method and tools

- Read and apply the repository's `.agents/skills/arranque-motion/SKILL.md` skill and its relevant references. Claude can discover it through `.claude/skills/arranque-motion`; the single source is `.agents/skills/arranque-motion/`. Also use the relevant local Remotion skills: `.agents/skills/remotion-best-practices/SKILL.md`, `remotion-markup`, `remotion-render`, and, if applicable, `remotion-captions`. Check their actual paths before opening them; do not install new skills or dependencies.
- This handoff's instruction supersedes any management overhead in the method: work directly through code, validation, render, PNG inspection, and delivery. Do not organize sprints, arbiters, agent cycles, or checkpoints. Retain the skill's audiovisual rigor without creating those processes. You do not need to read the historical S03–S12 handoff, which prescribes a different scope.
- **Computer use prohibited:** no CUA, desktop control, app screenshots, or interface automation. PNG rendering, frame extraction, and direct reading/inspection of those images through file tools are permitted. Use code/Remotion and existing resources for graphics.
- You may use **Codex through its direct CLI**, preferably GPT-6.1 Sol if its actual identifier is confirmed available. Do not invent the model ID: if you do not know it, omit `-m` and retain the configured model. **Do not use native Claude Agent/Task subagents or `codex-rescue`**. Do not delegate and simultaneously edit the same files.
- `codex exec --help` has already confirmed `-C`, `-m`, `-s`, stdin `-`, `--json`, and `-o`. Example for a bounded read-only query, without a wrapper (run from the repository root):

```powershell
@'
Review only the specified files and issue. Read-only; brief result with evidence.
'@ | codex exec -C . -s read-only --json -o out/codex-respuesta.txt - > out/codex-completo.jsonl 2> out/codex-stderr.log
```

For an already scoped implementation task, you may use the `workspace-write` sandbox; confirm availability with local help. Avoid unnecessary delegation. Save complete logs to disk and communicate only milestones and brief results; do not flood the conversation or reduce verification to a `tail`.

## Baseline and mandatory sources

The standard is `../SO-ARR-BIOS-001 v2.0.0.md`: §§4C01–08, 6.8, 8S07/S08, 9.1/9.3/9.4, 10.1/10.2, and 12. Also read `src/arranque/{escenas,tiempo,dialogo,subtitulos,anclas,recursos,audio}.ts`, `docs/arranque/README.md`, `docs/arranque/VOCES.md`, `docs/arranque/PRODUCCION.md`, the final S06 dossier, and `out/produccion/contratos-S07-S12.md` as a navigation aid.

Legacy Intel/Phoenix BIOS, Intel SE440BX-2 motherboard, Pentium II, 82443BX+PIIX4E, E28F004S5 parallel flash, PC100 SDRAM, and IDE/ATA disk. Later stages: **GRUB Legacy 0.97 Stage1/1.5/2**, ext2, and Linux 2.6 with built-in IDE/ext2, without an additional initrd. Do not introduce UEFI/GPT/ESP/SecureBoot/NVMe/SATA, SPI flash, GRUB 2, or `core.img`. Do not research all BIOS history or add unrequested values.

The primary POST table, if context needs to be retained, is in `out/produccion/S05/fuentes/`; IVT/BDA and physical-compatibility sources are in `out/produccion/S06/fuentes/`. CMOS configuration does not contain the BIOS program. BIOS and then the bootloaders are code executed by the same CPU.

## Two authorized scenes

### S07 — Boot device selection

Duration **25 s / 750 frames**, global interval **175–200 s**. Cast: Cmosi and Bios. RF15/16 and applicable common requirements. Input: S06 left RAM, services, and peripherals available and the IDE disk identified. Result: selected device and prepared BIOS bootstrap; no sector executing yet.

**Literal visible dialogue, split into speaker cues without changing the concatenated text:**

> Mis parámetros CMOS ayudan al BIOS a conocer su configuración de arranque. En nuestra computadora se intenta primero la disquetera y después el disco IDE. Como no hay un disquete arrancable, el BIOS selecciona el disco y activa la rutina de inicio, representada por la interrupción diecinueve hexadecimal.

Keep the Cmosi→Bios casting coherent. Show floppy→IDE order and the absence of a bootable floppy; do not invent a physical disk failure. `INT 19h` represents the bootstrap routine: it is not the service that reads the sector. Do not show GRUB, executing MBR, kernel, or processes. If a floppy drive needs to be represented, add a resource exclusive to the new scene without altering approved defaults or making S06's persistent hardware disappear.

### S08 — Reading the first sector

Duration **25 s / 750 frames**, global interval **200–225 s**. Cast: Bios and Disqui. RF16/17/18 and applicable common requirements. Input: disk selected by S07, POST complete, IDE available. Result: **512 bytes loaded into physical RAM `0x7C00`–`0x7DFF`**, ready for the next scene. **Do not execute MBR/Stage1 in S08**: that explanation/transfer belongs to S09, outside this assignment.

**Literal visible dialogue:**

> Para leer el disco utilizo servicios de la interrupción trece hexadecimal. Identifico el primer disco duro con el valor ochenta hexadecimal y leo su sector inicial de quinientos doce bytes. Coloco esos bytes en memoria, en la dirección siete C cero cero hexadecimal, para preparar su ejecución.

These sentences describe BIOS actions: Bios may speak them while Disqui responds through acting. A two-character cast does not require two voices; do not reassign BIOS's initiative to read or place bytes in RAM to Disqui merely to divide sentences.

Mandatory: `INT 13h`, `DL=0x80`, initial 512-byte sector, and destination `0000:7C00`/physical address `0x7C00`. Teach request, read, transfer, and RAM reception as distinct events; the disk does not place bytes in RAM on its own initiative. BIOS continues executing during the read.

The initial sector is **logical sector 0**. If you choose to explain CHS, the §6.8 example uses **cylinder 0, head 0, sector 1**; never CHS sector 0. Its parameters are AH02/AL01/CH00/CL01/DH00/DL80, ES:BX0000:7C00. It is a teaching example, not a standalone boot program; do not invent a stack, handlers, or additional registers. Assembly need not be shown.

§9.4 requires a non-bootable-sector alternative with a consequence: GRUB is not reached. Show it as an alternative and resume the successful read within 25 s. If the `55AA` signature is represented, checking it does not establish that a valid OS exists. Do not yet draw the full analysis of the MBR's 446 + 64 + 2 bytes or impose VBR: the later installation has Stage1 directly in the MBR and does not require an intermediate VBR.

## Continuity: reuse actual states and clocks

Start S07 with `crearMotor(GUION_S06, anclasS06,30).en(749)` from the version delivered by direction; S08 derives from S07's last visible frame 749. Do not manually reconstruct actor, camera, chip, or layer states. Register S06→S07 and S07→S08 links in `cine/guion/registro.ts`, with frameCamara/frameActores = 749 and relevant persistent states. Do not create a link to a nonexistent S09 just to pass a test.

- Current reference: `src/arranque/escenas/S06ServiciosDispositivos.tsx`, `cine/guion/S06.ts`, `cine/ServiciosMaterial.tsx`, `cine/servicios-geometria.ts`. These are a single implementation; reuse it, do not generate a second services world or replace the component with an approximation.
- Bios ends displaced relative to `LUGARES.bios`: the current script reaches `desplazX = 3.4`. Her effective position is base+displacement. Use the actual final state, account for arms/jumping, and frame the **full body**. Do not return her to the origin or calculate labels/hands as though she were stationary at the base.
- Preserve the external CRT/table/pedestal/keyboard station, AGP card, PS/2, disk, and IDE ribbon, together with persistent actors and signals. An object outside the frame continues to exist; do not make it reappear or change its position to accommodate an explanation.
- `Actor.frame` is the **cue-local** clock and its visemes. `frameAmbiente` drives only breathing/blinking and defaults to `frame` to preserve approved scenes. Do not pass an accumulated clock as a new speaker's `frame`. Cue S06-C01 uses `rampaLabialFrames: 2` to soften its initial vowel; other cues retain previous behavior. If a new cue needs the opt-in, preserve exact S01–S06 checks and restrict the historical assertion enumerating opt-ins in `validar-s06.mjs` to those scenes; do not change hashes or thresholds. `PostinActivo` also separates both clocks and allows omitting the cue: do not reactivate an S05 voice.

Accumulated offsets relative to each new scene's local frame, derived from current S06 code; if direction changes its ending, check them again against that code:

| Element/clock | S07 | S08 |
|---|---:|---:|
| Secu/Pulso ambience | +4650 | +5400 |
| Cipu ambience | +3900 | +4650 |
| Romi/Bios/Cmosi ambience | +3150 | +3900 |
| Postín/Spedi/Rami ambience | +2250 | +3000 |
| Disqui ambience | +750 | +1500 |
| Mundo3D.frame | +3900 | +4650 |
| PlacaEncendida.frameGlobal | +5250 | +6000 |
| PlacaEncendida.frameRelojS02 | +4650 | +5400 |

`MemoriaMaterial` must receive **S05 anchors** and accumulated S05 local frame: S07 `frame+2250`, S08 `frame+3000`; do not use new anchors or restart POST. Its persistent display uses `checkpointS05` with that same clock. `ServiciosMaterial` receives **S06 anchors** and accumulated S06 local frame: S07 `frame+750`, S08 `frame+1500`; do not trigger S06's setup/preparation again. Each new speaker's pose and cue remain local to S07 or S08. `aS02` remains for the motherboard's physical clock.

## Implementation and evidence without additional overhead

Complete contracts, local cues, whole-word anchors, deterministic pure scripts, and React components for S07/S08. Contracts follow §12; do not change the total 330 s storyboard. Audio paths prepared for ElevenLabs, **provider:none**, without generating voices or network calls. Synchronization remains estimated while recordings are unavailable. Do not modify `public/mascotas`, `src/mascotas`, `docs/mascotas`, or dependencies. `src/Root.tsx` retains CRLF.

Use consistent names and register them in Root/registro; the following commands propose `S07SeleccionDispositivo` and `S08LecturaSector`. If you choose other IDs, explicitly replace them in every command. Do not extend the approved `MacroEncendido`: it is the S01–S03 phase, not the entire video.

Acting must explain causes and responses, with anticipation/contact/settling, gaze, and small movements over actual physical media. Instruments integrated into the action; no slides, generic static panels, time labels, or beige backgrounds. Respect full bodies, readable actual height, subtitle band, two lines, and the rubric's effective contrast. Do not use numerical tests to claim you saw the result.

Use the standard local Remotion CLI, never bundler/renderer imports to bypass failures. Headless Chrome is already under `node_modules/.remotion`; `chromeLocal()` locates it. One bundle per code version; if source changes, the previous bundle remains evidence of the previous version. Do not run two GPU renders simultaneously.

Operational example, first creating new output/log folders:

```powershell
node node_modules/@remotion/cli/remotion-cli.js bundle src/index.ts --out-dir=out/produccion/S07-S08/bundle > out/produccion/S07-S08/bundle.stdout.log 2> out/produccion/S07-S08/bundle.stderr.log
node scripts/revisar-produccion.mjs --composicion S07SeleccionDispositivo --anclas --secuencias --radio 6 --bundle out/produccion/S07-S08/bundle --salida out/produccion/S07/preview --escala 0.5
node scripts/revisar-produccion.mjs --composicion S08LecturaSector --anclas --secuencias --radio 6 --bundle out/produccion/S07-S08/bundle --salida out/produccion/S08/preview --escala 0.5
```

The helper captures PNGs in a batch and generates paginated sheets/manifest; inspect originals at useful resolution, not just thumbnails. Add `--frames LISTA` to cover actions, camera changes, consecutive request/reception segments, and both sides of cuts. Also check S06/07 and S07/08 cuts with their two adjacent frames and sequence. Preserve correction evidence without generating additional management documentation.

Extend necessary S07/S08 tests without relaxing S01–S06 checks; validate §8's literal text, anchors, operations, boundaries, and speaker gaps. The following checks must pass; you may run them through the closure helper below, which saves their logs and exit codes, without duplicating already completed runs:

```powershell
node tests/validar-cine.mjs
node tests/validar-h02.mjs
node node_modules/typescript/bin/tsc --noEmit
node node_modules/eslint/bin/eslint.js src
node tests/validar-rigs.mjs
node tests/verificar-mascotas.mjs
node tests/validar-svg-mascotas.mjs
node .agents/skills/arranque-motion/scripts/validar-skill.mjs
node tests/validar-s03.mjs
node tests/validar-s04.mjs
node tests/validar-s05.mjs
node tests/validar-s06.mjs
node tests/validar-s07.mjs
node tests/validar-s08.mjs
```

For technical closure use `scripts/certificar-produccion.mjs`: it runs those checks through the specified scene, renders preview at 0.5 and 1080p with concurrency 2, archives logs/hashes/freezes, and checks fps 30, frame count, duration, and dimensions through ffprobe. It does not grant audiovisual approval. Do not freeze a version and keep changing it during its renders.

```powershell
node scripts/certificar-produccion.mjs --escena S07 --composicion S07SeleccionDispositivo --bundle out/produccion/S07-S08/bundle --salida out/produccion/S07/certificacion
node scripts/certificar-produccion.mjs --escena S08 --composicion S08LecturaSector --bundle out/produccion/S07-S08/bundle --salida out/produccion/S08/certificacion
```

Confirm 1080p PNGs and frames extracted from both MP4s, continuity, and contrast. Rendering video or passing ffprobe does not mean it was watched; specify which images you reviewed. Do not invent temporal playback of a video if only frames were inspected.

## Regressions: preserve references and known limits

The eight official S01/S02 goldens must remain identical. Do not modify hashes or use `--actualizar` to hide differences:

```powershell
node .agents/skills/arranque-motion/scripts/regresion-visual.mjs --manifiesto .agents/skills/arranque-motion/assets/regresion/macro-encendido.json --bundle out/produccion/S07-S08/bundle
```

For per-scene references, use **their complete canonical profile**, not an isolated still or just the nine goldens. `scripts/regresion-produccion.mjs` reads `metodo`, `perfilCaptura`, and `capturaManifest`, validates all PNGs/mapping/headers, and compares approved hashes. Example:

```powershell
node scripts/regresion-produccion.mjs --manifiesto docs/arranque/produccion/referencias/S03.json --bundle out/produccion/S07-S08/bundle --salida out/produccion/S07-S08/regresion-S03
```

Apply the same procedure to existing S04/S05 references and the approved S06 reference; check the actual files and report all exit codes. Do not alter those references. New S07/S08 references, if created after review, must retain complete profile and provenance; they do not replace earlier ones.

**Known S04 limitation:** at S05 closure, the exact S04 comparison achieved 6/9 with a new bundle; the approved bundle, using the same 250-PNG profile and environment, achieved 8/9 and failed a different frame. Relevant code, cues/anchors, 15 previous locations, and 900/900 S04 CPU states were identical. Exit 1 results and differences are retained in `out/produccion/S05/diagnostico-S04/` and described in `docs/arranque/produccion/S05.md`/`S05-auditoria.md`. This does not certify S04 binary identity, does not by itself identify the raster mechanism, and does not authorize new tolerances. Retain exact hashes and tests, record the actual result, distinguish this preexisting limitation from a new modification, and do not call everything green.

## Delivery

Deliver S07 and S08 with changed files, composition/duration, PNG and MP4/manifest locations, which visual evidence you inspected, measured contrast, complete commands and exit codes, regressions, and actual limitations. Update only documentation necessary for those two scenes. Do not create S09–S12, close the overall project, deploy, or ask the user for additional management work.
