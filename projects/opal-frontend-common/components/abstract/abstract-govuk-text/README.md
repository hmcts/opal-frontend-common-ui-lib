# AbstractGovukTextComponent

An abstract base class that provides common functionality for GOV.UK text-based form controls (text inputs and text areas). This component eliminates code duplication and ensures consistent behavior across all text-based form components.

## Purpose

The `AbstractGovukTextComponent` extracts shared logic for:

- Form control management with Angular signals
- Character count calculations
- Input validation and error handling
- Common input properties and behaviors

## Features

- **Signal-based reactivity**: Uses Angular signals for efficient change detection
- **Automatic subscription management**: Proper cleanup using `takeUntilDestroyed`
- **Character counting**: Real-time remaining character count calculation
- **Type safety**: Full TypeScript support with proper typing
- **Memory leak prevention**: Automatic subscription cleanup on component destroy

## API Reference

### Inputs

| Property                | Type                      | Required | Default | Description                             |
| ----------------------- | ------------------------- | -------- | ------- | --------------------------------------- |
| `labelText`             | `string`                  | ✅       | -       | The label text for the form control     |
| `labelClasses`          | `string`                  | ❌       | -       | Additional CSS classes for the label    |
| `inputId`               | `string`                  | ✅       | -       | Unique identifier for the input element |
| `inputName`             | `string`                  | ✅       | -       | Name attribute for the input element    |
| `inputClasses`          | `string`                  | ❌       | -       | Additional CSS classes for the input    |
| `hintText`              | `string`                  | ❌       | -       | Helper text displayed below the label   |
| `errors`                | `string \| null`          | ❌       | `null`  | Error message to display                |
| `characterCountEnabled` | `boolean`                 | ❌       | `false` | Whether to show character count         |
| `maxCharacterLimit`     | `number`                  | ❌       | `500`   | Maximum number of characters allowed    |
| `control`               | `AbstractControl \| null` | ✅       | -       | Angular form control instance           |

### Properties

| Property                  | Type             | Description                                    |
| ------------------------- | ---------------- | ---------------------------------------------- |
| `remainingCharacterCount` | `Signal<number>` | Computed signal returning remaining characters |
| `getControl`              | `FormControl`    | Getter for the form control instance           |

### Protected Members

| Member          | Type             | Description                                 |
| --------------- | ---------------- | ------------------------------------------- |
| `_controlValue` | `Signal<string>` | Internal signal tracking form control value |
| `destroyRef`    | `DestroyRef`     | Angular DestroyRef for automatic cleanup    |

## Usage

This is an abstract class and cannot be instantiated directly. Instead, extend it in your concrete components:

```typescript
import { Component } from '@angular/core';
import { AbstractGovukTextComponent } from '../abstract/abstract-govuk-text.component';

@Component({
  selector: 'my-text-input',
  template: `
    <div class="govuk-form-group govuk-character-count" [class.govuk-form-group--error]="!!errors">
      <h1 class="govuk-label-wrapper">
        <label class="govuk-label {{ labelClasses }}" [for]="inputId">
          {{ labelText }}
        </label>
      </h1>
      @if (hintText) {
        <div id="{{ inputId }}-hint" class="govuk-hint">
          {{ hintText }}
        </div>
      }

      @if (hintHtml) {
        <div id="{{ inputId }}-hint" class="govuk-hint"><ng-content></ng-content></div>
      }

      @if (errors) {
        <p id="{{ this.inputId }}-error-message" class="govuk-error-message">
          <span class="govuk-visually-hidden">Error: </span> {{ errors }}
        </p>
      }

      <input
        class="govuk-input {{ inputClasses }}"
        [id]="inputId"
        [name]="inputName"
        type="text"
        [formControl]="getControl"
        [maxlength]="maxCharacterLimit"
      />
      @if (characterCountEnabled) {
        <div [id]="inputId + '-hint'" class="govuk-hint">
          You have {{ remainingCharacterCount() }} character{{ remainingCharacterCount() === 1 ? '' : 's' }} remaining
        </div>
      }
    </div>
  `,
  standalone: true,
})
export class MyTextInputComponent extends AbstractGovukTextComponent {
  // Add component-specific properties and methods here
}
```

## Implementation Details

### Signal Management

The component uses Angular signals for reactive state management:

```typescript
private readonly _controlValue = signal<string>('');

protected readonly remainingCharacterCount = computed(() => {
  return this.maxCharacterLimit - this._controlValue().length;
});
```

### Form Control Integration

When a form control is set, the component:

1. Initializes the internal signal with the current value
2. Subscribes to value changes using `takeUntilDestroyed` for automatic cleanup
3. Converts null/undefined values to empty strings

```typescript
@Input({ required: true }) set control(abstractControl: AbstractControl | null) {
  this._control = abstractControl as FormControl;

  this._controlValue.set(this._control.value || '');

  this._control.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((value) => {
      this._controlValue.set(value || '');
    });
}
```

### Memory Management

The component automatically handles subscription cleanup using Angular's `takeUntilDestroyed` operator, preventing memory leaks without requiring manual `ngOnDestroy` implementation.

## Extending Components

Current implementations extending this abstract class:

- [`GovukTextInputComponent`](../govuk-text-input/README.md) - Single-line text input
- [`GovukTextAreaComponent`](../govuk-text-area/README.md) - Multi-line text area

### Adding New Extensions

To create a new text-based component:

1. Extend `AbstractGovukTextComponent`
2. Add component-specific inputs and logic
3. Create your template using the inherited properties
4. Import the abstract class in your component

```typescript
export class MyCustomTextComponent extends AbstractGovukTextComponent {
  @Input() customProperty: string = '';

  // Add custom methods as needed
}
```

## Testing

The abstract class includes comprehensive test coverage in `abstract-govuk-text.component.spec.ts`. When extending this class, focus your tests on:

- Component-specific functionality
- Template rendering
- Custom input properties
- Integration with the abstract base class

The abstract class tests cover:

- ✅ Signal initialization and updates
- ✅ Form control integration
- ✅ Character count calculations
- ✅ Null/undefined value handling
- ✅ Subscription management

## Best Practices

1. **Keep extensions focused**: Only add component-specific logic in extending classes
2. **Use protected members**: Access inherited signals using the provided getters
3. **Test integration**: Verify that your component works correctly with the abstract base
4. **Follow Angular patterns**: Use modern Angular features like signals and standalone components

## Migration Notes

If migrating from individual component implementations:

1. Remove duplicate code (signals, form control management, character counting)
2. Update imports to extend the abstract class
3. Move component-specific logic to the extending class
4. Update tests to remove duplicate test cases covered by the abstract class tests
5. Verify that templates use the inherited properties correctly

## Related Components

- [GovukTextInputComponent](../govuk-text-input/README.md)
- [GovukTextAreaComponent](../govuk-text-area/README.md)
