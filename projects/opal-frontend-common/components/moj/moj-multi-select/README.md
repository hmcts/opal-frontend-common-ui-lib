# MoJ Multi-Select Components

This package provides reusable Angular standalone components for integrating MoJ/GOV.UK multi-select checkboxes into tables.

## Components

### Header Checkbox (`opal-lib-moj-multi-select-header`)

Apply to a `<th>` element for "select all" functionality.

#### Inputs

| Name      | Type    | Required | Description                                                  |
| --------- | ------- | -------- | ------------------------------------------------------------ |
| `id`      | string  | Yes      | Base identifier used to generate host <th> and checkbox ids. |
| `checked` | boolean | No       | Whether all rows are selected.                               |

#### Outputs

| Name      | Type                  | Description                           |
| --------- | --------------------- | ------------------------------------- |
| `toggled` | EventEmitter<boolean> | Emits new checked state (true/false). |

#### Notes

- The host `<th>` element will have id: `{id}-select-all`
- The inner checkbox will have id: `{id}-select-all-input`

#### Example

```html
<th
  opal-lib-moj-multi-select-header
  [id]="'my-table-select-all'"
  [checked]="isAllVisibleSelected()"
  (toggled)="toggleSelectAll($event)"
></th>
```

---

### Row Checkbox (`opal-lib-moj-multi-select-row`)

Apply to a `<td>` element for selecting individual rows.

#### Inputs

| Name            | Type             | Required | Description                                                  |
| --------------- | ---------------- | -------- | ------------------------------------------------------------ |
| `id`            | string           | Yes      | Base identifier used to generate host <td> and checkbox ids. |
| `rowIdentifier` | string \| number | Yes      | Unique row identifier.                                       |
| `checked`       | boolean          | No       | Whether the row is selected.                                 |

#### Outputs

| Name      | Type                  | Description                           |
| --------- | --------------------- | ------------------------------------- |
| `toggled` | EventEmitter<boolean> | Emits new checked state (true/false). |

#### Notes

- The host `<td>` element will have id: `{id}-{rowIdentifier}-cell`
- The inner checkbox will have id: `{id}-{rowIdentifier}-input`

#### Example

```html
<td
  opal-lib-moj-multi-select-row
  [id]="'my-table'"
  [rowIdentifier]="row.id"
  [checked]="rowIsSelected(row)"
  (toggled)="toggleRow(row, $event)"
></td>
```

## Styling

Both components use GOV.UK and MoJ Design System classes:

- `govuk-checkboxes__item`
- `govuk-checkboxes--small`
- `moj-multi-select__checkbox`

Ensure you have included the GOV.UK Frontend and MoJ Design System styles in your project.
