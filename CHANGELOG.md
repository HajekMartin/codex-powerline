# Changelog

## Unreleased

- Refresh the footer when Codex changes the model, reasoning effort, speed, or
  working directory, without waiting for a new turn.

## 1.0.0

- First production release on npm.
- Added an optional widget that shows the selected ChatGPT workspace in `run` mode.
- Removed the `native` and `mcp` commands. If you set up the former provider
  manually, remove its `mcp_servers.codex_powerline` table and the
  `tui.status_line_provider` entry that points to it. `run` needs neither setting.
- Added an optional Permissions widget for the active Codex permission profile
  or sandbox mode and approval policy.

## 0.1.0

- Adapted the editor, renderer, and layout format from the MIT-licensed
  [ccstatusline `0c94df7`](https://github.com/sirmalloc/ccstatusline/tree/0c94df755665ed7794f082863821fd5f428cdf60).
- Added native MCP and multiline launch modes, Codex metrics, and separate
  settings for Codex Powerline.
