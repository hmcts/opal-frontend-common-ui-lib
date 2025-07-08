# Custom Action links Component

This Angular component provides a custom action links component, which will be used for the account enquiry flow and other flows throughout the application.

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
import { CustomActionLinksComponent } from '@hmcts/opal-frontend-common/components/custom/custom-action-links';
```

## Usage

You can use the Custom Action Links component in your template as follows:

```html
<opal-lib-custom-action-links>
  <h2 class="govuk-heading-s" heading>Actions</h2>
  <opal-lib-govuk-list links>
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
</opal-lib-custom-action-links>
```

## Inputs

There are no input fields for this component.

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `custom-action-links.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
