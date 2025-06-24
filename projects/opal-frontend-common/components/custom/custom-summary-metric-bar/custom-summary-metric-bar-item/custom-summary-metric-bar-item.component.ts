import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-summary-metric-bar-item',
  templateUrl: './custom-summary-metric-bar-item.component.html',
  styleUrl: './custom-summary-metric-bar-item.component.scss',
})
export class CustomSummaryMetricBarItemComponent {
  @Input() backgroundColour: string = '';
  @Input() textColour: string = '';

  @HostBinding('style.backgroundColor') get bg(): string {
    return this.backgroundColour;
  }

  @HostBinding('style.color') get fg(): string {
    return this.textColour;
  }
}
