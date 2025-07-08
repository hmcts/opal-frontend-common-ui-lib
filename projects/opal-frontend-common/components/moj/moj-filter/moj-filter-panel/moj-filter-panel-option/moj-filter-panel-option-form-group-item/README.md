# MojFilterPanelOptionFormGroupItemComponent

The `MojFilterPanelOptionFormGroupItemComponent` is a reusable form group subcomponent of the `MojFilterOptionComponent`. It renders a group of GOV.UK checkboxes for a specific filter category.

This component is typically used inside the `[mojFilterPanelItems]` content projection slot of the `MojFilterOptionComponent`.

## Features

- Renders checkboxes in a `<fieldset>` for a given filter category
- Outputs the changed option and category context
- Styled using GOV.UK checkbox and fieldset classes

## Usage

### Import

```ts
import { MojFilterPanelOptionFormGroupItemComponent } from '@hmcts/opal-frontend-common/components/moj/moj-filter/moj-filter-panel/moj-filter-panel-option/moj-filter-panel-option-form-group-item';
```

### In Template

```html
<opal-lib-moj-filter-panel-option-form-group-item
  [options]="{ categoryName: 'Status', options: statusOptions }"
  (changed)="onCategoryCheckboxChange($event)"
></opal-lib-moj-filter-panel-option-form-group-item>
```

## Inputs

| Input   | Type                                                              | Description                                     |
| ------- | ----------------------------------------------------------------- | ----------------------------------------------- |
| options | `{ categoryName: string, options: IAbstractTableFilterOption[] }` | Filter category name and checkbox options array |

## Outputs

| Output  | Type                                                         | Description                                  |
| ------- | ------------------------------------------------------------ | -------------------------------------------- |
| changed | `{ categoryName: string, item: IAbstractTableFilterOption }` | Emitted when a checkbox selection is toggled |

## Accessibility

- Uses `<fieldset>` and `<legend>` for grouping related inputs.
- Each checkbox input is labelled with a `<label>` and includes unique `id`/`name` attributes to support screen readers.

## Testing

Unit tests should verify:

- The correct number of checkboxes renders for the given options
- The checkbox is checked based on the `selected` flag
- The `changed` output emits with the expected payload
