---

# GOV.UK Table Component

This Angular component provides a GOV.UK-styled table with optional caption support and projected header and body content.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

```typescript
import { GovukTableBodyRowComponent, GovukTableBodyRowDataComponent, GovukTableComponent, GovukTableHeadingComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-table';
```

## Usage

Use the table component with projected header cells in the `head` slot and body rows in the `body` or `results` slots:

```html
<opal-lib-govuk-table
  caption="People"
  captionClasses="govuk-table__caption--m"
  tableClasses="govuk-!-margin-bottom-6"
>
  <th opal-lib-govuk-table-heading head>Name</th>
  <th opal-lib-govuk-table-heading head>Status</th>

  <tr opal-lib-govuk-table-body-row body>
    <td opal-lib-govuk-table-body-row-data id="personName">Arnab Subedi</td>
    <td opal-lib-govuk-table-body-row-data id="personStatus">Complete</td>
  </tr>

  <tr opal-lib-govuk-table-body-row results>
    <td opal-lib-govuk-table-body-row-data id="personNameTwo">Jane Doe</td>
    <td opal-lib-govuk-table-body-row-data id="personStatusTwo">In progress</td>
  </tr>
</opal-lib-govuk-table>
```

### Example in HTML

```html
<table class="govuk-table">
  <caption class="govuk-table__caption">People</caption>
  <thead class="govuk-table__head">
    <tr class="govuk-table__row">
      <th class="govuk-table__header" scope="col">Name</th>
      <th class="govuk-table__header" scope="col">Status</th>
    </tr>
  </thead>
  <tbody class="govuk-table__body">
    <tr class="govuk-table__row">
      <td class="govuk-table__cell" id="personName">Arnab Subedi</td>
      <td class="govuk-table__cell" id="personStatus">Complete</td>
    </tr>
  </tbody>
</table>
```

## Inputs

| Input | Type | Description |
| --- | --- | --- |
| `tableClasses` | `string` | Additional classes applied to the root table element. |
| `caption` | `string` | Optional table caption text. |
| `captionClasses` | `string` | Additional classes applied to the caption element. |

## Testing

Unit tests for this component can be found in the `govuk-table.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` explains how to use and configure the `govuk-table` component for GOV.UK-styled tables.
