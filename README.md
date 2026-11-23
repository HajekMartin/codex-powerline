# Codex Powerline

**A customizable Powerline status bar for the OpenAI Codex CLI.**

See your model, context, usage limits, and Git state in your terminal.

[![npm version](https://img.shields.io/npm/v/codex-powerline?logo=npm)](https://www.npmjs.com/package/codex-powerline)
[![Monthly npm downloads](https://img.shields.io/npm/dm/codex-powerline?logo=npm)](https://www.npmjs.com/package/codex-powerline)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Node.js: 22.12+](https://img.shields.io/badge/Node.js-22.12%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)

![Two Powerline rows with the model, reasoning effort, Git branch, context usage, working directory, and usage limits](https://raw.githubusercontent.com/HajekMartin/codex-powerline/main/docs/powerline-preview.png)

</div>

## Contents

- [Install, update, or uninstall](#install-update-or-uninstall)
  - [Windows (PowerShell)](#windows-powershell)
  - [macOS (Zsh)](#macos-zsh)
  - [Linux (Bash)](#linux-bash)
- [Features](#features)
- [Usage](#usage)
- [Contributing](#-contributing)
- [Changelog](CHANGELOG.md)
- [Development](#development)
- [Author and Acknowledgments](#author-and-acknowledgments)
- [License](#license)

## Install, update, or uninstall

### Windows (PowerShell)

**Install.** If you do not have Node.js 22.12 or newer, install Node.js LTS:

```powershell
winget install --id OpenJS.NodeJS.LTS --exact --source winget
```

If `winget` is not available, run the [Node.js LTS Windows installer](https://nodejs.org/en/download).
Open a new PowerShell window so it can find Node.js and npm.

Paste this block. If you already have Codex CLI, skip the first line and use
`codex login` if your install has no `codex.cmd`. If you are already signed
in, skip the sign-in line. In the layout editor, choose **Save & Exit** to save
your layout. The last command starts Codex with the Powerline footer.
The `.cmd` commands also work when PowerShell blocks npm's `.ps1` shims.

```powershell
npm.cmd install --global @openai/codex@latest
npm.cmd install --global codex-powerline@latest
codex.cmd login
codex-powerline.cmd configure
codex-powerline.cmd run
```

If separators appear as boxes, use Windows Terminal with a Powerline-compatible
font or Nerd Font. If Powerline cannot find your existing Codex executable,
replace the example path below with its full path:

```powershell
$env:CODEX_POWERLINE_CODEX = 'C:\path\to\codex.exe'
codex-powerline.cmd run
```

**Update.** Exit the running Powerline session, then run:

```powershell
npm.cmd install --global codex-powerline@latest
codex-powerline.cmd --version
```

**Uninstall.** Exit the running Powerline session, then run:

```powershell
npm.cmd uninstall --global codex-powerline
```

This keeps Codex CLI, Node.js, and your saved layout. Run this only if you
also want to delete the default Powerline settings and their backups:

```powershell
Remove-Item -LiteralPath "$HOME\.config\codex-powerline" -Recurse -Force
```

### macOS (Zsh)

**Install.** If you do not have Node.js 22.12 or newer, install Node.js 24
with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating). If the nvm
installer asks for the Xcode Command Line Tools, run `xcode-select --install`,
finish the installer, then retry this block:

```zsh
touch "$HOME/.zshrc"
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.41.0/install.sh | PROFILE="$HOME/.zshrc" bash
export NVM_DIR="${NVM_DIR:-${XDG_CONFIG_HOME:+$XDG_CONFIG_HOME/nvm}}"
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
. "$NVM_DIR/nvm.sh"
nvm install 24
```

Paste this block. If you already have Codex CLI, skip the first line. If you
are already signed in, skip the sign-in line. In the layout editor, choose
**Save & Exit** to save your layout. The last command starts Codex with the
Powerline footer.

```zsh
npm install --global @openai/codex@latest
npm install --global codex-powerline@latest
codex login
codex-powerline configure
codex-powerline run
```

**Update.** Exit the running Powerline session, then run:

```zsh
npm install --global codex-powerline@latest
codex-powerline --version
```

**Uninstall.** Exit the running Powerline session, then run:

```zsh
npm uninstall --global codex-powerline
```

This keeps Codex CLI, Node.js, and your saved layout. Run this only if you
also want to delete the default Powerline settings and their backups:

```zsh
rm -r "$HOME/.config/codex-powerline"
```

### Linux (Bash)

**Install.** If you do not have Node.js 22.12 or newer, install Node.js 24
with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating). This block
uses `curl`. If it is missing, install it with your distribution's package
manager first.

```bash
touch "$HOME/.bashrc"
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.41.0/install.sh | PROFILE="$HOME/.bashrc" bash
export NVM_DIR="${NVM_DIR:-${XDG_CONFIG_HOME:+$XDG_CONFIG_HOME/nvm}}"
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
. "$NVM_DIR/nvm.sh"
nvm install 24
```

Paste this block. If you already have Codex CLI, skip the first line. If you
are already signed in, skip the sign-in line. In the layout editor, choose
**Save & Exit** to save your layout. The last command starts Codex with the
Powerline footer.

```bash
npm install --global @openai/codex@latest
npm install --global codex-powerline@latest
codex login
codex-powerline configure
codex-powerline run
```

**Update.** Exit the running Powerline session, then run:

```bash
npm install --global codex-powerline@latest
codex-powerline --version
```

**Uninstall.** Exit the running Powerline session, then run:

```bash
npm uninstall --global codex-powerline
```

This keeps Codex CLI, Node.js, and your saved layout. Run this only if you
also want to delete the default Powerline settings and their backups:

```bash
rm -r "$HOME/.config/codex-powerline"
```

## Features

- **Live preview:** Arrange widgets, set labels and colors, and preview each row
  before you save.
- **Powerline themes:** Use colored segments, custom separators, padding,
  alignment, and a choice of terminal color levels.
- **Codex metrics:** Display model, reasoning effort, context, tokens, cache,
  and 5-hour or weekly usage. A widget uses data from the active Codex session
  when that data is available.
- **Project and session information:** Show the ChatGPT workspace, working directory,
  Git or Jujutsu state, and Codex permissions. Add your own text, links, or command output.
- **Portable layouts:** Export a configuration as JSON. Import it later by
  merging it with your settings or replacing them.

## Usage

### Launch Codex with Powerline

```sh
codex-powerline run resume --last
codex-powerline --config ./configTemplates/powerline.json run
```

`run` shows all configured rows, including ANSI links. It forwards Codex
arguments and leaves your Codex config file unchanged. It needs a Codex release
that supports `--remote`, `--remote-auth-token-env`, and the
[Codex App Server](https://learn.chatgpt.com/docs/app-server). Set its refresh
interval in **Configure Status Line**. With `run --no-alt-screen`, use
**Shift+Page Up** and **Shift+Page Down** to browse the wrapper's scrollback.
The wrapper uses an alternate terminal screen, so its scrollback is not copied
to the shell on exit.

The **ChatGPT Workspace** widget shows the name of the workspace selected when
you sign in to Codex. The widget stays hidden if Codex does not report a name.
Use **Current Working Dir** for the local path.

### Save or import a layout

In `codex-powerline configure`, use **Edit Lines** to add and reorder widgets.
Use **Powerline Setup** to choose a theme and separators. Press **Ctrl+S** to
save, or choose **Save & Exit**.

Settings live at `~/.config/codex-powerline/settings.json`, including on Windows.
Pass `--config PATH` before the command to use another file. Start with the
[Powerline preset](configTemplates/powerline.json) or the
[classic layout](configTemplates/classic.json). Use **Import Config** to
load a previous layout. The old `git-pr` widget ID migrates to `git-review`.
Unknown widgets stay in the file, but do not render. Only import custom command
widgets from configurations you trust.

### Render without Codex

```sh
codex-powerline --config ./configTemplates/powerline.json render < scripts/payload.example.json
```

```powershell
Get-Content -Raw scripts/payload.example.json | codex-powerline --config ./configTemplates/powerline.json render
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

## 🤝 Contributing

Contributions are welcome. Open an issue to report a bug or discuss a larger
change. For a code change, fork the repository, create a focused branch, add
tests when they fit, and open a pull request.

Before you open a pull request, run:

```sh
bun test
bun run lint
bun run build
```

## Author and Acknowledgments

**Martin Hájek** is the author and maintainer of Codex Powerline.

Inspired by [ccstatusline](https://github.com/sirmalloc/ccstatusline), created
by Matthew Breedlove. The first version was based on that project. See
[NOTICE](NOTICE) for the upstream attribution and [CHANGELOG.md](CHANGELOG.md)
for release history.

## License

MIT. See [LICENSE](LICENSE) for the terms and copyright notices.
