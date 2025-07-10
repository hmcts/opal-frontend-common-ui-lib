# Custom Summary Metric Bar Item Value Component

This Angular component provides a Metric Bar Item Value component which will be content projected into the Metric Bar Item component alongside the Metric Bar Item Label to form the complete layout and consistent stylings of each item in the metric bar.

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
import { CustomSummaryMetricBarItemValueComponent } from '@hmcts/opal-frontend-common/components/custom/custom-summary-metric-bar/custom-summary-metric-bar-item/custom-summary-metric-bar-item-value';
```

## Usage

You can use the Custom Summary Metric Bar Item Value component in your template as follows:

By default the text colour is set to use `govuk-dark-grey-text-colour`:

```html
<p opal-lib-custom-summary-metric-bar-item-value>Value 2:</p>
```

You can change the text colour using the textColour input and provide a valid GDS text colour class found in styles.scss:

```html
<p opal-lib-custom-summary-metric-bar-item-value textColour="govuk-dark-blue-text-colour">Value 2</p>
```

The component uses defaulted govuk classes to remove margin and set font size and weight using this GDS class 'govuk-body govuk-!-font-size-24 govuk-!-font-weight-bold govuk-!-margin-0'.

## Inputs

| Input        | Type     | Default                       | Description                                                                          |
| ------------ | -------- | ----------------------------- | ------------------------------------------------------------------------------------ |
| `textColour` | `string` | `govuk-dark-grey-text-colour` | Applies the text colour dependant using GDS text colour classes found in styles.scss |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `custom-summary-metric-bar-item-value.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
