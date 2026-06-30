import { describe, expect, it } from 'vitest';
import {
  getHistoryMappingDetailsText,
  getHistoryMappingDateTimestamp,
  getHistoryMappingFragmentPrefix,
  getHistoryMappingItemsEntry,
  getHistoryMappingNumber,
  getHistoryMappingRows,
  getHistoryMappingString,
  getHistoryMappingValue,
  parseHistoryDateTimestamp,
} from './history-mapping.utils';

const HISTORY_MAPPING_TEST_DATE_FORMAT = {
  input: 'yyyy-MM-dd',
  output: 'dd/MM/yyyy',
};
const HISTORY_MAPPING_TEST_DISPLAY_DATE_FORMAT = {
  input: 'dd/MM/yyyy',
  output: 'dd/MM/yyyy',
};
const HISTORY_MAPPING_TEST_ITEM = {
  amount: '-£25.00',
  details: {
    posted_by_name: 'Case worker',
    posted_date: '25/06/2026',
    empty: '',
    nested: {
      value: 'Nested value',
    },
  },
  numericUser: 12345,
  timestamp: 1234567890,
};
const HISTORY_MAPPING_TEST_KEYS = ['historyItems', 'history_items'];
const HISTORY_MAPPING_TEST_DETAILS_TEXT_OPTIONS = {
  detailsLineSeparator: ' ',
  fragmentEmptyPrefix: '',
  fragmentJoiner: '',
  fragmentSpacePrefix: ' ',
  hyphenPrefix: ' - ',
  partSeparator: ' | ',
};

