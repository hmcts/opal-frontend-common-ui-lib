# MOJ Header Component

This Angular component provides a Ministry of Justice (MOJ)-styled page header. It displays the GOV.UK logo, organisation and service names, and projected account navigation items.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Methods](#methods)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

```typescript
import { MojHeaderComponent } from '@components/moj/moj-header/moj-header.component';
```

## Usage

Pass the header URLs through `headerLinks`. The organisation name, service name, and navigation items are supplied through content projection. This example follows the usage in Fines:

```html
<opal-lib-moj-header [headerLinks]="headerLinks">
  <ng-container organisationName>HMCTS</ng-container>
  <ng-container serviceName>Opal</ng-container>
  <opal-lib-moj-header-navigation-item (actionClick)="handleAuthentication()">
    @if (!globalStore.authenticated()) {
      <ng-container linkText>Sign in</ng-container>
    } @else {
      <ng-container linkText>Sign out</ng-container>
    }
  </opal-lib-moj-header-navigation-item>
</opal-lib-moj-header>
```

`headerLinks` has the shape `{ govukLink, organisationLink, serviceLink }`. When `organisationLink` or `serviceLink` is empty, the corresponding name is rendered as non-link text. The navigation item emits `actionClick` when selected; its label is projected through `linkText`.

## Inputs

| Input        | Type              | Description                                                     |
| ------------ | ----------------- | --------------------------------------------------------------- |
| `headerLinks` | `IMojHeaderLinks` | URLs for the GOV.UK logo, organisation name, and service name.  |

## Outputs

The header component has no outputs. Each `opal-lib-moj-header-navigation-item` provides an `actionClick` output.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `moj-header.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This README describes the `moj-header` component API and projected content.
