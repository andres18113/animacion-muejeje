# Test fixtures

## Boot contract

`boot-contract.json` contains the twelve original scene names from section 9.1 and the exact Spanish dialogue from section 8 of `SO-ARR-BIOS-001 v2.0.0.md`. The `sourceSha256` field records the SHA-256 of the original source file at extraction time.

The fixture was extracted from the authoring specification rather than generated from application code. It supplies an independent reference for `validar-h02.mjs` and the S07–S12 validators. This removes their former dependency on a specification file outside the repository.

Dialogue and scene names intentionally remain in Spanish because the checks compare them literally against the animation. The original specification is not distributed in this repository.

Update the fixture only when the reference contract changes, retaining source provenance and reviewing the corresponding source changes. Do not rewrite expected dialogue from the implementation merely to make a failing test pass.

## Original montage

`montaje-original.json` preserves the original timing baseline used by montage and retiming checks. Treat it as historical reference data rather than a generated output.

## Approved visual baselines

`visual/macro-encendido/` contains eight original approved PNGs and their hash list, copied byte-for-byte from the historical `out/referencia-aprobada/` directory. The project skill's regression manifest retains the original frame numbers and SHA-256 values.

The offline tooling validator checks these committed files against that manifest and uses one PNG to exercise HTML report generation. It does not render new images or assert that another GPU reproduces the baseline. These reference images are the exception to the policy of excluding generated renders from Git.
