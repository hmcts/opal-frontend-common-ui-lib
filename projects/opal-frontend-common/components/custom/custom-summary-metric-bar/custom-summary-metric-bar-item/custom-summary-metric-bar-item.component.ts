import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';

export type ITEM_COLOURS = 'light-grey' | 'light-blue' | 'blue';

@Component({
  selector: 'opal-lib-custom-summary-metric-bar-item',
  templateUrl: './custom-summary-metric-bar-item.component.html',
  styleUrls: ['./custom-summary-metric-bar-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSummaryMetricBarItemComponent {
  @Input({required: false}) itemColour: ITEM_COLOURS = 'light-grey';
  @Input({required: false}) itemClasses: string = 'govuk-grid-column-one-fifth';

  @HostBinding('class')
  get hostClasses(): string {
    return this.itemClasses;
  }
}
