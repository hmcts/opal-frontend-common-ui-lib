import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-govuk-details',
  imports: [],
  templateUrl: './govuk-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukDetailsComponent {
  @Input({ required: true }) summaryText!: string;
}
