---
name: codex-powerline-cli
description: Change or test Codex Powerline's native MCP status provider, multiline terminal launcher, App Server bridge, and Codex telemetry mappings. Use for launch, protocol, resize, terminal restoration, or live status data issues.
---

# Codex Powerline CLI

Pick the affected mode before making a change:

- **Native:** `src/codex/native.ts` accepts a status snapshot in MCP
  `resources/read` metadata and emits a single Codex UI row. Verify protocol
  details against the supported Codex release, not the latest source alone.
  Keep all stdout output valid JSON-RPC on the `mcp` entry point.
- **Multiline:** `src/codex/bridge.ts` relays the stock CLI to App Server over
  authenticated loopback. `telemetry.ts` observes thread-specific metrics.
  `launcher.ts` and `terminal.ts` own footer rows, keyboard forwarding,
  resize, and terminal restoration. Do not mix usage from background threads
  into the active thread.
- **Shared:** Both adapters produce the validated status payload consumed by
  `src/utils/status-render.ts`. Keep data normalization outside the renderer.
  A metric that exists in one mode need not be inferred for the other.

Run `bun test src/codex/__tests__` and `bun run build`. For transport or
terminal changes, use the built entry point with a real interactive terminal
and an isolated `CODEX_HOME`. Check footer visibility, input, resize, and
`/exit` as applicable. Do not use a paid model turn just to check a startup
or rendering path.
