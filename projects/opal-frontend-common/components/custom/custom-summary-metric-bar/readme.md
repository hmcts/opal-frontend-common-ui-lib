# Custom Summary Metric Bar Component

This Angular component implements a custom summary metric bar designed to display key financial and informational metrics to users. It will be used in the account enquiry flow as well as other areas of the program where clear metric presentation is required.

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
import { CustomSummaryMetricBarItemComponent } from '@hmcts/opal-frontend-common/components/custom/custom-summary-metric-bar/custom-summary-metric-bar-item';
import { CustomSummaryMetricBarItemLabelComponent } from '@hmcts/opal-frontend-common/components/custom/custom-summary-metric-bar/custom-summary-metric-bar-item/custom-summary-metric-bar-item-label';
import { CustomSummaryMetricBarItemValueComponent } from '@hmcts/opal-frontend-common/components/custom/custom-summary-metric-bar/custom-summary-metric-bar-item/custom-summary-metric-bar-item-value';
import { CustomSummaryMetricBarComponent } from '@hmcts/opal-frontend-common/components/custom/custom-summary-metric-bar';
```

## Usage

You can use the Custom Metric Bar Component in your template as follows:

Example of one quarter layout:

```html
div opal-lib-custom-summary-metric-bar>
  <opal-lib-custom-summary-metric-bar-item>
    <p opal-lib-custom-summary-metric-bar-item-label>Metric 1:</p>
    <p opal-lib-custom-summary-metric-bar-item-value>Value 1</p>
  </opal-lib-custom-summary-metric-bar-item>
  <opal-lib-custom-summary-metric-bar-item backgroundColour="govuk-lighter-blue-background-colour">
    <p opal-lib-custom-summary-metric-bar-item-label textColour="govuk-dark-blue-text-colour">Metric 2:</p>
    <p opal-lib-custom-summary-metric-bar-item-value textColour="govuk-dark-blue-text-colour">Value 2</p>
  </opal-lib-custom-summary-metric-bar-item>
  <opal-lib-custom-summary-metric-bar-item backgroundColour="govuk-lighter-blue-background-colour">
    <p opal-lib-custom-summary-metric-bar-item-label textColour="govuk-dark-blue-text-colour">Metric 2:</p>
    <p opal-lib-custom-summary-metric-bar-item-value textColour="govuk-dark-blue-text-colour">Value 2</p>
  </opal-lib-custom-summary-metric-bar-item>
  <opal-lib-custom-summary-metric-bar-item backgroundColour="govuk-blue-background-colour">
    <p opal-lib-custom-summary-metric-bar-item-label textColour="govuk-white-text-colour">Metric 1:</p>
    <p opal-lib-custom-summary-metric-bar-item-value textColour="govuk-white-text-colour">Value 1</p>
  </opal-lib-custom-summary-metric-bar-item>
</div>
```

Example of one-third layout:

```html
div opal-lib-custom-summary-metric-bar>
  <opal-lib-custom-summary-metric-bar-item>
    <p opal-lib-custom-summary-metric-bar-item-label>Metric 1:</p>
    <p opal-lib-custom-summary-metric-bar-item-value>Value 1</p>
  </opal-lib-custom-summary-metric-bar-item>
  <opal-lib-custom-summary-metric-bar-item backgroundColour="govuk-lighter-blue-background-colour">
    <p opal-lib-custom-summary-metric-bar-item-label textColour="govuk-dark-blue-text-colour">Metric 2:</p>
    <p opal-lib-custom-summary-metric-bar-item-value textColour="govuk-dark-blue-text-colour">Value 2</p>
  </opal-lib-custom-summary-metric-bar-item>
  <opal-lib-custom-summary-metric-bar-item backgroundColour="govuk-lighter-blue-background-colour">
    <p opal-lib-custom-summary-metric-bar-item-label textColour="govuk-dark-blue-text-colour">Metric 2:</p>
    <p opal-lib-custom-summary-metric-bar-item-value textColour="govuk-dark-blue-text-colour">Value 2</p>
  </opal-lib-custom-summary-metric-bar-item>
</div>
```

## Inputs

There are no custom inputs for this component.

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
