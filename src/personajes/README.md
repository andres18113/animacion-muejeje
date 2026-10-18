# Mascot rigs

`Personaje` draws an inline 512 × 512 SVG. It accepts `id: MascotaId`,
`tamano` in pixels (512 by default) and a complete or partial `pose`.
It exports `Pose`, `PoseParcial`, `Boca`, `POSE_BASE`, `mezclarPoses` and
`EXPRESIONES`. Pure calculations can be imported from `poses.ts`,
`geometria.ts` and `labios.ts` with Node 24, without React.

## Pose conventions

- `x`, `y` and `salto`: viewBox units; positive jump raises the character.
- `inclinacion`, `brazoIzq/Der`, `codoIzq/Der`, `ventilador`: degrees.
  Left/right refer to the sides of the image.
- `paso`: phase in radians, with alternating 12-unit elevation.
- `squash`: relative vertical variation around y=455; reciprocal horizontal
  scale to preserve area. Zero preserves the original.
- `ojo`: closure from 0 to 1; at 1, sleeping-eye lines appear.
- `mirada.x/y`, `cejas.altura/angulo`, `boca.sonrisa`: −1 to 1.
  Positive angle interpolates the eyebrows from the alert SVG.
- `mejillas`, `boton`, `led`, `boca.apertura/ancho/redondez`: 0 to 1.
  Cheeks=0.25 and LED=0.5 preserve the original SVG; LED=0 darkens,
  LED=1 brightens and adds a glow. Button=1 shifts the button and its face
  by 6 units and compresses them vertically.

`mezclarPoses(a, b, t)` blends nested fields without mutating inputs. Fields
omitted in `a` take base values; those omitted in `b` retain `a`.
The factor is clamped to 0…1. Expression presets describe only the face.

## Lips and timing

`bocaEnFrame({cue, segmentos, frame, fps, alineacion?})` returns a `Boca`.
`frame` and segments use **scene-relative** coordinates.
Alignment seconds are **relative to the cue's start**:

```ts
const alineacion = {
  characters: ["a", "m", "o"],
  character_start_times_seconds: [0, 0.5, 1.5],
  character_end_times_seconds: [0.5, 1, 2],
};
```

Arrays must have equal lengths, with finite, ordered, nonoverlapping times
within the cue. Zero-duration characters are accepted.
`undefined`/`null` estimates from `speechText` characters, distributed across
the accumulated spoken duration, excluding gaps between segments.
An empty alignment means silence. Alignment gaps also close the mouth,
even while the subtitle remains visible.

A smooth two-frame window at 30 fps blends neighboring visemes. Entry and
exit smooth all parameters, with opening exactly zero outside spoken
intervals. When closing in the base pose, the mouth retains the literal neutral
path and morphs through four cubic curves toward an ellipse calibrated
against the speaking/alert SVGs. The tongue is clipped inside the mouth.

`parpadeoEnFrame(frame, semilla, fps=30)` uses a local integer generator:
75…150-frame intervals and 5…7-frame closures at 30 fps, with at least
one fully closed frame. `respiracionEnFrame` returns a 0…1 sine wave
phase-shifted by seed. Using the id as seed separates the characters.

## Generation and checking

`node scripts/generar-rigs.mjs` regenerates `rigs.generated.ts` from the 45 SVGs
and the catalog. It uses only local modules and Node built-ins. It preserves
original markup, layer order, strokes, transformations and coordinates. It
validates the expected XML subset and fails on incompatible templates. The fan
rotates within its original transform around local center 202,214.

`node tests/validar-rigs.mjs` checks all 15 rigs, original mouth paths,
rejection of incompatible SVGs, ranges, continuity, silence and determinism of
the four cues; it tests synthetic alignment, full closures and 135000 frames
of blinking. The generated file is part of the delivered source code;
it is not generated during rendering.

The Remotion **Rigs** folder contains `PruebaRigs` (600 frames, 30 fps,
1920 × 1080) and `ComparacionRigs` (1 frame). The comparison uses Voltio, Pulso,
Secu, Cipu, Postín and Grubi: a fixed selection for reproducible renders,
including two displaced faces. The test preserves the cues' scene timing:
Secu starts at f180 and its dialogue ends at f740, so the final 140 frames
do not fit within the requested test duration.

Limitations: without audio or actual alignment, visemes are an orthographic
approximation, not a phonetic transcription. The official comparison render
could not run in this sandbox because of esbuild's `Access is denied`; visual
inspection on the host remains pending. No alternative renderer was used.
