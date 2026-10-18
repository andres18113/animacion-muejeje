# Signals, power and anchors

Use this reference when representing a transfer, logical level, voltage or instrument. Review [SENALES_ALIMENTACION](repo:src/arranque/escenas.ts#SENALES_ALIMENTACION), [ESCENAS](repo:src/arranque/escenas.ts#ESCENAS) and operations in the historical specification `SO-ARR-BIOS-001 v2.0.0.md`, §§4, 6, 8, 9.3 and 12. The external specification is optional authoring context and is not included; use local contracts and `tests/fixtures/boot-contract.json` for clone checks.

## Semantic catalog

| Fact | Existing representation | Pass criterion |
| --- | --- | --- |
| A01: AC mains | [OndaAlterna](repo:src/arranque/cine/capas.tsx#OndaAlterna) over [RECORRIDO_RED](repo:src/arranque/cine/Mundo3D.tsx#RECORRIDO_RED) | Oscillating sine wave reaching the power supply; distinguish the shape without relying on labels. |
| A02: +5VSB | [FlujoContinuo](repo:src/arranque/cine/capas.tsx#FlujoContinuo) over [recorridoEspera](repo:src/arranque/cine/Mundo3D.tsx#recorridoEspera) | DC without a sine wave, purple wire and actual trace to LED; Secu receives standby power. Persists after the cut. |
| A03: button | [SenalViajera](repo:src/arranque/cine/capas.tsx#SenalViajera), `persistente={false}` | Pulse/event; does not leave a trace lit indefinitely. |
| A04: PS_ON# | Persistent signal along a trace and then green wire | The board requests by setting level 0; travel explains source and destination. |
| A05: outputs | Orange/red/yellow wires and damped ripple | Power supply responds after the request; there is no stable confirmation yet during settling. |
| A06: PWR_OK | Confirmation along gray wire and return trace | Level 1 only after satisfactory electrical conditions; reaches Secu before action. |
| A07: clock and RESET | Periodic clock pulses, latch release and CPU enabled | Complete power, clock and reset; enabling does not yet mean executing the first instruction. |

Retain these [COLORES_ATX](repo:src/arranque/cine/Mundo3D.tsx#COLORES_ATX) colors:

| Key | Function | Color |
| --- | --- | --- |
| `v33` | +3.3 V, orange | `#F28C28` |
| `v5` | +5 V, red | `#E5383B` |
| `v12` | +12 V, yellow | `#F2D13A` |
| `espera` | +5VSB, purple | `#9B5DE5` |
| `psOn` | PS_ON#, green | `#2DC653` |
| `pwrOk` | PWR_OK, gray | `#B8C0CC` |

[MAZO_ATX](repo:src/arranque/cine/Mundo3D.tsx#MAZO_ATX), [recorridoMazo](repo:src/arranque/cine/Mundo3D.tsx#recorridoMazo) and [PISTAS](repo:src/arranque/cine/Mundo3D.tsx#PISTAS) define geometry shared with the set. Project with [trazar](repo:src/arranque/cine/capas.tsx#trazar); use [puntoEn](repo:src/arranque/cine/capas.tsx#puntoEn) for front/direction and [dParcial](repo:src/arranque/cine/capas.tsx#dParcial) for visible length. Preserve direction: supply→board for power, board→supply for PS_ON#, supply→logic for PWR_OK. Do not draw floating shortcuts.

`persistente=true` retains the level after the front; `false` draws a traveling event. Numerical progress 0..1 is not the electrical level: active PS_ON# uses progress=1 and level=0. Do not assign universal voltages to logical levels.

## Instruments sharing the event

[Trazas](repo:src/arranque/cine/instrumentos.tsx#Trazas) displays channels defined by [Canal](repo:src/arranque/cine/instrumentos.tsx#Canal); its cursor reveals the world's same chronology. Use [escalon](repo:src/arranque/cine/instrumentos.tsx#escalon) for transitions and [subidaEstabilizada](repo:src/arranque/cine/instrumentos.tsx#subidaEstabilizada) for damped ripple. Do not draw a decorative graph disconnected from the event.

In [S01Energia](repo:src/arranque/escenas/S01Energia.tsx#S01Energia), the hologram explains the future output and PWR_OK sequence: actual outputs remain off until S02. In [S02Orden](repo:src/arranque/escenas/S02Orden.tsx#S02Orden), the analyzer records PWR_OK on arrival (`a.pwr + 30`) and RESET on release (`a.reset + 26`), not when the front starts traveling. Preserve this distinction between emission, transit and reception.

## Anchor the fact to the word

Add each event to [ANCLAS_VISUALES](repo:src/arranque/anclas.ts#ANCLAS_VISUALES). [anclaEnCue](repo:src/arranque/anclas.ts#anclaEnCue) finds the phrase in its subtitle segment and calculates `inicioFrame + floor(posicionTexto/longitudTexto * duracionSegmento)`. This is a proportional position, not exact phonetic alignment. If the phrase is split between segments, correct the segment or anchor phrase; do not invent an absolute frame.

Require strictly increasing frames per scene through [anclasDeEscena](repo:src/arranque/recursos.ts#anclasDeEscena) and [validar-h02](repo:tests/validar-h02.mjs). Use relative offsets for anticipation/transit/reaction and document which represents the technical fact. When voice or alignment changes, recalculate the plan and render again. Under §9.3, binary and hexadecimal data must appear during their mention, never after the dialogue ends.

S02 preserves +5VSB throughout with flow `frame + 600` and progress=1: it maintains presence and phase from S01. Record and check similar persistence at every new cut.
