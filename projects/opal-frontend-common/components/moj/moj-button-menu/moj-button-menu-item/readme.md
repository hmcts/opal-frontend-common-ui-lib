# MOJ Button Menu Item Component

This Angular component represents an individual item in the MOJ button menu, typically used to display a button for an action inside a menu.

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
import { MojButtonMenuItemComponent } from '@hmcts/opal-frontend-common/components/moj/moj-button-menu/moj-button-menu-item';
```

## Usage

You can use the button menu item component in your template as follows:

```html
<opal-lib-moj-button-menu-item itemText="Option 3"></opal-lib-moj-button-menu-item>
```

## Inputs

| Input      | Type     | Description                              |
| ---------- | -------- | ---------------------------------------- |
| `itemText` | `string` | Used to set the text of the link button. |

## Outputs

| Output        | Type                 | Description                               |
| ------------- | -------------------- | ----------------------------------------- |
| `actionClick` | `EventEmitter<void>` | Event emitted when the button is clicked. |

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `moj-button-menu-item.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
