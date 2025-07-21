import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-scrollable-panes-inner-pane',
  imports: [CommonModule],
  templateUrl: './custom-scrollable-panes-inner-pane.component.html',
  styleUrl: './custom-scrollable-panes-inner-pane.component.scss',
})
export class CustomScrollablePanesInnerPaneComponent {
  @Input({ required: false }) stickyHeadersEnabled: boolean = true;
  @Input({ required: false }) maxHeight: string = '500px';
}
