import { ValidatorFn, AbstractControl } from '@angular/forms';

export function nationalInsuranceNumberValidator(stripSpaces = false): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const value = control.value;
    if (value) {
      const valueToValidate = stripSpaces ? value.replace(/ /g, '') : value;
      // Check if the value has exactly 9 characters and matches the National Insurance number format
      const ninoRegex = /^[A-Z]{2}\d{6}[A-D]$/;
      if (valueToValidate.length !== 9 || !ninoRegex.test(valueToValidate)) {
        return { nationalInsuranceNumberPattern: { value: value } };
      }
    }
    return null;
  };
}
