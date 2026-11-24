<div align="center">

# ![Codex Powerline](docs/header.svg)

**A customizable Powerline status bar for the OpenAI Codex CLI.**

[ccstatusline](https://github.com/sirmalloc/ccstatusline), rewritten for Codex.
See your model, context, usage limits, and Git state in your terminal, with
flexible layouts, themes, and a live configuration preview.

Give a ⭐ if this project helped you!

[![GitHub stars](https://img.shields.io/github/stars/HajekMartin/codex-powerline?style=social)](https://github.com/HajekMartin/codex-powerline)
[![GitHub forks](https://img.shields.io/github/forks/HajekMartin/codex-powerline?style=social)](https://github.com/HajekMartin/codex-powerline/forks)
[![GitHub watchers](https://img.shields.io/github/watchers/HajekMartin/codex-powerline?style=social)](https://github.com/HajekMartin/codex-powerline)

[![npm version](https://img.shields.io/npm/v/codex-powerline?logo=npm)](https://www.npmjs.com/package/codex-powerline)
[![Monthly npm downloads](https://img.shields.io/npm/dm/codex-powerline?logo=npm)](https://www.npmjs.com/package/codex-powerline)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Made with Bun](https://img.shields.io/badge/Made%20with-Bun-000000?logo=bun)](https://bun.sh/)
[![Node.js: 22.12+](https://img.shields.io/badge/Node.js-22.12%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)

[![GitHub issues](https://img.shields.io/github/issues/HajekMartin/codex-powerline)](https://github.com/HajekMartin/codex-powerline/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/HajekMartin/codex-powerline)](https://github.com/HajekMartin/codex-powerline/pulls)
[![GitHub contributors](https://img.shields.io/github/contributors/HajekMartin/codex-powerline)](https://github.com/HajekMartin/codex-powerline/graphs/contributors)

![Two Powerline rows with the model, reasoning effort, Git branch, context usage, working directory, and usage limits](https://raw.githubusercontent.com/HajekMartin/codex-powerline/main/docs/powerline-preview.png)

</div>

## Contents

- [Install](#-install)
  - [Windows](#-windows)
  - [macOS](#-macos)
  - [Linux](#-linux)
- [Features](#-features)
- [Contributing](#-contributing)
- [Changelog](CHANGELOG.md)
- [Development](#development)
- [Author and Acknowledgments](#author-and-acknowledgments)
- [License](#license)

## 🚀 Install

### 🪟 Windows

Install [Node.js 22.12 or newer](https://nodejs.org/en/download) if needed.
Open PowerShell and paste this block. Sign in, then save and exit the editor.

```powershell
npm install --global @openai/codex codex-powerline
codex login
codex-powerline configure
codex-powerline run
```

**Update Powerline**

```powershell
npm install --global codex-powerline@latest
```

**Uninstall Powerline**

```powershell
npm uninstall --global codex-powerline
```

If PowerShell blocks scripts, paste the same commands into Command Prompt.
If the separators look like boxes, try a Nerd Font in Windows Terminal.

### 🍎 macOS

Install [Node.js 22.12 or newer](https://nodejs.org/en/download) if needed.
Open Terminal and paste this block. Sign in, then save and exit the editor.

The package includes a Nerd Font and installs it automatically. In Apple
Terminal, setup selects it for your current profile; allow Terminal automation
if macOS asks. Other terminal apps may require selecting the font in settings.

```sh
npm install --global @openai/codex codex-powerline
codex login
codex-powerline configure
codex-powerline run
```

**Update Powerline**

```sh
npm install --global codex-powerline@latest
```

**Uninstall Powerline**

```sh
npm uninstall --global codex-powerline
```

### 🐧 Linux

Install [Node.js 22.12 or newer](https://nodejs.org/en/download) if needed.
Open a terminal and paste this block. Sign in, then save and exit the editor.

```sh
npm install --global @openai/codex codex-powerline
codex login
codex-powerline configure
codex-powerline run
```

**Update Powerline**

```sh
npm install --global codex-powerline@latest
```

**Uninstall Powerline**

```sh
npm uninstall --global codex-powerline
```

Uninstalling Powerline keeps Codex CLI, your saved layout, and installed fonts.

## ✨ Features

- 🎨 **Make it yours.** Stack rows, pick a theme, and tweak colors and separators with a live preview.
- ⏱️ **Know what’s left.** See context usage and your 5-hour and weekly limits at a glance.
- 🧠 **See what Codex is using.** Show the active model, reasoning effort, token counts, and cache stats.
- 🌿 **Stay oriented.** Show your working folder, Git or Jujutsu status, and Codex workspace and permissions.
- 📦 **Take your layout with you.** Export your setup as JSON and import it on another machine.

Import [Author’s Favorite](configTemplates/authors-favorite.json) for a Catppuccin layout with four aligned columns for Codex, context, usage and workspace, and Git.

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

Based on [ccstatusline](https://github.com/sirmalloc/ccstatusline), created
by Matthew Breedlove, and rewritten for the OpenAI Codex CLI. See
[NOTICE](NOTICE) for the upstream attribution and [CHANGELOG.md](CHANGELOG.md)
for release history.

## License

MIT. See [LICENSE](LICENSE) for the terms and copyright notices.
