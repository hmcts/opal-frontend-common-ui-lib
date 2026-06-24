import { DateService } from '../../date-service/date.service';
import { IHistoryDetails } from '../interfaces/history-details.interface';
import { IHistoryDetailsDateFormat } from '../interfaces/history-details-date-format.interface';
import { IHistoryDetailsFragment } from '../interfaces/history-details-fragment.interface';
import { IHistoryDetailsLink } from '../interfaces/history-details-link.interface';
import { IHistoryDetailsPart } from '../interfaces/history-details-part.interface';
import { IHistoryTransformationConfig } from '../interfaces/history-transformation-service-config.interface';
import { IHistoryFragmentOptions } from '../interfaces/history-fragment-options.interface';
import { THistoryDetailsRawItem } from '../types/history-details-raw-item.type';
import { HISTORY_DETAILS_DEFAULT_EMPTY_VALUES } from '../constants/history-details-default-empty-values.constant';
import { HISTORY_DETAILS_PATTERNS } from '../constants/history-details-patterns.constant';

const HISTORY_DETAILS_DATE_SERVICE = new DateService();

/**
 * Transforms a raw history item into the configured structured details model.
 *
 * @param item - The raw history item.
 * @param config - The domain-specific transformation configuration.
 * @returns The transformed details model.
 */
export function transformHistoryDetails(
  item: THistoryDetailsRawItem,
  config: IHistoryTransformationConfig,
): IHistoryDetails {
  const itemType = normaliseHistoryKey(
    getHistoryString(item, config.historyItemTypeAliases, config.aliasPathPrefixes, config.emptyValues),
  );
  const transformer = itemType ? config.transformers[itemType] : null;

  return transformer ? transformer(item) : transformHistoryFallbackDetails(item, config);
}

/**
 * Transforms raw history items while preserving the rest of each item.
 *
 * @param items - The raw history items.
 * @param config - The domain-specific transformation configuration.
 * @returns The items with transformed structured details.
 */
export function transformHistoryItems<T extends THistoryDetailsRawItem>(
  items: T[],
  config: IHistoryTransformationConfig,
): Array<Omit<T, 'details'> & { details: IHistoryDetails }> {
  return items.map((item) => ({
    ...item,
    details: transformHistoryDetails(item, config),
  }));
}

/**
 * Builds fallback details from configured fallback fields when no transformer matches.
 *
 * @param item - The raw history item.
 * @param config - The domain-specific transformation configuration.
 * @returns The fallback structured details model.
 */
export function transformHistoryFallbackDetails(
  item: THistoryDetailsRawItem,
  config: IHistoryTransformationConfig,
): IHistoryDetails {
  return createHistoryDetails([
    createHistoryTextPart(
      getHistoryString(item, config.fallbackAliases, config.aliasPathPrefixes, config.emptyValues) ??
        getHistoryString(item, config.historyItemTypeAliases, config.aliasPathPrefixes, config.emptyValues),
    ),
  ]);
}

/**
 * Creates a details object and normalises an empty secondary line to null.
 *
 * @param line1Parts - The primary line parts.
 * @param line2Parts - The secondary line parts.
 * @returns The structured details object.
 */
export function createHistoryDetails(
  line1Parts: Array<IHistoryDetailsPart | null>,
  line2Parts: Array<IHistoryDetailsPart | null> = [],
): IHistoryDetails {
  const line1 = line1Parts.filter(isPresentPart);
  const line2 = line2Parts.filter(isPresentPart);

  return {
    line1,
    line2: line2.length ? line2 : null,
  };
}

/**
 * Creates a details part after removing empty fragments.
 *
 * @param fragments - The fragments for the part.
 * @returns The details part or null when no fragments are visible.
 */
export function createHistoryDetailsPart(fragments: IHistoryDetailsFragment[]): IHistoryDetailsPart | null {
  const visibleFragments = fragments.filter(({ text }) => text.length > 0);
  return visibleFragments.length ? { fragments: visibleFragments } : null;
}

/**
 * Creates a text-only details part.
 *
 * @param text - The part text.
 * @returns The details part or null when text is empty.
 */
