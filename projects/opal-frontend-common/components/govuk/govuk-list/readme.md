# GOV.UK List Component

This component renders a list of actionable links using GOV.UK styles. It is designed for scenarios where users need to select from a set of common actions, such as managing records or initiating processes. Each item appears as a text-based link, typically used in administrative workflows.  

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
import { GovukListComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-list';
import { GovukListLinkComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-list/govuk-list-link';
```

## Usage

You can use the list component in your template as follows:

Example using a list link:

```html
<opal-lib-govuk-list>
  <opal-lib-govuk-list-link
    linkText="Add enforcement action"
    (linkClickEvent)="linkClickEvent1()"
  ></opal-lib-govuk-list-link>
  <opal-lib-govuk-list-link
    linkText="Perform hmrc check"
    (linkClickEvent)="linkClickEvent2()"
  ></opal-lib-govuk-list-link>
  <opal-lib-govuk-list-link
    linkText="Remove enforcement action"
    (linkClickEvent)="linkClickEvent3()"
  ></opal-lib-govuk-list-link>
</opal-lib-govuk-list>
```
## Inputs

There are no custom inputs for this component.

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-list.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
