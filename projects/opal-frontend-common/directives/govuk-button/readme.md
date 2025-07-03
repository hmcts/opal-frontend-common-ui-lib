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

Use this attribute selector on any component or element by passing in an Angular form control via the directive input. The directive listens for value changes and capitalises the content of the provided control.

[opalLibCapitaliseAllCharacters]

## Usage

You can apply the directive to any component or element by binding it to an Angular form control. The directive listens to the control's value changes and converts the value to uppercase.

### Native Input Example

```html
<input type="text" [formControl]="formControl" [opalLibCapitaliseAllCharacters]="formControl" />
```

### Custom Component Example

```html
<opal-lib-govuk-text-input
  [opalLibCapitaliseAllCharacters]="form.controls['exampleInput']"
  inputId="exampleInput"
  inputName="exampleInput"
  labelText="Reference Number"
  [control]="form.controls['exampleInput']"
/>
```

### Expected Behaviour

For example, if a user types `ab12cd`, the form control's value will be transformed to `AB12CD` in real time via the control's value changes.

## Inputs

- `opalLibCapitaliseAllCharacters` – Accepts an `AbstractControl` (such as `FormControl`). The directive subscribes to its value changes and updates it to uppercase.

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
