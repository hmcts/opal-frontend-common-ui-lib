# MOJ Primary Navigation Item Component

Projected list-item component used inside `opal-lib-moj-primary-navigation`.

## Installation

```typescript
import { MojPrimaryNavigationItemComponent } from '@hmcts/opal-frontend-common/components/moj/moj-primary-navigation';
```

## Inputs

| Input                           | Type      | Required | Default | Description                                                                                            |
| ------------------------------- | --------- | -------- | ------- | ------------------------------------------------------------------------------------------------------ |
| `primaryNavigationItemId`       | `string`  | Yes      | N/A     | DOM id for the host `<li>`.                                                                            |
| `primaryNavigationItemFragment` | `string`  | Yes      | N/A     | Item key used for fragment navigation and active-state matching.                                       |
| `primaryNavigationItemText`     | `string`  | Yes      | N/A     | Link text.                                                                                             |
| `activeItemFragment`            | `string`  | Yes      | N/A     | Current active item key for `aria-current`.                                                            |
| `isLastItem`                    | `boolean` | No       | `false` | Adds `last-item` class to host when true.                                                              |
| `useFragmentNavigation`         | `boolean` | No       | `true`  | When false, click emits selection instead of writing URL fragment. Usually set by container component. |

## Outputs

| Output                   | Type                   | Description                                                    |
| ------------------------ | ---------------------- | -------------------------------------------------------------- |
| `navigationItemSelected` | `EventEmitter<string>` | Emits selected item key when `useFragmentNavigation` is false. |

## Usage

```html
<li
  opal-lib-moj-primary-navigation-item
  primaryNavigationItemId="search-link"
  primaryNavigationItemFragment="search"
  [activeItemFragment]="activePrimaryItem"
  primaryNavigationItemText="Search"
></li>
```

## Testing

Unit tests are in `moj-primary-navigation-item.component.spec.ts`.
