# Abstract Nested Form Base Component

This Angular component extends the `AbstractFormBaseComponent` and is designed for **nested sub-form components** that contribute their own controls and field-error messages into a parent form. It provides helpers for installing/removing nested controls, managing conditional validation, and spreading error definitions into the parent’s error maps.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Responsibilities](#responsibilities)
- [Methods](#methods)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

To use the `AbstractNestedFormBaseComponent`, extend it in a nested sub-form component (e.g. Individuals, Companies, Creditors):

```typescript
import { AbstractNestedFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-nested-form-base/abstract-nested-form-base.component';
```

## Usage

This component is intended to be extended by **child sub-forms** that plug into a parent form component. It ensures consistent handling of control installation, conditional validation, and error-message registration.

### Example Usage

```ts
@Component({
  selector: 'app-child-sub-form',
  templateUrl: './child-sub-form.component.html',
})
export class ChildSubFormComponent extends AbstractNestedFormBaseComponent implements OnInit, OnDestroy {
  @Input({ required: true }) override form!: FormGroup;

  public override ngOnInit(): void {
    this.setupChildForm();
    super.ngOnInit();
  }

  private setupChildForm(): void {
    const controlsGroup = this.buildChildControls();
    this.addControlsToNestedFormGroup(controlsGroup);
    this.setupConditionalValidation();
    this.rePopulateForm(/* values from store */);
    this.handleConditionalValidation();
  }
}
```

## Responsibilities

- Install (and later remove) sub-form controls into an existing parent FormGroup.
- Provide ergonomic helpers for common validation flows:
  - Toggle `required` validators.
  - Reset and revalidate controls/groups.
  - Subscribe to conditional validation with automatic teardown.
- Ensure proper cleanup on destroy (removes its own controls).

## Methods

| Method                              | Parameters                                                                             | Description                                                                                               |
| ----------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `addControlsToNestedFormGroup`      | `source: FormGroup, target?: FormGroup`                                                | Installs detached controls into target form (defaults to `this.form`).                                    |
| `removeControlsFromNestedFormGroup` | `source: FormGroup, target?: FormGroup`                                                | Removes controls from target whose names are in `source`.                                                 |
| `setValidatorPresence`              | `control: AbstractControl, validators: ValidatorFn \| ValidatorFn[], present: boolean` | Adds or removes one or more validators and updates validity.                                              |
| `hasValue`                          | `v: unknown`                                                                           | Utility to check if a value is considered present (non-null; non-empty string; all non-strings are true). |
| `resetAndValidateControls`          | `controls: (AbstractControl \| null)[]`                                                | Resets given controls, clears errors, reapplies validators.                                               |
| `resetAndValidateFormGroup`         | `group: FormGroup`                                                                     | Resets entire group, marks pristine/untouched, updates validity.                                          |
| `subscribeValidation`               | `handler: () => void, ...controls`                                                     | Subscribes a handler to `valueChanges` of controls with auto-unsubscribe.                                 |

## Error Handling

- Each sub-form is responsible only for its own validators and error state.
- The parent remains the single source of truth for fieldErrors and merges child error templates as needed.
- The abstract ensures cleanup by removing its own controls on destroy.

## Testing

Unit tests should verify:

- Controls are installed and removed correctly.
- Conditional validators are toggled and errors appear/disappear as expected.
- Lifecycle (`ngOnInit`, `ngOnDestroy`) ensures no leaks.

## Contributing

Contributions should maintain consistency with the base form component and Angular best practices. Add unit tests for any new helpers or changes to validation/error-handling logic.
