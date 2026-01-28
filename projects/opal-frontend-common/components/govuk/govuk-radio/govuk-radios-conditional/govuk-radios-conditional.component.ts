import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-govuk-radios-conditional, [opal-lib-govuk-radios-conditional]',
  imports: [],
  templateUrl: './govuk-radios-conditional.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./govuk-radios-conditional.component.scss'],
})
export class GovukRadiosConditionalComponent {
  /**
   * Id used by aria-controls to connect a radio input to this conditional panel.
   */
  @Input({ required: true }) conditionalId!: string;
}
