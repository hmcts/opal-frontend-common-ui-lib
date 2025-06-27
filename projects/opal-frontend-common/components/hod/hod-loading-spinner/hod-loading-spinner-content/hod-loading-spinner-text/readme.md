# HOD (Home Office Design) Loading Spinner text Component

This Angular component provides a Home-office-styled loading spinner text component, this component is used to display the heading and text for the loading spinner text component.

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
import { HodLoadingSpinnerTextComponent } from '@hmcts/opal-frontend-common/components/hod/hod-loading-spinner/hod-loading-spinner-content/hod-loading-spinner-text';
```

## Usage

You can use the loading spinner content text component in your template as follows:

```html
<h2 class="govuk-heading-m" opal-lib-hod-loading-spinner-text>Processing request</h2>
<p class="govuk-body" opal-lib-hod-loading-spinner-text>This may take up to 3 minutes</p>
```

## Inputs

There are no custom inputs for this component.

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `hod-loading-spinner-content-text.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
