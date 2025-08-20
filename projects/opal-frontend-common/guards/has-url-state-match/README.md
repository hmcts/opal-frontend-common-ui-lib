# Has URL State Match Guard

This Angular guard validates URL parameters against application state and redirects when they don't match.

## Table of Contents

- [Installation](#installation)
- [Selector](#selector)
- [Usage](#usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Methods](#methods)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

```typescript
import { hasUrlStateMatchGuard } from '@hmcts/opal-frontend-common/guards/has-url-state-match';
```

Ensure the guard is imported in your route configuration:

```typescript
import { hasUrlStateMatchGuard } from '@hmcts/opal-frontend-common/guards/has-url-state-match';

const routes: Routes = [
  {
    path: 'account/:accountNumber/summary',
    component: AccountSummaryComponent,
    canActivate: [yourGuardInstance],
  },
];
```

## Selector

Use this guard factory function to create route guards.

hasUrlStateMatchGuard

## Usage

You can create a guard instance by calling the factory function:

```typescript
export const accountValidationGuard = hasUrlStateMatchGuard(
  () => accountService.getState(),
  (route) => !route.params['accountNumber'],
  (state, route) => state.selectedAccount?.accountNumber === route.params['accountNumber'],
  (route) => `/account/${route.params['accountNumber']}/details`,
);
```

## Inputs

| Input               | Type                                                   | Description                                                                  |
| ------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `getState`          | `() => T`                                              | Function that returns the current application state                          |
| `checkRoute`        | `(route: ActivatedRouteSnapshot) => boolean`           | Function that checks if validation should be skipped (return `true` to skip) |
| `checkCondition`    | `(state: T, route: ActivatedRouteSnapshot) => boolean` | Function that validates state against route (return `true` if valid)         |
| `getNavigationPath` | `(route: ActivatedRouteSnapshot) => string`            | Function that returns the redirect path when validation fails                |

Example usage of inputs:

```typescript
export const userContextGuard = hasUrlStateMatchGuard(
  () => userService.getCurrentUser(),
  (route) => !route.queryParams['userId'],
  (state, route) => state?.id === route.queryParams['userId'],
  () => '/login',
);
```

## Outputs

| Output          | Type                 | Description                                                       |
| --------------- | -------------------- | ----------------------------------------------------------------- |
| `CanActivateFn` | `boolean \| UrlTree` | Returns `true` if access is allowed, or `UrlTree` for redirection |

Example of using the output in routes:

```typescript
const routes: Routes = [
  {
    path: 'account/:accountNumber/summary',
    component: AccountSummaryComponent,
    canActivate: [accountValidationGuard],
  },
];
```

## Methods

There are no custom methods for this guard. It returns a `CanActivateFn` that follows Angular's route guard pattern.

## Testing

Unit tests for this guard are located in the has-url-state-match.guard.spec.ts file.

```bash
npm test
```

## Contributing

Feel free to submit issues or pull requests to improve this guard.
If you encounter any bugs or missing functionality, please raise an issue.

---
