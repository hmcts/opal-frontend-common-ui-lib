# GOV.UK Tab List Item Component

This Angular component renders a single list item wrapper with the appropriate GOV.UK class for use within a tabbed
navigation structure. It renders the `<a>` tab link and projects the link text.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

Each component in the `govuk-tabs` group is exported individually:

```typescript
import { GovukTabListItemComponent } from 'opal-frontend-common/components/govuk/govuk-tabs/govuk-tab-list-item';
```

## Usage

This component renders a list item wrapper with appropriate GOV.UK classes for use within a tabs list.

You must provide the following inputs:

- `tabItemFragment` — a unique string fragment to identify this tab
- `activeTabItemFragment` — the currently selected fragment (e.g. from the route or state)
- `tabItemId` — the unique ID for accessibility

The link text inside the `<a>` is projected using `<ng-content>`.

### Example

```html
<opal-lib-govuk-tabs-list-item
  [tabItemFragment]="'panel-individuals'"
  [activeTabItemFragment]="activeTabFragment"
  [tabItemId]="'tab-individuals'"
>
  Individuals
</opal-lib-govuk-tabs-list-item>
```

This results in:

```html
<li class="govuk-tabs__list-item govuk-tabs__list-item--selected">
  <a
    id="tab-individuals"
    href="#panel-individuals"
    class="govuk-tabs__tab"
    role="tab"
    aria-controls="panel-individuals"
    aria-selected="true"
  >
    Individuals
  </a>
</li>
```

The `govuk-tabs__list-item--selected` class is applied automatically when `tabItemFragment` matches `activeTabItemFragment`.

## Testing

Unit tests for this component can be found in the `govuk-tab-list-item.component.spec.ts` file. To run the tests:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
