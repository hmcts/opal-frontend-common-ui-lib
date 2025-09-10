import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

/**
 * Row checkbox for multi-select tables (attribute-on-<td> usage).
 *
 * Usage:
 *   <td
 *     opal-lib-moj-multi-select-row
 *     [id]="'check-and-validate-table'"
 *     [rowIdentifier]="row['Defendant id']"
 *     [checked]="rowIsSelected(row)"
 *     (toggled)="toggleRow(row, $event)"
 *   ></td>
 */
@Component({
  selector: 'opal-lib-moj-multi-select-row, [opal-lib-moj-multi-select-row]',
  standalone: true,
  templateUrl: './moj-multi-select-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojMultiSelectRow {
  /** Base id prefix shared with the header (e.g. 'check-and-validate-table'). */
  @Input({ required: true }) id!: string;

  /** Stable unique identifier for this row (string or number). */
  @Input({ required: true }) rowIdentifier!: string | number;

  /** Whether this row is selected. */
  @Input() checked = false;

  /** Emits the new checked state when the checkbox toggles. */
  @Output() toggled = new EventEmitter<boolean>();

  /** Apply GOV.UK table cell styling to the host <td>. */
  @HostBinding('class') hostCellClass = 'govuk-table__cell';

  /** Host <td> id derived from the base id and rowIdentifier. */
  @HostBinding('attr.id') get hostTableRowIdAttr(): string | null {
    return this.id && this.rowIdentifier != null ? `${this.id}-${this.rowIdentifier}-cell` : null;
  }

  /** Id for the inner checkbox <input>, derived from base id and rowIdentifier. */
  get checkboxId(): string {
    return `${this.id}-${this.rowIdentifier}-input`;
  }

  /** Handle checkbox change and emit new checked state. */
  onChange(evt: Event): void {
    const target = evt.target as HTMLInputElement;
    this.toggled.emit(!!target.checked);
  }
}
