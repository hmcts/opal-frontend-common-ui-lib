import { Component } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  template: '',
})
export abstract class AbstractNestedFormBaseComponent extends AbstractFormBaseComponent {
  /**
   * Installs all controls from a **detached** builder group into a target FormGroup (defaults to `this.form`).
   *
   * @param source A FormGroup created locally (its controls must not already belong to another parent).
   * @param target The FormGroup to install the controls into. Defaults to `this.form`.
   *
   * Notes:
   * - This method **moves** the control instances from `source` into `target` (no cloning).
   * - If a control already has a parent, Angular will throw when adding it to `target`.
   */
  protected addControlsToNestedFormGroup(source: FormGroup, target: FormGroup = this.form): void {
    Object.entries(source.controls).forEach(([name, ctrl]) => {
      target.addControl(name, ctrl);
    });
  }

  /**
   * Removes controls from `target` whose names are present in `source` (defaults to `this.form`).
   *
   * @param source A FormGroup whose control names identify which controls to remove.
   * @param target The FormGroup to remove controls from. Defaults to `this.form`.
   *
   * Use this with the same builder group you used to add controls so you only remove what you added.
   */
  protected removeControlsFromNestedFormGroup(source: FormGroup, target: FormGroup = this.form): void {
    Object.keys(source.controls).forEach((name) => {
      target.removeControl(name);
    });
  }

  /**
   * Adds or removes one or more validators on a control and updates validity without emitting events.
   *
   * @param control The control to modify. If null/undefined, the method no-ops and returns `false`.
   * @param validators A single `ValidatorFn` or an array of `ValidatorFn`s to add/remove.
   * @param present When `true`, validators are added; when `false`, the same validators are removed.
   * @returns The `present` flag (for convenient inline use in conditionals).
   */
  protected setValidatorPresence(
    control: AbstractControl | null,
    validators: ValidatorFn | ValidatorFn[],
    present: boolean,
  ): boolean {
    if (!control) return false;
    const list = Array.isArray(validators) ? validators : [validators];
    if (present) {
      control.addValidators(list);
    } else {
      control.removeValidators(list);
    }
    control.updateValueAndValidity({ emitEvent: false, onlySelf: true });
    return present;
  }

  /**
   * Truthy-value helper used by multiple sub-forms.
   *
   * Returns `false` for `null`/`undefined`. For strings, trims whitespace and checks for non-zero length.
   * For all other types, returns `true` (treat non-string values as present).
   */
  protected hasValue(v: unknown): boolean {
    if (v == null) return false;
    return typeof v === 'string' ? v.trim().length > 0 : true;
  }

  /**
   * Resets a list of controls and re-computes validity without emitting value-change events.
   *
   * For each control: clears errors, resets the value to `null`, and calls `updateValueAndValidity`.
   * This means built-in validators (e.g. `required`) will be re-applied after reset.
   */
  protected resetAndValidateControls(controls: (AbstractControl | null)[]): void {
    controls.forEach((c) => {
      if (!c) return;
      c.setErrors(null);
      c.reset(null, { emitEvent: false });
      c.updateValueAndValidity({ emitEvent: false, onlySelf: true });
    });
  }

  /**
   * Resets a FormGroup’s value/state and re-computes validity without emitting value-change events.
   *
   * Performs: `group.reset(undefined)`, marks pristine/untouched, then `updateValueAndValidity`.
   */
  protected resetAndValidateFormGroup(group: FormGroup): void {
    group.reset(undefined, { emitEvent: false });
    group.markAsPristine();
    group.markAsUntouched();
    group.updateValueAndValidity({ emitEvent: false, onlySelf: true });
  }

  /**
   * Subscribes a handler to the `valueChanges` of multiple controls, with auto-unsubscribe on destroy.
   *
   * @param handler Function invoked whenever **any** provided control emits a value change.
   * @param controls One or more controls to observe; falsy entries are ignored.
   *
   * Implementation detail: merges the streams and unsubscribes via `takeUntil(this.ngUnsubscribe)`.
   */
  protected subscribeValidation(handler: () => void, ...controls: (AbstractControl | null)[]): void {
    const streams = controls.filter(Boolean).map((c) => c!.valueChanges);
    if (!streams.length) return;
    merge(...streams)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(handler);
  }

  /**
   * @inheritdoc
   *
   * Handles cleanup logic when the component is destroyed.
   *
   * - Clears local child error definitions and emits an empty map to the parent.
   * - Removes all controls added by this sub-form from the parent form, if nested.
   * - Calls the base class's `ngOnDestroy` for additional teardown.
   */
  public override ngOnDestroy(): void {
    // Remove controls this sub-form added to the parent (if nested)
    if (this.form?.parent) {
      Object.keys(this.form.controls).forEach((name) => this.form.removeControl(name));
    }

    super.ngOnDestroy();
  }
}
