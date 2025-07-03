import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-summary-metric-bar-item-value, [opal-lib-custom-summary-metric-bar-item-value]',
  templateUrl: './custom-summary-metric-bar-item-value.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSummaryMetricBarItemValueComponent {
  @HostBinding('class') hostClass = 'govuk-body govuk-!-font-size-24 govuk-!-font-weight-bold govuk-!-margin-0';
}
