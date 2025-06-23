import { ValidatorFn, AbstractControl } from '@angular/forms';

/**
 * Validator function to check if the input value is in a valid driving licence number.
 * @returns A validator function that checks if the input value is a valid driving licence number.
 * The valid format is: 5 letters, 6 digits, 2 letters, and 3 alphanumeric characters.
 * Example: ABCDE123456FGH123
 * If the value does not match this format, it returns an error object; otherwise, it returns null.
 */
export function drivingLicenceNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const value = control.value;
    if (value && !value.match(/^[A-Za-z]{5}\d{6}[A-Za-z]{2}[A-Za-z0-9]{3}$/)) {
      return { invalidDrivingLicenceNumber: { value: value } };
    }
    return null;
  };
}
