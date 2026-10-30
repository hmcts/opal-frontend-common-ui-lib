# Dependency security

Use this process to investigate and remediate dependencies in this Angular UI library. Follow [repository guidance](../AGENTS.md) and retain review evidence for each change. This runbook does not grant risk acceptance; see [security exceptions](SECURITY_EXCEPTIONS.md).

## Sources of truth and package boundary

- [Root manifest](../package.json): Yarn version, development graph, scripts and any resolutions.
- [Lockfile](../yarn.lock) and [Yarn configuration](../.yarnrc.yml): exact resolutions and the node-modules linker. Inspect effective configuration as well as repository declarations.
- [Angular targets](../angular.json): production library build through `@angular/build:ng-packagr`, tests through `@angular/build:unit-test`, and Angular ESLint. There is no configured serve or SSR target; the root `start` script alone does not establish a working harness.
- [Publication manifest](../projects/opal-frontend-common/package.json), [ng-packagr configuration](../projects/opal-frontend-common/ng-package.json), and [public API](../projects/opal-frontend-common/public-api.ts): the package is built into `dist/opal-frontend-common`, including secondary entrypoints, declarations and styles. The workspace root manifest differs from the published manifest.
- [Export validator](../scripts/validate-path-alias-exports-sync.mjs) and [package validator](../scripts/validate-package-surface.mjs): maintained checks for aliases, export targets and the publish surface.
- [CI workflow](../.github/workflows/npm_build.yml): Node 26.x and required checks. Corepack's prepared fallback differs from the project's Yarn pin; verify that the project pin wins before any dependency command.
- [Renovate configuration](../.github/renovate.json) and [audit baseline](../yarn-audit-known-issues): inspect their actual scope and provenance. Neither supplies exception approval.

Discover workspaces on each run; the current root is the only Yarn workspace. Secondary library entrypoint manifests are not separate Yarn workspaces. No Docker packaging or Jenkins pipeline is tracked here. Consumer images and deployment remain outside this checkout's evidence.

Use the declared development runtime and project-pinned Yarn through Corepack or the repository launcher. Do not use an ambient Yarn Classic installation. Record actual versions and inspect effective `npmRegistryServer`, `npmAuditRegistry`, `npmAuditExcludePackages`, `npmAuditIgnoreAdvisories`, `npmMinimalAgeGate`, `enableScripts` and immutable-install settings without exposing credentials. Preserve release-age controls. If lifecycle scripts are disabled by the execution environment, disclose that limitation and retain script-enabled CI verification as pending.

## Investigation

Capture these scopes separately from the Git root:

```sh
yarn workspaces list --json
yarn npm audit --recursive --environment production --json
yarn npm audit --recursive --json
```

Add `--all` to both audits if multiple workspaces are introduced. Preserve exact commands, Node/Yarn versions, UTC timestamps, revision, dirty status, manifest/lockfile hashes, stdout, stderr and exit status outside application source. Capture unfiltered evidence where permitted; disclose any required filtering. Do not add production counts to complete-graph totals.

Yarn 4.18.1 emits tree-shaped NDJSON with `value` and `children`. It also emits deprecation records whose IDs end in `(deprecation)`; these are maintenance findings, not security advisories. Recognised findings can yield exit 1. Validate report contents, errors and scope before interpreting the status. Empty, malformed, unexpected, incomplete or error-only output is indeterminate. If JSON is empty, retain it and corroborate with the same scope without `--json`, requiring explicit successful completion without findings or errors.

Trace each affected resolved version with `yarn why <package> --recursive --json`, lockfile descriptors and parent manifests. Follow repeated tree references so alternate root routes are included. Confirm affected and patched ranges against current authoritative advisories and package releases. Record canonical advisory identities, severity, every route, direct owning parent, constraints and assessed runtime/build/test/packed exposure. Installed tooling can matter even when absent from the production audit; a library lockfile does not prove consumer image contents or exploitability.

