# Custom Summary Metric Bar Item Label Component

This Angular component provides a CustomSummaryMetricBarItemLabel component which will be content projected into the CustomSummaryMetricBarItem component alongside the CustomSummaryMetricBarItemValue to form the complete layout and consistent stylings of each item in the metric bar.

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
import { CustomSummaryMetricBarItemLabelComponent } from '@hmcts/opal-frontend-common/components/custom/custom-summary-metric-bar/custom-summary-metric-bar-item/custom-summary-metric-bar-item-label';
```

## Usage

You can use the Custom Summary Metric Bar Item Label component in your template as follows:

```html
<div opal-lib-custom-summary-metric-bar-item-label>Metric 1:</div>
```

The component uses defaulted govuk classes to remove margin and set font size and weight using this GDS class 'govuk-!-font-size-19 govuk-!-font-weight-bold govuk-!-margin-0 govuk-body'.

## Inputs

There are no custom inputs for this component.

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `custom-summary-metric-bar-item-label.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
