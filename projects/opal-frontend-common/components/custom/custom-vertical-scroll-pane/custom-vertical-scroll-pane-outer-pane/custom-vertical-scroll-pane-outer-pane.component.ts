import { Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-vertical-scroll-pane-outer-pane',
  templateUrl: './custom-vertical-scroll-pane-outer-pane.component.html',
})
export class CustomVerticalScrollPaneOuterPaneComponent {
  @Input({ required: false }) height: string = '100%';
}
