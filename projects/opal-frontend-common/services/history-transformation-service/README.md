# History Transformation Service

Shared helpers for converting raw history API items into the structured details model consumed by OPAL history-and-notes UIs.

## Entry Points

- `HistoryTransformationService.transformDetails(item, config)` transforms one raw item into `IHistoryDetails`.
- `HistoryTransformationService.transformItems(items, config)` transforms an array of raw items while preserving each item and replacing its `details` value.
- `transformHistoryDetails(item, config)` and `transformHistoryItems(items, config)` provide the same behaviour for non-Angular utility usage.

## Mapping Helpers

The package also exports utility functions for mapping raw history responses into consumer-owned table rows.

- `getHistoryMappingItemsEntry(source, keys)` finds the first configured response key that contains an array and filters it to object items.
- `getHistoryMappingRows(source, keys, mapItemToRow)` maps the first supported item collection, or returns an empty array when none of the configured keys are present.
- `getHistoryMappingValue(item, path, fieldPathSeparator)` reads nested values using dot-separated paths by default.
- `getHistoryMappingString(item, paths)` returns the first non-empty string or numeric value from candidate paths.
- `getHistoryMappingNumber(item, paths, options)` returns the first finite numeric value and can sanitise formatted strings such as currency values.
- `getHistoryMappingDateTimestamp(item, paths, dateFormat)` returns the first parseable timestamp for sorting. It supports numeric timestamps, configured date strings, ISO dates, and ISO date-times.
- `getHistoryMappingDetailsText(details, options)` flattens transformed `IHistoryDetails` into sortable text, applying fragment prefixes, line separators, part separators and optional fragment joiners.

Example:

```ts
const rows = getHistoryMappingRows(response, ['historyItems', 'history_items'], (item, index) => {
  const details = transformHistoryDetails(item, config);

  return {
    index,
    postedBy: getHistoryMappingString(item, ['details.posted_by_name', 'postedByName']),
    postedDateTimestamp: getHistoryMappingDateTimestamp(item, ['details.posted_date', 'postedDate'], config.dateFormat),
    details,
    detailsText: getHistoryMappingDetailsText(details, {
      detailsLineSeparator: ' ',
      fragmentEmptyPrefix: null,
      fragmentJoiner: null,
      fragmentSpacePrefix: ' ',
      hyphenPrefix: ' - ',
      partSeparator: ' | ',
    }),
  };
});
```

## Configuration

Consumers provide `IHistoryTransformationConfig`:

- `aliasPathPrefixes` expands simple aliases across supported object paths.
- `dateFormat` controls date parsing and output formatting.
- `emptyValues` defines values treated as missing.
- `fallbackAliases` identifies the fields used when no item-specific transformer matches.
- `historyItemTypeAliases` identifies the field used to choose an item transformer.
- `transformers` maps normalised item types to domain-specific detail transformers.

## Output Model

The output is `IHistoryDetails`, split into `line1` and optional `line2` parts. Each part contains fragments with text, bold and hyphen flags, and optional link metadata.

## Constants

The package exports parser-pattern constants only. Consumers are expected to define their own alias prefixes, date formats, and empty-value handling in their domain config.
