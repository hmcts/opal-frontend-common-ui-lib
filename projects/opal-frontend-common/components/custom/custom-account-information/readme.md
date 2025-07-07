# Custom Account Information Component

This Angular component provides a custom account information component, which will be used for the account enquiry flow and other flows throughout the application.

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

You can use the custom account information component in your template as follows:

Example of one-third layout:

```html
<div opal-lib-custom-account-information>
  <opal-lib-custom-account-information-item>
    <h3 opal-lib-custom-account-information-item-label>Account Name:</h3>
    <p opal-lib-custom-account-information-item-value>Dave Smith</p>
  </opal-lib-custom-account-information-item>
  <opal-lib-custom-account-information-item>
    <h3 opal-lib-custom-account-information-item-label>Account Name:</h3>
    <p opal-lib-custom-account-information-item-value>John Doe</p>
  </opal-lib-custom-account-information-item>
  <opal-lib-custom-account-information-item>
    <h3 opal-lib-custom-account-information-item-label>Account Name:</h3>
    <p opal-lib-custom-account-information-item-value>John Doe</p>
  </opal-lib-custom-account-information-item>
</div>
```

Example of one-quarter layout:

```html
<div opal-lib-custom-account-information>
  <opal-lib-custom-account-information-item itemClasses="govuk-grid-column-one-quarter">
    <h3 opal-lib-custom-account-information-item-label>Account Name:</h3>
    <p opal-lib-custom-account-information-item-value>Dave Smith</p>
  </opal-lib-custom-account-information-item>
  <opal-lib-custom-account-information-itemg itemClasses="govuk-grid-column-one-quarter">
    <h3 opal-lib-custom-account-information-item-label>Account Name:</h3>
    <p opal-lib-custom-account-information-item-value>John Doe</p>
  </opal-lib-custom-account-information-itemg>
  <opal-lib-custom-account-information-item itemClasses="govuk-grid-column-one-quarter">
    <h3 opal-lib-custom-account-information-item-label>Account Name:</h3>
    <p opal-lib-custom-account-information-item-value>John Doe</p>
  </opal-lib-custom-account-information-item>
  <opal-lib-custom-account-information-item itemClasses="govuk-grid-column-one-quarter">
    <h3 opal-lib-custom-account-information-item-label>Account Name:</h3>
    <p opal-lib-custom-account-information-item-value>John Doe</p>
  </opal-lib-custom-account-information-item>
</div>
```

Example of one-fifth Layout:
"govuk-grid-column-one-fifth" is a custom style developed in [styles](projects/opal-frontend-common/styles/styles.scss).

```html
<div opal-lib-custom-account-information>
  <opal-lib-custom-account-information-item itemClasses="govuk-grid-column-one-fifth">
    <h3 opal-lib-custom-account-information-item-label>Account Name:</h3>
    <p opal-lib-custom-account-information-item-value>Dave Smith</p>
  </opal-lib-custom-account-information-item>
  <opal-lib-custom-account-information-item itemClasses="govuk-grid-column-one-fifth">
    <h3 opal-lib-custom-account-information-item-label>Account Name:</h3>
    <p opal-lib-custom-account-information-item-value>John Doe</p>
  </opal-lib-custom-account-information-item>
  <opal-lib-custom-account-information-item itemClasses="govuk-grid-column-one-fifth">
    <h3 opal-lib-custom-account-information-item-label>Account Name:</h3>
    <p opal-lib-custom-account-information-item-value>John Doe</p>
  </opal-lib-custom-account-information-item>
  <opal-lib-custom-account-information-item itemClasses="govuk-grid-column-one-fifth">
    <h3 opal-lib-custom-account-information-item-label>Account Name:</h3>
    <p opal-lib-custom-account-information-item-value>John Doe</p>
  </opal-lib-custom-account-information-item>
  <opal-lib-custom-account-information-item itemClasses="govuk-grid-column-one-fifth">
    <h3 opal-lib-custom-account-information-item-label>Account Name:</h3>
    <p opal-lib-custom-account-information-item-value>John Doe</p>
  </opal-lib-custom-account-information-item>
</div>
```

This component uses a default class from GDS layout to ensure the correct layout for content within it uses 'govuk-grid-row'.

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
