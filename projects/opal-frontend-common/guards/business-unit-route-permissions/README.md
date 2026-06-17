# Business Unit Route Permissions Guard

`businessUnitRoutePermissionsGuard` protects Angular routes by checking whether the logged-in user has one of the route's required permissions in the business unit resolved for the current route.

Use this guard when a route needs business-unit-specific permission checks rather than global user permission checks.

## Installation

```typescript
import {
  BUSINESS_UNIT_ID_RESOLVER,
  businessUnitRoutePermissionsGuard,
  type BusinessUnitIdResolver,
} from '@hmcts/opal-frontend-common/guards/business-unit-route-permissions';
```

## Provider Setup

Consuming applications must provide `BUSINESS_UNIT_ID_RESOLVER`. The resolver is application-specific because only the consuming app knows how to derive the business unit from its route, store, or API state.

```typescript
import { Injectable } from '@angular/core';
import { type ActivatedRouteSnapshot, type MaybeAsync } from '@angular/router';
import { type BusinessUnitIdResolver } from '@hmcts/opal-frontend-common/guards/business-unit-route-permissions';

@Injectable({
  providedIn: 'root',
})
export class AccountBusinessUnitResolver implements BusinessUnitIdResolver {
  public resolveBusinessUnitId(route: ActivatedRouteSnapshot): MaybeAsync<number | null> {
    const businessUnitId = Number(route.paramMap.get('businessUnitId'));

    return Number.isFinite(businessUnitId) && businessUnitId > 0 ? businessUnitId : null;
  }
}
```

Register the resolver once in the consuming app's providers:

```typescript
import { type ApplicationConfig } from '@angular/core';
import { BUSINESS_UNIT_ID_RESOLVER } from '@hmcts/opal-frontend-common/guards/business-unit-route-permissions';
import { AccountBusinessUnitResolver } from './account-business-unit.resolver';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: BUSINESS_UNIT_ID_RESOLVER,
      useExisting: AccountBusinessUnitResolver,
    },
  ],
};
```

## Route Data

Routes must declare the permission ids required for that route using `routePermissionId`.

Use `accessDeniedPath` when the route should redirect to a feature-specific denied page. Absolute paths are resolved from the app root. Relative paths are resolved from the current route's parent when one exists, or from the current route when there is no parent.

```typescript
import { type Routes } from '@angular/router';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { businessUnitRoutePermissionsGuard } from '@hmcts/opal-frontend-common/guards/business-unit-route-permissions';
import { accountStateGuard } from './account-state.guard';

export const routes: Routes = [
  {
    path: 'account/:accountId',
    children: [
      {
        path: 'payment-terms/amend',
        canActivate: [authGuard, businessUnitRoutePermissionsGuard, accountStateGuard],
        loadComponent: () => import('./payment-terms-amend.component').then((c) => c.PaymentTermsAmendComponent),
        data: {
          routePermissionId: [77],
          accessDeniedPath: 'payment-terms/denied/permission',
        },
      },
      {
        path: 'payment-terms/denied/:type',
        loadComponent: () =>
          import('./payment-terms-denied.component').then((c) => c.PaymentTermsDeniedComponent),
      },
    ],
  },
];
```

In an account flow, use a relative `accessDeniedPath` so the redirect keeps the current account route, including the account id. Use an absolute `accessDeniedPath`, starting with `/`, only when the denied page lives at the app root.

`routePermissionId` can be either a number or an array of numbers. Access is allowed when the user has at least one declared permission in the resolved business unit.

If no `accessDeniedPath` is supplied, the guard redirects to the common `/access-denied` page.

## Guard Ordering

Place this guard after authentication and before route-state guards that assume the user is allowed to enter the journey.

Recommended ordering:

```typescript
canActivate: [authGuard, businessUnitRoutePermissionsGuard, accountStateGuard];
```

If authentication is already enforced by a parent route, keep `businessUnitRoutePermissionsGuard` before the route-state guard on the child route.

This keeps the checks in this order:

1. The user is authenticated.
2. The user has the required permission in the resolved business unit.
3. The route has the application state needed by the feature.

## Resolver Guidance

The resolver should return a positive numeric business unit id when the route context is valid.

Return `null` when the business unit cannot be determined. The guard treats `null`, non-numeric values, non-finite values, and values less than or equal to zero as permission failures and redirects to the denied page.

The resolver can return a synchronous value, a `Promise`, or an `Observable`.

## Testing

When testing consuming routes, cover both direct navigation and in-journey navigation. Direct navigation is important because guards run before route resolvers, so the business unit id must be available through the `BUSINESS_UNIT_ID_RESOLVER` contract.
