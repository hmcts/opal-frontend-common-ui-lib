import { ValidatorFn, AbstractControl } from '@angular/forms';

export function optionalPhoneNumberValidator(allowedLengths: readonly number[] = [11]): ValidatorFn {
  const numericPattern = /^[\d\s]*$/;
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    if (control.value) {
      const valueWithoutSpaces = control.value.replaceAll(/\s+/g, '');
      const isValidPattern = numericPattern.test(control.value);
      const isValidLength = allowedLengths.includes(valueWithoutSpaces.length);
      const valid = isValidPattern && isValidLength;
      return valid ? null : { phoneNumberPattern: { value: control.value } };
    }
    return null;
  };
}
