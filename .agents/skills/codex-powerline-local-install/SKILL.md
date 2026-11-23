---
name: codex-powerline-local-install
description: Install or refresh the current checkout as the macOS user's codex-powerline command. Use when the user wants to try local runtime changes in their normal terminal or asks to keep their development install current.
---

# Codex Powerline local install on macOS

Check `command -v codex-powerline` and `npm prefix -g`. If an existing command
resolves outside that prefix, identify which installation is first on PATH
before replacing anything. Use the user's existing writable npm prefix.

From the repository root, after validating the runtime changes, build and
install the npm tarball:

```sh
(
  set -eu
  bun run build
  pack_dir="$(mktemp -d)"
  tarball=
  trap 'test -z "$tarball" || unlink "$pack_dir/$tarball"; rmdir "$pack_dir"' EXIT
  tarball="$(npm pack --pack-destination "$pack_dir" --silent)"
  npm install --global "$pack_dir/$tarball"
)
```

The tarball exercises the built Node entry point, bundled assets, and macOS
postinstall. It can replace the installed package at the same version without
a registry release or a version bump.

Check `command -v codex-powerline` and `codex-powerline --version`, then verify
the changed behavior through that command. For rendering, pass a temporary
`--config` and a sample payload. For terminal smoke tests, use an isolated
`CODEX_HOME`. A running launcher uses the build it started with, so restart it
to see the update.
