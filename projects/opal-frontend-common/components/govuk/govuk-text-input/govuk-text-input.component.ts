import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AbstractGovukTextComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-govuk-text';

@Component({
  selector: 'opal-lib-govuk-text-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './govuk-text-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTextInputComponent extends AbstractGovukTextComponent {
  @Input({ required: false }) hintHtml!: boolean;
}
