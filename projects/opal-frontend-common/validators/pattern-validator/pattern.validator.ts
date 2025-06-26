import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Returns a validator function that tests a form control's value against a given regular expression.
 * If the value does not match the pattern, it returns a validation error with the provided error key.
 * Returns null for empty or valid values.
 *
 * @param pattern - The regular expression to test the control's value against.
 * @param errorKey - The key to use in the returned validation error object (defaults to 'patternInvalid').
 * @returns A ValidatorFn that returns a validation error object or null.
 */
export function patternValidator(pattern: RegExp, errorKey: string = 'patternInvalid'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    return pattern.test(control.value)
      ? null
      : {
          [errorKey]: true,
        };
  };
}
