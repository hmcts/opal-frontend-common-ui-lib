---

# Custom Section Header Component

This Angular component provides a custom section header component, which will be used for the account enquiry flow and other flows throughout the program.
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
  import { CustomSectionHeaderComponent } from '@hmcts/opal-frontend-common/components/custom/custom-section-header';
```


## Usage

You can use the custom section header component in your template as follows:

```html
  <div opal-lib-custom-section-header customSectionHeading="Account Information"></div>
```

## Inputs

| Input                   | Type     | Description                                     |
| ----------------------- | -------- | ----------------------------------------------- |
| `customSectionHeading`  | `string` | Used to set the heading text of the component   |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `custom-section-header.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---
