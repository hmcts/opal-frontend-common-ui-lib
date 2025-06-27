# HOD (Home Office Design) Loading Spinner Content Component

This Angular component provides a Home-office-styled loading spinner content component, this component is used as a wrapper to encapsulate the loading spinner heading and loading spinner informative text.

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
import { HodLoadingSpinnerContentComponent } from '@hmcts/opal-frontend-common/components/hod/hod-loading-spinner/hod-loading-spinner-content';
import { HodLoadingSpinnerTextComponent } from '@hmcts/opal-frontend-common/components/hod/hod-loading-spinner/hod-loading-spinner-content/hod-loading-spinner-text';
```

## Usage

You can use the loading spinner content component in your template as follows:

```html
<div opal-lib-hod-loading-spinner-content>
  <h2 class="govuk-heading-m" opal-lib-hod-loading-spinner-text>Processing request</h2>
  <p class="govuk-body" opal-lib-hod-loading-spinner-text>This may take up to 3 minutes</p>
</div>
```

## Inputs

There are no custom inputs for this component.

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `hod-loading-spinner-content.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
