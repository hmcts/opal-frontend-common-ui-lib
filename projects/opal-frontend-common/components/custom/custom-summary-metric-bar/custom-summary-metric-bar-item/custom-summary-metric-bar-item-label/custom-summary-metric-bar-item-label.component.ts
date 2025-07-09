import { Component, ChangeDetectionStrategy, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-summary-metric-bar-item-label, [opal-lib-custom-summary-metric-bar-item-label]',
  templateUrl: './custom-summary-metric-bar-item-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSummaryMetricBarItemLabelComponent {
  @Input({ required: false }) textColour: string = 'govuk-dark-grey-text-colour';

  @HostBinding('class')
  get hostClasses(): string {
    return `govuk-body govuk-!-font-size-19 govuk-!-font-weight-bold govuk-!-margin-0 ${this.textColour}`;
  }
}
