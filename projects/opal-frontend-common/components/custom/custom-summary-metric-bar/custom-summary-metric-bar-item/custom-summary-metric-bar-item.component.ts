import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type Colours = 'grey' | 'light-blue' | 'blue';

@Component({
  selector: 'opal-lib-custom-summary-metric-bar-item',
  imports: [CommonModule],
  templateUrl: './custom-summary-metric-bar-item.component.html',
  styleUrl: './custom-summary-metric-bar-item.component.css',
})
export class CustomSummaryMetricBarItemComponent {
  @Input({ required: false }) colour: Colours = 'grey';
}
