import { ValidatorFn, AbstractControl } from '@angular/forms';

export function nationalInsuranceNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const value = control.value;
    if (value) {
      // Check if the value has exactly 9 characters and matches the National Insurance number format
      const ninoRegex = /^[A-Z]{2}\d{6}[A-D]$/;
      if (value.length !== 9 || !ninoRegex.test(value)) {
        return { nationalInsuranceNumberPattern: { value: value } };
      }
    }
    return null;
  };
}