describe('history mapping utils', () => {
  it('should find and filter the first supported history item collection', () => {
    expect(
      getHistoryMappingItemsEntry(
        { history_items: [HISTORY_MAPPING_TEST_ITEM, null, 'ignored'] },
        HISTORY_MAPPING_TEST_KEYS,
      ),
    ).toEqual({
      key: 'history_items',
      items: [HISTORY_MAPPING_TEST_ITEM],
    });
    expect(getHistoryMappingItemsEntry({ historyItems: 'not an array' }, HISTORY_MAPPING_TEST_KEYS)).toBeNull();
  });

  it('should map rows from the first supported history item collection', () => {
    expect(
      getHistoryMappingRows(
        { historyItems: [HISTORY_MAPPING_TEST_ITEM] },
        HISTORY_MAPPING_TEST_KEYS,
        (item, index) => ({
          index,
          user: getHistoryMappingString(item, ['details.posted_by_name']),
        }),
      ),
    ).toEqual([{ index: 0, user: 'Case worker' }]);
    expect(getHistoryMappingRows({ history: [] }, HISTORY_MAPPING_TEST_KEYS, (item) => item)).toEqual([]);
  });

  it('should read values from nested history item paths', () => {
    expect(getHistoryMappingValue(HISTORY_MAPPING_TEST_ITEM, 'details.nested.value')).toBe('Nested value');
    expect(getHistoryMappingValue(HISTORY_MAPPING_TEST_ITEM, 'details.missing.value')).toBeUndefined();
  });

  it('should get the first present string or number from history item paths', () => {
    expect(getHistoryMappingString(HISTORY_MAPPING_TEST_ITEM, ['details.empty', 'details.posted_by_name'])).toBe(
      'Case worker',
    );
    expect(getHistoryMappingString(HISTORY_MAPPING_TEST_ITEM, ['missing', 'numericUser'])).toBe('12345');
    expect(getHistoryMappingString(HISTORY_MAPPING_TEST_ITEM, ['missing', 'details.empty'])).toBeNull();
  });

  it('should get the first finite number from history item paths', () => {
    expect(
      getHistoryMappingNumber(HISTORY_MAPPING_TEST_ITEM, ['missing', 'amount'], {
        fieldPathSeparator: null,
        numberSanitisePattern: /[£,]/g,
      }),
    ).toBe(-25);
    expect(getHistoryMappingNumber(HISTORY_MAPPING_TEST_ITEM, ['timestamp'])).toBe(1234567890);
    expect(getHistoryMappingNumber({ amount: 'unknown' }, ['amount'])).toBeNull();
    expect(
      getHistoryMappingNumber(
        { amount: '£', whitespaceAmount: '   ', fallbackAmount: '12.50' },
        ['amount', 'whitespaceAmount', 'fallbackAmount'],
        {
          fieldPathSeparator: null,
          numberSanitisePattern: /[£,]/g,
        },
      ),
    ).toBe(12.5);
  });

  it('should parse configured dates, ISO dates and numeric timestamps for history sorting', () => {
    expect(parseHistoryDateTimestamp(null, HISTORY_MAPPING_TEST_DATE_FORMAT)).toBeNull();
    expect(parseHistoryDateTimestamp(1234567890, HISTORY_MAPPING_TEST_DATE_FORMAT)).toBe(1234567890);
    expect(parseHistoryDateTimestamp('2025-11-10', HISTORY_MAPPING_TEST_DATE_FORMAT)).toBe(
      Date.parse('2025-11-10T00:00:00Z'),
    );
    expect(parseHistoryDateTimestamp('10/11/2025', HISTORY_MAPPING_TEST_DISPLAY_DATE_FORMAT)).toBe(
      Date.parse('2025-11-10T00:00:00Z'),
    );
    expect(parseHistoryDateTimestamp('2025-11-10', HISTORY_MAPPING_TEST_DISPLAY_DATE_FORMAT)).toBe(
      Date.parse('2025-11-10T00:00:00Z'),
    );
    expect(parseHistoryDateTimestamp('2025-11-10T13:30:00Z', HISTORY_MAPPING_TEST_DATE_FORMAT)).toBe(
      Date.parse('2025-11-10T13:30:00Z'),
    );
    expect(parseHistoryDateTimestamp('not a date', HISTORY_MAPPING_TEST_DATE_FORMAT)).toBeNull();
  });

  it('should get the first parseable timestamp from history item paths', () => {
    expect(
      getHistoryMappingDateTimestamp(
        HISTORY_MAPPING_TEST_ITEM,
        ['details.empty', 'details.posted_date'],
        HISTORY_MAPPING_TEST_DISPLAY_DATE_FORMAT,
      ),
    ).toBe(Date.parse('2026-06-25T00:00:00Z'));
    expect(
      getHistoryMappingDateTimestamp(HISTORY_MAPPING_TEST_ITEM, ['missing'], HISTORY_MAPPING_TEST_DATE_FORMAT),
    ).toBeNull();
  });

  it('should get fragment prefixes from display options', () => {
    expect(getHistoryMappingFragmentPrefix({ hyphen: true }, 0, HISTORY_MAPPING_TEST_DETAILS_TEXT_OPTIONS)).toBe(' - ');
    expect(getHistoryMappingFragmentPrefix({ hyphen: false }, 1, HISTORY_MAPPING_TEST_DETAILS_TEXT_OPTIONS)).toBe(' ');
    expect(getHistoryMappingFragmentPrefix({ hyphen: false }, 0, HISTORY_MAPPING_TEST_DETAILS_TEXT_OPTIONS)).toBe('');
    expect(
      getHistoryMappingFragmentPrefix({ hyphen: false }, 0, {
        fragmentEmptyPrefix: null,
        fragmentSpacePrefix: ' ',
        hyphenPrefix: ' - ',
      }),
    ).toBe('');
  });

  it('should convert transformed history details to sortable text', () => {
    expect(
      getHistoryMappingDetailsText(
        {
          line1: [
            {
              fragments: [
                { text: 'Payment reversed', bold: false, hyphen: false },
                { text: 'Account 123', bold: true, hyphen: true },
              ],
            },
            {
              fragments: [{ text: 'Reason added', bold: false, hyphen: false }],
            },
          ],
          line2: [{ fragments: [{ text: 'Second line', bold: false, hyphen: false }] }],
        },
        HISTORY_MAPPING_TEST_DETAILS_TEXT_OPTIONS,
      ),
    ).toBe('Payment reversed - Account 123 | Reason added Second line');
  });

  it('should use fallback details text options when nullable values are not provided', () => {
    expect(
      getHistoryMappingDetailsText(
        {
          line1: [
            {
              fragments: [
                { text: 'Status', bold: false, hyphen: false },
                { text: 'updated', bold: false, hyphen: false },
              ],
            },
          ],
          line2: null,
        },
        {
          detailsLineSeparator: ' ',
          fragmentEmptyPrefix: null,
          fragmentJoiner: null,
          fragmentSpacePrefix: ' ',
          hyphenPrefix: ' - ',
          partSeparator: ' | ',
        },
      ),
    ).toBe('Status updated');
  });
});
