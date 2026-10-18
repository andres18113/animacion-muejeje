# Performance, rendering and evidence

Use this reference when inspecting a scene or closing visual regression. Run from the root with Node 24. Do not add dependencies. The actual IDs in [RemotionRoot](repo:src/Root.tsx#RemotionRoot) are `S01Alimentacion`, `S02ControlEncendido` and `MacroEncendido`; component names do not always match IDs.

## One bundle per review

On the host, use only the standard CLI. Example with the existing macro (1350 frames, 1920×1080, 30 fps):

```powershell
npx remotion bundle src/index.ts --out-dir=out/revision/bundle
npx remotion still out/revision/bundle MacroEncendido out/revision/macro-140.png --frame=140 --scale=0.5
npx remotion render out/revision/bundle MacroEncendido out/revision/preview.mp4 --scale=0.5 --concurrency=2
npx remotion render out/revision/bundle MacroEncendido out/revision/final-1080p.mp4 --scale=1 --concurrency=2
```

`remotion bundle` ignores a positional output folder and writes to `./build`: always specify `--out-dir=`.

The entry point is [src/index.ts](repo:src/index.ts); [Root.tsx](repo:src/Root.tsx) registers compositions. Reuse that bundle for all captures, sequences and videos of the same review. If code or assets change, create a new one and record its identity; do not mix evidence from two bundles under the same manifest. A bundle supplied with `--bundle` is the review's responsibility: document the revision it contains.

The Codex sandbox cannot run Remotion CLI: esbuild fails with `Access is denied`. Prepare scripts and `--dry-run` plans, test parsing/HTML/hashing against existing PNGs, and deliver commands to Claude for host execution. Do not replace the CLI with imports from `@remotion/bundler` or `@remotion/renderer`, or attempt to bypass the restriction.

## Inspection order

1. Capture the start, last visible frame, all resolved [ANCLAS_VISUALES](repo:src/arranque/anclas.ts#ANCLAS_VISUALES) frames and the frames on both sides of cuts. Cues use a local clock; convert them to the global clock when reviewing [MacroEncendido](repo:src/arranque/MacroEncendido.tsx#MacroEncendido).
2. Capture N frames before/after every action to read anticipation, contact, travel and reaction. Clamp to the composition's valid interval. Do not accept an action just because its central pose looks good.
3. Generate contact sheets through HTML and headless Chrome, retaining each original PNG. The `chrome-headless-shell` executable is under `node_modules/.remotion`; locate it on disk rather than assuming a specific hash or subdirectory. Escape text/paths in HTML.
4. Avoid passing quoted ffmpeg filters through `npx` on Windows: that chain already failed in this project. Use captures and HTML/Chrome contact sheets; do not add an ffmpeg wrapper to repeat the problem.
5. Watch a half-scale MP4 with `--scale=0.5 --concurrency=2` to reduce memory. Correct rubric failures and repeat affected checks. Then render 1080p (`--scale=1`) and recheck legibility and cuts at final size.

Save the plan, exact commands, exit codes, frames, SHA-256, scale/configuration, `index.html` and `manifest.json` in `out/revision/COMPOSICION/FECHA-HORA/`. Distinguish executed evidence, numerical checks, plans and limitations. A silent preview does not prove phonetic synchronization or mixing; apply the policy in [resolverVoz](repo:src/arranque/audio.ts#resolverVoz) and [VOCES.md](repo:docs/arranque/VOCES.md).

## Determinism and golden frames

Headless WebGL works on the host and has already produced the same SHA-256 for the same frame with the same configuration. Verify this when changing environment or infrastructure; determinism of [crearMotor](repo:src/arranque/cine/motor.ts#crearMotor) alone does not prove pixel identity.

The skill's approved manifest retains eight global MacroEncendido frames: **6, 140, 330, 578, 684, 928, 1148, 1320**, originally `macro-FRAME.png`. Use the same scale, machine/GPU and configuration as the original PNGs when comparing. A PNG hash requires identical bytes; a different GPU/configuration may require a new approved reference.

Regenerate all manifest frames from a fresh bundle and compare SHA-256. For differences, retain expected/actual images and captures: first determine whether visual code, environment, assets or configuration changed. Do not update the reference to hide a failure. `--actualizar` applies only to approved changes; retain the note **“valid for this machine/GPU; regenerate with --actualizar after approved changes”**.

Do not edit [S01Energia](repo:src/arranque/escenas/S01Energia.tsx#S01Energia), [S02Orden](repo:src/arranque/escenas/S02Orden.tsx#S02Orden), [GUION_S01](repo:src/arranque/cine/guion/S01.ts#GUION_S01) or [GUION_S02](repo:src/arranque/cine/guion/S02.ts#GUION_S02) to accommodate a review tool. Tests and records may be extended without changing their visual output.
