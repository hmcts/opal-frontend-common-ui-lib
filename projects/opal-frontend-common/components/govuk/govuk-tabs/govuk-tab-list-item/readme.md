---

# GOV.UK Tab List Item Component

This Angular component represents an individual item in the tab navigation for GOV.UK-styled tabs, allowing users to switch between different content panels.

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
import { GovukTabListItemComponent } from '@components/govuk/govuk-tab-list-item/govuk-tab-list-item.component';
```

## Usage

You can use the tab list item component in your template as follows:

```html
<li
  opal-lib-govuk-tab-list-item
  tabsId="example-tabs"
  tabsListItemId="first"
  tabListItemHref="#first-tab"
  tabListItemName="First tab">
</li>
```

### Example in HTML:

```html
<ul class="govuk-tabs__list">
  <li
    opal-lib-govuk-tab-list-item
    tabsId="example-tabs"
    tabsListItemId="first"
    tabListItemHref="#first-tab"
    tabListItemName="First tab">
  </li>
</ul>
```

## Inputs

| Input               | Type     | Description                                                                |
|--------------------|----------|----------------------------------------------------------------------------|
| `tabsId`           | `string` | The unique ID for the tab set; used to generate the list item `id`.        |
| `tabsListItemId`   | `string` | The ID of the tab item (automatically capitalised for ID generation).      |
| `tabListItemHref`  | `string` | The `href` for the tab link.                                               |
| `tabListItemName`  | `string` | The visible text label of the tab link.                                    |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-tab-list-item.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides guidance on how to use the `govuk-tab-list-item` component to create individual tabs for navigation in a GOV.UK-styled tab set.
