import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-multi-select-header, [opal-lib-moj-multi-select-header]',
  templateUrl: './moj-multi-select-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Represents the header checkbox for multi-select tables.
 * Used to select or deselect all rows in the table.
 */
export class MojMultiSelectHeader {
  /**
   * The base identifier used for generating both the host `<th>` id and checkbox `<input>` id.
   */
  @Input({ required: true }) id!: string;

  /**
   * Controls whether the header checkbox is checked.
   */
  @Input({ required: false }) checked = false;

  /**
   * Emits the new checked state when the header checkbox is toggled.
   */
  @Output() toggled = new EventEmitter<boolean>();

  /**
   * Applies GOV.UK table header styling.
   */
  @HostBinding('class') hostHeaderClass = 'govuk-table__header';

  /**
   * Applies GOV.UK table header semantics.
   */
  @HostBinding('attr.scope') hostScope = 'col';

  /**
   * Returns the id of the host `<th>` element, derived from the base id.
   */
  @HostBinding('attr.id') get hostTableHeaderIdAttr() {
    return this.id ? `${this.id}-select-all` : null;
  }

  /**
   * Returns the id of the inner checkbox `<input>`, derived from the base id.
   */
  get checkboxId() {
    return this.id ? `${this.id}-select-all-input` : null;
  }

  /**
   * Handles the checkbox change event and emits the new checked state.
   */
  onChange(evt: Event) {
    const target = evt.target as HTMLInputElement;
    this.toggled.emit(!!target.checked);
  }
}
