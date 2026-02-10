import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { FormControl, AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'opal-lib-govuk-radios-item, [opal-lib-govuk-radios-item]',
  imports: [ReactiveFormsModule],
  templateUrl: './govuk-radios-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukRadiosItemComponent {
  private _control!: FormControl;

  @Input({ required: true }) labelText!: string;
  @Input({ required: false }) labelClasses!: string;
  @Input({ required: true }) inputId!: string;
  @Input({ required: true }) inputName!: string;
  @Input({ required: false }) inputClasses!: string;
  @Input({ required: true }) inputValue!: string | boolean;
  @Input({ required: false }) inputValueHint!: string;
  @Input({ required: false }) ariaControls!: string;

  /**
   * Assigns the FormControl used to bind the radio input.
   * @param abstractControl - Control instance from the parent form group.
   * @remarks Casts to FormControl for template binding.
   */
  @Input({ required: true }) set control(abstractControl: AbstractControl | null) {
    // Form controls are passed in as abstract controls, we need to re-cast it.
    this._control = abstractControl as FormControl;
  }

  @HostBinding('class') class = 'govuk-radios__item';

  /**
   * Exposes the bound FormControl to the template.
   */
  get getControl() {
    return this._control;
  }

  /**
   * Normalizes the input name for safe binding.
   * @returns Trimmed input name or empty string.
   */
  get resolvedInputName(): string {
    return this.inputName?.trim() ?? '';
  }

  /**
   * Ensures the radio input id is prefixed with the input name when needed.
   * @returns Normalized id used by the input and label.
   */
  get resolvedInputId(): string {
    const baseId = this.inputId?.trim() ?? '';
    const inputName = this.resolvedInputName;
    const prefix = inputName ? `${inputName}-` : '';

    if (!baseId || !prefix || baseId === inputName || baseId.startsWith(prefix)) {
      return baseId;
    }

    return `${prefix}${baseId}`;
  }

  /**
   * Normalizes aria-controls to avoid empty attributes.
   * @returns Trimmed value or null when not provided.
   */
  get dataAriaControls(): string | null {
    const controls = this.ariaControls?.trim();
    return controls || null;
  }

  /**
   * Exposes the radio value for Angular's RadioControlValueAccessor.
   * IMPORTANT: keep the original type (e.g. boolean) so Reactive Forms emits the correct value.
   */
  get resolvedInputValue(): string | boolean {
    return this.inputValue;
  }

  /**
   * Normalizes the radio value to a string for the HTML attribute binding.
   * @returns String value for the input's `value` attribute.
   */
  get resolvedInputValueAttr(): string {
    const v = this.inputValue;
    return typeof v === 'string' ? v : String(v);
  }
}
