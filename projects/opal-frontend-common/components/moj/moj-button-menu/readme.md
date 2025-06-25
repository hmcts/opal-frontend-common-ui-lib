---

# MOJ Button Menu Component

This Angular component provides a Ministry of Justice (MOJ)-styled button menu, typically used to display a list of actions in a menu format.

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
import { MojButtonMenuComponent } from '@components/moj/moj-button-menu/moj-button-menu.component';
```

## Usage

You can use the button menu component in your template as follows:


```html
<opal-lib-moj-button-menu menuButtonTitle="More Options:">
      <opal-lib-moj-button-menu-item itemText="Option 1"></opal-lib-moj-button-menu-item>
      <opal-lib-moj-button-menu-item itemText="Option 2"></opal-lib-moj-button-menu-item>
      <opal-lib-moj-button-menu-item itemText="Option 3"></opal-lib-moj-button-menu-item>
</opal-lib-moj-button-menu>
```

## Inputs

| Input             | Type    | Description                               |
| ----------------- | --------------------------------------------------- |
| `menuButtonTitle` | `String` | Sets the text of the expandable button.  |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `moj-button-menu.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` provides an overview of how to use the `moj-button-menu` component for displaying a list of buttons in a menu layout following MOJ standards.
