import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Returns a validator function that rejects numeric zero values.
 * Empty and non-numeric values are treated as valid.
 *
 * @returns A ValidatorFn that returns `{ zeroValue: true }` when the parsed value is zero, otherwise null.
 */
export function nonZeroValueValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }

    const value = typeof control.value === 'string' ? control.value.trim() : control.value;

    if (value === '') {
      return null;
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return null;
    }

    return numericValue === 0 ? { zeroValue: true } : null;
  };
}
