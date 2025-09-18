# MoJ Multi‑Select Header

Angular standalone component to add a “Select all” checkbox to a table **header cell**.

> **Usage:** apply the directive/component to a `<th>` element. The component applies `govuk-table__header` and `scope="col"` to the host, and generates stable ids from a single base `id`.

## Example

```html
<th
  opal-lib-moj-multi-select-header
  [id]="'check-and-validate-table'"
  [checked]="isAllVisibleSelected()"
  (toggled)="toggleSelectAll($event)"
></th>
```

## Inputs

- `id: string` – **Base identifier** used to generate both ids:
  - Host `<th id>` → `{id}-select-all`
  - Checkbox `<input id>` → `{id}-select-all-input`
- `checked?: boolean` – Whether the header checkbox is checked.

## Outputs

- `toggled: EventEmitter<boolean>` – Emits the new checked state when the checkbox changes.

## Notes

- You do **not** need to add GOV.UK classes yourself; the component adds `govuk-table__header` and `scope="col"` to the host `<th>` automatically.
- The host <th> will have id="{id}-select-all" and the inner checkbox <input> will have id="{id}-select-all-input".
- The component intentionally does **not** accept `ariaLabel` / `ariaDescribedBy` inputs. If you need custom a11y text, provide context in the surrounding header text.

For full multi‑select docs (including the row checkbox), see the [parent README](../README.md).
