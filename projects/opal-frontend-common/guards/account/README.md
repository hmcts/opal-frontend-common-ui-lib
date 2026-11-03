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
| Authentication returns `false` or authentication returns `401` | The cached user state is cleared and the user is sent to the configured SSO login or `/sign-in`. |
| User-state request returns `401` after authentication succeeds | The cached user state is cleared and the mismatched session is ended. In SSO mode, the browser navigates to `/sso/logout` so its Azure redirect can complete; otherwise the user is sent to `/sign-in`. |
| User state is not `active` | The user is sent to `/account-created`. |
| Authentication or user-state request fails for another reason | The user is sent to `/error/internal-server`. |

## SSO redirects during server-side rendering

The browser redirect helpers record `login` and `logout` with `SERVER_SSO_REDIRECT` when they run on the server.
An application using Angular's `CommonEngine` must provide a callback for each render and send the HTTP redirect after
rendering. `CommonEngine.render()` returns HTML, so it cannot update the Express response by itself. Map only these two
targets to the application's configured SSO endpoints; do not accept an arbitrary URL from route state.

```ts
import { SERVER_SSO_REDIRECT, type ServerSsoRedirectTarget } from '@hmcts/opal-frontend-common/guards/auth';

const ssoRoutes: Record<ServerSsoRedirectTarget, string> = {
  login: '/sso/login',
  logout: '/sso/logout',
};

let ssoRedirectTarget: ServerSsoRedirectTarget | undefined;
const html = await commonEngine.render({
  // Existing render options...
  providers: [
    { provide: SERVER_SSO_REDIRECT, useValue: (target: ServerSsoRedirectTarget) => (ssoRedirectTarget = target) },
  ],
});

if (ssoRedirectTarget) {
  return res.redirect(302, ssoRoutes[ssoRedirectTarget]);
}
res.send(html);
```

## Nested routes and request counts

When this guard is used with `canActivateChild`, Angular can evaluate it more than once during a nested navigation.
The guard shares one authentication request between those evaluations for a navigation, including server-side rendering.
It rechecks authentication for a later navigation. Each SSR request has its own application injector, so this
navigation-scoped cache is not shared between requests or with browser hydration. Cover at least:

- A direct deep link to a nested protected route.
- Child-to-child navigation under the protected parent.
- An unauthenticated deep link, which must not call the user-state endpoint.
- Separate SSR requests, which must each make their own authentication request.

Do not introduce a process-wide authentication cache beyond this navigation-scoped sharing: authentication state is
user-specific and must remain safe across sign-out, a different user signing in, and server-side rendering or hydration.
