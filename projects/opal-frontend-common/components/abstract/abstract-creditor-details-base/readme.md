# Abstract Creditor Details Base Component

`AbstractCreditorDetailsBaseComponent<THeader, TTab>` is a reusable Angular abstract base for creditor details pages
that need:

- route-resolved header data
- shared header and tab payload transformation
- account version comparison
- creditor account refresh behaviour
- business-unit permission checks
- consistent teardown of transient account store state

It extends `AbstractAccountSummaryBaseComponent`, so the shared account summary refresh, permission, tab transform, and
teardown helpers are also available.

## Installation

Import the class from the secondary entry point:

```ts
import { AbstractCreditorDetailsBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-creditor-details-base';
```

## Generic Types

- `THeader`: Header model resolved on the creditor details route and returned by the header refresh request.
- `TTab`: Tab model for tab-level API responses. Must include `version: string | null`.

## Required Overrides

Subclasses must provide:

- `headerDataRouteKey: string`
- `defaultActiveTab: string`
- `transformItemsConfig: ITransformItem[]`
- `latestBannerMessage: string`
- `permissions: Record<string, number>`
- `payloadTransformer`
- `accountStore`
- `getAccountIdFromRoute(): number`
- `getHeaderData(accountId: number): Observable<THeader>`
- `transformHeaderForStore(accountId: number, header: THeader): void`
- `setupTabDataStream(): void`

`getHeaderDataFromRoute`, `transformHeaderForView`, `transformTabData`, `refreshPage`, and `ngOnDestroy` are implemented
by the base class.

## Expected Store Shape

The consuming app must provide an `accountStore` with this shape:

```ts
{
  account_id(): number | string | null | undefined;
  business_unit_id(): number | string | null | undefined;
  clearSuccessMessage(): void;
  compareVersion(version: string | null): void;
  setHasVersionMismatch(value: boolean): void;
  setSuccessMessage(message: string | null): void;
}
```

The base class uses the store to:

- get the account ID for `refreshPage()`
- get the business unit ID for `hasBusinessUnitPermissionKey(...)`
- compare tab response versions through `fetchTabDataTyped(...)`
- clear success and version mismatch state on destroy
- set the latest data banner message after a successful refresh

## Expected Transformer Shape

The consuming app must provide a `payloadTransformer` with this shape:

```ts
{
  transformPayload<T extends { [key: string]: unknown }>(payload: T, transformItemsConfig: ITransformItem[]): T;
}
```

The base class passes every header and tab payload through:

```ts
this.payloadTransformer.transformPayload(payload, this.transformItemsConfig);
```

Use `transformItemsConfig` to supply the transformation rules for the consuming app.

## Route Data Assumptions

The route must provide:

- enough route context for the consuming component's `getAccountIdFromRoute()` implementation
- resolved header data under `snapshot.data[headerDataRouteKey]`
- an optional route fragment used as the active tab

When no fragment is present, the base class uses `defaultActiveTab`.

Example route shape:

```ts
{
  path: 'accounts/:creditorAccountId',
  component: CreditorDetailsComponent,
  resolve: {
    creditorHeader: creditorHeaderResolver,
  },
}
```

For that route, the component should set:

```ts
protected override readonly headerDataRouteKey = 'creditorHeader';

protected override getAccountIdFromRoute(): number {
  return Number(this.activatedRoute.snapshot.paramMap.get('creditorAccountId'));
}
```

## Shared Methods

- `fetchTabDataTyped(serviceCall: Observable<T>): Observable<T>`
- `refreshPage(): void`
- `hasBusinessUnitPermissionKey(permissionKey: string): boolean`

`fetchTabDataTyped` applies payload transformation, calls `accountStore.compareVersion(...)`, and tears down through the
shared account summary base.

`refreshPage` clears the version mismatch flag, fetches the latest header for `accountStore.account_id()`, stores the raw
header through `transformHeaderForStore(...)`, transforms the header for the view, sets `latestBannerMessage`, and emits
the active refresh fragment.

## Example

```ts
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractCreditorDetailsBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-creditor-details-base';
import { ITransformItem } from '@hmcts/opal-frontend-common/services/transformation-service/interfaces';

type CreditorHeader = { version: string | null; accountName: string };
type CreditorTab = { version: string | null; status: string };

@Component({
  selector: 'app-creditor-details',
  standalone: true,
  templateUrl: './creditor-details.component.html',
})
export class CreditorDetailsComponent extends AbstractCreditorDetailsBaseComponent<CreditorHeader, CreditorTab> {
  private readonly creditorService = inject(CreditorService);
  private readonly transformationService = inject(TransformationService);

  protected override readonly headerDataRouteKey = 'creditorHeader';
  protected override readonly defaultActiveTab = 'at-a-glance';
  protected override readonly latestBannerMessage = 'Latest account data loaded';
  protected override readonly transformItemsConfig: ITransformItem[] = creditorDetailsTransformItemsConfig;
  protected override readonly permissions = creditorDetailsPermissions;
  protected override readonly payloadTransformer = this.transformationService;

  public override readonly accountStore = inject(CreditorAccountStore);

  protected override getAccountIdFromRoute(): number {
    return Number(this.activatedRoute.snapshot.paramMap.get('creditorAccountId'));
  }

  protected override getHeaderData(accountId: number): Observable<CreditorHeader> {
    return this.creditorService.getCreditorHeader(accountId);
  }

  protected override transformHeaderForStore(accountId: number, header: CreditorHeader): void {
    this.accountStore.setAccountHeader(accountId, header);
  }

  protected override setupTabDataStream(): void {
    this.tabData$ = this.fetchTabDataTyped(this.creditorService.getCreditorTab(this.accountId));
  }
}
```

## Testing Guidance

For unit tests, create a small concrete test subclass and verify:

- `accountId` is read through the consuming component's `getAccountIdFromRoute()` implementation
- route data is transformed and stored on init
- route fragments drive `activeTab`, with `defaultActiveTab` as the fallback
- `transformItemsConfig` is passed to the payload transformer for header and tab payloads
- `fetchTabDataTyped` delegates version comparison to `accountStore.compareVersion`
- `refreshPage` clears version mismatch state, refreshes the current store account ID, stores the raw header, transforms
  view data, and sets `latestBannerMessage`
- `hasBusinessUnitPermissionKey` resolves permission keys against `permissions` and `accountStore.business_unit_id()`
- `ngOnDestroy` clears success message and version mismatch state
