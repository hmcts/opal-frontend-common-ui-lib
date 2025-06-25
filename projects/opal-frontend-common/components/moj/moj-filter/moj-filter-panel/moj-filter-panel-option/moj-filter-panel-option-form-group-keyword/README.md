# MojFilterPanelOptionFormGroupKeywordComponent

The `MojFilterPanelOptionFormGroupKeywordComponent` is a simple, reusable keyword input subcomponent used within the `MojFilterPanelOptionComponent`.

It renders a GOV.UK-styled input field with a label and emits the entered keyword string via `keywordChange`.

This component is projected into `[mojFilterPanelKeyword]`.

## Features

- GOV.UK-styled input field and label
- Emits user input as a keyword string
- Accepts configurable input ID, name, and label

## Usage

### Import

```ts
import { MojFilterPanelOptionFormGroupKeywordComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter';
```

### In Template

```html
<opal-lib-moj-filter-panel-option-form-group-keyword
  [inputId]="'keywords'"
  [inputName]="'keywords'"
  [labelValue]="'Search by keyword'"
  (keywordChange)="onKeywordChange($event)"
></opal-lib-moj-filter-panel-option-form-group-keyword>
```

## Inputs

| Input        | Type   | Default    | Description                            |
| ------------ | ------ | ---------- | -------------------------------------- |
| `inputId`    | string | 'keywords' | The HTML ID applied to the input field |
| `inputName`  | string | 'keywords' | The name attribute for the input field |
| `labelValue` | string | 'Keywords' | The visible label for the input        |

## Outputs

| Output          | Type     | Description                         |
| --------------- | -------- | ----------------------------------- |
| `keywordChange` | `string` | Emits the keyword string when typed |

## Accessibility

- Label is properly linked to the input using `for`/`id`.
- Uses `govuk-label--m` and `govuk-input` to ensure visual and accessibility compliance with GOV.UK design system.

## Testing

Unit tests should verify:

- The label renders correctly using `labelValue`
- The input emits `keywordChange` with the expected string
- Custom `inputId` and `inputName` values are respected
