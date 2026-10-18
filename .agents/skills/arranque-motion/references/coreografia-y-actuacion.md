# Choreography and acting

Use this reference when designing beats, animating the rig or correcting a performance. Every movement must explain a technical fact from the historical specification `SO-ARR-BIOS-001 v2.0.0.md`; link beat, A0x operation or equivalent operation, action, anchor word and frame before animating. The external specification is optional authoring context and is not included; use local contracts and `tests/fixtures/boot-contract.json` for clone checks. Do not add decorative movement to fill silence.

## Build the action and its consequence

Use anticipation → action → squash/settling → receiver reaction. Distinguish characters by responsibility: the button requests; logic coordinates; the power supply confirms; the CPU starts when conditions are met. A reaction can happen while someone else speaks; never overlap voices or make two mouths speak simultaneously.

Exact anticipation and button-press example from [GUION_S02](repo:src/arranque/cine/guion/S02.ts#GUION_S02):

```ts
tl.to(s.pulso, {squash: -0.18, salto: 0, brazoIzq: 60, brazoDer: -60, cejaAltura: -0.3, duration: f(10), ease: "power2.in"}, f(a.boton - 16));
tl.to(s.pulso, {salto: 40, squash: 0.15, duration: f(6), ease: "power2.out"}, f(a.boton - 6));
tl.to(s.pulso, {salto: 0, squash: -0.18, boton: 1, duration: f(4), ease: "power3.in"}, f(a.boton));
tl.to(s.pulso, {squash: 0, boton: 0, brazoIzq: 0, brazoDer: 0, cejaAltura: 0.3, duration: f(14), ease: "elastic.out(1, 0.5)"}, f(a.boton + 6));
```

Arrival at Secu triggers its awakening after the pulse's journey, not before. Use `ease: "none"` for uniform travel; use bounce or elasticity for the body when they help convey effort/reaction. Do not deform electrical levels with a character-like bounce.

Another exact pattern from [GUION_S01](repo:src/arranque/cine/guion/S01.ts#GUION_S01):

```ts
tl.to(s.secu, {led: SECU_ENLACE.led, ojo: SECU_ENLACE.ojo, cejaAltura: SECU_ENLACE.cejaAltura, salto: 10, duration: f(8), ease: "power2.out"}, f(a.espera + 84));
tl.to(s.secu, {salto: 0, duration: f(10), ease: "bounce.out"}, f(a.espera + 92));
```

That partial awakening represents A02: +5VSB powers the logic. [SECU_ENLACE](repo:src/arranque/cine/guion/S02.ts#SECU_ENLACE) retains a dim LED and sleepy eyes until the button press arrives; [PULSO_ENLACE](repo:src/arranque/cine/guion/S02.ts#PULSO_ENLACE) retains the other character's pose at the cut.

## Rig and expression

- Start from [CUERPO_BASE](repo:src/arranque/cine/guion/comun.ts#CUERPO_BASE) and [Cuerpo](repo:src/arranque/cine/guion/comun.ts#Cuerpo); animate flat numerical fields. [poseDesdeCuerpo](repo:src/arranque/cine/Actor.tsx#poseDesdeCuerpo) translates those fields to the rig. Use [EXPRESIONES](repo:src/personajes/poses.ts#EXPRESIONES) and [mezclarPoses](repo:src/personajes/poses.ts#mezclarPoses) for coherent intent.
- Keep rotations readable, approximately between −100° and +100°; this is a learned composition range, not an API clamp. [geometriaBrazo](repo:src/personajes/geometria.ts#geometriaBrazo) and [alcanceBrazo](repo:src/personajes/geometria.ts#alcanceBrazo) extend reach when raising an arm. Review extremes, elbows and silhouette in sequences, including during GSAP overshoot.
- [Personaje](repo:src/personajes/Personaje.tsx#Personaje) keeps arms behind the body; only the hand passes in front when it rises above the shoulder. Do not turn the entire arm into a front layer. Check that raised hands are visible, without crossing eyes or obscuring data.
- Anchor effects to gestures with [manoEnPantalla](repo:src/arranque/cine/Actor.tsx#manoEnPantalla), which reuses actual geometry, instead of approximating the hand with a screen offset.
- Preserve [parpadeoEnFrame](repo:src/personajes/labios.ts#parpadeoEnFrame) and [respiracionEnFrame](repo:src/personajes/labios.ts#respiracionEnFrame): small deterministic movements. Use [anguloVentilador](repo:src/arranque/cine/Actor.tsx#anguloVentilador) for acceleration accumulated from the power event, never an incremental angle per render.

## Mouth and dialogue clock

[Actor](repo:src/arranque/cine/Actor.tsx#Actor) uses [estaHablando](repo:src/arranque/subtitulos.ts#estaHablando) and ALWAYS applies [bocaEnFrame](repo:src/personajes/labios.ts#bocaEnFrame) while speech is active, even on closed-mouth consonants. Do not replace a viseme with surprise, a fixed smile or `apertura > 0`. Emotion only modulates the smile, as in Actor. Outside speech, the pose may express surprise.

[AlineacionCaracteres](repo:src/personajes/labios.ts#AlineacionCaracteres) accepts ElevenLabs character alignment; [segmentosDeCue](repo:src/arranque/subtitulos.ts#segmentosDeCue) supplies the same mouth and subtitle intervals. Without actual recording/alignment, timing is estimated: do not claim validated phonetic synchronization. Also check pauses and consonant closures. Consult [VOCES.md](repo:docs/arranque/VOCES.md).

Pass `node tests/validar-rigs.mjs` and `node tests/validar-cine.mjs`; then inspect anticipation, contact and reaction sequences with audio when available. Record frame and defect for every correction.
