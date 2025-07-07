# MOJ Sub Navigation Item Component

This Angular component represents an individual item in the MOJ sub-navigation, used to create links within a sub-navigation bar for secondary navigation.

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
import { MojSubNavigationItemComponent } from '@components/moj/moj-sub-navigation-item/moj-sub-navigation-item.component';
```

## Usage

You can use the sub-navigation item component in your template as follows:

```html
<li opal-lib-moj-sub-navigation-item subNavItemText="Settings" [subNavItemFragment]="'settings'" [activeSubNavItemFragment]="activeTab"></li>
```

### Example in HTML:

```html
<ul class="moj-sub-navigation">
  <li opal-lib-moj-sub-navigation-item
      subNavItemId="settings-tab"
      [subNavItemFragment]="'settings'"
      [activeSubNavItemFragment]="activeTab"
      subNavItemText="Settings">
  </li>
</ul>
```

## Inputs

| Input                      | Type     | Description                                                                 |
|----------------------------|----------|-----------------------------------------------------------------------------|
| `subNavItemText`           | `string` | The text displayed for the navigation link.                                |
| `subNavItemFragment`       | `string` | The fragment identifier used to match active tab state.                    |
| `activeSubNavItemFragment` | `string` | The currently active tab's fragment to compare against.                    |
| `subNavItemId`             | `string` | The ID applied to the `<li>` element for accessibility or testing purposes.|

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `moj-sub-navigation-item.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` explains how to use and configure the `moj-sub-navigation-item` component to create links for secondary navigation in an MOJ application.
