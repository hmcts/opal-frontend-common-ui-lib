# Capitalisation Directive

This Angular directive automatically capitalises all characters in an input field in real-time as the user types. It is used to ensure consistent formatting in fields like reference numbers or codes.

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
import { CapitalisationDirective } from '@hmcts/opal-frontend-common/directives/capitalisation';
```

Ensure the directive is declared or imported in your component/module:

```typescript
@Component({
  imports: [CapitalisationDirective],
})
export class SharedModule {}
```

## Selector

Use this attribute selector on an `<input>` element or a custom component that emits the native input event. The directive listens for input events and capitalises the input value in real time.

```md
[opalLibCapitaliseAllCharacters]
```

## Usage

You can apply the directive to any component or element that is an `<input>` element inside it. The directive listens to input events and converts the value to uppercase.

### Native Input Example

```html
<input type="text" opalLibCapitaliseAllCharacters />
```

### Custom Component Example

```html
<opal-lib-govuk-text-input
  opalLibCapitaliseAllCharacters
  inputId="exampleInput"
  inputName="exampleInput"
  labelText="Reference Number"
  [control]="form.controls['exampleInput']"
/>
```

### Expected Behaviour

For example, if a user types `ab12cd`, the input will be transformed to `AB12CD` in real time.

## Inputs

There are no configurable inputs for this directive.

## Outputs

There are no custom outputs for this directive.

## Methods

There are no custom methods for this directive.

## Testing

Unit tests for this directive are located in the capitalisation.directive.spec.ts file.

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this directive.
If you encounter any bugs or missing functionality, please raise an issue.

---
