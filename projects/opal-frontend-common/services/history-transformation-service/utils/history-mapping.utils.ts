import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IHistoryDetails } from '../interfaces/history-details.interface';
import { IHistoryDetailsDateFormat } from '../interfaces/history-details-date-format.interface';
import { IHistoryDetailsFragment } from '../interfaces/history-details-fragment.interface';
import { IHistoryDetailsPart } from '../interfaces/history-details-part.interface';
import { IHistoryMappingDetailsTextOptions } from '../interfaces/history-mapping-details-text-options.interface';
import { IHistoryMappingFragmentPrefixOptions } from '../interfaces/history-mapping-fragment-prefix-options.interface';
import { IHistoryMappingItemsEntry } from '../interfaces/history-mapping-items-entry.interface';
import { IHistoryMappingNumberOptions } from '../interfaces/history-mapping-number-options.interface';
import { THistoryDetailsRawItem } from '../types/history-details-raw-item.type';

const HISTORY_MAPPING_DATE_SERVICE = new DateService();
const HISTORY_MAPPING_DEFAULT_FIELD_PATH_SEPARATOR = '.';

/**
 * Checks whether a value can be mapped as a raw history item.
 *
 * @param value - The value to check.
 * @returns True when the value is an object record.
 */
export function isHistoryMappingItem(value: unknown): value is THistoryDetailsRawItem {
  return typeof value === 'object' && value !== null;
}

/**
 * Finds the first supported history item collection and filters it to mappable object items.
 *
 * @param source - The source object containing a history item collection.
 * @param keys - Candidate history item collection keys in priority order.
 * @returns The matched collection entry, or null when no array is present.
 */
export function getHistoryMappingItemsEntry(
  source: Record<string, unknown>,
  keys: readonly string[],
): IHistoryMappingItemsEntry | null {
  for (const key of keys) {
    const historyItems = source[key];

    if (Array.isArray(historyItems)) {
      return {
        key,
        items: historyItems.filter(isHistoryMappingItem),
      };
    }
  }

  return null;
}

/**
 * Maps the first supported history item collection into consumer-owned row objects.
 *
 * @param source - The source object containing a history item collection.
 * @param keys - Candidate history item collection keys in priority order.
 * @param mapItemToRow - Row mapper owned by the consuming flow.
 * @returns Mapped rows.
 */
export function getHistoryMappingRows<TRow>(
  source: Record<string, unknown>,
  keys: readonly string[],
  mapItemToRow: (item: THistoryDetailsRawItem, index: number) => TRow,
): TRow[] {
  return (getHistoryMappingItemsEntry(source, keys)?.items ?? []).map((item, index) => mapItemToRow(item, index));
}

/**
 * Gets a value from a history item using a field path.
 *
 * @param source - The source history item.
 * @param path - The field path.
 * @param fieldPathSeparator - The path segment separator.
 * @returns The matched field value.
 */
export function getHistoryMappingValue(
  source: THistoryDetailsRawItem,
  path: string,
  fieldPathSeparator: string = HISTORY_MAPPING_DEFAULT_FIELD_PATH_SEPARATOR,
): unknown {
  return path.split(fieldPathSeparator).reduce<unknown>((current, key) => {
    if (typeof current !== 'object' || current === null) {
      return undefined;
    }

    return (current as Record<string, unknown>)[key];
  }, source);
}

/**
 * Gets the first present string or number from the supplied history item paths.
 *
 * @param item - The source history item.
 * @param paths - The field paths to inspect.
 * @param fieldPathSeparator - The path segment separator.
 * @returns The first present string value.
 */
export function getHistoryMappingString(
  item: THistoryDetailsRawItem,
  paths: readonly string[],
  fieldPathSeparator: string = HISTORY_MAPPING_DEFAULT_FIELD_PATH_SEPARATOR,
): string | null {
  for (const path of paths) {
    const value = getHistoryMappingValue(item, path, fieldPathSeparator);

    if (typeof value === 'string' && value.trim()) {
      return value;
    }

    if (typeof value === 'number') {
      return String(value);
    }
  }

  return null;
}

/**
 * Gets the first finite number from the supplied history item paths.
 *
 * @param item - The source history item.
 * @param paths - The field paths to inspect.
 * @param options - Number mapping options.
 * @returns The first finite number value.
 */
