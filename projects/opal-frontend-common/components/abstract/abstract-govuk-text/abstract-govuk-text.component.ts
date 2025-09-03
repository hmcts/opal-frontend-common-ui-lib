import { Directive, DestroyRef, Input, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl } from '@angular/forms';

@Directive()
export abstract class AbstractGovukTextComponent {
  private readonly destroyRef = inject(DestroyRef);
  private _control!: FormControl;
  private readonly _controlValue = signal<string>('');

  protected readonly remainingCharacterCount = computed(() => {
    return this.maxCharacterLimit - this._controlValue().length;
  });

  @Input({ required: true }) labelText!: string;
  @Input({ required: false }) labelClasses!: string;
  @Input({ required: true }) inputId!: string;
  @Input({ required: true }) inputName!: string;
  @Input({ required: false }) inputClasses!: string;
  @Input({ required: false }) hintText!: string;
  @Input({ required: false }) errors: string | null = null;
  @Input({ required: false }) characterCountEnabled: boolean = false;
  @Input({ required: false }) maxCharacterLimit: number = 500;
  @Input({ required: true }) set control(abstractControl: AbstractControl | null) {
    this._control = abstractControl as FormControl;

    this._controlValue.set(this._control.value || '');

    this._control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this._controlValue.set(value || '');
    });
  }

  get getControl() {
    return this._control;
  }
}
