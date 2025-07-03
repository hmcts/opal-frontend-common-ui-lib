# GOV.UK Tab Panel Component

This Angular component renders a GOV.UK-styled tab panel, used in conjunction with `govuk-tabs` and `govuk-tab-list-item`. It wraps content in a `<div>` with the appropriate GOV.UK class.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

Each component in the `govuk-tabs` group is exported individually:

```typescript
import { GovukTabPanelComponent } from 'opal-frontend-common/components/govuk/govuk-tabs/govuk-tab-panel';
```

## Usage

Wrap your tab content in this component and provide a unique ID to link it with the corresponding tab.

### Example

```html
<opal-lib-govuk-tab-panel id="panel-individuals">
  <h2 class="govuk-heading-m">Individuals</h2>
  <p>This is content for the Individuals tab.</p>
</opal-lib-govuk-tab-panel>
```

This renders:

```html
<div class="govuk-tabs__panel" id="panel-individuals">
  <h2 class="govuk-heading-m">Individuals</h2>
  <p>This is content for the Individuals tab.</p>
</div>
```

## Testing

Unit tests for this component can be found in the `govuk-tab-panel.component.spec.ts` file. To run the tests:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
