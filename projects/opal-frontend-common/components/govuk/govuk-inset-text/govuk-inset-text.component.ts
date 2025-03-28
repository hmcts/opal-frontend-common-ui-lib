import { Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-govuk-inset-text',
  imports: [],
  templateUrl: './govuk-inset-text.component.html',
})
export class GovukInsetTextComponent {
  @Input({ required: true }) insetTextId!: string;
}
