# Repository Guidelines

## Project Structure & Module Organization
This repository hosts the Angular library `opal-frontend-common`. Source code lives under `projects/opal-frontend-common`, organised into feature folders such as `components`, `services`, `pipes`, and `stores`. Shared styles are stored in `styles`, and `public-api.ts` governs which symbols are exported. Tests sit beside their subjects as `*.spec.ts`. Build artefacts land in `dist/opal-frontend-common`; clean it before publishing changes.

## Build, Test, and Development Commands
Use Yarn for all tasks:
- `yarn start` serves the example harness via the Angular dev server for local smoke tests.
- `yarn watch` rebuilds the library in development watch mode.
- `yarn build` runs `yarn clean`, builds the production bundle, and copies `README.md` into `dist/`.
- `yarn test` executes the Karma/Jasmine suite once; prefer `yarn test:coverage` for a coverage report in `coverage/`.
- `yarn lint` runs Prettier checks followed by Angular ESLint; apply `yarn prettier:fix` to reformat automatically.

## Coding Style & Naming Conventions
Editors should respect `.editorconfig` (UTF-8, spaces, 2-space indent). Prettier enforces 120-character lines, single quotes, and semicolons. Angular ESLint rules require component selectors to use the `opal-lib-` prefix (kebab-case) and directives to use `opalLib` (camelCase). Keep the public surface curated through `public-api.ts`, and follow the member ordering enforced by ESLint when adding class fields or methods.

## Testing Guidelines
Author Jasmine specs beside their subjects using the `*.spec.ts` suffix. Karma is configured via `karma.conf.js`. Run `yarn test:coverage` before raising PRs and review the generated reports to protect shared utilities, guards, and interceptors. For complex features, add harness components within `components/*/testing` folders to exercise interactions end-to-end.

## Commit & Pull Request Guidelines
Git history favours succinct, descriptive subjects (e.g. `chore(deps): update angular-cli monorepo to v20.3.5`, `PO-2278`). Mirror that structure and include ticket IDs where applicable. Keep commits focused and avoid bundling unrelated refactors. PRs should summarise intent, document testing performed, flag breaking API changes, and attach screenshots or GIFs for UI tweaks. Link Jira or GitHub issues and notify dependent teams if exports or selectors change.
