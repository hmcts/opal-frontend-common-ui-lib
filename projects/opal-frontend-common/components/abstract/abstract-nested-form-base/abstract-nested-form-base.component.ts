import { Component } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  IAbstractFormBaseFieldError,
  IAbstractFormBaseFieldErrors,
} from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

@Component({
  template: '',
})
/**
 * Base class for **nested** form components that contribute their own controls and
 * field-error messages into a container form managed by a parent component.
 *
 * Responsibilities:
 * - Install (and later remove) child-owned controls into an existing FormGroup.
 * - Provide tiny ergonomics for common validation flows (required toggle, reset helpers, subscriptions).
 * - Register/unregister this component’s error-message definitions into the active `fieldErrors` map.
 *   (Typically the parent passes its map down so both share the same object.)
 */
export abstract class AbstractNestedFormBaseComponent extends AbstractFormBaseComponent {
  private registeredFieldErrors: Record<string, string[]> = {};

  /**
   * Removes only the error types that were previously registered by this component.
   *
   * If a control key has no error types left after removal, the key is deleted from the map.
   * Safe to call multiple times.
   */
  private unregisterNestedFormFieldErrors(): void {
    const registry = this.registeredFieldErrors;
    if (!registry || !this.fieldErrors) return;

    Object.entries(registry).forEach(([controlKey, types]) => {
      const existing = this.fieldErrors[controlKey];
      if (!existing) return;
      types.forEach((t) => {
        delete existing[t];
      });
      if (!Object.keys(existing).length) {
        delete this.fieldErrors[controlKey];
      }
    });

    this.registeredFieldErrors = {};
  }

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
   * Merges this component’s field-error definitions into the active `fieldErrors` map.
   *
   * - Existing error **types** for the same control key are preserved (no overwrite).
   * - Newly added error types are tracked so they can be removed later.
   * - The target map is whatever `this.fieldErrors` currently references (often the parent’s map when passed down).
   *
   * @param child Map of controlKey → { errorType: { message, priority } } to register.
   */
  protected registerNestedFormFieldErrors(child: IAbstractFormBaseFieldErrors): void {
    if (!child) return;
    if (!this.fieldErrors) this.fieldErrors = {} as IAbstractFormBaseFieldErrors;

    Object.entries(child).forEach(([controlKey, childErrors]) => {
      const existing: IAbstractFormBaseFieldError = this.fieldErrors[controlKey] ?? ({} as IAbstractFormBaseFieldError);

      // add only new error types to avoid overwriting
      const newEntries: IAbstractFormBaseFieldError = {};
      const addedTypes: string[] = [];
      Object.keys(childErrors).forEach((errorType) => {
        if (!(errorType in existing)) {
          newEntries[errorType] = childErrors[errorType];
          addedTypes.push(errorType);
        }
      });

      if (addedTypes.length) {
        this.fieldErrors[controlKey] = { ...existing, ...newEntries };
        this.registeredFieldErrors[controlKey] = [...(this.registeredFieldErrors[controlKey] ?? []), ...addedTypes];
      }
    });
  }

  /**
   * Cleans up on destroy:
   * 1) Unregisters any field-error definitions this component registered, and
   * 2) If `this.form` is nested (has a parent), removes all controls added to it.
   *
   * Finally calls `super.ngOnDestroy()` to complete the base teardown.
   */
  public override ngOnDestroy(): void {
    this.unregisterNestedFormFieldErrors();
    if (this.form?.parent) {
      Object.keys(this.form.controls).forEach((name) => this.form.removeControl(name));
    }
    super.ngOnDestroy();
  }
}
