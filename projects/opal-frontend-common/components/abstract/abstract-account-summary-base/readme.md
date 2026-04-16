# Abstract Account Summary Base Component

`AbstractAccountSummaryBaseComponent<THeader, TTab>` is a reusable Angular abstract base for account summary pages that need:

- header retrieval and transformation
- tab data refresh/version comparison helpers
- shared permission checks
- consistent teardown behaviour

It extends `AbstractTabData`, so tab-fragment utilities are also available.

## Installation

Import the class from the secondary entry point:

```ts
import { AbstractAccountSummaryBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-account-summary-base';
```

## Generic Types

- `THeader`: Header model for account summary data.
- `TTab`: Tab model for tab-level API responses. Must include `version: string | null`.

## Required Overrides

Subclasses must implement:

- `getHeaderDataFromRoute(): void`
- `getHeaderData(accountId: number): Observable<THeader>`
- `transformHeaderForStore(accountId: number, header: THeader): void`
- `transformHeaderForView(header: THeader): THeader`

## Optional Override

- `setupTabDataStream(): void`

Default implementation is a no-op. Override it only when your screen needs tab-specific stream setup.

## Shared Methods

- `hasPermission(permission: number): boolean`
- `hasBusinessUnitPermission(permission: number, businessUnitId: number): boolean`
- `refreshPage(accountId: number, onSuccess: (header: THeader) => void): void`
- `fetchTabData(serviceCall: Observable<TTab>, compareVersion: (version: string | null) => void): Observable<TTab>`

`fetchTabData` applies:

- `transformTabData`
- version callback (`compareVersion`)
- `distinctUntilChanged()`
- teardown via `takeUntil(this.destroy$)`

## Example

```ts
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AbstractAccountSummaryBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-account-summary-base';

type AccountHeader = { id: number; accountNumber: string };
type AccountTabResponse = { version: string | null; items: string[] };

@Component({
  selector: 'app-account-summary',
  standalone: true,
  template: '',
})
export class AccountSummaryComponent extends AbstractAccountSummaryBaseComponent<AccountHeader, AccountTabResponse> {
  protected getHeaderDataFromRoute(): void {
    // parse route params and call refreshPage(...)
  }

  protected getHeaderData(accountId: number): Observable<AccountHeader> {
    return of({ id: accountId, accountNumber: 'ACC-001' });
  }

  protected transformHeaderForStore(accountId: number, header: AccountHeader): void {
    // write raw header to store/cache
  }

  protected transformHeaderForView(header: AccountHeader): AccountHeader {
    return header;
  }

  protected override setupTabDataStream(): void {
    // optional tab stream setup
  }
}
```

## Testing Guidance

For unit tests, create a small concrete test subclass and verify:

- lifecycle hooks (`ngOnInit`, `ngOnDestroy`)
- delegation of permission checks to `PermissionsService`
- `refreshPage` callback + refresh fragment emission
- `fetchTabData` version comparison and teardown behaviour
