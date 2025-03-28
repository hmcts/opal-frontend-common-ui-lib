import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-govuk-table-body-row, [opal-lib-govuk-table-body-row]',
  imports: [],
  templateUrl: './govuk-table-body-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTableBodyRowComponent {
  @Input({ required: false }) public bodyRowClasses: string = '';
  @HostBinding('class') get hostClass() {
    return `govuk-table__row ${this.bodyRowClasses}`;
  }
}
