# Codex Powerline

**A customizable Powerline status bar for the OpenAI Codex CLI.**

See your model, context, usage limits, and Git state in your terminal.

[![npm version](https://img.shields.io/npm/v/codex-powerline?logo=npm)](https://www.npmjs.com/package/codex-powerline)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Node.js: 22.12+](https://img.shields.io/badge/Node.js-22.12%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)

![Two Powerline rows with the model, reasoning effort, Git branch, context usage, working directory, and usage limits](https://raw.githubusercontent.com/HajekMartin/codex-powerline/main/docs/powerline-preview.png)

## Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Windows Support](#windows-support)
- [Usage](#usage)
- [Changelog](CHANGELOG.md)
- [Development](#development)
- [Author and Acknowledgments](#author-and-acknowledgments)
- [License](#license)

## Quick Start

Install [Codex CLI](https://developers.openai.com/codex/cli/) and Node.js 22.12 or
newer. Install [codex-powerline from npm](https://www.npmjs.com/package/codex-powerline):

```sh
npm install --global codex-powerline
codex-powerline configure
codex-powerline run
```

Use **Edit Lines** to add and reorder widgets. Open **Powerline Setup** to
choose a theme and separators. The editor previews your changes as you make
them. Press **Ctrl+S** to save, or choose **Save & Exit**.

## Features

- **Live preview:** Arrange widgets, set labels and colors, and preview each row
  before you save.
- **Powerline themes:** Use colored segments, custom separators, padding,
  alignment, and a choice of terminal color levels.
- **Codex metrics:** Display model, reasoning effort, context, tokens, cache,
  and 5-hour or weekly usage. A widget uses data from the active Codex session
  when that data is available.
- **Project and session information:** Show the workspace, working directory,
  Git or Jujutsu state, and Codex permissions. Add your own text, links, or command output.
- **Portable layouts:** Export a configuration as JSON. Import it later by
  merging it with your settings or replacing them.

## Windows Support

The commands work in PowerShell. Use Windows Terminal and a
Powerline-compatible or Nerd Font if arrow separators appear as boxes.
If the launcher cannot find your Codex executable, give it the full path:

```powershell
$env:CODEX_POWERLINE_CODEX = 'C:\path\to\codex.exe'
codex-powerline run
```

## Usage

### Choose a launch mode

| Mode | When to use it |
| --- | --- |
| `run` | Show all configured rows, including ANSI links. Works with a Codex release that supports `--remote`, `--remote-auth-token-env`, and App Server. |
| `native` | Show the first nonempty row in Codex's own footer. Requires [Codex 0.171.0 or newer](https://github.com/openai/codex/releases/tag/rust-v0.171.0) and uses its MCP status line feature. |

```sh
codex-powerline run resume --last
codex-powerline native
```

Both modes forward Codex arguments and leave your Codex config file unchanged.
`run` uses an authenticated loopback connection to the
[Codex App Server](https://learn.chatgpt.com/docs/app-server). Set its refresh
interval in **Configure Status Line**. With `run --no-alt-screen`, use
**Shift+Page Up** and **Shift+Page Down** to browse the wrapper's scrollback.
The wrapper uses an alternate terminal screen, so its scrollback is not copied
to the shell on exit.

Native mode keeps foreground, background, and bold styles. Use `run` for ANSI
links, multiple rows, or slow custom commands. Some data depends on the launch
mode, account, and current Codex session. For example, the cost widget needs
Codex to report session cost.

### Save or import a layout

Settings live at `~/.config/codex-powerline/settings.json`, including on Windows.
Pass `--config PATH` before the command to use another file. Start with the
[Powerline preset](configTemplates/powerline.json) or the
[classic layout](configTemplates/classic.json). Use **Import Config** to
load a previous layout. The old `git-pr` widget ID migrates to `git-review`.
Unknown widgets stay in the file, but do not render. Only import custom command
widgets from configurations you trust.

### Set up the native provider for regular Codex launches

In your user `config.toml`, add these entries to the matching tables. Run
`npm root --global` to find the installed package directory. Use an absolute
path to `node.exe` on Windows if `node` is not on Codex's PATH:

```toml
[features]
tui_extensions_statusline = true

[mcp_servers.codex_powerline]
command = "node"
args = ["/absolute/path/from/npm-root/codex-powerline/dist/codex-powerline.js", "mcp"]

[tui]
status_line_provider = { server = "codex_powerline", tool = "codex_powerline" }
```

### Render without Codex

From a built checkout, use the example payload and preset:

```sh
node dist/codex-powerline.js --config ./configTemplates/powerline.json render < scripts/payload.example.json
```

```powershell
Get-Content -Raw scripts/payload.example.json | node dist/codex-powerline.js --config ./configTemplates/powerline.json render
```

Use `CODEX_POWERLINE_WIDTH` to set the render width.

## Development

To run from a checkout instead of npm, install Bun and run:

```sh
bun install --frozen-lockfile
bun run start configure
bun test
bun run lint
bun run build
node dist/codex-powerline.js --config ./configTemplates/powerline.json run
```

See [AGENTS.md](AGENTS.md) for the project map and reusable development workflows.

## Author and Acknowledgments

**Martin Hájek** is the author and maintainer of Codex Powerline.

Inspired by [ccstatusline](https://github.com/sirmalloc/ccstatusline), created
by Matthew Breedlove. The first version was based on that project. See
[NOTICE](NOTICE) for the upstream attribution and [CHANGELOG.md](CHANGELOG.md)
for release history.

## License

MIT. See [LICENSE](LICENSE) for the terms and copyright notices.
