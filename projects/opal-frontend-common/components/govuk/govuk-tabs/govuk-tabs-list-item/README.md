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

The component uses content projection to wrap the `<a>` tag inside a `<li>`.

### Example

```html
<opal-lib-govuk-tab-list-item>
  <a id="tab-individuals" href="#panel-individuals" class="govuk-tabs__tab">
    Individuals
  </a>
</opal-lib-govuk-tab-list-item>
```

This results in:

```html
<li class="govuk-tabs__list-item">
  <a id="tab-individuals" href="#panel-individuals" class="govuk-tabs__tab">
    Individuals
  </a>
</li>
```

## Testing

Unit tests for this component can be found in the `govuk-tab-list-item.component.spec.ts` file. To run the tests:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
