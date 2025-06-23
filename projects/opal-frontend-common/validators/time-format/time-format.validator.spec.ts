import { FormControl } from '@angular/forms';
import { timeFormatValidator } from './time-format.validator';

describe('validTimeFormatValidator', () => {
  it('should return null for a valid time format (HH:mm)', () => {
    const control = new FormControl('12:30');
    const result = timeFormatValidator()(control);
    expect(result).toBeNull();
  });

  it('should return null for an empty string', () => {
    const control = new FormControl('');
    const result = timeFormatValidator()(control);
    expect(result).toBeNull();
  });

  it('should return an error object for an invalid time format', () => {
    const control = new FormControl('25:00');
    const result = timeFormatValidator()(control);
    expect(result).toEqual({ invalidTimeFormat: { value: '25:00' } });
  });

  it('should return an error object for a time format with seconds', () => {
    const control = new FormControl('12:30:45');
    const result = timeFormatValidator()(control);
    expect(result).toEqual({ invalidTimeFormat: { value: '12:30:45' } });
  });

  it('should return an error object for a time format with letters', () => {
    const control = new FormControl('12:ab');
    const result = timeFormatValidator()(control);
    expect(result).toEqual({ invalidTimeFormat: { value: '12:ab' } });
  });
});
