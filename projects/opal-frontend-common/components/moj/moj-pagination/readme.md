# MoJ Pagination Component

A dumb, reusable pagination component that follows the [Ministry of Justice Design System pagination pattern](https://design-patterns.service.justice.gov.uk/components/pagination/). It handles displaying paginated links with ellipses and results count, while delegating navigation logic to the consuming application.

This component is used in the Opal Frontend Common UI Library.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Migration](#migration)
- [Pagination Behaviour](#pagination-behaviour)
- [Accessibility](#accessibility)
- [Results Summary](#results-summary)
- [Styling](#styling)
- [Testing](#testing)
- [Alternatives](#alternatives)
- [Source](#source)
- [Related](#related)
- [Contributing](#contributing)

## Installation

- Always shows:
  - First and last pages
  - Current page
  - Previous and next pages (when applicable)
- Adds ellipsis (`…`) when large gaps in page ranges exist
- Outputs selected page via event
- Displays a results summary beneath the pagination controls (e.g. “Showing 11 to 20 of 200 total results”)
- Accessible and keyboard-navigable
- Built using Angular signals and `ChangeDetectionStrategy.OnPush`

## Import

```ts
import { MojPaginationComponent } from 'opal-frontend-common';
```

Declare in your module if needed, or import via the shared `OpalFrontendCommonComponentsModule`.

## Usage

You can use the pagination component in your template as follows:

```html
<opal-lib-moj-pagination
  [id]="'search-pagination'"
  [currentPage]="2"
  [limit]="10"
  [total]="47"
  (changePage)="handlePageChange($event)"
></opal-lib-moj-pagination>
```

## Inputs

| Name          | Type     | Required | Description                                                        |
| ------------- | -------- | -------- | ------------------------------------------------------------------ |
| `id`          | `string` | ✅       | `id` attribute for the `<nav>` element (for testing/accessibility) |
| `currentPage` | `number` | ✅       | The current page number (1-based)                                  |
| `limit`       | `number` | ✅       | Items per page                                                     |
| `total`       | `number` | ✅       | Total number of items                                              |

## Outputs

| Name         | Type                   | Description                                                      |
| ------------ | ---------------------- | ---------------------------------------------------------------- |
| `changePage` | `EventEmitter<number>` | Emits the selected page number when a pagination link is clicked |

## Methods

There are no custom methods for this component.

## Migration

MOJ Frontend v8 uses GOV.UK Pagination markup wrapped in a `.moj-pagination` container. This component now matches that
structure and moves the results count below the pagination controls.

Before (legacy MoJ markup):

```html
<nav class="moj-pagination moj-pagination-alignment">
  <ul class="moj-pagination__list">...</ul>
  <p class="moj-pagination__results">Showing 11 to 20 of 200 results</p>
</nav>
```

After (MOJ Frontend v8-compatible markup):

```html
<div class="moj-pagination">
  <nav class="govuk-pagination moj-pagination__pagination" aria-label="Pagination">...</nav>
  <p class="moj-pagination__results">Showing 11 to 20 of 200 total results</p>
</div>
```

Notes:

- If you were targeting `.moj-pagination__*` list classes, update selectors to GOV.UK pagination classes such as
  `.govuk-pagination__list` and `.govuk-pagination__item`.
- The results summary now renders whenever `total > 0`, even if there is only one page (pagination controls remain hidden).

## Pagination Behaviour

For large page sets, only a few key pages are shown:

- Always: First page, Last page
- Active page
- Previous/Next (if valid)
- Ellipsis (`…`) to indicate skipped ranges

Examples:

| Pages | Current | Output           |
| ----- | ------- | ---------------- |
| 5     | 2       | `1 2 3 4 5`      |
| 8     | 2       | `1 2 3 … 8`      |
| 8     | 4       | `1 … 3 4 5 … 8`  |
| 8     | 7       | `1 … 6 7 8`      |
| 10    | 5       | `1 … 4 5 6 … 10` |

- Ellipses are inserted **only when non-adjacent pages are skipped**.
- The last page always appears **after** the ellipsis — never before it.
- Ellipses never appear at the start or end of the pagination list.

## Accessibility

- Adds `aria-current="page"` to the active page
- Includes visually hidden "page" text in navigation links
- All navigation is keyboard-friendly

## Results Summary

When `total > 0`, the component displays:

> **"Showing _{start}_ to _{end}_ of _{total}_ total results"**

This is automatically calculated based on `currentPage`, `limit`, and `total`.

## Styling

This component uses GOV.UK pagination markup with a MoJ pagination wrapper.

Ensure your global styles include:

```scss
@import 'govuk-frontend/dist/govuk/all.scss';
@import '@ministryofjustice/frontend/moj/all.scss';
```

## Testing

The `id` input is available to help target the `<nav>` element during unit or e2e tests.

Unit tests for this component can be found in the `moj-pagination.component.spec.ts` file. To run the tests, use:

```bash
yarn test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

## Alternatives

For simpler pagination without ellipses or when using GOV.UK styling, use the [`govuk-pagination`](../govuk/govuk-pagination) component.

## Source

See implementation in:
`projects/opal-frontend-common/components/moj/moj-pagination/`

## Related

- [MoJ Design System - Pagination](https://design-patterns.service.justice.gov.uk/components/pagination/)
- [GOV.UK Design System - Pagination](https://design-system.service.gov.uk/components/pagination/)
