import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'opal-lib-govuk-table-heading, [opal-lib-govuk-table-heading]',
  imports: [],
  templateUrl: './govuk-table-heading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTableHeadingComponent {
  @HostBinding('class') hostClass = `govuk-table__header`;
  @HostBinding('scope') get hostScope() {
    return 'col';
  }
}
