# MoJ Multi-Select Directive

Utilities and directives for MoJ table multi-select behaviour using `opal-lib-govuk-checkboxes-item`.

## Usage

Import the directives and helper utilities from the secondary entrypoint:

```typescript
import { Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GovukCheckboxesComponent, GovukCheckboxesItemComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes';
import {
  MojMultiSelectBodyDirective,
  MojMultiSelectHeadDirective,
  areAllMultiSelectRowsSelected,
  areSomeMultiSelectRowsSelected,
  toggleAllMultiSelectRows,
  toggleMultiSelectRow,
} from '@hmcts/opal-frontend-common/directives/moj-multi-select';

interface IRow {
  id: string;
  name: string;
}

@Component({
  selector: 'app-multi-select-example',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    GovukCheckboxesComponent,
    GovukCheckboxesItemComponent,
    MojMultiSelectHeadDirective,
    MojMultiSelectBodyDirective,
  ],
  templateUrl: './multi-select-example.component.html',
})
export class MultiSelectExampleComponent {
  public rows = signal<IRow[]>([
    { id: 'A', name: 'Alpha' },
    { id: 'B', name: 'Beta' },
    { id: 'C', name: 'Gamma' },
  ]);

  public selectedRowIds = signal<Set<string>>(new Set<string>());
  public readonly selectAllControl = new FormControl(false, { nonNullable: true });
  public readonly rowControls: Record<string, FormControl<boolean>> = Object.fromEntries(
    this.rows().map((row) => [row.id, new FormControl(false, { nonNullable: true })]),
  );

  public readonly allSelected = computed(() =>
    areAllMultiSelectRowsSelected(this.rows(), this.selectedRowIds(), (row) => row.id),
  );
  public readonly someSelected = computed(() =>
    areSomeMultiSelectRowsSelected(this.rows(), this.selectedRowIds(), (row) => row.id),
  );

  public onToggleAll(checked: boolean): void {
    const next = toggleAllMultiSelectRows(this.rows(), this.selectedRowIds(), (row) => row.id, checked);
    this.selectedRowIds.set(next);
    this.selectAllControl.setValue(checked, { emitEvent: false });
    this.rows().forEach((row) => this.rowControls[row.id]?.setValue(checked, { emitEvent: false }));
  }

  public someVisibleRowsSelected(): boolean {
    return this.someSelected();
  }

  public onRowSelectionChange(event: { rowId: string; checked: boolean }): void {
    const next = toggleMultiSelectRow(this.selectedRowIds(), event.rowId, event.checked);
    this.selectedRowIds.set(next);
    this.selectAllControl.setValue(this.allSelected(), { emitEvent: false });
    this.rowControls[event.rowId]?.setValue(event.checked, { emitEvent: false });
  }
}
```

```html
<opal-lib-govuk-checkboxes fieldSetId="defendants-select-all-group" checkboxClasses="" legendText="">
  <div
    class="govuk-checkboxes--small"
    opal-lib-govuk-checkboxes-item
    opalLibMojMultiSelectHead
    [control]="selectAllControl"
    inputId="defendants-select-all-checkbox"
    inputName="defendants-select-all-checkbox"
    labelText=" "
    ariaLabel="Select all defendants"
    [selectAllIndeterminate]="someVisibleRowsSelected()"
    (toggleAll)="onToggleAll($event)"
  ></div>
</opal-lib-govuk-checkboxes>

@for (row of rows(); track row.id) {
  <div
    class="govuk-checkboxes--small"
    opal-lib-govuk-checkboxes-item
    opalLibMojMultiSelectBody
    [control]="rowControls[row.id]"
    [inputId]="'row-' + row.id"
    [inputName]="'row-' + row.id"
    labelText=" "
    [rowId]="row.id"
    [ariaLabel]="'Select row ' + row.name"
    (selectionChange)="onRowSelectionChange($event)"
  ></div>
}
```

## Exports

- `MojMultiSelectHeadDirective`
- `MojMultiSelectBodyDirective`
- `MultiSelectRowIdentifier`
- Multi-select selection utilities

## Directive inputs

### `MojMultiSelectHeadDirective` (`opalLibMojMultiSelectHead`)

| Input                    | Type      | Required | Default             | Description                                                        |
| ------------------------ | --------- | -------- | ------------------- | ------------------------------------------------------------------ |
| `extraClasses`           | `string`  | No       | `''`                | Additional CSS classes applied to the host checkboxes item.        |
| `selectAllIndeterminate` | `boolean` | No       | `false`             | Sets the native checkbox `indeterminate` state for partial select. |
| `ariaLabel`              | `string`  | No       | `'Select all rows'` | Accessible label applied to the nested checkbox input.             |

