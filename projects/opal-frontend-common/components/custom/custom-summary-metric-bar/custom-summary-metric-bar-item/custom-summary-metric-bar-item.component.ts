import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-summary-metric-bar-item',
  templateUrl: './custom-summary-metric-bar-item.component.html',
  styleUrl: './custom-summary-metric-bar-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSummaryMetricBarItemComponent {
  @Input() backgroundColour: string = '#EEEFEF';
  @Input() textColour: string = '#383F43';

  @HostBinding('style.backgroundColor') get backgroundColourStyle(): string {
    return this.backgroundColour;
  }

  @HostBinding('style.color') get textColourStyle(): string {
    return this.textColour;
  }
}
