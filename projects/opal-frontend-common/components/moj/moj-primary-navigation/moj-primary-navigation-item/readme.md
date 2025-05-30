---

# MOJ Primary Navigation Item Component

This Angular component represents an individual item in the MOJ primary navigation, typically used to create navigation links inside a primary navigation bar.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Methods](#methods)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

```typescript
import { MojPrimaryNavigationItemComponent } from '@components/moj/moj-primary-navigation-item/moj-primary-navigation-item.component';
```

## Usage

You can use the primary navigation item component in your template as follows:

```html
<li
  opal-lib-moj-primary-navigation-item
  primaryNavigationItemId="home-link"
  primaryNavigationItemFragment="home"
  [activeItemFragment]="activeFragment"
  primaryNavigationItemText="Home">
</li>
```

### Example in HTML:

```html
<ul class="moj-primary-navigation">
  <li
    opal-lib-moj-primary-navigation-item
    primaryNavigationItemId="home-link"
    primaryNavigationItemFragment="home"
    [activeItemFragment]="activeFragment"
    primaryNavigationItemText="Home">
  </li>
</ul>
```

## Inputs

| Input                      | Type      | Description                                                                 |
|----------------------------|-----------|-----------------------------------------------------------------------------|
| `primaryNavigationItemId` | `string`  | The ID applied to the `<li>` element for accessibility or testing purposes.|
| `primaryNavigationItemFragment` | `string`  | The fragment identifier this item navigates to.                           |
| `primaryNavigationItemText` | `string` | The text displayed for the navigation link.                                |
| `activeItemFragment`      | `string`  | The current active fragment to compare against for aria-current.           |
| `isLastItem`              | `boolean` | Whether this is the last item in the list (adds `last-item` class).        |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `moj-primary-navigation-item.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` explains how to use the `moj-primary-navigation-item` component to create individual navigation links in the MOJ primary navigation bar.
