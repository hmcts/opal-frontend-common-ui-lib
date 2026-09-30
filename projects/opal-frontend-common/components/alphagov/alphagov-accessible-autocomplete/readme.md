# Alphagov Accessible Autocomplete Component

This Angular component provides an accessible, GOV.UK-styled autocomplete input field using the `accessible-autocomplete` library. It supports form validation, dynamic configuration, and seamless integration with Angular Reactive Forms.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Suggestion templates](#suggestion-templates)
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
| `suggestionTemplate` | `(label: string) => string` | `undefined` | Optional suggestion HTML renderer; raw names remain unchanged for input display and matching. |

## Suggestion templates

From version `0.0.109`, `AlphagovAccessibleAutocompleteComponent` accepts an optional
`suggestionTemplate` input of type `(label: string) => string`. This callback formats
suggestion HTML only. Keep `autoCompleteItems[].name` as the original label: input
display, filtering, selection, restored values and exact matching on blur continue to
use that raw label.

For plain-text labels, escape characters at the suggestion-rendering boundary in the
consuming application:

```ts
public readonly suggestionTemplate = (label: string): string =>
  label
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
```

Bind it alongside the existing required inputs:

```html
<opal-lib-alphagov-accessible-autocomplete
  [control]="control"
  labelText="Choose an option"
  inputId="option"
  inputName="option"
  [autoCompleteItems]="options"
  [suggestionTemplate]="suggestionTemplate"
></opal-lib-alphagov-accessible-autocomplete>
```

For example, an option with `name: 'A & B'` produces suggestion HTML `A &amp; B`,
while both the visible suggestion and the selected input show `A & B`.

Supply the callback before the autocomplete is first rendered and keep its reference
stable. Changing it after initial rendering does not refresh existing suggestions.
The callback returns HTML, so escape externally supplied labels as above; Angular
does not sanitise this callback's output. Omitting the input preserves the existing
upstream rendering behaviour. Updating the library alone does not opt applications
into escaped suggestions.

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
