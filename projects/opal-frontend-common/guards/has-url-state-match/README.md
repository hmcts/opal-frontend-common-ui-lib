# Has URL State Match Guard

This Angular guard validates URLs and application state, redirecting when either the URL format is invalid or when the state doesn't match the URL parameters. The guard performs two main checks:

1. **URL Validation**: Ensures the URL structure is canonical/valid
2. **State Validation**: Verifies that the application state matches the URL parameters

If either check fails, the guard redirects to a specified path while preserving query parameters and fragments.

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

The guard performs validation in the following order:


1. **URL Validation**: Calls `hasRouteParams(route)` to check if the URL format is valid
   - If `false`, redirects immediately
   - If `true`, proceeds to state validation

2. **State Validation**: Calls `checkCondition(state, route)` to validate state against URL
   - If `false`, redirects
   - If `true`, allows access

3. **Query Parameters & Fragments**: When redirecting, preserves existing query parameters and fragments

You can create a guard instance by calling the factory function:

```typescript
export const accountValidationGuard = hasUrlStateMatchGuard(
  () => accountService.getState(),
  (route) => !!route.params['accountNumber'], // Returns true if URL is canonical/valid
  (state, route) => state.selectedAccount?.accountNumber === route.params['accountNumber'],
  (route) => `/account/${route.params['accountNumber']}/details`,
);
```

### Advanced Example

```typescript
export const userAccountGuard = hasUrlStateMatchGuard(
  // Get current state
  () => authService.getCurrentUserState(),

  // Check if URL format is valid (has required parameters)
  (route) => {
    const accountId = route.params['accountId'];
    const userId = route.queryParams['userId'];
    return !!(accountId && userId && accountId.match(/^\d+$/));
  },

  // Validate state matches URL parameters
  (state, route) => {
    if (!state.user || !state.selectedAccount) return false;
    return state.user.id === route.queryParams['userId'] && state.selectedAccount.id === route.params['accountId'];
  },

  // Redirect path when validation fails
  (route) => '/dashboard',
);
```

## Inputs

| Input               | Type                                                   | Description                                                             |
| ------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------- |
| `getState`          | `() => T`                                              | Function that returns the current application state                     |
| `hasRouteParams`    | `(route: ActivatedRouteSnapshot) => boolean`           | Function that checks if the route params valid (return `true` if valid) |
| `checkCondition`    | `(state: T, route: ActivatedRouteSnapshot) => boolean` | Function that validates state against route (return `true` if valid)    |
| `getNavigationPath` | `(route: ActivatedRouteSnapshot) => string`            | Function that returns the redirect path when validation fails           |

Example usage of inputs:

```typescript
export const userContextGuard = hasUrlStateMatchGuard(
  () => userService.getCurrentUser(),
  (route) => !!route.queryParams['userId'], // Returns true if URL contains required userId
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

### Error Handling

The guard does not catch errors thrown by the provided functions. If any of the callback functions (`getState`, `isCanonicalUrl`, `checkCondition`, or `getNavigationPath`) throw an error, it will bubble up and should be handled by your application's error handling mechanisms.

### Query Parameters and Fragments

When redirecting, the guard:

- Preserves existing query parameters (only if they exist and are non-empty)
- Preserves URL fragments
- Passes both to the redirect URL

## Testing

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this guard.
If you encounter any bugs or missing functionality, please raise an issue.