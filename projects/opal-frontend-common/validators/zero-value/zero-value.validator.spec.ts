import { FormControl } from '@angular/forms';
import { describe, expect, it } from 'vitest';

import { zeroValueValidator } from './zero-value.validator';

describe('zeroValueValidator', () => {
  it('should return null if value is empty', () => {
    const control = new FormControl('');

    expect(zeroValueValidator()(control)).toBeNull();
  });

  it('should return null if value is null', () => {
    const control = new FormControl(null);

    expect(zeroValueValidator()(control)).toBeNull();
  });

  it('should return null if value is undefined', () => {
    const control = new FormControl(undefined);

    expect(zeroValueValidator()(control)).toBeNull();
  });

  it('should return null if value is whitespace', () => {
    const control = new FormControl('   ');

    expect(zeroValueValidator()(control)).toBeNull();
  });

  it('should return an error when the value is a zero string', () => {
    const control = new FormControl('0');

    expect(zeroValueValidator()(control)).toEqual({ zeroValue: true });
  });

  it('should return an error when the value is a zero decimal string', () => {
    const control = new FormControl('0.00');

    expect(zeroValueValidator()(control)).toEqual({ zeroValue: true });
  });

  it('should return an error when the value is negative zero', () => {
    const control = new FormControl('-0');

    expect(zeroValueValidator()(control)).toEqual({ zeroValue: true });
  });

  it('should return null when the value is negative', () => {
    const control = new FormControl('-1');

    expect(zeroValueValidator()(control)).toBeNull();
  });

  it('should return null when the value is positive', () => {
    const control = new FormControl(10);

    expect(zeroValueValidator()(control)).toBeNull();
  });

  it('should return null when the value is not numeric', () => {
    const control = new FormControl('abc');

    expect(zeroValueValidator()(control)).toBeNull();
  });
});
