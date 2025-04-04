import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-govuk-summary-list',
  imports: [],
  templateUrl: './govuk-summary-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukSummaryListComponent {
  @Input({ required: true }) summaryListId!: string;
  @Input({ required: false }) classes!: string;
}
