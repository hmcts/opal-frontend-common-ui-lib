import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';

export type ITEM_COLOURS = 'light-grey' | 'light-blue' | 'blue';

@Component({
  selector: 'opal-lib-custom-summary-metric-bar-item',
  templateUrl: './custom-summary-metric-bar-item.component.html',
  styleUrls: ['./custom-summary-metric-bar-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSummaryMetricBarItemComponent {
  @Input() itemColour: ITEM_COLOURS = 'light-grey';

  @HostBinding('class')
  get hostClasses(): string {
    return `${this.itemColour}-item`;
  }
}
