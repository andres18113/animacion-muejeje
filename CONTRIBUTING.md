# Contributing

## Setup

Use Node.js 24 or later, run `npm ci`, and initialize project tooling with `node scripts/enlazar-skills.mjs`. Run commands from the repository root. Windows and PowerShell are the original production environment.

## Working on scenes

Read the [architecture guide](docs/arranque/README.md) and [production workflow](docs/arranque/PRODUCCION.md). Keep dialogue, subtitle timing, mouth animation, visual anchors, and scene duration consistent. Preserve the previous scene's camera and persistent actor state at each cut.

Choreography must be deterministic for arbitrary frame order. Use the shared frame clock and scene anchors rather than wall-clock time or accumulated mutable animation state. Retain existing composition IDs, Spanish dialogue, and asset paths unless the assigned work explicitly requires changing them.

The canonical project skill is `.agents/skills/arranque-motion/`. Edit its source rather than generated links under `.claude/`. Third-party skills are local tooling and are not bundled with this repository.

## Before submitting

1. Run `npm run lint`.
2. Run every non-helper `.mjs` validator in `tests/`, using the complete command in the [README](README.md#validation).
3. Run `npm run build`.
4. For visual changes, render and inspect affected scenes, transition frames, and relevant action sequences using the production workflow. Keep evidence and report any unresolved limitations.
5. Review the diff for unrelated edits, credentials, generated files, and accidental asset changes.

Do not regenerate paid voice assets as part of ordinary verification. Tests use fixtures and local assets; the existing build and preview do not require a voice-service login.

## Documentation and evidence

Write documentation, commit messages, issue descriptions, and pull request descriptions in English. Preserve literal Spanish examples when they describe the actual animation or validate exact dialogue.

Distinguish automated checks from visual review. Include the commands run, their exit status, inspected artifacts, and pending work. Historical production notes are evidence of their recorded run, not proof that a later environment has passed.

Keep full verbose logs locally and summarize results in the contribution. Do not commit `node_modules/`, `build/`, `out/`, local skill links, or credentials.
