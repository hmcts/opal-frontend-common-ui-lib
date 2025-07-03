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
import { HodLoadingSpinnerContentComponent } from '@hmcts/opal-frontend-common/components/hod/hod-loading-spinner/hod-loading-spinner-content';
```

## Usage

You can use the loading spinner component in your template as follows:

```html
<div opal-lib-hod-loading-spinner>
  <div opal-lib-hod-loading-spinner-content>
    <ng-container hodLoadingSpinnerHeading> Processing request</ng-container>
    <ng-container hodLoadingSpinnerText>This may take up to 3 minutes</ng-container>
  </div>
</div>
```

## Inputs

There are no custom inputs for this component.

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
