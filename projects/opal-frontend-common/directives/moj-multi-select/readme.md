# MoJ Multi-Select Directive

Utilities and directives for MoJ table multi-select behaviour using `opal-lib-govuk-checkboxes-item`.

## Usage

Import the directives and helper utilities from the secondary entrypoint:

```typescript
import { Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GovukCheckboxesItemComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-checkboxes/govuk-checkboxes-item';
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
  imports: [ReactiveFormsModule, GovukCheckboxesItemComponent, MojMultiSelectHeadDirective, MojMultiSelectBodyDirective],
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

  public onRowSelectionChange(event: { rowId: string; checked: boolean }): void {
    const next = toggleMultiSelectRow(this.selectedRowIds(), event.rowId, event.checked);
    this.selectedRowIds.set(next);
    this.selectAllControl.setValue(this.allSelected(), { emitEvent: false });
    this.rowControls[event.rowId]?.setValue(event.checked, { emitEvent: false });
  }
}
```

```html
<opal-lib-govuk-checkboxes-item
  opalLibMojMultiSelectHead
  inputId="select-all"
  inputName="select-all"
  labelText="Select all"
  [control]="selectAllControl"
  [selectAllIndeterminate]="someSelected()"
  [ariaLabel]="'Select all rows'"
  (toggleAll)="onToggleAll($event)"
></opal-lib-govuk-checkboxes-item>

@for (row of rows(); track row.id; let i = $index) {
  <opal-lib-govuk-checkboxes-item
    opalLibMojMultiSelectBody
    [control]="rowControls[row.id]"
    [inputId]="'row-' + row.id"
    [inputName]="'row-' + row.id"
    [labelText]="row.name"
    [rowId]="row.id"
    [rowIndex]="i"
    [ariaLabel]="'Select row ' + row.name"
    (selectionChange)="onRowSelectionChange($event)"
  ></opal-lib-govuk-checkboxes-item>
}
```

## Exports

- `MojMultiSelectHeadDirective`
- `MojMultiSelectBodyDirective`
- `MultiSelectRowIdentifier`
- Multi-select selection utilities
