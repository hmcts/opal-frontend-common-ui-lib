import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-govuk-checkboxes',
  imports: [CommonModule],
  templateUrl: './govuk-checkboxes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukCheckboxesComponent {
  @Input({ required: true }) fieldSetId!: string;
  @Input({ required: true }) legendText!: string;
  @Input({ required: false }) legendHint!: string;
  @Input({ required: false }) legendClasses!: string;
  @Input({ required: false }) checkboxClasses!: string;
  @Input({ required: false }) errors!: string | null;

  get describedBy(): string | null {
    const ids: string[] = [];

    if (this.legendHint) {
      ids.push(`${this.fieldSetId}-hint`);
    }

    if (this.errors) {
      ids.push(`${this.fieldSetId}-error-message`);
    }

    return ids.length ? ids.join(' ') : null;
  }
}
