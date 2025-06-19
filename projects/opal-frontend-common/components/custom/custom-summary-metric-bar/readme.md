---

# Custom Summary Metric Bar Component

This Angular component provides a custom summary metric bar component, which will be used for the account enquiry flow and other flows throughout the program.
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
  CustomSummaryMetricBarComponent,
  CustomSummaryMetricBarItemComponent,
  CustomSummaryMetricBarItemLabelComponent,
  CustomSummaryMetricBarItemValueComponent,
} from '@hmcts/opal-frontend-common/components/custom/custom-summary-metric-bar';
```


## Usage

You can use the alert component in your template as follows:

```html
  <opal-lib-custom-summary-metric-bar>
    <opal-lib-custom-summary-metric-bar-item>
      <opal-lib-custom-summary-metric-bar-item-label>Metric 1:</opal-lib-custom-summary-metric-bar-item-label>
      <opal-lib-custom-summary-metric-bar-item-value>Value 1</opal-lib-custom-summary-metric-bar-item-value>
    </opal-lib-custom-summary-metric-bar-item>
    <opal-lib-custom-summary-metric-bar-item colour="light-blue">
      <opal-lib-custom-summary-metric-bar-item-label>Metric 2:</opal-lib-custom-summary-metric-bar-item-label>
      <opal-lib-custom-summary-metric-bar-item-value>Value 2</opal-lib-custom-summary-metric-bar-item-value>
    </opal-lib-custom-summary-metric-bar-item>
    <opal-lib-custom-summary-metric-bar-item colour="light-blue">
      <opal-lib-custom-summary-metric-bar-item-label>Metric 2:</opal-lib-custom-summary-metric-bar-item-label>
      <opal-lib-custom-summary-metric-bar-item-value>Value 2</opal-lib-custom-summary-metric-bar-item-value>
    </opal-lib-custom-summary-metric-bar-item>
    <opal-lib-custom-summary-metric-bar-item colour="light-blue">
      <opal-lib-custom-summary-metric-bar-item-label>Metric 2:</opal-lib-custom-summary-metric-bar-item-label>
      <opal-lib-custom-summary-metric-bar-item-value>Value 2</opal-lib-custom-summary-metric-bar-item-value>
    </opal-lib-custom-summary-metric-bar-item>
    <opal-lib-custom-summary-metric-bar-item colour="blue">
      <opal-lib-custom-summary-metric-bar-item-label>Metric 2:</opal-lib-custom-summary-metric-bar-item-label>
      <opal-lib-custom-summary-metric-bar-item-value>Value 2</opal-lib-custom-summary-metric-bar-item-value>
    </opal-lib-custom-summary-metric-bar-item>
  </opal-lib-custom-summary-metric-bar>
```



## Inputs

| Input         | Type     | Description                                                                      |
| ------------  | -------- | -------------------------------------------------------------------------------- |
| `colour`      | `string` | colour of item. grey | light-blue | blue as per design of account enquiry flow   |

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
