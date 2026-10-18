# Documentation

This repository contains an educational animation of a legacy BIOS boot sequence. Documentation is in English; Spanish dialogue, visible labels, asset names, and code identifiers are preserved.

## Development and architecture

- [Project setup and commands](../README.md)
- [Contributing and verification](../CONTRIBUTING.md)
- [Scene contracts, architecture, and validation](arranque/README.md)
- [Production workflow](arranque/PRODUCCION.md)
- [Voice generation and alignment](arranque/VOCES.md)
- [Audio-driven retiming](arranque/RETIMING.md)
- [Character assets](mascotas/README.md)
- [Art direction](mascotas/DIRECCION_ARTISTICA.md)
- [Character rigs](../src/personajes/README.md)
- [Portable test fixture provenance](../tests/fixtures/README.md)

## Historical production records

Scene records and audits are stored in [`arranque/produccion/`](arranque/produccion/). They preserve the evidence, limitations, rejections, and decisions recorded during production. References to ignored `out/` artifacts describe local evidence that is not included in a clone.

The [S03–S12 handoff](arranque/RELEVO-S03-S12.md), [S07–S08 handoff](arranque/RELEVO-CLAUDE-S07-S08.md), and [character production prompt](mascotas/PROMPT_CLAUDE.md) are historical authoring instructions. They do not override a new contributor's explicitly assigned scope.

Several records cite the external specification `SO-ARR-BIOS-001 v2.0.0.md`. That document is not distributed here. The committed test fixture preserves the exact scene names and dialogue used by automated contract checks; local source files define the current executable contracts and timing.