### `MojMultiSelectBodyDirective` (`opalLibMojMultiSelectBody`)

| Input          | Type                       | Required | Default | Description                                                                          |
| -------------- | -------------------------- | -------- | ------- | ------------------------------------------------------------------------------------ |
| `rowId`        | `MultiSelectRowIdentifier` | Yes      | -       | Unique row identifier emitted in selection events and used for selection state.      |
| `ariaLabel`    | `string`                   | No       | `''`    | Optional custom accessible label. If empty, the visible checkbox label is preserved. |
| `extraClasses` | `string`                   | No       | `''`    | Additional CSS classes applied to the host checkboxes item.                          |

## Utility methods

- `MultiSelectRowIdResolver<TRow, TRowId>`: Function type used to derive a stable row id from a row object and its index.
- `isMultiSelectRowSelected(row, index, selectedRowIds, getRowId)`: Returns `true` when the resolved id for a single row exists in `selectedRowIds`.
- `areAllMultiSelectRowsSelected(rows, selectedRowIds, getRowId)`: Returns `true` when `rows` is not empty and every row id is present in `selectedRowIds`.
- `areSomeMultiSelectRowsSelected(rows, selectedRowIds, getRowId)`: Returns `true` only for partial selection (at least one selected, but not all). Returns `false` for empty `rows`.
- `toggleMultiSelectRow(selectedRowIds, rowId, checked)`: Returns a new `Set` with one row id added (`checked = true`) or removed (`checked = false`).
- `toggleAllMultiSelectRows(rows, selectedRowIds, getRowId, checked)`: Returns a new `Set` with all visible row ids added or removed based on `checked`, while preserving unrelated ids already in the set.

### Utility method inputs

#### `isMultiSelectRowSelected(row, index, selectedRowIds, getRowId)`

| Input            | Type                                     | Description                                          |
| ---------------- | ---------------------------------------- | ---------------------------------------------------- |
| `row`            | `TRow`                                   | Current row object to test.                          |
| `index`          | `number`                                 | Row index passed to the resolver.                    |
| `selectedRowIds` | `ReadonlySet<TRowId>`                    | Current selected ids set.                            |
| `getRowId`       | `MultiSelectRowIdResolver<TRow, TRowId>` | Function that resolves an id from `row` and `index`. |

#### `areAllMultiSelectRowsSelected(rows, selectedRowIds, getRowId)`

| Input            | Type                                     | Description                                                           |
| ---------------- | ---------------------------------------- | --------------------------------------------------------------------- |
| `rows`           | `readonly TRow[]`                        | Visible rows to evaluate.                                             |
| `selectedRowIds` | `ReadonlySet<TRowId>`                    | Current selected ids set.                                             |
| `getRowId`       | `MultiSelectRowIdResolver<TRow, TRowId>` | Function that resolves row ids used when checking all-selected state. |

#### `areSomeMultiSelectRowsSelected(rows, selectedRowIds, getRowId)`

| Input            | Type                                     | Description                                                         |
| ---------------- | ---------------------------------------- | ------------------------------------------------------------------- |
| `rows`           | `readonly TRow[]`                        | Visible rows to evaluate for partial selection.                     |
| `selectedRowIds` | `ReadonlySet<TRowId>`                    | Current selected ids set.                                           |
| `getRowId`       | `MultiSelectRowIdResolver<TRow, TRowId>` | Function that resolves row ids used for selected count calculation. |

#### `toggleMultiSelectRow(selectedRowIds, rowId, checked)`

| Input            | Type                  | Description                                       |
| ---------------- | --------------------- | ------------------------------------------------- |
| `selectedRowIds` | `ReadonlySet<TRowId>` | Current selected ids set.                         |
| `rowId`          | `TRowId`              | Row id to add or remove.                          |
| `checked`        | `boolean`             | `true` to add `rowId`; `false` to remove `rowId`. |

#### `toggleAllMultiSelectRows(rows, selectedRowIds, getRowId, checked)`

| Input            | Type                                     | Description                                                               |
| ---------------- | ---------------------------------------- | ------------------------------------------------------------------------- |
| `rows`           | `readonly TRow[]`                        | Visible rows to toggle.                                                   |
| `selectedRowIds` | `ReadonlySet<TRowId>`                    | Current selected ids set.                                                 |
| `getRowId`       | `MultiSelectRowIdResolver<TRow, TRowId>` | Function that resolves row ids from each row and index.                   |
| `checked`        | `boolean`                                | `true` to add all visible row ids; `false` to remove all visible row ids. |
