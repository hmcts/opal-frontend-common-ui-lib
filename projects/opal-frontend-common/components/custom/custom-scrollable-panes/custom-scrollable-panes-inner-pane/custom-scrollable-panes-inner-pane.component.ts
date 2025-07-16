import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-scrollable-panes-inner-pane',
  imports: [CommonModule],
  templateUrl: './custom-scrollable-panes-inner-pane.component.html',
  styleUrl: './custom-scrollable-panes-inner-pane.component.scss',
})
export class CustomScrollablePanesInnerPaneComponent {
  private _maxHeight: string = '500px';

  @Input({ required: false }) stickyHeadersEnabled: boolean = true;

  @Input()
  set maxHeight(value: string) {
    if (!value) {
      this._maxHeight = '500px';
    } else {
      this._maxHeight = `${value}`;
    }
  }

  get maxHeight(): string {
    return this._maxHeight;
  }
}
