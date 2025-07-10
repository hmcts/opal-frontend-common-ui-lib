import { Component, ChangeDetectionStrategy, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-summary-metric-bar-item-value, [opal-lib-custom-summary-metric-bar-item-value]',
  templateUrl: './custom-summary-metric-bar-item-value.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSummaryMetricBarItemValueComponent {
  @Input({ required: false }) textColour: string = 'govuk-dark-grey-text-colour';

  @HostBinding('class')
  get hostClasses(): string {
    return `govuk-body govuk-!-font-size-24 govuk-!-font-weight-bold govuk-!-margin-0 ${this.textColour}`;
  }
}
