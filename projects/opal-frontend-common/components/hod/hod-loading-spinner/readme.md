# HOD (Home Office Design) Loading Spinner Component

This Angular component provides a Home-office-styled loading spinner component, following Hod design and accessibility standards.

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
import { HodLoadingSpinnerComponent } from '@hmcts/opal-frontend-common/components/hod/hod-loading-spinner';
```

## Usage

You can use the loading spinner component in your template as follows:

```html
<opal-lib-hod-loading-spinner spinnerId="dashboard">
  <h1 class="govuk-heading-m govuk-!-margin-bottom-0">Loading Dashboard...</h1>
  <p class="govuk-body">Please wait while we load the dashboard data.</p>
</opal-lib-hod-loading-spinner>
```

## Inputs

| Input       | Type     | Description                    |
| ----------- | -------- | ------------------------------ |
| `spinnerId` | `string` | The ID of the spinner element. |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `hod-loading-spinner.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
