# Instructions for Claude — H01 milestone orchestration

## Context

Existing Remotion project `arranque-so`, located at:
`<project-root>`

Baseline `SO-ARR-BIOS-001 v2.0.0`: classic x86 PC (Pentium II), ATX power supply, legacy Intel/Phoenix BIOS, PC100 SDRAM, IDE/ATA HDD, 512-byte MBR sector, GRUB Legacy and Linux x86. Introducing UEFI, ESP, GPT, Secure Boot or NVMe is prohibited. Final video duration: 5 to 6 minutes. This milestone does not animate the complete boot sequence: it integrates and verifies the mascots.

## Claude's role

Act as **orchestrator and quality reviewer**. First inspect the actual project (structure, scripts, Remotion version and existing modifications). Do not delete or rewrite the base project. If it differs from this package's assumptions, adapt only the integration needed.

## Delegation to Codex

Delegate substantial operational tasks to Codex where they allow parallel work without conflicts:

1. Validate the 45 SVGs and manifest: 15 IDs, three expressions per ID, `viewBox`, XML syntax and path compatibility.
2. Integrate `public/mascotas` and `src/mascotas` into the actual tree, retaining the `Mascota` API and avoiding changes to existing components.
3. Prepare or register a temporary `CatalogoMascotas` composition and, if useful, a test scene; reuse the actual Remotion configuration.
4. Run TypeScript/Remotion checks, fix integration errors and produce a verifiable frame or view of all 15 mascots.
5. Report files created or modified, commands run, errors and evidence obtained.

## Checks Claude must perform

- Review Codex's result, naming consistency and late-1990s hardware characteristics.
- Check that `Bios` is not confused with `Romi`, `Cmosi` or `Postín`.
- Open and review the composition render; confirm there are no clipped elements, severe overlaps or illegible labels.
- Reject changes that introduce modern hardware or alter the legacy BIOS approach.
- Keep video timing as requirement RNF-10 for later phases; do not generate the complete film yet.
- Conclude with a short report of met/pending H01 criteria and the next recommended milestone.

## Operational constraints

- Work inside `arranque-so` and request confirmation for destructive operations.
- Do not change dependencies if existing versions already support `Img`, `staticFile`, `useCurrentFrame` and `spring`.
- Do not reuse the first conceptual sheet that added an owl and a computer; the approved characters are exclusively M01–M15.
- Do not alter the BIOS technical specification or the 5:30 script.
- Do not generate a new graphic identity for the mascots without justification and a design review.

## Definition of done

H01 is complete only when integration runs in the local project, the composition is visually verified, expressions are validated and result evidence is recorded. The ZIP provides assets and starter code; it does not itself demonstrate completed local integration.
