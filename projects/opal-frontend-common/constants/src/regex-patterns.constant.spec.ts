import { describe, expect, it } from 'vitest';
import { ADDRESS_LINE_PATTERN } from './regex-patterns.constant';

describe('ADDRESS_LINE_PATTERN', () => {
  it('should allow supported address characters', () => {
    expect(ADDRESS_LINE_PATTERN.test(`Flat 3, 10-12 O'Leary Street`)).toBe(true);
    expect(ADDRESS_LINE_PATTERN.test('Unit_4 (Rear Block)*.')).toBe(true);
  });

  it('should reject unsupported address characters', () => {
    expect(ADDRESS_LINE_PATTERN.test('12/14 King Street')).toBe(false);
    expect(ADDRESS_LINE_PATTERN.test('Flat #3')).toBe(false);
  });
});
