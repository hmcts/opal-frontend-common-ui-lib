import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-ticket-panel',
  imports: [],
  templateUrl: './moj-ticket-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojTicketPanelComponent {
  @Input({ required: false }) componentClasses!: string;
  @Input({ required: false }) sectionClasses!: string;
  @Input({ required: false }) alert!: boolean;
}
