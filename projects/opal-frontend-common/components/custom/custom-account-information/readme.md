---

# Custom Account Information Component

This Angular component provides a custom account information component, which will be used for the account enquiry flow and other flows throughout the program.
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
  import {
    CustomAccountInformationComponent,
    CustomAccountInformationItemComponent,
    CustomAccountInformationItemValueComponent,
    CustomAccountInformationItemLabelComponent,
  } from '@hmcts/opal-frontend-common/components/custom/custom-account-information';
```


## Usage

You can use the alert component in your template as follows:

```html
  <div opal-lib-custom-account-information>
    <opal-lib-custom-account-information-item>
      <div opal-lib-custom-account-information-item-label>Account Name:</div>
      <div opal-lib-custom-account-information-item-value>Dave Smith</div>
    </opal-lib-custom-account-information-item>
    <opal-lib-custom-account-information-item>
      <div opal-lib-custom-account-information-item-label>Account Name:</div>
      <div opal-lib-custom-account-information-item-value>John Doe</div>
    </opal-lib-custom-account-information-item>
    <opal-lib-custom-account-information-item>
      <div opal-lib-custom-account-information-item-label>Account Name:</div>
      <div opal-lib-custom-account-information-item-value>John Doe</div>
    </opal-lib-custom-account-information-item>
  </div>
```



## Inputs
There are no input fields for this component.

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `custom-account-information.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---
