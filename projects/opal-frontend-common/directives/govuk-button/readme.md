# Govuk Button Directive

This Angular directive applies govuk button classes on a regular button element.

## Table of Contents

- [Installation](#installation)
- [Selector](#selector)
- [Usage](#usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Methods](#methods)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

```typescript
import { GovukButtonDirective } from '@hmcts/opal-frontend-common/directives/govuk-button';
```

Ensure the directive is declared or imported in your component/module:

```typescript
@Component({
  imports: [GovukButtonDirective],
})
export class SharedModule {}
```

## Selector

Use this attribute selector on any button element to apply GDS button classes onto it.

[opalLibGovukButton]

## Usage

You can apply the directive to any button to apply the GDS button classes like so:

```html
<button opalLibGovukButton buttonId="Return">Return to account details</button>
```

## Inputs

| Input           | Type     | Description                                                                        |
| --------------- | -------- | ---------------------------------------------------------------------------------- |
| `buttonId`      | `String` | Sets the id of the button                                                          |
| `buttonClasses` | `String` | Sets the additional classes for the button                                         |
| `type`          | `String` | Sets the type for the button. Defaulted to submit but can be button, submit ,reset |

Example usage of inputs:

```html
<button opalLibGovukButton buttonId="test-button" buttonClasses="govuk-button--secondary" type="reset">
  Test Button
</button>
```

## Outputs

| Output             | Type    | Description                                                         |
| ------------------ | ------- | ------------------------------------------------------------------- |
| `buttonClickEvent` | `Event` | Emits an event for the parent to capture when the button is clicked |

Example of using the output in the parent:

```html
<button opalLibGovukButton buttonId="Return" (buttonClickEvent)="onTestButtonClick()">Return to account details</button>
```

```typescript
public onTestButtonClick(): void {
  console.log('Test button clicked');
  }
```

## Methods

There are no custom methods for this directive.

## Testing

Unit tests for this directive are located in the govuk-button.directive.spec.ts file.

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this directive.
If you encounter any bugs or missing functionality, please raise an issue.

---
