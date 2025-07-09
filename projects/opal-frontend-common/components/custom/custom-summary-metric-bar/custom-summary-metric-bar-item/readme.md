# Custom Summary Metric Bar Item Component

This Angular component, Metric Bar Item Component, serves as a wrapper around both Metric Bar Item Value and Metric Bar Item Label components. It provides the necessary layout structure and styling for individual items within the custom summary metric bar.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Methods](#methods)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

````typescript
import { CustomSummaryMetricBarItemComponent} from '@hmcts/opal-frontend-common/components/custom/custom-summary-metric-bar/custom-summary-metric-bar-item'
import { CustomSummaryMetricBarItemLabelComponent } from '@hmcts/opal-frontend-common/components/custom/custom-summary-metric-bar/custom-summary-metric-bar-item/custom-summary-metric-bar-item-label';
import { CustomSummaryMetricBarItemValueComponent } from '@hmcts/opal-frontend-common/components/custom/custom-summary-metric-bar/custom-summary-metric-bar-item/custom-summary-metric-bar-item-value';```
````

## Usage

You can use the Custom Summary Metric Bar Item component in your template as follows:

By default the item will be set to use 'govuk-grid-column-one-quarter':

```html
<opal-lib-custom-summary-metric-bar-item itemColour="light-blue">
  <div opal-lib-custom-summary-metric-bar-item-label>Metric 1:</div>
  <div opal-lib-custom-summary-metric-bar-item-value>Value 1</div>
</opal-lib-custom-summary-metric-bar-item>
```

You can input into the itemClasses string with another govuk-grid-column class as required:

Example using one third layout:

```html
<opal-lib-custom-summary-metric-bar-item itemColour="light-blue" itemClasses="govuk-grid-column-one-third">
  <div opal-lib-custom-summary-metric-bar-item-label>Metric 1:</div>
  <div opal-lib-custom-summary-metric-bar-item-value>Value 1</div>
</opal-lib-custom-summary-metric-bar-item>
```

## Inputs

| Input         | Type     | Default                         | Description                                                                                          |
| ------------- | -------- | ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `itemColour`  | `string` | 'light-grey'                    | GDS colours that apply colour to background and text of the item. 'light-grey', 'light-blue', 'blue' |
| `itemClasses` | `string` | `govuk-grid-column-one-quarter` | Sets the grid layout of the item using gds grid-column classes                                       |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `custom-summary-metric-bar-item.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
