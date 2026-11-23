---
name: codex-powerline-widgets
description: Add or change Codex Powerline widgets, Powerline themes, renderer layout, and widget previews or controls in the Ink editor. Use for widget settings compatibility and display bugs, not Codex App Server or MCP protocol work.
---

# Codex Powerline widgets

1. Find the closest supported widget in `src/widgets/` and reuse its shared
   formatter or editor controls. Register each new widget ID in
   `src/utils/widget-manifest.ts` and export its class from `src/widgets/index.ts`.
2. Give preview mode a representative sample without running commands or
   reading live session data. Use the relevant fields in `RenderContext` for
   live mode. If a field is unavailable, hide the widget or use its existing
   no-data behavior. Do not present missing usage or cost as zero.
3. Keep existing widget IDs and metadata readable. If an ID must change,
   add its old spelling to the aliases in `src/utils/widgets.ts`. Imported
   unknown widgets remain in the file but do not render.
4. Check the affected widget and renderer tests. Smoke-test styled output
   from the built CLI with `scripts/payload.example.json`. For a layout bug,
   include both Powerline and plain layouts when both share the changed path.

The preview and the live renderer both use the widget registry. Native MCP
uses the first nonempty rendered row and converts its styles to Codex UI
nodes. The multiline mode prints ANSI rows and supports OSC 8 links.
