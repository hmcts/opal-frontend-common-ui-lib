# MOJ Primary Navigation Component

Container component for OPAL primary navigation items.

## Installation

```typescript
import { MojPrimaryNavigationComponent } from '@hmcts/opal-frontend-common/components/moj/moj-primary-navigation';
```

## Inputs

| Input                   | Type      | Required | Default | Description                                                                                        |
| ----------------------- | --------- | -------- | ------- | -------------------------------------------------------------------------------------------------- |
| `primaryNavigationId`   | `string`  | Yes      | N/A     | DOM id applied to the navigation wrapper.                                                          |
| `useFragmentNavigation` | `boolean` | No       | `true`  | When `true`, active item follows URL fragment updates. When `false`, fragment updates are ignored. |

## Outputs

| Output                   | Type                   | Description                                  |
| ------------------------ | ---------------------- | -------------------------------------------- |
| `activeItemFragment`     | `EventEmitter<string>` | Emits current fragment in fragment mode.     |
| `navigationItemSelected` | `EventEmitter<string>` | Emits selected item key in path-driven mode. |

## Usage

### Fragment mode (default, backward compatible)

```html
<opal-lib-moj-primary-navigation primaryNavigationId="fines-primary-nav" (activeItemFragment)="active = $event">
  <li
    opal-lib-moj-primary-navigation-item
    primaryNavigationItemId="search-link"
    primaryNavigationItemFragment="search"
    [activeItemFragment]="active"
    primaryNavigationItemText="Search"
  ></li>
</opal-lib-moj-primary-navigation>
```

### Path-driven mode (for route-based top-level nav)

```html
<opal-lib-moj-primary-navigation
  primaryNavigationId="fines-primary-nav"
  [useFragmentNavigation]="false"
  (navigationItemSelected)="onPrimaryNavSelected($event)"
>
  <li
    opal-lib-moj-primary-navigation-item
    primaryNavigationItemId="reports-link"
    primaryNavigationItemFragment="reports"
    [activeItemFragment]="activePrimaryItem"
    primaryNavigationItemText="Reports"
  ></li>
</opal-lib-moj-primary-navigation>
```

```typescript
onPrimaryNavSelected(item: string): void {
  this.activePrimaryItem = item;
  this.router.navigate(['/fines/dashboard', item]);
}
```

## Testing

Unit tests are in `moj-primary-navigation.component.spec.ts`.
