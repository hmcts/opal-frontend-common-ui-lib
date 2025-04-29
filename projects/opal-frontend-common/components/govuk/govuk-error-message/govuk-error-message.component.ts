import { Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-govuk-error-message',
  imports: [],
  templateUrl: './govuk-error-message.component.html',
})
export class GovukErrorMessageComponent {
  @Input({ required: true }) error!: boolean;
  @Input({ required: true }) errorMessage!: string;
  @Input({ required: true }) elementId!: string;
}
