# GOV.UK Tabs Component

This Angular component renders GOV.UK-styled tabs, allowing users to switch between different sections of content.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

Import the main component and its supporting subcomponents individually as required from their respective paths:

```typescript
import { GovukTabsComponent } from 'opal-frontend-common/components/govuk/govuk-tabs';
import { GovukTabListItemComponent } from 'opal-frontend-common/components/govuk/govuk-tabs/govuk-tab-list-item';
import { GovukTabPanelComponent } from 'opal-frontend-common/components/govuk/govuk-tabs/govuk-tab-panel';
```

## Usage

The component uses content projection, meaning you pass in your own tab list and tab panels.

### Example

```html
<opal-lib-govuk-tabs>
  <ng-container tab-list-items>
    <opal-lib-govuk-tab-list-item>
      <a id="tab-individuals" href="#panel-individuals" class="govuk-tabs__tab">Individuals</a>
    </opal-lib-govuk-tab-list-item>
    <opal-lib-govuk-tab-list-item>
      <a id="tab-companies" href="#panel-companies" class="govuk-tabs__tab">Companies</a>
    </opal-lib-govuk-tab-list-item>
  </ng-container>

  <ng-container tab-panels>
    <opal-lib-govuk-tab-panel id="panel-individuals">
      <h2 class="govuk-heading-m">Individuals</h2>
      <!-- panel content -->
    </opal-lib-govuk-tab-panel>
    <opal-lib-govuk-tab-panel id="panel-companies">
      <h2 class="govuk-heading-m">Companies</h2>
      <!-- panel content -->
    </opal-lib-govuk-tab-panel>
  </ng-container>
</opal-lib-govuk-tabs>
```

## Testing

Unit tests for this component can be found in the `govuk-tabs.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
