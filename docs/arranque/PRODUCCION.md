# S03–S12 production log

Normative sources: [arranque-motion](../../.agents/skills/arranque-motion/SKILL.md), [handoff](RELEVO-S03-S12.md), and BIOS specification v2.0.0. S01/S02 are approved, protected references. This log describes actual evidence; “implemented” does not mean “approved.”

## Conditions of this session

- Direction and integration: main agent. Implementation and arbitration: separate GPT-6.1 Sol agents. The reviewer had no editing permission for the files under review.
- The user prohibits computer use and explicitly permits inspecting PNGs instead of playing the videos. Anchors, cuts, and consecutive sequences will be reviewed; full renders will be retained.
- Audio uses `provider: "none"`; synchronization is estimated until actual voices and alignment are available. No voice generation or new dependencies.
- The repository contains numerous previously untracked files. A production commit does not include everything; copies of edited files are retained under `out/produccion/S03/baseline/`.
- Standard Remotion CLI available: the test bundle finished with exit 0. No internal imports were used to bypass restrictions.

## Board

| Scene | Duration | Status | Evidence / next gate |
| --- | ---: | --- | --- |
| S01 | 20 s | Previously approved | Eight golden frames shared with S02; repeat regression |
| S02 | 25 s | Previously approved | Camera, actor, and analyzer continuity into S03 |
| S03 | 25 s | Approved | [Dossier](produccion/S03.md), [audit](produccion/S03-auditoria.md); 9 gates, 8/8 regression, complete preview and 1080p |
| S04 | 30 s | Approved | [Dossier](produccion/S04.md), [audit](produccion/S04-auditoria.md); 10 gates, references preserved, and two complete MP4s |
| S05 | 50 s | Approved | [Dossier](produccion/S05.md), [audit](produccion/S05-auditoria.md); 11 gates, two MP4s, 661 PNGs per scale, and canonical 9/9. S04: continuity corroborated; additional binary identity not certified |
| S06 | 25 s | Approved, correction 3 | [Dossier](produccion/S06.md), [verdict](produccion/S06-auditoria.md); 12 checks with exit 0, two complete MP4s, 750 encoded PNGs per scale, canonical 9/9, and five scores of 4/5. Supplementary S04 limitation preserved |
| S07 | 25 s | Implemented, technically closed; audiovisual approval pending | [Dossier](produccion/S07.md); 13 checks with exit 0, two valid MP4s, 750 PNGs extracted from each |
| S08 | 25 s | Implemented, technically closed; audiovisual approval pending | [Dossier](produccion/S08.md); 14 checks with exit 0, two valid MP4s, 750 PNGs extracted from each |
| S09 | 30 s | Implemented, technically closed; audiovisual approval pending | [Dossier](produccion/S09.md); 15 checks with exit 0, two valid MP4s, 900 PNGs extracted from each |
| S10 | 30 s | Implemented, technically closed; audiovisual approval pending | [Dossier](produccion/S10.md); 16 checks with exit 0, two valid MP4s, 900 PNGs extracted from each |
| S11 | 25 s | Implemented, technically closed; audiovisual approval pending | [Dossier](produccion/S11.md); 17 checks with exit 0, two valid MP4s |
| S12 | 20 s | Implemented, technically closed; audiovisual approval pending | [Dossier](produccion/S12.md); 18 checks with exit 0, two valid MP4s |

Total plan: 330 s / 9900 frames at 30 fps. Maximum: 360 s. Complete edit (2026-10-18): composition `VideoCompleto` (“Video” folder, `src/arranque/VideoCompleto.tsx`), 1080 render at `out/video-completo/2026-10-18/arranque-S01-S12-1080.mp4` (9900 frames, 330.000 s; all 11 cuts reviewed at their adjacent frames). No audio; audiovisual approval pending.

## Current handoff scope

Following a later user instruction: finish S06 in this session and deliver a prompt to Claude to implement S07–S08 only. Claude may delegate to Codex; it will not use native Claude subagents. It will apply arranque-motion and the relevant Remotion skills. The handoff will not require sprints, arbiters, loops, or new checkpoints. Historical evidence and copies are retained.

<a id="revisión-integral-s03s12-claude-2026-10-18"></a>

## Comprehensive S03–S12 review (Claude, 2026-10-18)