export function getHistoryMappingNumber(
  item: THistoryDetailsRawItem,
  paths: readonly string[],
  options: IHistoryMappingNumberOptions = {},
): number | null {
  const fieldPathSeparator = options.fieldPathSeparator ?? HISTORY_MAPPING_DEFAULT_FIELD_PATH_SEPARATOR;

  for (const path of paths) {
    const value = getHistoryMappingValue(item, path, fieldPathSeparator);

    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const parsed = Number(options.numberSanitisePattern ? value.replace(options.numberSanitisePattern, '') : value);

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return null;
}

/**
 * Parses supported history date values to sortable UTC timestamps.
 *
 * @param value - The raw date value.
 * @param dateFormat - The configured input date format.
 * @returns The UTC timestamp in milliseconds, or null when parsing fails.
 */
export function parseHistoryDateTimestamp(value: unknown, dateFormat: IHistoryDetailsDateFormat): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  const trimmedValue = value.trim();
  const parsedFormattedDate = HISTORY_MAPPING_DATE_SERVICE.getFromFormat(trimmedValue, dateFormat.input);

  if (HISTORY_MAPPING_DATE_SERVICE.isValidDate(parsedFormattedDate)) {
    return Date.UTC(parsedFormattedDate.year, parsedFormattedDate.month - 1, parsedFormattedDate.day);
  }

  const isoDate = HISTORY_MAPPING_DATE_SERVICE.getFromIso(trimmedValue);

  if (!HISTORY_MAPPING_DATE_SERVICE.isValidDate(isoDate)) {
    return null;
  }

  return trimmedValue.length === 10 ? Date.UTC(isoDate.year, isoDate.month - 1, isoDate.day) : isoDate.toMillis();
}

/**
 * Gets the first parseable date timestamp from the supplied history item paths.
 *
 * @param item - The source history item.
 * @param paths - The field paths to inspect.
 * @param dateFormat - The configured input date format.
 * @param fieldPathSeparator - The path segment separator.
 * @returns The first parseable UTC timestamp in milliseconds.
 */
export function getHistoryMappingDateTimestamp(
  item: THistoryDetailsRawItem,
  paths: readonly string[],
  dateFormat: IHistoryDetailsDateFormat,
  fieldPathSeparator: string = HISTORY_MAPPING_DEFAULT_FIELD_PATH_SEPARATOR,
): number | null {
  for (const path of paths) {
    const timestamp = parseHistoryDateTimestamp(getHistoryMappingValue(item, path, fieldPathSeparator), dateFormat);

    if (timestamp !== null) {
      return timestamp;
    }
  }

  return null;
}

/**
 * Gets the rendered prefix for a history details fragment.
 *
 * @param fragment - The details fragment.
 * @param index - The fragment index in its part.
 * @param options - Prefix display options.
 * @returns The rendered prefix.
 */
export function getHistoryMappingFragmentPrefix(
  fragment: Pick<IHistoryDetailsFragment, 'hyphen'>,
  index: number,
  options: IHistoryMappingFragmentPrefixOptions,
): string {
  if (fragment.hyphen) {
    return options.hyphenPrefix;
  }

  return index > 0 ? options.fragmentSpacePrefix : (options.fragmentEmptyPrefix ?? '');
}

/**
 * Converts transformed history details into plain text for table sorting.
 *
 * @param details - The transformed details model.
 * @param options - Details text display options.
 * @returns Details text.
 */
export function getHistoryMappingDetailsText(
  details: IHistoryDetails,
  options: IHistoryMappingDetailsTextOptions,
): string {
  return [getHistoryMappingPartsText(details.line1, options), getHistoryMappingPartsText(details.line2 ?? [], options)]
    .filter(Boolean)
    .join(options.detailsLineSeparator);
}

/**
 * Converts transformed history details parts into plain text for table sorting.
 *
 * @param parts - The transformed details parts.
 * @param options - Details text display options.
 * @returns Details parts text.
 */
export function getHistoryMappingPartsText(
  parts: IHistoryDetailsPart[],
  options: IHistoryMappingDetailsTextOptions,
): string {
  return parts
    .map((part) =>
      part.fragments
        .map((fragment, index) => `${getHistoryMappingFragmentPrefix(fragment, index, options)}${fragment.text}`)
        .join(options.fragmentJoiner ?? '')
        .trim(),
    )
    .filter(Boolean)
    .join(options.partSeparator);
}
