import { describe, expect, it } from 'vitest';
import { HISTORY_FALLBACK_DETAILS_MOCK } from '../mocks/history-fallback-details.mock';
import { HISTORY_FALLBACK_ITEM_MOCK } from '../mocks/history-fallback-item.mock';
import { HISTORY_NOTE_DETAILS_MOCK } from '../mocks/history-note-details.mock';
import { HISTORY_NOTE_ITEM_MOCK } from '../mocks/history-note-item.mock';
import { HISTORY_STRUCTURED_NOTE_ITEM_MOCK } from '../mocks/history-structured-note-item.mock';
import { HISTORY_STRUCTURED_NOTE_TRANSFORMED_ITEM_MOCK } from '../mocks/history-structured-note-transformed-item.mock';
import { HISTORY_TRANSFORMATION_CONFIG_MOCK } from '../mocks/history-transformation-config.mock';
import {
  createHistoryDetails,
  createHistoryDetailsPart,
  createHistoryFragment,
  createHistoryLabelValuePart,
  createHistoryTextPart,
  formatHistoryDate,
  formatHistoryMoney,
  getHistoryString,
  getHistoryValue,
  getHistoryValueByPath,
  normaliseHistoryKey,
  normaliseHistoryTransactionType,
  toHistorySnakeCase,
  transformHistoryDetails,
  transformHistoryItems,
} from './history-transformation-service.utils';

const HISTORY_TEST_ALIAS_PATH_PREFIXES = ['', 'details.', 'data.', 'payload.'];
const HISTORY_TEST_DATE_FORMAT = {
  input: 'yyyy-MM-dd',
  output: 'dd/MM/yyyy',
};
const HISTORY_TEST_EMPTY_VALUES: readonly unknown[] = [null, undefined, ''];

