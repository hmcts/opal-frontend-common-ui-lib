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

By default the item will use `govuk-grid-column-one-third govuk-!-padding-left-0`:

```html
<opal-lib-custom-account-information-item>
  <h3 opal-lib-custom-account-information-item-label>Account name:</h3>
  <p opal-lib-custom-account-information-item-value>Dave Smith</p>
</opal-lib-custom-account-information-item>
```

You can set `itemClasses` to use another GOV.UK grid-column class as required. Include any spacing utility
classes needed by the layout:

```html
<opal-lib-custom-account-information-item itemClasses="govuk-grid-column-one-quarter govuk-!-padding-left-0">
  <h3 opal-lib-custom-account-information-item-label>Account name:</h3>
  <p opal-lib-custom-account-information-item-value>Dave Smith</p>
</opal-lib-custom-account-information-item>
```

## Inputs

| Input         | Type     | Default                                              | Description                                                       |
| ------------- | -------- | ---------------------------------------------------- | ----------------------------------------------------------------- |
| `itemClasses` | `string` | `govuk-grid-column-one-third govuk-!-padding-left-0` | Sets the grid layout and spacing of the item using GOV.UK classes |

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
