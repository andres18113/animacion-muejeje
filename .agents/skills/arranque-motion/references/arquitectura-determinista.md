# Deterministic architecture

Use this reference when implementing or reviewing the clock, state or 3D integration. The platform is Remotion 4.0.536, Node 24 and Windows; do not change dependencies for this skill.

## One frame describes the entire state

1. Define numerical state and a pure script with `inicial()` and `construir(tl, s, f, anclas)`, following [Guion](repo:src/arranque/cine/guion/comun.ts#Guion). `f(frames)` converts relative frames to GSAP seconds.
2. Consume the script through [useCoreografia](repo:src/arranque/cine/coreografia.ts#useCoreografia). [crearMotor](repo:src/arranque/cine/motor.ts#crearMotor) builds a paused timeline, runs `tl.seek(frame / fps, true)` and returns a copy of numbers. GSAP adds `_gsap` to objects: do not spread its internal objects or serialize the original animated state.
3. Draw from that copy. Do not accumulate transforms between renders or depend on Remotion's frame request order. Check forward/backward jumps with two independent engines.
4. Preserve the shared space of [LUGARES](repo:src/arranque/cine/mundo.ts#LUGARES). Use the same [Camara](repo:src/arranque/cine/mundo.ts#Camara) for [Mundo3D](repo:src/arranque/cine/Mundo3D.tsx#Mundo3D) and [crearCamara](repo:src/arranque/cine/mundo.ts#crearCamara)/[proyectar](repo:src/arranque/cine/mundo.ts#proyectar). 2D layers rest on the board, not independent screen coordinates.
5. Set the Three camera within the render body before advancing the frame, as Mundo3D does through [aplicarCamara](repo:src/arranque/cine/mundo.ts#aplicarCamara). Do not replace this synchronization with `useFrame`.

Actual minimal example from [GUION_S02](repo:src/arranque/cine/guion/S02.ts#GUION_S02):

```ts
tl.to(s.senal, {psOn: 1, duration: f(30), ease: "power1.in"}, f(a.psOn));
tl.to(s.senal, {psOnHilo: 1, duration: f(18), ease: "none"}, f(a.psOn + 30));
```

Here `psOn` is visual progress 0..1; the represented electrical level is PS_ON# = 0. Do not confuse the drawing parameter with the logical value.

## Scene integration

Read [ContratoEscena](repo:src/arranque/escenas.ts#ContratoEscena), [ESCENAS](repo:src/arranque/escenas.ts#ESCENAS), [STORYBOARD](repo:src/arranque/tiempo.ts#STORYBOARD) and dialogue in the historical specification `SO-ARR-BIOS-001 v2.0.0.md`, §§8, 9 and 12. The external specification is optional authoring context, not included in the repository; local contracts and `tests/fixtures/boot-contract.json` support clone checks. Contract intervals are global seconds; cues and anchors use scene-relative frames. [FPS](repo:src/arranque/tiempo.ts#FPS) is 30; [duracionEscena](repo:src/arranque/anclas.ts#duracionEscena) derives duration from the storyboard.

Resolve [cuesDeEscena](repo:src/arranque/recursos.ts#cuesDeEscena) and [anclasDeEscena](repo:src/arranque/recursos.ts#anclasDeEscena) together. Reuse [Actor](repo:src/arranque/cine/Actor.tsx#Actor), [SubtituloCine](repo:src/arranque/cine/SubtituloCine.tsx#SubtituloCine) and [CapaAudio](repo:src/arranque/componentes/CapaAudio.tsx#CapaAudio). Components [S01Energia](repo:src/arranque/escenas/S01Energia.tsx#S01Energia) and [S02Orden](repo:src/arranque/escenas/S02Orden.tsx#S02Orden) use `Interactive.create({Component, layout: "absolute-fill"})`; [MacroEncendido](repo:src/arranque/MacroEncendido.tsx#MacroEncendido) consumes them in a `Track`.

In pure modules executed by Node, use relative imports with an explicit `.ts` extension and `import type` for types. Do not import TSX into numerical validations. Preserve CRLF when editing [Root.tsx](repo:src/Root.tsx), and register the composition in `H02-Encendido` using [RemotionRoot](repo:src/Root.tsx#RemotionRoot).

## Prohibited patterns

- `useFrame`, `Math.random()`, `Date` or wall clock to calculate pixels; timers, `setTimeout` and `requestAnimationFrame` to move elements.
- Timed CSS animations/transitions, self-playing timelines, GSAP targeting DOM, Three refs mutated by a ticker.
- React state accumulating progress between frames or effects setting the camera late.
- Network calls, voice generation during rendering and new dependencies. Voice assets are local under [resolverVoz](repo:src/arranque/audio.ts#resolverVoz).

Pass `node tests/validar-cine.mjs`, `node tests/validar-h02.mjs`, `npx tsc` and `npx eslint src`. [validar-cine](repo:tests/validar-cine.mjs) demonstrates numerical state/framing; it does not replace visual inspection or PNG hash comparison.
