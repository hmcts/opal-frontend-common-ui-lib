import { ValidatorFn, AbstractControl } from '@angular/forms';

/**
 * * Validator function to check if the input value is in a valid time format (HH:mm).
 * * @returns A validator function that returns an error object if the value is not in the valid time format, or null if it is valid.
 */
export function timeFormatValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const value = control.value;
    if (value && !value.match(/^([01]\d|2[0-3]):[0-5]\d$/)) {
      return { invalidTimeFormat: { value: value } };
    }
    return null;
  };
}
