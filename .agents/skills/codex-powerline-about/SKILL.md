---
name: codex-powerline-about
description: Draft or update Codex Powerline's GitHub About description and align its README introduction. Use for repository positioning and About metadata, not npm releases.
---

# Codex Powerline GitHub About

Run from the repository root. The maintained About description is in
`docs/github-about.txt`. GitHub does not read this file automatically;
apply it using GitHub CLI when the user requests a live About update.
No CI/CD workflow is needed.

Lead with the OpenAI Codex CLI and the benefit to its users. Describe
ccstatusline as rewritten for Codex, link to
https://github.com/sirmalloc/ccstatusline in the README, and preserve
the upstream credit in `LICENSE` and `NOTICE`. Keep feature claims grounded
in the app. This is an independent project maintained by Martin Hájek.

For wording changes, update `docs/github-about.txt` as one plain-text line
and keep the README introduction consistent. A request to create this skill
or draft copy alone does not request a live GitHub change.

For a requested live update, confirm that `origin` is
`HajekMartin/codex-powerline`, then inspect the existing description:

```sh
git remote get-url origin
gh repo view HajekMartin/codex-powerline --json description --jq .description
```

Apply the maintained text and read it back:

```sh
gh repo edit HajekMartin/codex-powerline --description "$(cat docs/github-about.txt)"
gh repo view HajekMartin/codex-powerline --json description --jq .description
```

Verify that the returned description matches the file. Change only the
description unless the user also requests website or topic changes. If `gh`
is unavailable or authentication fails, report that the live About remains
unchanged and provide the prepared text or command. Do not claim that saving
or pushing the file updates GitHub.

GitHub CLI reference: https://cli.github.com/manual/gh_repo_edit
