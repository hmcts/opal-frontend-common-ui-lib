import { FormControl } from '@angular/forms';
import { drivingLicenceNumberValidator } from './driving-licence-number.validator';

describe('drivingLicenceNumberValidator', () => {
  const validator = drivingLicenceNumberValidator();

  it('should return null for a valid driving licence number', () => {
    const control = new FormControl('ABCDE123456FGH12');
    expect(validator(control)).toBeNull();
  });

  it('should return error object for an invalid driving licence number (wrong format)', () => {
    const control = new FormControl('12345ABCDE6789');
    const result = validator(control);
    expect(result).toEqual({
      invalidDrivingLicenceNumber: { value: '12345ABCDE6789' },
    });
  });

  it('should return null for an empty value', () => {
    const control = new FormControl('');
    expect(validator(control)).toBeNull();
  });

  it('should return error object for a value that is too short', () => {
    const control = new FormControl('ABC12');
    const result = validator(control);
    expect(result).toEqual({
      invalidDrivingLicenceNumber: { value: 'ABC12' },
    });
  });

  it('should return error object for a value that is too long', () => {
    const control = new FormControl('ABCDE123456FGH1234');
    const result = validator(control);
    expect(result).toEqual({
      invalidDrivingLicenceNumber: { value: 'ABCDE123456FGH1234' },
    });
  });

  it('should return error object for a value with invalid characters', () => {
    const control = new FormControl('ABCDE123456FGH!@#');
    const result = validator(control);
    expect(result).toEqual({
      invalidDrivingLicenceNumber: { value: 'ABCDE123456FGH!@#' },
    });
  });
});
