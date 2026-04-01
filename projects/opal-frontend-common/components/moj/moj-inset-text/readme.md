# MOJ Inset Text Component

This component wraps content in GOV.UK inset text styling and supports content projection.

## Installation

```typescript
import { MojInsetTextComponent } from '@hmcts/opal-frontend-common/components/moj/moj-inset-text';
```

## Usage

```html
<opal-lib-moj-inset-text id="reports-highlight">
  <a class="govuk-link govuk-link--no-visited-state" [routerLink]="['/reports']">View all your reports</a>
</opal-lib-moj-inset-text>
```

## Inputs

| Input     | Type             | Required | Description                                                           |
| --------- | ---------------- | -------- | --------------------------------------------------------------------- |
| `id`      | `string`         | Yes      | Base id for the container. The rendered id becomes `{id}_inset_text`. |
| `classes` | `string \| null` | No       | Override panel class.                                                 |

## Outputs

None.

## Notes

- This component uses content projection (`<ng-content></ng-content>`) for inner content.
- The component reuses `opal-lib-govuk-inset-text` internally.

## Testing

Unit tests are in `moj-inset-text.component.spec.ts`.
