# Alphagov Accessible Autocomplete Component

This Angular component provides an accessible, GOV.UK-styled autocomplete input field using the `accessible-autocomplete` library. It supports form validation, dynamic configuration, and seamless integration with Angular Reactive Forms.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Accessibility](#accessibility)
- [Testing](#testing)
- [Contributing](#contributing)

---

## Installation

Import the component into your module or component file:

```ts
import { AlphagovAccessibleAutocompleteComponent } from '@components/alphagov/alphagov-accessible-autocomplete/alphagov-accessible-autocomplete.component';
```

## Usage

You can use the accessible autocomplete component in your template as follows:

```html
<opal-lib-alphagov-accessible-autocomplete
  [labelText]="'Search'"
  [labelClasses]="'govuk-label'"
  [inputId]="'country-autocomplete-input'"
  [inputName]="'country'"
  [inputClasses]="'govuk-input'"
  [hintText]="'Start typing the country name'"
  [errors]="formControl.errors?.message"
  [autoCompleteItems]="countries"
  [control]="formControl"
></opal-lib-alphagov-accessible-autocomplete>
```

## Inputs

| Input               | Type                                    | Default                | Description                                                             |
| ------------------- | --------------------------------------- | ---------------------- | ----------------------------------------------------------------------- |
| `control`           | `FormControl \| AbstractControl`        | —                      | The reactive form control tied to the hidden input field.               |
| `labelText`         | `string`                                | `'Search'`             | The label for the autocomplete input field.                             |
| `labelClasses`      | `string`                                | `''`                   | Optional CSS classes for styling the label.                             |
| `inputId`           | `string`                                | `'autocomplete-input'` | The ID for the hidden input field and autocomplete container.           |
| `inputName`         | `string`                                | `''`                   | The name attribute for the hidden input element.                        |
| `inputClasses`      | `string`                                | `''`                   | Optional classes applied to the autocomplete container.                 |
| `hintText`          | `string`                                | `''`                   | Optional hint text displayed under the label.                           |
| `errors`            | `string \| null`                        | `null`                 | Error message shown if validation fails.                                |
| `autoCompleteItems` | `IAlphagovAccessibleAutocompleteItem[]` | `[]`                   | The list of items to populate the autocomplete, with `{ name, value }`. |
| `showAllValues`     | `boolean`                               | `true`                 | Whether to show all available options in the dropdown.                  |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `alphagov-accessible-autocomplete.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
