# Custom Section Header Divider Component

This Angular component provides a custom section header Divider component, which is an optional divider than can be used within the custom section header component..

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
import { CustomSectionHeaderDividerComponent } from '@hmcts/opal-frontend-common/components/custom/custom-section-header/custom-section-header-divider';
```

## Usage

You can use the custom section header divider component in your template as follows:

```html
<div opal-lib-custom-section-header>
  <h2 customSectionHeaderTitle>Payment Terms</h2>
  <opal-lib-custom-section-header-divider customSectionHeaderDivider></opal-lib-custom-section-header-divider>
</div>
```

## Inputs

| Input              | Type     | Description                                                                               |
| ------------------ | -------- | ----------------------------------------------------------------------------------------- |
| `backgroundColour` | `string` | Used to set the background colour of the divider. You should pass a colour code as input. |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `custom-section-header-divider.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
