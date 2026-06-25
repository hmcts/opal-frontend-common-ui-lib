# History Transformation Service

Shared helpers for converting raw history API items into the structured details model consumed by OPAL history-and-notes UIs.

## Entry Points

- `HistoryTransformationService.transformDetails(item, config)` transforms one raw item into `IHistoryDetails`.
- `HistoryTransformationService.transformItems(items, config)` transforms an array of raw items while preserving each item and replacing its `details` value.
- `transformHistoryDetails(item, config)` and `transformHistoryItems(items, config)` provide the same behaviour for non-Angular utility usage.

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
