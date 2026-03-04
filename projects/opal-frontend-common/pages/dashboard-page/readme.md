# Dashboard Page Component

`DashboardPage` is a config-driven page component for rendering Opal dashboard content (title, highlights, and grouped links).

## Installation

```typescript
import { DashboardPage } from '@hmcts/opal-frontend-common/pages/dashboard-page';
import { IDashboardPageConfiguration } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
```

## Usage

```typescript
import { Component } from '@angular/core';
import { DashboardPage } from '@hmcts/opal-frontend-common/pages/dashboard-page';
import { IDashboardPageConfiguration } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';

@Component({
  selector: 'app-reports-dashboard-container',
  standalone: true,
  imports: [DashboardPage],
  template: `<opal-lib-dashboard-page [dashboardConfig]="dashboardConfig" />`,
})
export class ReportsDashboardContainerComponent {
  public dashboardConfig: IDashboardPageConfiguration = {
    title: 'Dashboard',
    highlights: [
      {
        id: 'reports-highlight-yours',
        text: 'View all your reports',
        routerLink: ['/reports', '0', 'summary-list'],
        fragment: null,
        permissionId: 101,
        newTab: false,
        style: 'guidance-panel-blue',
      },
    ],
    groups: [
      {
        title: 'Operational reports',
        links: [
          {
            id: 'reports-link-enforcement',
            text: 'Operational reports (by enforcement)',
            routerLink: ['/reports', '1', 'summary-list'],
            fragment: null,
            permissionId: 102,
            newTab: false,
            style: '',
          },
        ],
      },
    ],
  };
}
```

## Input

| Input | Type | Required | Description |
| --- | --- | --- | --- |
| `dashboardConfig` | `IDashboardPageConfiguration` | Yes | Configuration object defining title, highlights, and grouped links. |

## Configuration Shape

Each highlight/link supports:

- `id`: HTML id for the rendered anchor/inset container.
- `text`: Link text.
- `routerLink`: Angular router link commands.
- `fragment`: Optional URL fragment.
- `permissionId`: Numeric permission id used for visibility filtering.
- `newTab`: Opens link in a new tab when `true`.
- `style`: Optional class string for styled highlights.

## Behaviour

- Highlights and grouped links are filtered by user permissions.
- Permission ids are read using `PermissionsService` and `GlobalStore`.
- If a highlight has a non-empty `style`, it is wrapped in `opal-lib-moj-inset-text`.
- Links with `newTab: true` render with `_blank` target and `noopener noreferrer`.

## Notes For Consuming Apps

- The consuming app should resolve `:dashboardType` route params to a local config object.
- This component only renders the provided config and does not resolve dashboard type itself.

## Testing

Unit tests are in `dashboard-page.component.spec.ts`.
