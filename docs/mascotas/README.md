# H01 — Creating the *Arranque SO* mascots

**Baseline:** SO-ARR-BIOS-001 v2.0.0.  
**Milestone status:** asset package created; **integration and verification in the Windows project pending**.  
**Scope:** mascot design and test composition only. The video sequence is **not** implemented yet.

## Delivery

- `public/mascotas/`: **45 transparent SVG files** (15 mascots × `neutral`, `hablando` and `alerta` expressions). They are vectors, not generated images with characters outside the baseline.
- `src/mascotas/catalogo.ts`: typed character manifest.
- `src/mascotas/Mascota.tsx`: reusable Remotion component to display, move and simulate mascot speech.
- `src/mascotas/CatalogoMascotas.tsx`: visual inspection composition in a 15-character grid.
- `src/mascotas/EjemploEscena.tsx`: optional minimal scene for checking speaker changes.
- `docs/mascotas/lamina-15-mascotas.png`: visual reference showing all characters. Regenerate it from the SVGs with `npx remotion still src/index.ts LaminaMascotas docs/mascotas/lamina-15-mascotas.png`.
- `docs/mascotas/mascotas-manifiesto.json`: responsibilities and characteristics.
- `docs/mascotas/DIRECCION_ARTISTICA.md`: art and continuity criteria.
- `docs/mascotas/PROMPT_CLAUDE.md`: instructions for Claude to orchestrate integration and delegate checks to Codex.
- `tests/verificar-mascotas.mjs`: basic check without external dependencies.

## Integration into the existing project

From the project root:

```powershell
cd "<project-root>"
```

1. Save the attached ZIP in an accessible folder. Make a copy or commit the project if it has significant changes.
2. Extract the ZIP into the `arranque-so` project **root**, preserving its internal structure. For example, from PowerShell at the project root:

   ```powershell
   Expand-Archive -Path "$env:USERPROFILE\Downloads\arranque-so-mascotas-v1.zip" -DestinationPath "." -Force
   ```

   **Caution:** the ZIP only adds files in `public/mascotas`, `src/mascotas`, `docs/mascotas` and `tests`; it does not replace `package.json`, `src/Root.tsx` or existing videos. Even so, inspect changes before committing them.
3. Validate the delivery:

   ```powershell
   node .\tests\verificar-mascotas.mjs
   ```

4. In the existing `Root.tsx`, register a temporary composition without deleting existing project compositions. Example:

   ```tsx
   import {Composition} from "remotion";
   import {CatalogoMascotas} from "./mascotas/CatalogoMascotas";

   // Inside the existing Root component:
   <Composition
     id="CatalogoMascotas"
     component={CatalogoMascotas}
     durationInFrames={150}
     fps={30}
     width={1920}
     height={1080}
   />
   ```

   The example assumes `Root.tsx` is in `src/`. Claude must inspect the actual tree and adjust imports/registration if it differs.
5. Verify using the Remotion development server already configured in `package.json`; in a conventional project this may be `npm run dev` or `npm start`, depending on its scripts.
6. Render a frame of the composition and check that all 15 characters are visible, unclipped and legible.

## Using a character

```tsx
import {Mascota} from "./mascotas/Mascota";

<Mascota id="bios" tamano={320} expresion="neutral" />
<Mascota id="romi" tamano={320} hablando />
<Mascota id="postin" tamano={320} expresion="alerta" />
```

Animations depend on `useCurrentFrame()` for deterministic rendering. `hablando` alternates between `neutral` and `hablando` expressions while active. There is no phonetic lip synchronization: that is outside H01.

## H01 acceptance criteria

- [ ] All 15 characters are visible, with correct names and roles.
- [ ] All 45 SVGs load in Remotion without errors and retain transparency.
- [ ] Each character changes expression correctly.
- [ ] Animations work through frames, not browser timers.
- [ ] The design matches late-1990s BIOS hardware; no UEFI, GPT or NVMe appears.
- [ ] The test scene can render without changing the existing project structure.
- [ ] Claude has reviewed integration results and records screenshots or rendering evidence.

**Scope note:** these are original, simplified, animatable vector illustrations. They are not photographic replicas of the Intel SE440BX-2 board. Technical text and drawings must represent the essential characteristics without claiming more physical precision than they show.