describe('history details transformation utils', () => {
  it('should transform a raw item through the configured transformer', () => {
    const result = transformHistoryDetails(HISTORY_NOTE_ITEM_MOCK, HISTORY_TRANSFORMATION_CONFIG_MOCK);

    expect(result).toEqual(HISTORY_NOTE_DETAILS_MOCK);
  });

  it('should transform raw item arrays by replacing the details value', () => {
    const result = transformHistoryItems([HISTORY_STRUCTURED_NOTE_ITEM_MOCK], HISTORY_TRANSFORMATION_CONFIG_MOCK);

    expect(result).toEqual([HISTORY_STRUCTURED_NOTE_TRANSFORMED_ITEM_MOCK]);
  });

  it('should fall back to configured fallback text when no transformer matches', () => {
    const result = transformHistoryDetails(HISTORY_FALLBACK_ITEM_MOCK, HISTORY_TRANSFORMATION_CONFIG_MOCK);

    expect(result).toEqual(HISTORY_FALLBACK_DETAILS_MOCK);
  });

  it('should fall back when item type aliases do not resolve', () => {
    const result = transformHistoryDetails(
      { details: { description: 'No type description' } },
      HISTORY_TRANSFORMATION_CONFIG_MOCK,
    );

    expect(result).toEqual(createHistoryDetails([createHistoryTextPart('No type description')]));
  });

  it('should use the history item type as fallback text when fallback aliases do not resolve', () => {
    const result = transformHistoryDetails(
      { type: 'Generated order', details: {} },
      HISTORY_TRANSFORMATION_CONFIG_MOCK,
    );

    expect(result).toEqual(createHistoryDetails([createHistoryTextPart('Generated order')]));
  });

  it('should keep secondary line parts when line2 has visible content', () => {
    const result = createHistoryDetails([createHistoryTextPart('Line 1')], [createHistoryTextPart('Line 2')]);

    expect(result.line2).toEqual([createHistoryTextPart('Line 2')]);
  });

  it('should set line2 to null when secondary parts are empty', () => {
    const result = createHistoryDetails([createHistoryTextPart('Line 1')], [createHistoryTextPart(null)]);

    expect(result.line2).toBeNull();
  });

  it('should return null when a details part has no visible fragments', () => {
    expect(createHistoryDetailsPart([createHistoryFragment('')])).toBeNull();
  });

  it('should create fragments with default styling flags and optional links', () => {
    expect(createHistoryFragment('Linked', { link: { type: 'account', emit: '1' } })).toEqual({
      text: 'Linked',
      bold: false,
      hyphen: false,
      link: { type: 'account', emit: '1' },
    });
  });

  it('should create label-value parts with a bold label', () => {
    expect(createHistoryLabelValuePart('Old:', 'A')).toEqual({
      fragments: [
        { text: 'Old:', bold: true, hyphen: false },
        { text: 'A', bold: false, hyphen: false },
      ],
    });
  });

  it('should return null when a label-value part has no value', () => {
    expect(createHistoryLabelValuePart('Old:', null)).toBeNull();
  });

  it('should read scalar values from nested alias paths', () => {
    const result = getHistoryString(
      { details: { nested: { value: 'Nested text' } } },
      ['details.nested.value'],
      HISTORY_TEST_ALIAS_PATH_PREFIXES,
      HISTORY_TEST_EMPTY_VALUES,
    );

    expect(result).toBe('Nested text');
  });

  it('should ignore record values when scalar text is expected', () => {
    const result = getHistoryString(
      { details: { noteText: { text: 'Nested note text' } } },
      ['details.noteText'],
      HISTORY_TEST_ALIAS_PATH_PREFIXES,
      HISTORY_TEST_EMPTY_VALUES,
    );

    expect(result).toBeNull();
  });

  it('should return null when no aliases resolve to a non-empty value', () => {
    const result = getHistoryValue(
      { details: { description: null } },
      ['missing', 'description'],
      HISTORY_TEST_ALIAS_PATH_PREFIXES,
      HISTORY_TEST_EMPTY_VALUES,
    );

    expect(result).toBeNull();
  });

  it('should stop reading a path when an intermediate value is not a record', () => {
    const result = getHistoryValueByPath({ details: { description: 'Text' } }, 'details.description.value');

    expect(result).toBeUndefined();
  });

  it('should normalise keys, transaction types and snake case values', () => {
    expect(normaliseHistoryKey('Payment terms')).toBe('paymentterms');
    expect(normaliseHistoryTransactionType('  cancelled   cheque ')).toBe('CANCELLED CHEQUE');
    expect(toHistorySnakeCase('defendantAccount')).toBe('defendant_account');
    expect(toHistorySnakeCase('Defendant account')).toBe('defendant_account');
  });

  it('should return null when normalising empty keys and transaction types', () => {
    expect(normaliseHistoryKey(null)).toBeNull();
    expect(normaliseHistoryTransactionType(null)).toBeNull();
  });

  it('should format configured dates, ISO dates and invalid dates', () => {
    expect(formatHistoryDate(null, HISTORY_TEST_DATE_FORMAT)).toBeNull();
    expect(formatHistoryDate('2025-11-10', HISTORY_TEST_DATE_FORMAT)).toBe('10/11/2025');
    expect(formatHistoryDate('2025-11-10T13:30:00Z', HISTORY_TEST_DATE_FORMAT)).toBe('10/11/2025');
    expect(formatHistoryDate('not a date', HISTORY_TEST_DATE_FORMAT)).toBe('not a date');
  });

  it('should format money values for empty, numeric, prefixed, numeric text and unknown text values', () => {
    expect(formatHistoryMoney(null, '£', HISTORY_TEST_EMPTY_VALUES)).toBeNull();
    expect(formatHistoryMoney(15, '£', HISTORY_TEST_EMPTY_VALUES)).toBe('£15.00');
    expect(formatHistoryMoney('£15.00', '£', HISTORY_TEST_EMPTY_VALUES)).toBe('£15.00');
    expect(formatHistoryMoney('15', '£', HISTORY_TEST_EMPTY_VALUES)).toBe('£15.00');
    expect(formatHistoryMoney('unknown', '£', HISTORY_TEST_EMPTY_VALUES)).toBe('unknown');
  });
});
