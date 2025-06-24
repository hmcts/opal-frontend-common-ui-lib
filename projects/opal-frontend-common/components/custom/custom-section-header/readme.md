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

### Divider On

```html
<div opal-lib-custom-section-header dividerColour="#1d70b8">
  <h2 customSectionHeaderTitle>Payment terms</h2>
</div>
```

### Divider Off

```html
<div opal-lib-custom-section-header [showDiviver]="false">
  <h2 customSectionHeaderTitle>Payment terms</h2>
</div>
```

## Inputs

| Input           | Type      | Default | Description                                              |
| --------------- | --------- | ------- | -------------------------------------------------------- |
| `dividerColour` | `string`  | #1d70b8 | Colour code to set the background colour of the divider. |
| `showDivider`   | `boolean` | true    | Boolean value to hide/show the divider.                  |

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
