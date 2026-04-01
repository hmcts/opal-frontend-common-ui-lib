---
name: opal-vitest-guard
description: Guardrails for Vitest changes in opal-frontend-common-ui-lib. Use when editing Vitest config, Angular test setup, or VS Code Vitest Explorer support so the extension path works without regressing the normal Angular CLI Vitest flow.
---

# Opal Vitest Guard

Use this skill when changing `vitest*.ts`, Angular test setup files, or `.vscode` Vitest settings in this repository.

## Core rule
- Keep VS Code `vitest.explorer` support isolated from the normal Angular CLI Vitest runner.

## Guardrails
- Prefer a dedicated `vitest.vscode.config.ts` for editor-only behavior.
- Keep the main [`vitest.config.ts`](../../../../vitest.config.ts) aligned with the Angular CLI runner and free of raw-Vitest-only workarounds.
- Keep the main [`projects/opal-frontend-common/test-setup.ts`](../../../../projects/opal-frontend-common/test-setup.ts) lean.
- Put raw Vitest browser-test bootstrap, component-resource handling, and browser-only widget stubs in [`projects/opal-frontend-common/test-setup.vscode.ts`](../../../../projects/opal-frontend-common/test-setup.vscode.ts) or the VS Code config path, not in the main setup.
- Use current Angular browser testing APIs: `BrowserTestingModule` and `platformBrowserTesting`.
- Do not reintroduce deprecated dynamic-testing APIs from `@angular/platform-browser-dynamic/testing`.
- Preserve Vitest default excludes when adding repo-specific excludes so `node_modules` tests are not collected accidentally.
- Scope VS Code test discovery to `projects/opal-frontend-common/**/*.spec.ts` and `projects/opal-frontend-common/**/*.test.ts`.
- When package-subpath imports such as `@hmcts/opal-frontend-common/...` need to work under raw Vitest, resolve them to source entry points rather than relying on stale built output.

## Validation
- Verify one raw-Vitest command with the VS Code config against a component spec that uses `templateUrl` and `styleUrl` or `styleUrls`.
- Verify one Angular CLI Vitest command still passes with the main config.
- If discovery behavior changes, confirm the VS Code config does not pull in `node_modules` test trees.

## Repo touchpoints
- [`vitest.config.ts`](../../../../vitest.config.ts)
- [`vitest.vscode.config.ts`](../../../../vitest.vscode.config.ts)
- [`projects/opal-frontend-common/test-setup.ts`](../../../../projects/opal-frontend-common/test-setup.ts)
- [`projects/opal-frontend-common/test-setup.vscode.ts`](../../../../projects/opal-frontend-common/test-setup.vscode.ts)
- [`.vscode/settings.json`](../../../../.vscode/settings.json)
