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

# Review guidelines (for automated code review)

These rules are designed for automated PR reviews (e.g., Codex in GitHub). They prioritise clear, actionable feedback and map to severity levels Codex understands.

## How to use

- Apply these rules to changes in this PR only.
- Prefer specific, line-anchored comments with a short rationale and a concrete fix.
- Treat **P0** and **P1** as blocking; **P2** as advisory.

### Scope of review

Automated review should only analyse and comment on **project-owned application code** within this repository.

In particular:

- Focus on TypeScript and templates under `src/app/**`, shared utilities under `src/**`, and configuration that affects runtime behaviour.
- Ignore Cypress code and tests under `cypress/**` (including component tests, e2e tests, mocks, and fixtures).
- Ignore external library code and their internals (for example, any packages starting `hmcts-opal-frontend-common-*` or other third-party dependencies).
- Do not comment on generated files, build outputs, or `node_modules`.

## Severity definitions

- **P0 (blocker):** Security risk, data loss, broken UX/AX, build/test failure, or architectural violation that will be hard to undo.
- **P1 (high):** Regressions in quality, maintainability, or performance with simple fixes.
- **P2 (advice):** Stylistic or non-critical improvements.

---

## Repo scope

Angular v20+ standalone app using GOV.UK/HMCTS design system. Prefer modern Angular primitives (standalone components, template control flow, signals) and accessibility to WCAG 2.2 AA.

---

## P0 rules (must block)

1. **Security & safety**

- Unsanitised HTML or `bypassSecurityTrust*` without justification and tests.
- Interpolating user data into `[innerHTML]`/`[srcdoc]`/`style`, or unsafe URL handling.
- Credentials, tokens, secrets, or PII in code, logs, comments, or tests.

2. **Accessibility (AX)**

- Interactive elements not reachable by keyboard, `click` handlers on non-interactive elements without proper roles/tabindex.
- Missing visible label/`aria-label` for form controls or buttons; images without meaningful `alt`.

3. **Architecture & build integrity**

- New Angular modules where a **standalone** component/route/provider is appropriate.
- Mixing **signals** and imperative RxJS within the same component in a way that causes side-effects in template evaluation.
- Using **barrel exports** (`index.ts`, `export *`) or importing via barrels. Prefer **direct, specific imports** from the declaring file. Keep features self-contained by default.
- CI/test failures, TypeScript errors, or missing required checks.

---

## P1 rules (high priority)

1. **Angular correctness**

- Prefer `@if`, `@for`, `@switch` over legacy structural directives in new/changed templates.
- Use **computed signals** and **pure functions** for derived state; avoid calling methods with side effects in templates.
- Choose RxJS concurrency intentionally: `switchMap` for latest-only, `exhaustMap` for form submit, `concatMap` when order matters.

2. **Code quality fundamentals**

- Use clear, descriptive names for symbols, inputs/outputs, and tests; avoid abbreviations that obscure intent.
- Keep components and services small and cohesive; extract helpers to keep implementations readable.
- Prefer simple, readable code over cleverness; add comments that explain _why_ decisions were made.
- Apply modern Angular features (standalone components, signals, control flow) in new/changed code.

3. **Performance**

- Avoid heavy work in templates (no `.map()`/`.filter()` or non-pure pipes inside bindings).
- Lazy-load routes and large feature areas; avoid broad shared providers when a **standalone provider** suffices.
- Guard against large third-party dependencies; if introduced, note size and reason.

4. **Testing**

- Add/maintain tests for new logic and error/empty states.
- Prefer Angular Testing Library/Harnesses; avoid brittle DOM selectors/data-testids when a Harness exists.

5. **Function design**

- Prefer **small, single-purpose, pure functions**.
- Keep cyclomatic complexity low.
- Pass explicit inputs and return data rather than performing side effects.

---

## P2 rules (advisory)

- Prefer container (smart) vs. presentational component separation when complexity grows.
- Keep features **self-contained** by default. **No barrels** (`index.ts`, `export *`) — prefer direct file imports for tree-shaking.
- Provide brief inline docs when introducing patterns others should copy.

---

## What to ignore (unless requested)

- Typos in comments/docs (treat as P2 unless critical).
- Pure formatting churn without semantic change.

---

## Comment style for the reviewer (automated)

Use this shape to keep feedback crisp and useful:

### Examples

- **P0: Unsanitised HTML**  
  _Problem:_ `[innerHTML]` used with dynamic user content in `case-summary.component.html`.  
  _Why:_ XSS risk.  
  _Fix:_ Remove `innerHTML`, render via bindings/DOM APIs, or use a trusted, sanitised subset with tests.

- **P1: Template work**  
  _Problem:_ Method call `getItems()` used in template; performs filtering.  
  _Why:_ Re-runs each change detection; performance risk.  
  _Fix:_ Move to computed signal `itemsFiltered = computed(() => …)` and bind to that.

- **P1: Concurrency**  
  _Problem:_ Form submit uses `mergeMap`, causing double submits.  
  _Why:_ Users can trigger parallel requests.  
  _Fix:_ Use `exhaustMap` around submit stream and disable button while pending.

---

## Repo links (for humans & tools)

- Angular style: standalone, signals, control flow
- GOV.UK/HMCTS patterns and accessibility
- Testing: Angular Testing Library & Harnesses

(When Codex is invoked with `@codex review`, apply these rules. Treat P0/P1 as blocking; raise P2 as comments.)
