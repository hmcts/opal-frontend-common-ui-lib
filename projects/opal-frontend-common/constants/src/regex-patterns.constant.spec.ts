import { describe, expect, it } from 'vitest';
import { ASCII_ALPHANUMERIC_PATTERN } from '../public-api';
import { ADDRESS_LINE_PATTERN } from './regex-patterns.constant';

describe('ASCII_ALPHANUMERIC_PATTERN', () => {
  it.each(['AB12', 'azAZ09', 'abc', '123'])('should accept %j', (value) => {
    expect(ASCII_ALPHANUMERIC_PATTERN.test(value)).toBe(true);
  });

  it.each(['', 'AB-12', 'ABß12', 'AB 12', 'É123', 'AB１２'])('should reject %j', (value) => {
    expect(ASCII_ALPHANUMERIC_PATTERN.test(value)).toBe(false);
  });
});

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
