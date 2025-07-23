import { UppercaseAllPipe } from './capitalisation.pipe';

describe('UppercaseAllPipe', () => {
  let pipe: UppercaseAllPipe;

  beforeEach(() => {
    pipe = new UppercaseAllPipe();
  });

  it('should convert lowercase string to uppercase', () => {
    expect(pipe.transform('warrant')).toBe('WARRANT');
  });

  it('should return empty string for null input', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined input', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should not change an already uppercase string', () => {
    expect(pipe.transform('ALREADY')).toBe('ALREADY');
  });

  it('should handle mixed case input', () => {
    expect(pipe.transform('wArRaNt')).toBe('WARRANT');
  });
});