Visual review of all S03–S12 scenes at 1080p and a parallel static audit with Codex (technical fidelity against the baseline and voice readiness). Codex found no technical contradictions. Evidence: `out/revision-claude/2026-10-18/`, with `stills-v2/`, `cert-S03…S12/`, `regresion-*`, and `gates2/`.

Defects corrected:

| Scene | Defect | Correction |
| --- | --- | --- |
| S12 | The `linux` shot left the upper third empty; Núcleo and Init measured about 216 px, and Rami obscured SPD | Camera `{px:7, py:9, pz:15, tx:5, ty:-.5, tz:1, fov:34}` found using the same `validar-s12` constraints, now applied to the entire cast: ATX harness, panels, subtitle band, exposed Grubi ≤15%, and no overlap between Núcleo/Init. Núcleo and Init measure about 264 px |
| S03 | The “0xFFFFFFF0” capsule passed beneath the “PIIX4E” label and the two blended together | The capsule is drawn on top, and the crossed label fades continuously |
| S03 | The map → flash stroke crossed out “firmware” and “Flash 4 Mbit” | The stroke leaves below the label and enters the flash from the left |
| S04 | Each block's address range overlapped its slab's edge | 23/21 px text inside the 52 px slab |
| S09 | “0xAA=10101010” overflowed the MBR panel | Right-aligned, 20 px |
| S10/S11 | “▶ Stage 1 · 0x7C00” overflowed its 200 px box | 19 px in that box |
| S11 | “31 PG” and “PE 0” looked like values just as PE changes to 1 | “bit 31 · PG” and “PE · bit 0” |
| S03–S12 | The speaker's name, in its accent color, disappeared against light objects (ATX connector, IDE ribbon) | `SubtituloCine contornoNombre`: dark halo. S01/S02 unchanged: goldens 8/8 |
| Voices | With word alignment containing silences, every anchor in a sentence fell in the first segment. In S03, chipset = region = 595; in S11, the handoff lasted −3 frames | `anclaEnCue` distributes the position across all segments of the sentence. New test in `validar-h02` with synthetic word alignment for all scenes: fails with the previous code and passes with the new code |
| Voices | Character alignment never reached `bocaEnFrame` | `rutaCaracteres`, the `ALINEACIONES_CARACTERES` registry, `CueVisual.caracteres`, and `Actor` use it. `validar-h02` checks it. See `VOCES.md` |

Results with bundle `out/revision-claude/2026-10-18/bundle-v2`:
- S03–S12 certifications: exit 0 for all ten (`cierre-tecnico-pasa`; valid preview and 1080).
- S01/S02 goldens: exit 0, 8/8.
- Canonical S03/S05/S06 and supplementary S04 regressions: exit 1, expected result (2/9, 5/9, 4/9, and 3/9). Each difference was located through pixel comparison against the previous pass:
  - Speaker-name strip (y 860–960): every frame with subtitles.
  - Map stroke: S03:707.
  - Flash blocks: S04:133 and S04:217.
  - Previously documented raster instability: S04:660 and S06:275/299, with YMAX ≤ 22 or YAVG < 0.001.
- **Hashes were not updated.** S03–S06 were approved: these visual changes require renewed approval and then `--actualizar` for their references.

Pending before voice generation:
- From S04 onward, `speechText` is identical to `displayText`; the phonetic adaptation of acronyms present in S01–S03 is missing. Pronunciation is left to the user.
- Tight windows at 130 wpm: S03-C01, S08-C01, S01-C01, and S02-C02 (`VOCES.md`).
- `scripts/generar-voces.mjs` remains unimplemented.

## Real voices (2026-10-18)

The 20 ElevenLabs voices are integrated and detailed in [VOCES.md](VOCES.md#producción-real-2026-10-18). Codex implemented the pipeline and choreography synchronization; Claude reviewed and corrected the alignment tail, S02/S12 timing, `SubtituloCine`, and voice selection. With real audio, all validations pass: voices, h02, cine, rigs, mascots, svg, s03–s12, tsc, eslint, and skill. Video with voices: `out/video-completo/2026-10-18-voces/arranque-S01-S12-voces-1080.mp4`, with measured synchronization of 22–89 ms. Resulting visual changes: the S05 cut moves from frame 344 to 429, and the S06 shot change waits until 368. User audiovisual approval, including listening, remains pending.
