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
import { Component } from '@angular/core';
import { CustomAccessibleMonetaryComponent } from '@hmcts/opal-frontend-common/components/custom/custom-accessible-monetary';

@Component({
  selector: 'app-payment-summary',
  imports: [CustomAccessibleMonetaryComponent],
  templateUrl: './payment-summary.component.html',
})
export class PaymentSummaryComponent {}
```

## Usage

You can use the custom accessible monetary component in your template as follows:

```html
<opal-lib-custom-accessible-monetary [value]="-17"></opal-lib-custom-accessible-monetary>
<opal-lib-custom-accessible-monetary
  [value]="-17"
  format="remove-minus-symbol"
></opal-lib-custom-accessible-monetary>
```

For negative amounts, the component shows the formatted monetary value visually and provides a visually hidden
`minus ...` version for assistive technology. When `format="remove-minus-symbol"` is used, the component removes the
minus sign and renders the monetary value without additional accessibility markup.

## Inputs

| Input    | Type                                           | Required | Description                                                      |
| -------- | ---------------------------------------------- | -------- | ---------------------------------------------------------------- |
| `value`  | `number \| string \| null \| undefined` | Yes      | The monetary value to render. Supports preformatted currency strings.        |
| `format` | `'default' \| 'remove-minus-symbol'`    | No       | Controls whether a leading minus sign is preserved or removed. Defaults to `'default'`. |

## Outputs

There are no custom outputs for this component.

## Methods

This component has no consumer-facing methods. Its derived getters are implementation details.

## Testing

Unit tests for this component can be found in the `custom-accessible-monetary.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
