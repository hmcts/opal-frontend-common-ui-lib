# Custom Account Information item Component

This Angular component acts as a layout wrapper for a single label–value pair within the `<opal-lib-custom-account-information>` block. It should only be used in combination with `<opal-lib-custom-account-information-item-label>` and `<opal-lib-custom-account-information-item-value>` to enforce consistent styling and alignment across metadata summaries.

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

You can use the custom account information item component in your template as follows:

By default the item will be set to use 'govuk-grid-column-one-third':

```html
<opal-lib-custom-account-information-item>
  <h3 opal-lib-custom-account-information-item-label>Account name:</h3>
  <p opal-lib-custom-account-information-item-value>Dave Smith</p>
</opal-lib-custom-account-information-item>
```

You can input into the itemClasses string with another govuk-grid-column class as required:

```html
<opal-lib-custom-account-information-item itemClasses="govuk-grid-column-one-fourth">
  <h3 opal-lib-custom-account-information-item-label>Account name:</h3>
  <p opal-lib-custom-account-information-item-value>Dave Smith</p>
</opal-lib-custom-account-information-item>
```

## Inputs

| Input         | Type     | Default                       | Description                                                    |
| ------------- | -------- | ----------------------------- | -------------------------------------------------------------- |
| `itemClasses` | `string` | `govuk-grid-column-one-third` | Sets the grid layout of the item using gds grid-column classes |

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
