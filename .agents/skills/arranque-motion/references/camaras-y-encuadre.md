# Cameras and framing

Use this reference when composing shots, moving the camera or preparing a cut. The world uses arbitrary units and the board occupies y = 0. [LUGARES](repo:src/arranque/cine/mundo.ts#LUGARES) is the shared spatial source; do not move destinations to fix framing.

## Projection and safe zones

[ANCHO](repo:src/arranque/cine/mundo.ts#ANCHO) = 1920 and [ALTO](repo:src/arranque/cine/mundo.ts#ALTO) = 1080. [Camara](repo:src/arranque/cine/mundo.ts#Camara) contains `px, py, pz, tx, ty, tz, fov`. Build with [crearCamara](repo:src/arranque/cine/mundo.ts#crearCamara) and project with [proyectar](repo:src/arranque/cine/mundo.ts#proyectar). Scale is pixels per unit at the subject's depth; do not use a fixed size for characters on the board.

[Actor](repo:src/arranque/cine/Actor.tsx#Actor) uses `tamano = pie.escala * alto`, viewBox 512 and foot baseline 455. Actual height values are 3.0 for Voltio and 2.3 for Pulso/Secu. [validar-cine](repo:tests/validar-cine.mjs) approximates the box with:

```text
u = tamano / 512
izquierda = pie.x - 216*u; derecha = pie.x + 216*u
techo = pie.y - (455 - 60 + salto)*u
base = pie.y + 15*u
```

In every speaking frame, require the complete box inside the frame (including top), apparent height ≥200 px and feet above y=885 when subtitles are present. The validator retains text through `finFrame + 6`, as does [SubtituloCine](repo:src/arranque/cine/SubtituloCine.tsx#SubtituloCine). Extras entering that band produce a warning; review them visually and avoid interference. The numerical box does not prove that hands, effects, squash or shadows are clear: inspect the render.

## Search for composition before animating

1. Define subject, receiver and desired screen region; for example, Secu in the foreground and connector/CPU behind. Add height, edge and subtitle-band constraints for subjects.
2. Search a bounded grid of positions, targets and FOV with the skill's solver. Use actual projections; discard points behind the camera and candidates outside the region. Evaluate all constraints, not just the subject's center.
3. Test the best candidates with maximum-extension states: jump, lean, arm and illuminated receiver. Keep the speaking subject fully in frame during movement between cameras.
4. Render a transition sequence. Check travel direction and cause→destination relationship; the camera must reveal information, not wander.

Use [CAMARAS_S01](repo:src/arranque/cine/guion/S01.ts#CAMARAS_S01) and [CAMARAS_S02](repo:src/arranque/cine/guion/S02.ts#CAMARAS_S02) as examples of literals, without copying them out of context. S02's `conector` shot makes Secu readable in the foreground and its target in the background. Do not turn the world into beige backgrounds, card grids, static panels, slide titles or time labels.

## Continuity at the cut

Share a linking camera and complete character and signal states. For new scenes, keep N's last visible frame equal to N+1's first in camera and characters; include an ending hold if needed. Also check persistence (e.g. +5VSB), flow phase, orientation, lighting and spatial position.

The existing reference uses [CAMARA_PUENTE](repo:src/arranque/cine/mundo.ts#CAMARA_PUENTE):

```ts
{px: 1.2, py: 8.4, pz: 11.2, tx: -0.6, ty: 0, tz: 0.4, fov: 40}
```

Preserve the exact approved checks: S01 camera at frame 600 = S02 at 0 with tolerance 1e-6; S01 characters at 599 = S02 at 0; positional jump between S01 camera at 599 and S02 start is <0.2. Do not describe that last check as exact equality of the visible frame. [GUION_S01](repo:src/arranque/cine/guion/S01.ts#GUION_S01) and [GUION_S02](repo:src/arranque/cine/guion/S02.ts#GUION_S02) are the approved reference: do not adjust their pixels when extending the infrastructure.

Pass `node tests/validar-cine.mjs`; also review global frames 599/600 in [MacroEncendido](repo:src/arranque/MacroEncendido.tsx#MacroEncendido), together with a before/after-cut sequence. For future links, register camera, shared actors and persistent states in their continuity test.