Inspect relevant existing dependency-bot diffs, their exact base/head and CI diagnostics before reusing updates. A green check is evidence only for that revision and the checks actually performed.

## Audit-enforcement follow-up

The current `audit:check` script parses the older `auditAdvisory/data.advisory.id` format, suppresses scanner failures with `|| true` and scans only production. Its parser can produce empty sets for Yarn tree records; a scanner failure can also pass. Treat that behavior as an enforcement defect. Retain an isolated replay demonstrating findings and scanner-error cases; do not replace the application baseline to reproduce it.

A separately scoped repair should preserve execution failures, validate the pinned schema/completion, distinguish deprecations, establish intended production/complete coverage and test findings, successful no-findings output, malformed/empty/incomplete reports and scanner failures. Assign ownership through the repository's actual process. Until repaired, a passing wrapper is not evidence of security verification. Do not change CI or suppression policy merely to make a dependency update pass.

## Supported remediation

Prefer maintained direct or parent releases supporting patched dependencies, followed by targeted `yarn up --recursive <package...>` refreshes within existing ranges. Review every changed descriptor. Check advisory ranges, engines, peers, API/module compatibility and release-age eligibility before choosing versions.

Remove unused tooling only after checking every configured target, script and owned import. Preserve explicit dependencies for code that imports them directly, including editor tooling. Do not remove active functionality or move dependencies between scopes merely to reduce audit counts.

Use a narrow resolution only when necessary and supported by every affected consumer. An override across supported majors requires compatibility evidence, a verified accountable owner, tracking work and a removal condition. Missing ownership makes it an incomplete proposal. Do not silently raise the published runtime floor or claim a passing build repairs existing peer incompatibilities. Docker, shared pipeline and bot policy work require separate scope.

## Exceptions and suppression records

Follow the [exception register](SECURITY_EXCEPTIONS.md). No repository security approval authority or response deadline is documented in the inspected guidance; obtain the actual policy and owner before any risk decision. Do not invent them.

The current baseline contains Angular deprecations at older resolved versions. It is scanner output, not approval evidence, and requires scope review. Do not regenerate it or copy changed versions into it automatically. Remove only verified resolved records with an explanation; unresolved deprecation/version mismatches remain explicit follow-ups. Never broaden acceptance or silently extend expiry.

## Verification and review

Run the repository checks with the declared runtime:

```sh
yarn install --immutable
yarn npm audit --recursive --environment production --json
yarn npm audit --recursive --json
yarn lint
yarn exports:check
yarn build
yarn pack:check
yarn test:coverage
```

Run build, package validation and coverage sequentially: build cleans `dist`, while packaging and test aliases rely on generated output. Inspect diagnostics as well as exit codes. Record peer warnings and failed external service calls rather than presenting local tests as deployment verification. When changing editor-test dependencies, exercise the existing `vitest.vscode.config.ts` against a component using external resources; a CLI smoke test does not verify the editor UI.

Retrace every affected package after installation and check all remaining versions against authoritative vulnerable ranges. Compare equivalent unfiltered scopes using distinct canonical advisories; keep raw record, package/version and deprecation counts separately. Count an advisory as resolved only when every affected occurrence is removed and fresh equivalent audits corroborate it. Report remaining and newly introduced findings explicitly. Exceptions and reclassification are not removals.

Inspect the actual distribution manifest and package surface, including declarations, styles and export targets. Keep required consumer smoke tests and the published support matrix pending when no representative consumer is available. Library lockfile remediation does not update consuming applications' lockfiles.

Retain a review pack outside application source with run/skill/model identity where available, start/end timestamps, before/after evidence, finding and verification ledgers, compatibility decisions, diff and proposed PR text. Preserve it before temporary cleanup; share only sanitised evidence through an approved access-controlled location. Human review, combined CI, consumer checks, publication, image scanning and deployment each need their own observed evidence and authorisation.
