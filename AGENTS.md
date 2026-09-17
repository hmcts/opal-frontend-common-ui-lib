# Repository Guidelines

This file is the entrypoint. It stays brief and points to skills for detailed guidance.

## Skills Map

- `skills/opal-frontend-common-ui-lib/opal-frontend-common-ui-lib-repo-guidelines` for repo structure, build/test commands, style rules, and local tooling.
- `skills/opal-frontend-common-ui-lib/opal-frontend-common-ui-lib-review-guidelines` for code review severity rules and comment format.

## Always-Apply Guardrails

- Do not add secrets, tokens, or PII to code, logs, comments, or tests.
- Prefer standalone components/routes/providers; avoid creating Angular modules by default.
- Avoid barrel exports and barrel imports; use direct imports.

<!-- opal-superpowers-policy:start -->

## Superpowers artifacts

- Treat Superpowers design and implementation-plan artifacts as local-only. Keep them under ignored `docs/superpowers/` paths. Never stage, force-add, commit, or relocate them into a tracked path to bypass ignore rules unless the user explicitly requests it.

<!-- opal-superpowers-policy:end -->
