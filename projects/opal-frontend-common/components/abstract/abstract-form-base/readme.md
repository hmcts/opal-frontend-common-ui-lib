# Abstract Form Base Component

This Angular component serves as a foundational base class for managing form controls, validation, and error handling in Angular applications. It provides comprehensive functionality for form management, error handling, validation, and routing.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Properties](#properties)
- [Outputs](#outputs)
- [Methods](#methods)
- [Interfaces](#interfaces)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

To use the `AbstractFormBaseComponent` in your project, extend it in your form components:

```typescript
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/abstract-form-base.component';
```

## Usage

This component is designed to be extended by form components to provide consistent form handling, validation, and error management.

### Example Usage:

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/abstract-form-base.component';

@Component({
  selector: 'app-my-form',
  templateUrl: './my-form.component.html',
})
export class MyFormComponent extends AbstractFormBaseComponent implements OnInit, OnDestroy {
  // Component logic
}
```

## Properties

The component provides several public properties for form management:

| Property                   | Type                                         | Description                                   |
| -------------------------- | -------------------------------------------- | --------------------------------------------- |
| `form`                     | `FormGroup`                                  | The main form group instance                  |
| `formControlErrorMessages` | `IAbstractFormControlErrorMessage`           | Object containing error messages for controls |
| `formErrorSummaryMessage`  | `IAbstractFormBaseFormErrorSummaryMessage[]` | Array of error summary messages               |
| `formErrors`               | `IAbstractFormBaseFormError[]`               | Array of all form errors                      |

## Outputs

| Output           | Type                                  | Description                               |
| ---------------- | ------------------------------------- | ----------------------------------------- |
| `unsavedChanges` | `EventEmitter<boolean>`               | Emits when form has unsaved changes       |
| `formSubmit`     | `EventEmitter<IAbstractFormBaseForm>` | Emits when form is submitted successfully |

## Methods

### Public Methods

| Method                             | Parameters                                                             | Description                                                                |
| ---------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `handleClearForm()`                | —                                                                      | Resets the form to its initial state.                                      |
| `scrollTo(fieldId)`                | `fieldId: string`                                                      | Scrolls to and focuses the specified field.                                |
| `handleRoute()`                    | `route: string, nonRelative?: boolean, event?: Event, routeData?: any` | Handles navigation with optional route data, respecting unsaved changes.   |
| `handleFormSubmit()`               | `event: SubmitEvent`                                                   | Runs validation and emits `formSubmit` when valid; focuses summary if not. |
| `handleUppercaseInputMask()`       | `event: Event`                                                         | Uppercases all letters in the event target input.                          |
| `updateFieldErrors()`              | `event: IAbstractFormBaseFieldErrors`                                  | Replaces the current map of field-level error templates.                   |
| `updateFormControlErrorMessages()` | `event: IAbstractFormControlErrorMessage`                              | Replaces the current per-control inline error messages map.                |
| `updateFormErrorSummaryMessage()`  | `event: IAbstractFormBaseFormErrorSummaryMessage[]`                    | Replaces the current error summary items array.                            |
| `updateFormErrors()`               | `event: IAbstractFormBaseFormError[]`                                  | Replaces the current raw error collection (rarely needed directly).        |

### Protected Methods

| Method                        | Parameters                                                                             | Description                                                                         |
| ----------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `createFormControl()`         | `validators: ValidatorFn[], initialValue?: string \| null`                             | Creates a `FormControl` with validators.                                            |
| `handleErrorMessages()`       | —                                                                                      | Computes `formErrors`, inline messages, and summary from the current form state.    |
| `hasUnsavedChanges()`         | —                                                                                      | Returns `true` when the form is dirty and not yet submitted.                        |
| `setInputValue()`             | `value: string, controlPath: string`                                                   | Patches a control’s value and marks it as touched.                                  |
| `handleDateInputFormErrors()` | —                                                                                      | Collapses day/month/year errors into a single DOB message when appropriate.         |
| `setInitialErrorMessages()`   | —                                                                                      | Seeds an empty inline error messages object and clears the summary.                 |
| `rePopulateForm()`            | `state: any`                                                                           | `patchValue` helper to rehydrate from store/state.                                  |
| `createControl()`             | `controlName: string, validators: ValidatorFn[]`                                       | Adds a new control to the root form.                                                |
| `updateControl()`             | `controlName: string, validators: ValidatorFn[]`                                       | Updates validators (or creates the control if absent).                              |
| `removeControl()`             | `controlName: string`                                                                  | Removes a control and its inline error entry.                                       |
| `removeControlErrors()`       | `controlName: string`                                                                  | Removes inline error entry for a specific control.                                  |
| `clearAllErrorMessages()`     | —                                                                                      | Clears inline messages, summary, and cached errors; updates form validity silently. |
| `addControlsToFormGroup()`    | `formGroup: FormGroup, controls: IAbstractFormArrayControlValidation[], index: number` | Utility for dynamically adding indexed controls.                                    |
| `mergeFieldErrors()`          | `current: IAbstractFormBaseFieldErrors, incoming: IAbstractFormBaseFieldErrors`        | Shallow-by-key merge; override in parents if multiple children need deep merges.    |

### Example Template Usage:

```html
<form [formGroup]="form" (ngSubmit)="handleFormSubmit($event)">
  <!-- Error Summary -->
  @if (formErrorSummaryMessage.length > 0) {
  <div class="govuk-error-summary" role="alert" tabindex="-1">
    <h2 class="govuk-error-summary__title">There is a problem</h2>
    <div class="govuk-error-summary__body">
      <ul class="govuk-list govuk-error-summary__list">
        @for (error of formErrorSummaryMessage; track error.fieldId) {
        <li>
          <a (click)="scrollTo(error.fieldId)">{{ error.message }}</a>
        </li>
        }
      </ul>
    </div>
  </div>
  }

  <!-- Form Fields -->
  <div class="govuk-form-group" [class.govuk-form-group--error]="formControlErrorMessages['name']">
    <label class="govuk-label" for="name">Name</label>
    @if (formControlErrorMessages['name']) {
    <p class="govuk-error-message">{{ formControlErrorMessages['name'] }}</p>
    }
    <input
      class="govuk-input"
      [class.govuk-input--error]="formControlErrorMessages['name']"
      id="name"
      formControlName="name"
    />
  </div>

  <div class="govuk-form-group" [class.govuk-form-group--error]="formControlErrorMessages['email']">
    <label class="govuk-label" for="email">Email</label>
    @if (formControlErrorMessages['email']) {
    <p class="govuk-error-message">{{ formControlErrorMessages['email'] }}</p>
    }
    <input
      class="govuk-input"
      [class.govuk-input--error]="formControlErrorMessages['email']"
      id="email"
      type="email"
      formControlName="email"
    />
  </div>

  <button type="submit" class="govuk-button">Submit</button>
  <button type="button" class="govuk-button govuk-button--secondary" (click)="handleClearForm()">Clear</button>
</form>
```

### Wiring nested sub-forms (simplified)

Parent remains the single source of truth for `fieldErrors` and computes `formControlErrorMessages` (for example via a tab-specific map). Children do **not** emit error maps; they only receive the nested `FormGroup` and the inline messages to display.

```html
<app-my-sub-form [form]="form.get('sub') as FormGroup" [formControlErrorMessages]="formControlErrorMessages">
</app-my-sub-form>
```

## Interfaces

The component utilizes several interfaces for type safety and structure:

### Key Interfaces:

1. **Error Handling Interfaces**:
   - `IAbstractFormBaseFieldError`: Individual field-level error details with priority and message
   - `IAbstractFormBaseFieldErrors`: Collection of field errors indexed by field name
   - `IAbstractFormBaseFormError`: Form error with fieldId, message, priority, and type
   - `IAbstractFormBaseFormErrorSummaryMessage`: Error summary message for display
   - `IAbstractFormBaseHighPriorityFormError`: High-priority error with type information

2. **Form Structure Interfaces**:
   - `IAbstractFormBaseForm<T>`: Form structure with formData and nestedFlow properties
   - `IAbstractFormControlErrorMessage`: Error messages indexed by control name
   - `IAbstractFormArrayControlValidation`: Validation configuration for form array controls

## Error Handling Features

**Ownership model:**

- Parent is the single source of truth for field error templates and computed messages.
- Children install/remove their own controls and manage validators; they do not emit error maps.

The component provides comprehensive error handling:

- **Automatic Error Detection**: Recursively scans FormGroups and FormArrays for errors
- **Priority-based Error Display**: Shows highest priority errors when multiple errors exist
- **Date Field Consolidation**: Automatically consolidates date field errors (day, month, year)
- **Error Summary Generation**: Creates accessible error summaries with scroll-to functionality
- **Real-time Validation**: Updates error messages as users interact with the form

## Form Management Features

- **Dynamic Control Management**: Add, update, or remove form controls at runtime
- **Validator Management**: Update validators for existing controls or clear all validators
- **Form State Tracking**: Monitor unsaved changes and form submission state
- **Route Integration**: Handle navigation with form state preservation
- **Accessibility Support**: Focus management and ARIA compliance

## Testing

Unit tests should cover:

- Form validation scenarios
- Error message handling and display
- Dynamic control management
- Route handling with unsaved changes
- Error summary functionality

```typescript
describe('MyFormComponent', () => {
  let component: MyFormComponent;
  let fixture: ComponentFixture<MyFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [MyFormComponent],
    });
    fixture = TestBed.createComponent(MyFormComponent);
    component = fixture.componentInstance;
  });

  it('should handle form submission with validation errors', () => {
    component.form.patchValue({ name: '', email: 'invalid-email' });
    component.handleFormSubmit(new SubmitEvent('submit'));

    expect(component.formErrors.length).toBeGreaterThan(0);
    expect(component.formErrorSummaryMessage.length).toBeGreaterThan(0);
  });
});
```

## Contributing

Feel free to submit issues or pull requests to improve this component. Ensure that all changes follow Angular best practices and maintain consistency with form management and validation logic.
