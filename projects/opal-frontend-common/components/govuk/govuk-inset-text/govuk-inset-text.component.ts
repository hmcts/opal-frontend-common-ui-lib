import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'opal-lib-govuk-inset-text',
  imports: [NgClass],
  templateUrl: './govuk-inset-text.component.html',
})
export class GovukInsetTextComponent {
  @Input({ required: true }) insetTextId!: string;
  @Input({ required: false }) classes: string | null = null;
}
