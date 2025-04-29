import { Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-gov-uk-error-message',
  imports: [],
  templateUrl: './govuk-error-message.component.html',
})
export class GovUkErrorMessageComponent {
  @Input({ required: true }) error: string | null = null;
  @Input({ required: true }) elementId!: string;
}
