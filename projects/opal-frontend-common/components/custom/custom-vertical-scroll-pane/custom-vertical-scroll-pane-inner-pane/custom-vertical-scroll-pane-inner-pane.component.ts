import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-vertical-scroll-pane-inner-pane',
  imports: [CommonModule],
  templateUrl: './custom-vertical-scroll-pane-inner-pane.component.html',
  styleUrl: './custom-vertical-scroll-pane-inner-pane.component.scss',
})
export class CustomVerticalScrollPaneInnerPaneComponent {
  @Input({ required: false }) maxHeight: string = '500px';
  @Input({ required: false }) stickyHeadersEnabled: boolean = true;
}
