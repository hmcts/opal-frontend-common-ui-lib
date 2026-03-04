# MoJ Multi-Select

A dumb, reusable multi-select pattern for table rows using Ministry of Justice checkbox styles.

This package provides:

- `MojMultiSelectCheckboxComponentHead`: header checkbox (select all)
- `MojMultiSelectCheckboxComponentBody`: row checkbox (select one row)
- `MojMultiSelectComponent`: optional projection wrapper only (no state logic)

Selection state is intentionally owned by the consuming table wrapper, so this works for:

- sortable tables
- paginated tables
- plain tables

## Usage

Import from:

```ts
import {
  MojMultiSelectCheckboxComponentHead,
  MojMultiSelectCheckboxComponentBody,
} from '@hmcts/opal-frontend-common/components/moj/moj-multi-select';
```

### Sortable or Plain Table Pattern

Use one header checkbox and one body checkbox per row:

```html
<table class="govuk-table">
  <thead class="govuk-table__head">
    <tr class="govuk-table__row">
      <th class="govuk-table__header" scope="col" id="defendants-select-all">
        <app-moj-multi-select-checkbox-head
          inputId="defendants-select-all-checkbox"
          ariaLabel="Select all defendants"
          [selectAllChecked]="allVisibleRowsSelected()"
          [selectAllIndeterminate]="someVisibleRowsSelected()"
          (toggleAll)="onToggleAll($event)"
        />
      </th>
      <th class="govuk-table__header" scope="col">Account</th>
      <th class="govuk-table__header" scope="col">Name</th>
    </tr>
  </thead>

  <tbody class="govuk-table__body">
    @for (row of visibleRows(); track row.id ?? $index) {
      <tr class="govuk-table__row" [class.govuk-table__row--selected]="isRowSelected(row, $index)">
        <td class="govuk-table__cell">
          <app-moj-multi-select-checkbox-body
            [inputId]="'row-select-' + getRowIdentifier(row, $index)"
            [rowId]="getRowIdentifier(row, $index)"
            [isChecked]="isRowSelected(row, $index)"
            [ariaLabel]="'Select ' + (row.name ?? ('row ' + ($index + 1)))"
            [rowIndex]="$index"
            (selectionChange)="onRowSelectionChange($event)"
          />
        </td>
        <td class="govuk-table__cell">{{ row.account }}</td>
        <td class="govuk-table__cell">{{ row.name }}</td>
      </tr>
    }
  </tbody>
</table>
```

## Wrapper State Example

Keep selection in the consuming component (not in multi-select components):

```ts
import {
  areAllMultiSelectRowsSelected,
  areSomeMultiSelectRowsSelected,
  isMultiSelectRowSelected,
  toggleAllMultiSelectRows,
  toggleMultiSelectRow,
} from '@hmcts/opal-frontend-common/components/moj/moj-multi-select';

type RowId = string | number;

private readonly selectedRowIds = signal<Set<RowId>>(new Set<RowId>());

getRowIdentifier(row: Record<string, unknown>, index: number): RowId {
  return (row['id'] as RowId) ?? index;
}

isRowSelected(row: Record<string, unknown>, index: number): boolean {
  return isMultiSelectRowSelected(row, index, this.selectedRowIds(), this.getRowIdentifier);
}

allVisibleRowsSelected(): boolean {
  const rows = this.visibleRows();
  return areAllMultiSelectRowsSelected(rows, this.selectedRowIds(), this.getRowIdentifier);
}

someVisibleRowsSelected(): boolean {
  return areSomeMultiSelectRowsSelected(this.visibleRows(), this.selectedRowIds(), this.getRowIdentifier);
}

onToggleAll(checked: boolean): void {
  this.selectedRowIds.set(toggleAllMultiSelectRows(this.visibleRows(), this.selectedRowIds(), this.getRowIdentifier, checked));
}

onRowSelectionChange(event: { rowId: RowId; checked: boolean }): void {
  this.selectedRowIds.set(toggleMultiSelectRow(this.selectedRowIds(), event.rowId, event.checked));
}
```

## Inputs and Outputs

### `MojMultiSelectCheckboxComponentHead`

Inputs:

- `inputId: string` (default: `select-all`)
- `extraClasses: string`
- `selectAllChecked: boolean`
- `selectAllIndeterminate: boolean`
- `ariaLabel: string` (default: `Select all rows`)

Outputs:

- `toggleAll: EventEmitter<boolean>`

### `MojMultiSelectCheckboxComponentBody`

Inputs:

- `inputId: string`
- `extraClasses: string`
- `isChecked: boolean`
- `rowIndex: number`
- `ariaLabel: string`
- `rowId: string | number`

Outputs:

- `selectionChange: EventEmitter<{ rowId: string | number; checked: boolean }>`

## Accessibility Notes

- Provide meaningful `ariaLabel` values for header and row checkboxes.
- Ensure each row checkbox has a unique `inputId`.
- Use row selected styling (for example `govuk-table__row--selected`) to communicate state visually.

## Testing

Run tests with:

```bash
yarn test
```

## Related

- [MOJ Sortable Table](../moj-sortable-table/readme.md)
- [MOJ Design Patterns](https://design-patterns.service.justice.gov.uk/)
