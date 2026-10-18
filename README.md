# animacion-muejeje

A five-minute educational animation about legacy PC startup: from ATX standby power and the power button to BIOS initialization, the master boot record, GRUB Legacy, and Linux PID 1.

Built with **Remotion 4.0.536**, **React 19**, **Three.js**, **React Three Fiber**, **GSAP**, and **TypeScript**. Twelve connected scenes combine a 3D motherboard, animated characters, traveling signals, Spanish dialogue, synchronized mouths, and subtitles.

Documentation is in English. The animation's dialogue, visible labels, composition IDs, and source identifiers retain their original Spanish names.

## Quick start

Use **Node.js 24 or later** for the full development and validation workflow. The validation scripts import TypeScript directly through Node. npm is also required.

```sh
git clone https://github.com/andres18113/animacion-muejeje.git
cd animacion-muejeje
npm ci
node scripts/enlazar-skills.mjs
npm run dev
```

Open the address printed by Remotion Studio and select **Video → VideoCompleto**. The main composition is **1920 × 1080**, **30 fps**, and **9,000 frames (300 seconds)**. Individual scenes and character previews are available in the Studio folders.

The skill setup command creates local links from `.claude/skills/` to the canonical project tooling in `.agents/skills/`. These links are generated locally and excluded from Git.

## Scenes

| Scene | Studio composition | Subject |
| --- | --- | --- |
| S01 | `S01Alimentacion` | ATX standby power |
| S02 | `S02ControlEncendido` | Power button, rails, PWR_OK, and RESET |
| S03 | `S03PrimeraInstruccion` | CPU reset vector and the first instruction |
| S04 | `S04BiosFlashCmos` | BIOS, flash storage, and CMOS settings |
| S05 | `S05PostMemoria` | POST, SPD, and SDRAM initialization |
| S06 | `S06ServiciosDispositivos` | BIOS services and peripheral structures |
| S07 | `S07SeleccionDispositivo` | Boot order and INT 19h |
| S08 | `S08LecturaSector` | INT 13h and the first disk sector |
| S09 | `S09EstructuraMbr` | MBR code, partition table, and signature |
| S10 | `S10GrubLegacy` | GRUB Legacy boot stages |
| S11 | `S11TransferenciaNucleo` | Preparing and entering the kernel |
| S12 | `S12InicioSistema` | Linux startup and PID 1 |

## Build and export

Create the browser bundle:

```sh
npm run build
```

Render the full video or one scene:

```sh
npx remotion render src/index.ts VideoCompleto out/animacion-muejeje.mp4
npx remotion render src/index.ts S03PrimeraInstruccion out/s03.mp4
```

Render the character sheet:

```sh
npx remotion still src/index.ts LaminaMascotas out/characters.png
```

Rendering needs a working Chromium/WebGL environment and may be expensive. Generated bundles, videos, logs, and review artifacts are excluded from version control.

## Validation

Run linting and TypeScript checks:

```sh
npm run lint
```

Run the complete script-based test suite from the repository root in PowerShell:

```powershell
Get-ChildItem tests -File -Filter '*.mjs' |
  Where-Object Name -NotLike 'comun-*' |
  Sort-Object Name |
  ForEach-Object {
    node $_.FullName
    if ($LASTEXITCODE -ne 0) { throw "Failed: $($_.Name)" }
  }
```

The suite covers scene contracts, dialogue and audio alignment, character geometry and rigs, camera framing, continuity, deterministic seeking, montage timing, and production tooling. Numeric checks and a successful build do not establish visual approval; production review also requires inspecting rendered evidence.

Tests use independent reference data in [`tests/fixtures/boot-contract.json`](tests/fixtures/boot-contract.json). The original external authoring specification is not required to run them. See the [fixture provenance](tests/fixtures/README.md).

## Project layout

| Path | Purpose |
| --- | --- |
| `src/Root.tsx` | Studio compositions and folders |
| `src/arranque/` | Scene contracts, timing, dialogue, audio, and the full montage |
| `src/arranque/cine/` | Deterministic choreography, cameras, world geometry, and rendering |
| `src/arranque/escenas/` | Individual scene components |
| `src/mascotas/` | Character catalog and SVG presentation |
| `src/personajes/` | Generated rigs, poses, blinking, and mouth animation |
| `public/mascotas/` | Character SVG assets |
| `public/voces/` | Recorded voice assets and alignment metadata |
| `scripts/` | Asset generation, production review, and certification tools |
| `tests/` | Automated validators and independent fixtures |
| `docs/` | Architecture, workflow, art direction, and historical records |
| `.agents/skills/arranque-motion/` | Project-specific animation workflow and review tools |

## Audio and assets

Voice recordings and alignment files are included, so previewing and rendering existing scenes do not require an ElevenLabs account. Regeneration is an optional authoring operation using the authenticated ElevenLabs CLI; read the [voice workflow](docs/arranque/VOCES.md) before using it.

Background music is included at `public/musica/fondo.mp3`. If that file is removed, the music component stays silent.

Regenerate the committed character rigs only when their source SVGs change:

```sh
node scripts/generar-rigs.mjs
node tests/validar-rigs.mjs
```

## Documentation

Start with the [documentation index](docs/README.md), [animation architecture](docs/arranque/README.md), [production workflow](docs/arranque/PRODUCCION.md), and [contributing guide](CONTRIBUTING.md).

Production records refer to historical renders, local review folders, and earlier acceptance decisions. Files under `out/` are not distributed with the repository, and historical results are not a certification of a new checkout or rendering environment.

## License

The project is marked `UNLICENSED` in `package.json`; no open-source license is granted by this repository. Dependencies and third-party tools retain their respective licenses. Review the applicable Remotion terms before production or commercial use.
