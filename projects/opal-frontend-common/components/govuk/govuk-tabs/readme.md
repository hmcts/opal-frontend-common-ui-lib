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

To track and control which tab is selected, subscribe to the `(activeTabFragmentChange)` output and bind it to your component's internal state (e.g. `activeTab`).

Each tab item uses `[tabItemFragment]` and `[activeTabItemFragment]` to determine which tab is visually active. The
`tabItemFragment` should match the `id` on the corresponding tab panel.

### Example

```html
<opal-lib-govuk-tabs [tabId]="'searchTabs'" (activeTabFragmentChange)="activeTab = $event">
  <ng-container tab-list-items>
    <opal-lib-govuk-tab-list-item
      [tabItemFragment]="'individuals'"
      [activeTabItemFragment]="activeTab"
      [tabItemId]="'tab-individuals'"
    >
      Individuals
    </opal-lib-govuk-tab-list-item>
    <opal-lib-govuk-tab-list-item
      [tabItemFragment]="'companies'"
      [activeTabItemFragment]="activeTab"
      [tabItemId]="'tab-companies'"
    >
      Companies
    </opal-lib-govuk-tab-list-item>
  </ng-container>

  <ng-container tab-panels>
    <opal-lib-govuk-tab-panel id="individuals">
      <h2 class="govuk-heading-m">Individuals</h2>
    </opal-lib-govuk-tab-panel>
    <opal-lib-govuk-tab-panel id="companies">
      <h2 class="govuk-heading-m">Companies</h2>
    </opal-lib-govuk-tab-panel>
  </ng-container>
</opal-lib-govuk-tabs>
```

You can derive `activeTab` from Angular’s `ActivatedRoute.fragment`, or allow the component to emit the currently selected fragment via `(activeTabFragmentChange)` and store it in your component's state.

## Testing

Unit tests for this component can be found in the `govuk-tabs.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.
