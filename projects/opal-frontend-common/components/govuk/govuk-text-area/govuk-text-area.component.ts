import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AbstractGovukTextComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-govuk-text';

@Component({
  selector: 'opal-lib-govuk-text-area',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './govuk-text-area.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTextAreaComponent extends AbstractGovukTextComponent {
  @Input({ required: false }) inputMode: string = 'text';
  @Input({ required: false }) rows: number = 5;
}
