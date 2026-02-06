import { FormControl } from '@angular/forms';
import { patternValidator } from './pattern.validator';
import { describe, it, expect } from 'vitest';

describe('patternValidator', () => {
  it('should return null if value matches pattern', () => {
    const validator = patternValidator(/^[A-Z]{2}\d{6}[A-D]$/);
    const control = new FormControl('QQ123456C');
    expect(validator(control)).toBeNull();
  });

  it('should return error object if value does not match pattern', () => {
    const validator = patternValidator(/^\d{8}$/, 'invalidFormat');
    const control = new FormControl('ABC123');
    const result = validator(control);
    expect(result).toEqual({
      invalidFormat: true,
    });
  });

  it('should return null if control value is empty', () => {
    const validator = patternValidator(/.+/);
    const control = new FormControl('');
    expect(validator(control)).toBeNull();
  });

  it('should use default error key if not provided', () => {
    const validator = patternValidator(/^\d{4}$/);
    const control = new FormControl('abc');
    const result = validator(control);
    expect(result).toEqual({
      patternInvalid: true,
    });
  });

  it('should return null if control value is null or undefined', () => {
    const validator = patternValidator(/^\d+$/);
    expect(validator(new FormControl(null))).toBeNull();
    expect(validator(new FormControl(undefined))).toBeNull();
  });
});
