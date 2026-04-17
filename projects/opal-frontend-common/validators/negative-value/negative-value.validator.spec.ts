import { FormControl } from '@angular/forms';
import { describe, expect, it } from 'vitest';

import { negativeValueValidator } from './negative-value.validator';

describe('negativeValueValidator', () => {
  it('should return null if value is empty', () => {
    const control = new FormControl('');

    expect(negativeValueValidator()(control)).toBeNull();
  });

  it('should return null if value is null', () => {
    const control = new FormControl(null);

    expect(negativeValueValidator()(control)).toBeNull();
  });

  it('should return null if value is undefined', () => {
    const control = new FormControl(undefined);

    expect(negativeValueValidator()(control)).toBeNull();
  });

  it('should return null if value is whitespace', () => {
    const control = new FormControl('   ');

    expect(negativeValueValidator()(control)).toBeNull();
  });

  it('should return an error when the value is a negative string', () => {
    const control = new FormControl('-1');

    expect(negativeValueValidator()(control)).toEqual({ negativeValue: true });
  });

  it('should return an error when the value is a negative number', () => {
    const control = new FormControl(-42);

    expect(negativeValueValidator()(control)).toEqual({ negativeValue: true });
  });

  it('should return null when the value is zero', () => {
    const control = new FormControl('0');

    expect(negativeValueValidator()(control)).toBeNull();
  });

  it('should return null when the value is a positive number', () => {
    const control = new FormControl('12.34');

    expect(negativeValueValidator()(control)).toBeNull();
  });

  it('should return null when the value is not numeric', () => {
    const control = new FormControl('abc');

    expect(negativeValueValidator()(control)).toBeNull();
  });
});
