import { Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-scrollable-panes',
  templateUrl: './custom-scrollable-panes.component.html',
  styleUrl: './custom-scrollable-panes.component.scss',
})
export class CustomScrollablePanesComponent {
  @Input({ required: false }) public height: string = '100%';
}
