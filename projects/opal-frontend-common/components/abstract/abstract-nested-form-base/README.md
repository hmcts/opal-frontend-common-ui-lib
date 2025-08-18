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

```typescript
@Component({
  selector: 'app-child-sub-form',
  templateUrl: './child-sub-form.component.html',
})
export class ChildSubFormComponent extends AbstractNestedFormBaseComponent implements OnInit, OnDestroy {
  @Input({ required: true }) override form!: FormGroup;

  private readonly childFieldErrors = CHILD_FORM_FIELD_ERRORS;

  public override ngOnInit(): void {
    // Register this sub-form’s field errors into the shared map
    this.registerNestedFormFieldErrors(this.childFieldErrors);
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
- Register/unregister this component’s error-message definitions into the active `fieldErrors` map (shared with parent).
- Ensure proper cleanup on destroy (removes its own errors and controls).

## Methods

### Public / Protected Methods

| Method                              | Parameters                                    | Description                                                                 |
| ----------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------- |
| `addControlsToNestedFormGroup`      | `source: FormGroup, target?: FormGroup`       | Installs detached controls into target form (defaults to `this.form`).      |
| `removeControlsFromNestedFormGroup` | `source: FormGroup, target?: FormGroup`       | Removes controls from target whose names are in `source`.                   |
| `setRequired`                       | `control: AbstractControl, required: boolean` | Adds or removes `Validators.required` and updates validity.                 |
| `resetAndValidateControls`          | `controls: (AbstractControl \| null)[]`       | Resets given controls, clears errors, reapplies validators.                 |
| `resetAndValidateFormGroup`         | `group: FormGroup`                            | Resets entire group, marks pristine/untouched, updates validity.            |
| `subscribeValidation`               | `handler: () => void, ...controls`            | Subscribes a handler to `valueChanges` of controls with auto-unsubscribe.   |
| `registerNestedFormFieldErrors`     | `child: IAbstractFormBaseFieldErrors`         | Merges this component’s error definitions into the active map.              |
| `unregisterNestedFormFieldErrors`   | None                                          | Removes only the error definitions previously registered by this component. |

## Error Handling

- **Shared Map Registration**: Each sub-form registers its error definitions into the parent’s `fieldErrors` map using `registerNestedFormFieldErrors`.
- **Scoped Unregister**: On destroy, only error types added by the sub-form are removed (safe even if called multiple times).
- **Consistent UI**: Ensures both the error summary and inline messages include sub-form controls when validation fails.

## Testing

Unit tests should verify:

- Controls are installed and removed correctly.
- Conditional validators are toggled and errors appear/disappear as expected.
- Field error messages are merged into the parent and removed on destroy.
- Lifecycle (`ngOnInit`, `ngOnDestroy`) ensures no leaks.

## Contributing

Contributions should maintain consistency with the base form component and Angular best practices. Add unit tests for any new helpers or changes to validation/error-handling logic.
