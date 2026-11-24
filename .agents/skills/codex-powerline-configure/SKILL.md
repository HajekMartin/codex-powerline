---
name: codex-powerline-configure
description: Create or update a user's Codex Powerline layout from a plain-language request without using the interactive editor. Use for settings files, presets, and layout previews, not for adding widgets or changing Codex's own configuration.
---

# Configure Codex Powerline

Use this skill from a Powerline checkout. Use the checkout's CLI to preview
unreleased features. Do not assume an older installed CLI supports them.

1. Turn the request into widget choices, row order, and a plain or Powerline
   style. Infer routine details from the current layout or the closest preset
   in `configTemplates/`. Ask only when a missing choice changes the result in
   a way that matters to the user.
2. Use the schema in `src/types/Settings.ts` and `src/types/Widget.ts` at the
   version the user runs. Look up widget IDs in `src/utils/widget-manifest.ts`,
   legacy aliases in `src/utils/widgets.ts`, and widget-specific options in
   `src/widgets/`. Use existing widgets and unique item IDs. If a requested
   widget is unavailable, point out the gap instead of inventing an ID.
3. Create a named JSON layout, such as `powerline.local.json`, unless the user
   asks to update a specific file or set the default. Without `--config`,
   Powerline uses `~/.config/codex-powerline/settings.json` on all supported
   platforms. For an update, read the target, preserve unrelated settings,
   and keep a backup before replacing it. Do not change Codex's
   `config.toml` or add executable widgets unless the user requests them.
4. Validate a draft before applying it. Check the JSON against the schema and
   check widget IDs against the manifest: unknown IDs pass schema validation
   but do not render. Pipe `scripts/payload.example.json` into
   `codex-powerline --config "<draft-path>" render`. In a checkout, use
   `bun run start --config "<draft-path>" render` instead. Treat warnings that
   the renderer used defaults as a failed check. Use sample fields for any
   requested widget that needs data missing from the example. Omit any
   `custom-command` items from the temporary render copy so the preview does
   not execute them. Keep them in the saved layout if they were already there
   or the user asked for them.
5. Save the checked config and show the file path and the preview. For a
   named layout, give the command
   `codex-powerline --config "<saved-path>" run`. For the default layout,
   `codex-powerline run` is enough. Do not start an interactive session to
   check settings.
