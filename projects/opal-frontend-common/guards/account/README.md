# Authenticated Account Guard

`authenticatedAccountGuard` protects routes that need both a valid authenticated session and the logged-in user's
account state. It performs those checks in sequence: authentication is checked first, and user state is requested only
after authentication succeeds.

Use it instead of placing `authGuard` and `accountGuard` in the same route guard array when the account check depends on
authentication. Angular can subscribe to asynchronous guards in an array concurrently, so an array does not provide
that sequencing.

## Import and route setup

```ts
import { type Routes } from '@angular/router';
import { authenticatedAccountGuard } from '@hmcts/opal-frontend-common/guards/account';

export const routes: Routes = [
  {
    path: 'fines',
    canActivateChild: [authenticatedAccountGuard],
    children: [
      {
        path: 'accounts/:accountId',
        loadComponent: () => import('./account.component').then((component) => component.AccountComponent),
      },
    ],
  },
];
```

Apply the guard at the protected route boundary. Do not also add a redundant authentication guard to each child unless a
route has an additional, distinct authentication requirement.

## Outcomes

| Condition | Result |
| --- | --- |
| Authentication returns `true` and user state is `active` | Navigation continues. |
| Authentication returns `false` or either request returns `401` | The cached user state is cleared and the user is sent to the configured SSO login or `/sign-in`. |
| User state is not `active` | The user is sent to `/account-created`. |
| Authentication or user-state request fails for another reason | The user is sent to `/internal-server-error`. |

## Nested routes and request counts

When this guard is used with `canActivateChild`, Angular can evaluate it more than once during a nested navigation.
Each evaluation starts an authentication request, so consumers must check request counts in their own route integration
tests and deployed telemetry. Cover at least:

- A direct deep link to a nested protected route.
- Child-to-child navigation under the protected parent.
- An unauthenticated deep link, which must not call the user-state endpoint.

Do not introduce a process-wide cached authentication result merely to reduce these calls: authentication state is
user-specific and must remain safe across sign-out, a different user signing in, and server-side rendering or hydration.
