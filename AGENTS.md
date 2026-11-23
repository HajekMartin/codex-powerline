# Codex Powerline

Codex Powerline is a TypeScript terminal status bar for the OpenAI Codex CLI.
It is an independent project maintained by Martin Hájek. Keep the upstream
MIT attribution in `LICENSE` and `NOTICE`. Do not add dependencies on another
assistant's runtime, config files, credentials, or transcript format.

## Development

- Install dependencies with `bun install --frozen-lockfile`.
- Run the editor from source with `bun run start configure`.
- Use `bun test <path>` for a focused check and `bun test` for the full suite.
- Keep release notes in `CHANGELOG.md`, not in the README.
- Keep npm publishing instructions in the release skill, not in the README.
- Keep the README short. Give each supported platform one self-contained section
  with copy-paste commands for install, first launch, update, and uninstall.
  Link to prerequisite installers instead of duplicating their instructions.
- Run `bun run lint` and `bun run build` before completing runtime changes.
- Test the built Node entry point as well as source when you change a launch
  path. The published package runs on Node.js, while Bun builds it.
- Use isolated settings and `CODEX_HOME` for integration checks. Do not write
  to the developer's Codex config just to smoke-test the provider.

## Project map

| Area | Location |
| --- | --- |
| CLI and shared renderer | `src/codex-powerline.ts`, `src/utils/status-render.ts`, `src/utils/renderer.ts` |
| Multiline CLI and App Server bridge | `src/codex/` |
| Ink editor and preview | `src/tui/` |
| Widgets and registry | `src/widgets/`, `src/utils/widget-manifest.ts` |
| Settings schema and migrations | `src/types/Settings.ts`, `src/utils/config.ts`, `src/utils/migrations.ts` |

Preserve older layout imports. Unknown widget IDs stay in saved settings and
do not render. Do not register a widget that has no Codex data or other
supported local source. Keep README examples usable from an unpublished checkout.

## Project skills

- [codex-powerline-widgets](.agents/skills/codex-powerline-widgets/SKILL.md):
  add or change widgets, editor previews, themes, and renderer behavior.
- [codex-powerline-cli](.agents/skills/codex-powerline-cli/SKILL.md):
  change or test the multiline launcher, App Server bridge, or telemetry adapter.
- [codex-powerline-release](.agents/skills/codex-powerline-release/SKILL.md):
  prepare versions and release notes, validate packages, and publish to npm.
