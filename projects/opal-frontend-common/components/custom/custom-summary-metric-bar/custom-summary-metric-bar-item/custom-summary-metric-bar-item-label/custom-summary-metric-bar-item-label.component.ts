import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-summary-metric-bar-item-label, [opal-lib-custom-summary-metric-bar-item-label]',
  templateUrl: './custom-summary-metric-bar-item-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSummaryMetricBarItemLabelComponent {
  @HostBinding('class') hostClass = 'govuk-body govuk-!-font-size-19 govuk-!-font-weight-bold govuk-!-margin-0';
}