export function createHistoryTextPart(text: string | null): IHistoryDetailsPart | null {
  return text ? createHistoryDetailsPart([createHistoryFragment(text)]) : null;
}

/**
 * Creates a details part containing a bold label and plain value.
 *
 * @param label - The label text.
 * @param value - The value text.
 * @returns The labelled details part or null when value is empty.
 */
export function createHistoryLabelValuePart(label: string, value: string | null): IHistoryDetailsPart | null {
  return value
    ? createHistoryDetailsPart([createHistoryFragment(label, { bold: true }), createHistoryFragment(value)])
    : null;
}

/**
 * Creates a text fragment with default styling flags.
 *
 * @param text - The fragment text.
 * @param options - Optional fragment styling and link metadata.
 * @returns The details fragment.
 */
export function createHistoryFragment(text: string, options: IHistoryFragmentOptions = {}): IHistoryDetailsFragment {
  return {
    text,
    bold: options.bold ?? false,
    hyphen: options.hyphen ?? false,
    ...(options.link ? { link: options.link } : {}),
  };
}

/**
 * Creates link metadata for a details fragment.
 *
 * @param type - The link type emitted by the UI.
 * @param emit - The emitted linked entity identifier.
 * @returns The fragment link metadata.
 */
export function createHistoryLink(type: string, emit: string): IHistoryDetailsLink {
  return { type, emit };
}

/**
 * Reads the first non-empty scalar value from candidate aliases as a string.
 *
 * @param item - The raw history item.
 * @param aliases - The candidate field aliases.
 * @param aliasPathPrefixes - The prefixes used for unqualified aliases.
 * @param emptyValues - Values that should be treated as empty.
 * @returns The string value or null.
 */
export function getHistoryString(
  item: THistoryDetailsRawItem,
  aliases: string[],
  aliasPathPrefixes: string[],
  emptyValues: readonly unknown[] = HISTORY_DETAILS_DEFAULT_EMPTY_VALUES,
): string | null {
  const value = getHistoryValue(item, aliases, aliasPathPrefixes, emptyValues);

  if (isHistoryEmptyValue(value, emptyValues) || isHistoryRecord(value)) {
    return null;
  }

  return String(value);
}

/**
 * Reads the first non-empty value from candidate aliases.
 *
 * @param item - The raw history item.
 * @param aliases - The candidate field aliases.
 * @param aliasPathPrefixes - The prefixes used for unqualified aliases.
 * @param emptyValues - Values that should be treated as empty.
 * @returns The matched value or null.
 */
export function getHistoryValue(
  item: THistoryDetailsRawItem,
  aliases: string[],
  aliasPathPrefixes: string[],
  emptyValues: readonly unknown[] = HISTORY_DETAILS_DEFAULT_EMPTY_VALUES,
): unknown {
  for (const alias of aliases) {
    for (const path of getHistoryAliasPaths(alias, aliasPathPrefixes)) {
      const value = getHistoryValueByPath(item, path);
      if (!isHistoryEmptyValue(value, emptyValues)) {
        return value;
      }
    }
  }

  return null;
}

/**
 * Expands an alias into candidate dot-notated paths.
 *
 * @param alias - The field alias.
 * @param aliasPathPrefixes - The prefixes used for unqualified aliases.
 * @returns The candidate paths.
 */
export function getHistoryAliasPaths(alias: string, aliasPathPrefixes: string[]): string[] {
  return alias.includes('.') ? [alias] : aliasPathPrefixes.map((prefix) => `${prefix}${alias}`);
}

/**
 * Reads a value from an history item using a dot-notated path.
 *
 * @param item - The raw history item.
 * @param path - The dot-notated path.
 * @returns The matched value or undefined.
 */
export function getHistoryValueByPath(item: THistoryDetailsRawItem, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (!isHistoryRecord(value)) {
      return undefined;
    }

    return value[key];
  }, item);
}

/**
 * Checks whether a value is a non-null record.
 *
 * @param value - The value to check.
 * @returns True when the value is a record.
 */
