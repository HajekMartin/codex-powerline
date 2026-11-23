---
name: codex-powerline-release
description: Prepare and publish Codex Powerline npm releases, including version bumps, release notes, package validation, and npm version conflicts. Use for maintainer release work, not end-user installation.
---

# Codex Powerline releases

Run commands from the repository root. Keep publishing instructions here and
release notes in `CHANGELOG.md`; the README serves users installing Powerline.

## Prepare and validate

Check `package.json`, the changelog, and the working tree. For a new release,
bump the version only if it has not already been prepared:

```sh
npm version patch --no-git-tag-version
```

Choose `minor` or `major` when appropriate. This updates the local version
without creating a Git commit or tag. Move the relevant unreleased notes into
the matching version section in `CHANGELOG.md`.

```sh
bun run release:dry-run
```

This installs locked dependencies, runs lint and the full test suite, builds,
checks the built Node entry point with `--version` and `--help`, and previews
the npm upload. Check that the package includes `dist/codex-powerline.js`, its
chunks, `LICENSE`, and `NOTICE`, and that the built version matches the manifest.

## Publish

When the user requests publishing, run:

```sh
bun run release
```

The same validation runs before uploading the current version. If sign-in is
needed, use `npm login`; npm handles any required two-factor approval. A request
to prepare commands or validate a release alone does not authorize an upload.

After a successful upload, verify the version and public tags:

```sh
npm view codex-powerline versions --json
npm view codex-powerline dist-tags --json
```

## Version conflicts

npm rejects versions that are already published or staged. A dry run checks
the build and packaging; it does not guarantee version availability. A staged
upload is not yet a public release.

On a publish failure, report the error before trying another upload. For a
version conflict, determine whether the intended artifact is already staged
or a new version is needed; do not automatically bump and republish. Use the
[npm staging documentation](https://docs.npmjs.com/cli/v11/commands/npm-stage/)
when inspecting or approving an existing stage, and verify its contents first.
