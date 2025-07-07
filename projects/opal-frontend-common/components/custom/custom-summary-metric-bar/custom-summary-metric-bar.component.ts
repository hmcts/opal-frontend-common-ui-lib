import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-summary-metric-bar, [opal-lib-custom-summary-metric-bar]',
  templateUrl: './custom-summary-metric-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSummaryMetricBarComponent {
  @HostBinding('class') hostClass = 'govuk-grid-row';
}
