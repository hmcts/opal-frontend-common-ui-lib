# Custom Account Information item Component

This Angular component provides a custom-account-information-item component, which will be content projected into the custom-account-information component to be used as a wrapper for label and values for the item.

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
import { CustomAccountInformationComponent } from '@hmcts/opal-frontend-common/components/custom/custom-account-information';
import { CustomAccountInformationItemComponent } from '@hmcts/opal-frontend-common/components/custom/custom-account-information/custom-account-information-item';
import { CustomAccountInformationItemLabelComponent } from '@hmcts/opal-frontend-common/components/custom/custom-account-information/custom-account-information-item/custom-account-information-item-label';
import { CustomAccountInformationItemValueComponent } from '@hmcts/opal-frontend-common/components/custom/custom-account-information/custom-account-information-item/custom-account-information-item-value';
```

## Usage

You can use the alert component in your template as follows:

```html
<opal-lib-custom-account-information-item> </opal-lib-custom-account-information-item>
```

## Inputs

There are no input fields for this component.

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `custom-account-information-item.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
