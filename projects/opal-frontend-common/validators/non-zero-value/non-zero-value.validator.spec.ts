import { FormControl } from '@angular/forms';
import { describe, expect, it } from 'vitest';

import { nonZeroValueValidator } from './non-zero-value.validator';

describe('nonZeroValueValidator', () => {
  it('should return null if value is empty', () => {
    const control = new FormControl('');

    expect(nonZeroValueValidator()(control)).toBeNull();
  });

  it('should return null if value is null', () => {
    const control = new FormControl(null);

    expect(nonZeroValueValidator()(control)).toBeNull();
  });

  it('should return null if value is undefined', () => {
    const control = new FormControl(undefined);

    expect(nonZeroValueValidator()(control)).toBeNull();
  });

  it('should return null if value is whitespace', () => {
    const control = new FormControl('   ');

    expect(nonZeroValueValidator()(control)).toBeNull();
  });

  it('should return an error when the value is a zero string', () => {
    const control = new FormControl('0');

    expect(nonZeroValueValidator()(control)).toEqual({ zeroValue: true });
  });

  it('should return an error when the value is a zero decimal string', () => {
    const control = new FormControl('0.00');

    expect(nonZeroValueValidator()(control)).toEqual({ zeroValue: true });
  });

  it('should return an error when the value is negative zero', () => {
    const control = new FormControl('-0');

    expect(nonZeroValueValidator()(control)).toEqual({ zeroValue: true });
  });

  it('should return null when the value is negative', () => {
    const control = new FormControl('-1');

    expect(nonZeroValueValidator()(control)).toBeNull();
  });

  it('should return null when the value is positive', () => {
    const control = new FormControl(10);

    expect(nonZeroValueValidator()(control)).toBeNull();
  });

  it('should return null when the value is not numeric', () => {
    const control = new FormControl('abc');

    expect(nonZeroValueValidator()(control)).toBeNull();
  });
});
