import { describe, beforeEach, it, expect } from 'vitest';
import { NationalInsurancePipe } from './national-insurance.pipe';

describe('NationalInsurancePipe', () => {
  let pipe: NationalInsurancePipe;

  beforeEach(() => {
    pipe = new NationalInsurancePipe();
  });

  it('should format a standard NI number correctly', () => {
    expect(pipe.transform('QQ123456C')).toBe('QQ 12 34 56 C');
  });

  it('should format a lowercase NI number', () => {
    expect(pipe.transform('qq123456c')).toBe('QQ 12 34 56 C');
  });

  it('should format NI number with special characters', () => {
    expect(pipe.transform('qq-12-34-56-c')).toBe('QQ 12 34 56 C');
  });

  it('should return original value if input is too short', () => {
    expect(pipe.transform('Q123456')).toBe('Q123456');
  });

  it('should return empty string for null or empty input', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null as unknown as string)).toBe('');
    expect(pipe.transform(undefined as unknown as string)).toBe('');
  });
});
