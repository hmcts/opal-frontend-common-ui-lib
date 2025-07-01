# Custom Summary Metric Bar Item Component

This Angular component, CustomSummaryMetricBarItemComponent, serves as a wrapper around both CustomSummaryMetricBarItemValue and CustomSummaryMetricBarItemLabel components. It provides the necessary layout structure and styling for individual items within the custom summary metric bar.

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

```html
<opal-lib-custom-summary-metric-bar-item itemColour="light-blue">
  <div opal-lib-custom-summary-metric-bar-item-label>Metric 1:</div>
  <div opal-lib-custom-summary-metric-bar-item-value>Value 1</div>
</opal-lib-custom-summary-metric-bar-item>
```

## Inputs

| Input        | Type     | Default      | Description                                                                                          |
| ------------ | -------- | ------------ | ---------------------------------------------------------------------------------------------------- |
| `itemColour` | `string` | 'light-grey' | GDS colours that apply colour to background and text of the item. 'light-grey', 'light-blue', 'blue' |

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
