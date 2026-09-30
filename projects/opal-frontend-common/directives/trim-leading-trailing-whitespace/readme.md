# Trim Leading Trailing Whitespace Directive

This standalone Angular directive trims leading and trailing whitespace from the value of a provided form control when focus leaves the wrapped element. It is designed for inputs rendered through wrapper components, such as `opal-lib-govuk-text-input`, where the bubbling `focusout` event can be used to trigger the trim.

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
import { TrimLeadingTrailingWhitespaceDirective } from '@hmcts/opal-frontend-common/directives/trim-leading-trailing-whitespace';
```

Ensure the directive is declared or imported in your component:

```typescript
@Component({
  imports: [TrimLeadingTrailingWhitespaceDirective],
})
export class SharedComponent {}
```

## Selector

Use this attribute selector on a native element or wrapper component by passing in an Angular form control via the directive input.

[opalLibTrimLeadingTrailingWhitespace]

## Usage

You can apply the directive to a native input or a wrapper component. On `focusout`, the directive reads the supplied control value, trims it if it is a string, and updates the control only when the trimmed value differs.

### Native Input Example

```html
<input type="text" [formControl]="formControl" [opalLibTrimLeadingTrailingWhitespace]="formControl" />
```

### Custom Component Example

```html
<opal-lib-govuk-text-input
  [control]="form.get('fm_employer_details_employer_post_code')!"
  [opalLibTrimLeadingTrailingWhitespace]="form.get('fm_employer_details_employer_post_code')!"
  inputId="fm_employer_details_employer_post_code"
  inputName="fm_employer_details_employer_post_code"
  labelText="Post code"
/>
```

### Expected Behaviour

If a user enters `  ab12   cd  `, the directive updates the control value to `ab12   cd` when the host element emits `focusout`. Internal whitespace is preserved.

## Inputs

- `opalLibTrimLeadingTrailingWhitespace` - Accepts an `AbstractControl` such as `FormControl`. The directive reads the current control value on `focusout` and trims leading and trailing whitespace for string values.

## Outputs

There are no custom outputs for this directive.

## Methods

There are no custom methods for this directive.

## Testing

Unit tests for this directive are located in the `trim-leading-trailing-whitespace.directive.spec.ts` file.

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this directive.
If you encounter any bugs or missing functionality, please raise an issue.
