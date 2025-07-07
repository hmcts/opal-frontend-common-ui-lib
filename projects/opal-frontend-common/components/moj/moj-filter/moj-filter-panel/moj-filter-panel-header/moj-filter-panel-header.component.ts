import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-filter-panel-header',
  templateUrl: './moj-filter-panel-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojFilterPanelHeaderComponent {
  @Input({ required: false }) title: string = 'Filter';
}
