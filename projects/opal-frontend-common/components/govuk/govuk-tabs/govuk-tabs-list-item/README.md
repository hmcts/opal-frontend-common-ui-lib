# GOV.UK Tab List Item Component

This Angular component renders a single `<li>` element with the appropriate GOV.UK class for use within a tabbed navigation structure. It wraps a projected `<a>` tag that acts as the tab link.

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

This component renders a `<li>` with appropriate GOV.UK classes for use within a tabs list. It wraps a projected `<a>` element.

You must provide the following inputs:

- `tabItemFragment` — a unique string fragment to identify this tab
- `activeTabItemFragment` — the currently selected fragment (e.g. from the route or state)
- `tabItemId` — the unique ID for accessibility
- `tabItemText` — the display text for the tab

### Example

```html
<opal-lib-govuk-tabs-list-item
  [tabItemFragment]="'panel-individuals'"
  [activeTabItemFragment]="activeTabFragment"
  [tabItemId]="'tab-individuals'"
  [tabItemText]="'Individuals'"
>
  <a id="tab-individuals" href="#panel-individuals" class="govuk-tabs__tab"> Individuals </a>
</opal-lib-govuk-tabs-list-item>
```

This results in:

```html
<li class="govuk-tabs__list-item govuk-tabs__list-item--selected" id="tab-individuals">
  <a id="tab-individuals" href="#panel-individuals" class="govuk-tabs__tab"> Individuals </a>
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
