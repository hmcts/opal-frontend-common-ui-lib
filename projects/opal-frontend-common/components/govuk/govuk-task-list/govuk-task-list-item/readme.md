---

# GOV.UK Task List Item Component

This Angular component represents an individual item within a GOV.UK-styled task list, typically used to display a single task with a link and status.

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
import { GovukTaskListItemComponent } from '@components/govuk/govuk-task-list-item/govuk-task-list-item.component';
```

## Usage

You can use the task list item component in your template as follows:

```html
<opal-lib-govuk-task-list taskListId="exampleTaskList" taskListClasses="govuk-!-margin-left-0">
  <ng-container *ngTemplateOutlet="task1"></ng-container>
  <ng-container *ngTemplateOutlet="task2"></ng-container>
  <ng-container *ngTemplateOutlet="task3"></ng-container>
</opal-lib-govuk-task-list>
<opal-lib-govuk-table>
```

### Example in HTML:

```html
<li class="govuk-task-list__item">
  <a class="govuk-link" href="{{ link }}">{{ title }}</a>
  <strong class="govuk-tag govuk-task-list__tag">{{ status }}</strong>
</li>
```

## Inputs

| Input    | Type     | Description                                   |
| -------- | -------- | --------------------------------------------- |
| `title`  | `string` | The title of the task displayed in the list.  |
| `link`   | `string` | The URL or route to navigate to for the task. |
| `status` | `string` | The status of the task (e.g., 'Complete').    |

## Outputs

There are no custom outputs for this component.

## Methods

There are no custom methods for this component.

## Testing

Unit tests for this component can be found in the `govuk-task-list-item.component.spec.ts` file. To run the tests, use:

```bash
ng test
```

## Contributing

Feel free to submit issues or pull requests to improve this component.

---

This `README.md` explains how to use and configure the `govuk-task-list-item` component to display individual tasks in a GOV.UK-styled task list.
