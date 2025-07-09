import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-summary-metric-bar-item',
  templateUrl: './custom-summary-metric-bar-item.component.html',
  styleUrls: ['./custom-summary-metric-bar-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSummaryMetricBarItemComponent {
  @Input({ required: false }) backgroundColour: string = 'govuk-light-grey-background-colour';
  @Input({ required: false }) itemClasses: string = 'govuk-grid-column-one-quarter';

  @HostBinding('class')
  get hostClasses(): string {
    return this.itemClasses;
  }

  /**
   * Returns the CSS class names for the summary metric bar item.
   *
   * This method generates a string containing the default class "custom-summary-metric-bar-item-frame"
   * combined with additional classes determined by the component's background and text color properties.
   *
   * @returns {string} A space-separated list of CSS classes to apply to the component.
   */
  public getSummaryMetricBarItemClasses(): string {
    return `custom-summary-metric-bar-item-frame ${this.backgroundColour}`;
  }
}
