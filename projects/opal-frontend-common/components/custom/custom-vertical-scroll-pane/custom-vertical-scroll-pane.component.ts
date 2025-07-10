import { Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-vertical-scroll-pane',
  templateUrl: './custom-vertical-scroll-pane.component.html',
  styleUrl: './custom-vertical-scroll-pane.component.scss',
})
export class CustomVerticalScrollPaneComponent {
  @Input({ required: false }) maxHeight: string = '400px';
}