export function isHistoryRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Checks whether a value should be treated as empty.
 *
 * @param value - The value to check.
 * @param emptyValues - Values that should be treated as empty.
 * @returns True when the value is empty.
 */
export function isHistoryEmptyValue(
  value: unknown,
  emptyValues: readonly unknown[] = HISTORY_DETAILS_DEFAULT_EMPTY_VALUES,
): boolean {
  return emptyValues.includes(value);
}

/**
 * Checks whether a string value is present.
 *
 * @param value - The value to check.
 * @returns True when the value is a non-empty string.
 */
export function isHistoryPresentString(value: string | null): value is string {
  return !!value;
}

/**
 * Normalises a history item type key for transformer lookup.
 *
 * @param value - The raw key.
 * @returns The normalised key or null.
 */
export function normaliseHistoryKey(value: string | null): string | null {
  return value ? value.replace(HISTORY_DETAILS_PATTERNS.keyNormalise, '').toLowerCase() : null;
}

/**
 * Normalises a transaction type code for switch matching.
 *
 * @param value - The raw transaction type.
 * @returns The normalised transaction type or null.
 */
export function normaliseHistoryTransactionType(value: string | null): string | null {
  return value ? value.trim().toUpperCase().replace(HISTORY_DETAILS_PATTERNS.transactionTypeSpace, ' ') : null;
}

/**
 * Converts a camel, space, or hyphen value to snake case.
 *
 * @param value - The raw value.
 * @returns The snake case value.
 */
export function toHistorySnakeCase(value: string): string {
  return value
    .replace(HISTORY_DETAILS_PATTERNS.snakeCaseBoundary, '$1_$2')
    .replace(HISTORY_DETAILS_PATTERNS.snakeCaseSeparator, '_')
    .toLowerCase();
}

/**
 * Formats configured date strings to the configured output format.
 *
 * @param value - The raw date value.
 * @param dateFormat - The input and output date formats.
 * @returns The formatted date or original value when parsing fails.
 */
export function formatHistoryDate(value: string | null, dateFormat: IHistoryDetailsDateFormat): string | null {
  if (!value) {
    return null;
  }

  const parsedFormattedDate = HISTORY_DETAILS_DATE_SERVICE.getFromFormat(value, dateFormat.input);

  if (HISTORY_DETAILS_DATE_SERVICE.isValidDate(parsedFormattedDate)) {
    return HISTORY_DETAILS_DATE_SERVICE.getFromFormatToFormat(value, dateFormat.input, dateFormat.output);
  }

  const isoDate = HISTORY_DETAILS_DATE_SERVICE.getFromIso(value);

  return HISTORY_DETAILS_DATE_SERVICE.isValidDate(isoDate)
    ? HISTORY_DETAILS_DATE_SERVICE.toFormat(isoDate, dateFormat.output)
    : value;
}

/**
 * Formats numeric values as currency while preserving preformatted text.
 *
 * @param value - The raw money value.
 * @param currencyPrefix - The currency prefix to prepend to numeric values.
 * @param emptyValues - Values that should be treated as empty.
 * @returns The formatted money text or null.
 */
export function formatHistoryMoney(
  value: unknown,
  currencyPrefix: string,
  emptyValues: readonly unknown[] = HISTORY_DETAILS_DEFAULT_EMPTY_VALUES,
): string | null {
  if (isHistoryEmptyValue(value, emptyValues)) {
    return null;
  }

  if (typeof value === 'number') {
    return `${currencyPrefix}${value.toFixed(2)}`;
  }

  const text = String(value);
  if (text.startsWith(currencyPrefix)) {
    return text;
  }

  const numericValue = Number(text);
  return Number.isFinite(numericValue) ? `${currencyPrefix}${numericValue.toFixed(2)}` : text;
}

/**
 * Checks whether a details part should be kept in the rendered output.
 *
 * @param value - The details part to check.
 * @returns True when the part is present.
 */
function isPresentPart(value: IHistoryDetailsPart | null): value is IHistoryDetailsPart {
  return !!value;
}
