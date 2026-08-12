# Custom Accessible Monetary Component

This Angular component renders monetary values using the shared `MonetaryPipe` and adds screen-reader-friendly output
for negative amounts.

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
import { CustomAccessibleMonetaryComponent } from '@hmcts/opal-frontend-common/components/custom/custom-accessible-monetary';
```

## Usage

You can use the custom accessible monetary component in your template as follows:

```html
<opal-lib-custom-accessible-monetary [value]="-17"></opal-lib-custom-accessible-monetary>
<opal-lib-custom-accessible-monetary
  [value]="paymentSummary.imposedAmount"
  format="remove-minus-symbol"
></opal-lib-custom-accessible-monetary>
```

For negative amounts, the component shows the formatted monetary value visually and provides a hidden
`minus ...` version for assistive technology. When `format="remove-minus-symbol"` is used, the minus sign is removed
from both the visual and accessible output.

## Inputs

| Input    | Type                                           | Required | Description                                                      |
| -------- | ---------------------------------------------- | -------- | ---------------------------------------------------------------- |
| `value`  | `number \| string \| null \| undefined`        | Yes      | The monetary value to render. Supports preformatted currency strings. |
| `format` | `'default' \| 'remove-minus-symbol'` | No       | Controls whether a leading minus sign is preserved or removed.   |

## Outputs

There are no custom outputs for this component.

## Methods

This component exposes derived getters for its formatted value and accessible rendering state.

## Testing

Unit tests for this component can be found in the `custom-accessible-monetary.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
