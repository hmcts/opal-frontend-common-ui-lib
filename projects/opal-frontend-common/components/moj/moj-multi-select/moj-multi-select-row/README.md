# Moj Multi Select Row Component

The `moj-multi-select-row` component is a table row element designed for use within the MOJ multi-select table. It manages selection state and emits events when toggled.

## Usage

```html
<td
  opal-lib-moj-multi-select-row
  [id]="rowId"
  [rowIdentifier]="rowIdentifier"
  [checked]="isChecked"
  (toggled)="onRowToggled($event)"
>
  <!-- row content here -->
</td>
```

## Inputs

- `id: string` — Base id prefix shared with the header (e.g. 'check-and-validate-table').
- `rowIdentifier: string | number` — Stable unique identifier for this row.
- `checked: boolean` — Indicates if the row is currently selected.

## Outputs

- `toggled: EventEmitter<boolean>` — Emits the new checked state when toggled.

---

**Note:**  
The host `<td>` will have an `id` attribute of the form `${id}-${rowIdentifier}-cell`, and the inner checkbox will have an `id` of `${id}-${rowIdentifier}-input`. This convention ensures accessibility and unique element identification within the table.

For full documentation, see the [parent MOJ Multi Select README](../README.md).
