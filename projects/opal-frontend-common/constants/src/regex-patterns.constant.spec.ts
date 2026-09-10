import { describe, expect, it } from 'vitest';
import { ADDRESS_LINE_PATTERN, LETTERS_SPACES_HYPHENS_PATTERN } from './regex-patterns.constant';

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

describe('LETTERS_SPACES_HYPHENS_PATTERN', () => {
  it('should allow letters, spaces and hyphens', () => {
    expect(LETTERS_SPACES_HYPHENS_PATTERN.test('John Smith')).toBe(true);
    expect(LETTERS_SPACES_HYPHENS_PATTERN.test('Mary-Jane Smith')).toBe(true);
    expect(LETTERS_SPACES_HYPHENS_PATTERN.test('')).toBe(true);
  });

  it('should reject unsupported characters', () => {
    expect(LETTERS_SPACES_HYPHENS_PATTERN.test('John Smith2')).toBe(false);
    expect(LETTERS_SPACES_HYPHENS_PATTERN.test("O'Connor")).toBe(false);
    expect(LETTERS_SPACES_HYPHENS_PATTERN.test('Smith.')).toBe(false);
  });
});
