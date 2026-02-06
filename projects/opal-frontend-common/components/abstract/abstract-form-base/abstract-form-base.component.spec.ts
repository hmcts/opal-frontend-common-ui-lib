import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractFormBaseComponent } from './abstract-form-base.component';
import { FormArray, FormControl, FormGroup, FormRecord, ValidatorFn, Validators } from '@angular/forms';
import { IAbstractFormBaseFieldError } from './interfaces/abstract-form-base-field-error.interface';
import { IAbstractFormBaseFormError } from './interfaces/abstract-form-base-form-error.interface';
import { IAbstractFormBaseFormErrorSummaryMessage } from '../interfaces/abstract-form-base-form-error-summary-message.interface';
import { ABSTRACT_FORM_BASE_FORM_CONTROL_ERROR_MOCK } from './mocks/abstract-form-base-form-control-error.mock';
import { ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK } from './mocks/abstract-form-base-form-date-error-summary.mock';
import { ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK } from './mocks/abstract-form-base-form-error-summary.mock';
import { ABSTRACT_FORM_BASE_FORM_STATE_MOCK } from './mocks/abstract-form-base-form-state.mock';
import { ABSTRACT_FORM_BASE_FIELD_ERRORS } from './mocks/abstract-form-base-field-error.mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { IAbstractFormArrayControlValidation } from '../interfaces/abstract-form-array-control-validation.interface';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

class TestAbstractFormBaseComponent extends AbstractFormBaseComponent {
  constructor() {
    super();
    this.form = new FormGroup({
      court: new FormControl(null, [Validators.required]),
      surname: new FormControl(null),
      forename: new FormControl(null),
      initials: new FormControl(null),
      dateOfBirth: new FormGroup({
        dayOfMonth: new FormControl(null, [Validators.required, Validators.maxLength(2)]),
        monthOfYear: new FormControl(null, [Validators.required]),
        year: new FormControl(null, [Validators.required]),
      }),
      addressLine: new FormControl(null),
      niNumber: new FormControl(null),
      pcr: new FormControl(null),
      alias: new FormArray([]),
    });
  }
}

describe('AbstractFormBaseComponent', () => {
  beforeAll(() => {
    if (!HTMLElement.prototype.scrollIntoView) {
      Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
        value: () => {
          return;
        },
        configurable: true,
      });
    }
  });

  let component: TestAbstractFormBaseComponent | null;
  let fixture: ComponentFixture<TestAbstractFormBaseComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAbstractFormBaseComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAbstractFormBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the form when handleClearForm is called', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    vi.spyOn(component.form, 'reset');
    component.handleClearForm();
    expect(component.form.reset).toHaveBeenCalled();
  });

  it('should scroll to the label and focus the field when testScroll is called', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const fieldId = 'testField';
    const fieldElement = document.createElement('input');
    fieldElement.id = fieldId;
    document.body.appendChild(fieldElement);

    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', fieldId);
    document.body.appendChild(labelElement);

    vi.spyOn(fieldElement, 'focus');
    vi.spyOn(labelElement, 'scrollIntoView');

    component['scroll'](fieldId);

    expect(labelElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    expect(fieldElement.focus).toHaveBeenCalled();

    document.body.removeChild(fieldElement);
    document.body.removeChild(labelElement);
  });

  it('should scroll to the govuk-fieldset__legend if no label for fieldId is found', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const fieldId = 'testField';
    const fieldElement = document.createElement('input');
    fieldElement.id = fieldId;
    document.body.appendChild(fieldElement);

    const legendElement = document.createElement('div');
    legendElement.classList.add('govuk-fieldset__legend');
    fieldElement.appendChild(legendElement);

    vi.spyOn(fieldElement, 'focus');
    vi.spyOn(legendElement, 'scrollIntoView');

    component['scroll'](fieldId);

    expect(legendElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    expect(fieldElement.focus).toHaveBeenCalled();

    document.body.removeChild(fieldElement);
  });

  it('should scroll to label[for=fieldId-autocomplete] if present', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const fieldId = 'testField';
    const fieldElement = document.createElement('input');
    fieldElement.id = `${fieldId}-autocomplete`;
    document.body.appendChild(fieldElement);

    const autocompleteLabelElement = document.createElement('label');
    autocompleteLabelElement.setAttribute('for', `${fieldId}-autocomplete`);
    document.body.appendChild(autocompleteLabelElement);

    vi.spyOn(fieldElement, 'focus');
    vi.spyOn(autocompleteLabelElement, 'scrollIntoView');

    component['scroll'](fieldId);

    expect(autocompleteLabelElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    expect(fieldElement.focus).toHaveBeenCalled();

    document.body.removeChild(fieldElement);
    document.body.removeChild(autocompleteLabelElement);
  });

  it('should test scrollTo', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    vi.spyOn(
      component as unknown as {
        scroll: (fieldId: string) => void;
      },
      'scroll',
    );

    component.scrollTo('forename');

    expect(component['scroll']).toHaveBeenCalled();
  });

  it('should return the highest priority error', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const errorKeys = ['required', 'minLength'];
    const fieldErrors: IAbstractFormBaseFieldError = ABSTRACT_FORM_BASE_FORM_CONTROL_ERROR_MOCK;

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);

    expect(result).toEqual({ ...fieldErrors['minLength'], type: 'minLength' });
  });

  it('should return null if errorKeys is empty', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const errorKeys: string[] = [];
    const fieldErrors: IAbstractFormBaseFieldError = ABSTRACT_FORM_BASE_FORM_CONTROL_ERROR_MOCK;

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);
    expect(result).toBe(null);
  });

  it('should return null if fieldErrors is empty', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const errorKeys = ['required', 'minLength'];
    const fieldErrors: IAbstractFormBaseFieldError = {};

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);

    expect(result).toBe(null);
  });

  it('should return null if nothing is not passed in', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const result = component['getHighestPriorityError']();

    expect(result).toBe(null);
  });

  it('should return null if errorKeys and fieldErrors are empty', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const errorKeys: string[] = [];
    const fieldErrors: IAbstractFormBaseFieldError = {};

    const result = component['getHighestPriorityError'](errorKeys, fieldErrors);

    expect(result).toBe(null);
  });

  it('should return an array of error summary entries for nested form group controls', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
      return;
    }

    component['fieldErrors'] = {
      street: {
        required: {
          message: 'Street is required',
          priority: 1,
        },
      },
      city: {
        required: {
          message: 'City is required',
          priority: 1,
        },
      },
    };

    component.form = new FormGroup({
      address: new FormGroup({
        street: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
      }),
    });

    fixture.detectChanges();

    const result = component['getFormErrors'](component.form);

    expect(result).toEqual([
      { fieldId: 'street', message: 'Street is required', type: 'required', priority: 1 },
      { fieldId: 'city', message: 'City is required', type: 'required', priority: 1 },
    ]);
  });

  it('should repopulate the form', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component['rePopulateForm'](ABSTRACT_FORM_BASE_FORM_STATE_MOCK);
    expect(component.form.value.forename).toBe('Test');
  });

  it('should remove error summary messages', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component.formErrorSummaryMessage = ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK.slice(0, 1);

    component['removeErrorSummaryMessages'](component.formErrorSummaryMessage, [1]);

    expect(component.formErrorSummaryMessage.length).toBe(1);
  });

  it('should return the indices of form error summary messages for given field IDs', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const fieldIds = ['dayOfMonth', 'monthOfYear', 'year'];
    const formErrorSummaryMessage: IAbstractFormBaseFormErrorSummaryMessage[] =
      ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK;

    const result = component['getFormErrorSummaryIndex'](fieldIds, formErrorSummaryMessage);

    expect(result).toEqual([0, 1, 2]);
  });

  it('should return an empty array if no form error summary messages match the field IDs', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const fieldIds = ['surname', 'address', 'phone'];
    const formErrorSummaryMessage: IAbstractFormBaseFormErrorSummaryMessage[] =
      ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK;

    const result = component['getFormErrorSummaryIndex'](fieldIds, formErrorSummaryMessage);

    expect(result).toEqual([]);
  });
  it('should return the indices of form error summary messages for given field IDs', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const fieldIds = ['dayOfMonth', 'monthOfYear', 'year'];
    const formErrorSummaryMessage: IAbstractFormBaseFormErrorSummaryMessage[] =
      ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK;

    const result = component['getFormErrorSummaryIndex'](fieldIds, formErrorSummaryMessage);

    expect(result).toEqual([0, 1, 2]);
  });

  it('should return an empty array if no form error summary messages match the field IDs', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const fieldIds = ['surname', 'address', 'phone'];
    const formErrorSummaryMessage: IAbstractFormBaseFormErrorSummaryMessage[] =
      ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK;

    const result = component['getFormErrorSummaryIndex'](fieldIds, formErrorSummaryMessage);

    expect(result).toEqual([]);
  });

  it('should return the indices of form error summary messages to remove for date fields', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component.formErrorSummaryMessage = ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK;

    const result = component['getDateFieldsToRemoveIndexes']();

    expect(result).toEqual([1, 2]);
  });

  it('should return the indices of form error summary messages to remove for date fields when only two fields are present', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component.formErrorSummaryMessage = ABSTRACT_FORM_BASE_FORM_DATE_ERROR_SUMMARY_MOCK.slice(0, 2);

    const result = component['getDateFieldsToRemoveIndexes']();

    expect(result).toEqual([1]);
  });

  it('should return an empty array if no form error summary messages to remove for date fields', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component.formErrorSummaryMessage = [];

    const result = component['getDateFieldsToRemoveIndexes']();

    expect(result).toEqual([]);
  });

  it('should set the error messages', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const errorSummaryEntry: IAbstractFormBaseFormError[] = ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK;

    component['setErrorMessages'](errorSummaryEntry);

    expect(component.formControlErrorMessages['court']).toBe('Select a court');
    expect(component.formControlErrorMessages['dayOfMonth']).toBe(
      'The date your passport was issued must include a day',
    );
    expect(component.formErrorSummaryMessage).toEqual([
      {
        fieldId: 'court',
        message: 'Select a court',
      },
      {
        fieldId: 'dayOfMonth',
        message: 'The date your passport was issued must include a day',
      },
      {
        fieldId: 'monthOfYear',
        message: 'The date your passport was issued must include a month',
      },
      {
        fieldId: 'year',
        message: 'The date your passport was issued must include a year',
      },
    ]);
  });

  it('should set initial form error messages to null for each form control', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component['setInitialErrorMessages']();

    expect(component.formControlErrorMessages['forename']).toBeNull();
    expect(component.formControlErrorMessages['surname']).toBeNull();
    expect(component.formErrorSummaryMessage.length).toBe(0);
  });

  it('should return an empty array if the form is valid', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component.form.patchValue(ABSTRACT_FORM_BASE_FORM_STATE_MOCK);
    const result = component['getFormErrors'](component.form);

    expect(result).toEqual([]);
  });

  it('should return an empty array if the form control does not have a field error', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const invalidField = new FormGroup({
      test: new FormControl(null, Validators.required),
    });
    const result = component['getFormErrors'](invalidField);

    expect(result).toEqual([]);
  });

  it('should return an empty array if the form array does not have any field errors', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const formArray = new FormArray([
      new FormGroup({
        test: new FormControl(null, Validators.required),
      }),
      new FormGroup({
        test: new FormControl('valid value'),
      }),
    ]);

    const formGroup = new FormGroup({
      formArray: formArray,
    });

    const result = component['getFormErrors'](formGroup);

    expect(result).toEqual([]);
  });

  it('should handle FormArray containing non-FormGroup controls', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const formArray = new FormArray([
      new FormControl(null, Validators.required),
      new FormGroup({
        test: new FormControl('valid value'),
      }),
    ]);

    const formGroup = new FormGroup({
      formArray: formArray,
    });

    const result = component['getFormErrors'](formGroup);

    expect(result).toEqual([]);
  });

  it('should return the error summary entries', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component['fieldErrors'] = ABSTRACT_FORM_BASE_FIELD_ERRORS;
    const errorMessage = component['getFieldErrorDetails'](['court']);
    const expectedResp = { message: 'Select a court', priority: 1, type: 'required' };

    expect(errorMessage).toEqual(expectedResp);
  });

  it('should return null as no control error', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    expect(component['getFieldErrorDetails'](['surname'])).toBeNull();
  });

  it('should manipulate the form error message for specified fields', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const fields = ['monthOfYear', 'dayOfMonth', 'year'];
    const messageOverride = 'New error message';
    const errorType = 'required';
    const formErrors: IAbstractFormBaseFormError[] = ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK;

    const manipulatedFields = component['manipulateFormErrorMessage'](fields, messageOverride, errorType, formErrors);

    expect(manipulatedFields).toEqual([
      ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[0],
      { ...ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[1], message: messageOverride },
      { ...ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[2], message: messageOverride },
      { ...ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[3], message: messageOverride },
    ]);
  });

  it('should not manipulate the form error message if the error type does not match', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const fields = ['monthOfYear', 'dayOfMonth', 'year'];
    const messageOverride = 'New error message';
    const errorType = 'maxLength';
    const formErrors: IAbstractFormBaseFormError[] = ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK;

    const manipulatedFields = component['manipulateFormErrorMessage'](fields, messageOverride, errorType, formErrors);

    expect(manipulatedFields).toEqual(formErrors);
  });

  it('should return an empty array if formErrors is empty', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const fields = ['monthOfYear', 'dayOfMonth', 'year'];
    const messageOverride = 'New error message';
    const errorType = 'required';
    const formErrors: IAbstractFormBaseFormError[] = [];

    const manipulatedFields = component['manipulateFormErrorMessage'](fields, messageOverride, errorType, formErrors);

    expect(manipulatedFields).toEqual([]);
  });

  it('should handle date input form errors', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component.formErrors = ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK;
    const messageOverride = 'Please enter a DOB';

    const result = component['handleDateInputFormErrors']();

    expect(result).toEqual([
      ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[0],
      { ...ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[1], message: messageOverride },
      { ...ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[2], message: messageOverride },
      { ...ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[3], message: messageOverride },
    ]);
  });

  it('should return the highest priority form errors', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const formErrors: IAbstractFormBaseFormError[] = [
      ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[0],
      { ...ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[1], priority: 2 },
      { ...ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[2], priority: 2 },
      { ...ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[3], priority: 2 },
    ];

    const result = component['getHighPriorityFormErrors'](formErrors);

    expect(result).toEqual([ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[0]]);
  });

  it('should return an empty array if formErrors is empty', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const formErrors: IAbstractFormBaseFormError[] = [];

    const result = component['getHighPriorityFormErrors'](formErrors);

    expect(result).toEqual([]);
  });

  it('should return all form errors if they have the same priority', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const formErrors: IAbstractFormBaseFormError[] = ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK;

    const result = component['getHighPriorityFormErrors'](formErrors);

    expect(result).toEqual(formErrors);
  });

  it('should split form errors into clean and removed form errors', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const fieldIds = ['monthOfYear', 'dayOfMonth', 'year'];
    const formErrors: IAbstractFormBaseFormError[] = ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK;

    const [cleanFormErrors, removedFormErrors] = component['splitFormErrors'](fieldIds, formErrors);

    expect(cleanFormErrors).toEqual([ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[0]]);

    expect(removedFormErrors).toEqual([
      ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[1],
      ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[2],
      ABSTRACT_FORM_BASE_FORM_ERROR_SUMMARY_MOCK[3],
    ]);
  });

  it('should emit form submit event with form value', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const formValue = ABSTRACT_FORM_BASE_FORM_STATE_MOCK;
    component['rePopulateForm'](formValue);

    component['handleErrorMessages']();

    expect(component.formControlErrorMessages).toEqual({});
    expect(component.formErrorSummaryMessage).toEqual([]);
  });

  it('should test handleRoute', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const routerSpy = vi.spyOn(component['router'], 'navigate');
    component['handleRoute']('test');
    expect(routerSpy).toHaveBeenCalledWith(['test'], { relativeTo: component['activatedRoute'].parent });
  });

  it('should test handleRoute with no activated route', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const routerSpy = vi.spyOn(component['router'], 'navigate');
    component['handleRoute']('test', { nonRelative: true });
    expect(routerSpy).toHaveBeenCalledWith(['test'], {});
  });

  it('should test handleRoute with event', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const routerSpy = vi.spyOn(component['router'], 'navigate');
    const event = {
      preventDefault: vi.fn().mockName('event.preventDefault'),
    } as unknown as Event;

    component['handleRoute']('test', { event });
    expect(routerSpy).toHaveBeenCalledWith(['test'], { relativeTo: component['activatedRoute'].parent });
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should test handleRoute with routeData', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const routerSpy = vi.spyOn(component['router'], 'navigate');
    const event = {
      preventDefault: vi.fn().mockName('event.preventDefault'),
    } as unknown as Event;
    const routeData = { someData: 'test' };

    component['handleRoute']('test', { event, routeData });
    expect(routerSpy).toHaveBeenCalledWith(['test'], {
      relativeTo: component['activatedRoute'].parent,
      state: routeData,
    });
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should test handleRoute with fragment', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const routerSpy = vi.spyOn(component['router'], 'navigate');
    const fragment = 'section-header';

    component['handleRoute']('test', { fragment });
    expect(routerSpy).toHaveBeenCalledWith(['test'], {
      relativeTo: component['activatedRoute'].parent,
      fragment: fragment,
    });
  });

  it('should test hasUnsavedChanges', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component['formSubmitted'] = false;
    expect(component['hasUnsavedChanges']()).toBe(false);

    component.form.controls['surname'].markAsDirty();
    component['formSubmitted'] = true;
    expect(component['hasUnsavedChanges']()).toBe(false);

    component['formSubmitted'] = false;
    expect(component['hasUnsavedChanges']()).toBe(true);
  });

  it('should set the value of the form control and mark it as touched', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const testValue = 'newValue';
    const controlName = 'surname';

    // Set the input value
    component['setInputValue'](testValue, controlName);

    // Check updated state
    expect(component.form.controls[controlName].value).toBe(testValue);
    expect(component.form.controls[controlName].touched).toBe(true);
  });

  it('should add controls to a form group', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
      return;
    }

    const formGroup = new FormGroup({});
    const controls: IAbstractFormArrayControlValidation[] = [
      { controlName: 'firstName', validators: [] },
      { controlName: 'lastName', validators: [] },
    ];
    const index = 0;

    component['addControlsToFormGroup'](formGroup, controls, index);

    fixture.detectChanges();

    expect(formGroup.get('firstName_0')).toBeInstanceOf(FormControl);
    expect(formGroup.get('lastName_0')).toBeInstanceOf(FormControl);
  });

  it('should remove control name errors', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component.formControlErrorMessages = {
      court: 'test message',
    };

    component['removeControlErrors']('court');

    expect(component.formControlErrorMessages).toEqual({});
  });

  it('should create a new control with the given control name and validators', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const controlName = 'testControl';
    const validators: ValidatorFn[] = [Validators.required];

    component['createControl'](controlName, validators);

    expect(component.form.get(controlName)).toBeTruthy();
    expect(component.form.get(controlName)?.value).toBeNull();
    expect(component.form.get(controlName)?.hasValidator(Validators.required)).toBeTruthy();
  });

  it('should remove a control from the form', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const controlName = 'surname';
    component.formControlErrorMessages = { surname: 'Please enter a surname' };
    component['removeControl'](controlName);
    expect(component.form.get(controlName)).toBeNull();
  });

  it('should create a form control with the specified validators and initial value', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const validators = [Validators.required];
    const initialValue = 'Test';

    const formControl = component['createFormControl'](validators, initialValue);

    expect(formControl).toBeInstanceOf(FormControl);
    expect(formControl.value).toBe(initialValue);
    expect(formControl.hasValidator(Validators.required)).toBeTruthy();
  });

  it('should create a form control with default initial value of null', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const validators = [Validators.required];

    const formControl = component['createFormControl'](validators);

    expect(formControl).toBeInstanceOf(FormControl);
    expect(formControl.value).toBeNull();
    expect(formControl.hasValidator(Validators.required)).toBeTruthy();
  });

  it('should convert input value to uppercase when handleUppercaseInputMask is called', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const mockInputElement = document.createElement('input');
    mockInputElement.value = 'lowercase text';

    const event = new Event('input');
    Object.defineProperty(event, 'target', { writable: false, value: mockInputElement });

    vi.spyOn(component['utilsService'], 'upperCaseAllLetters');

    component.handleUppercaseInputMask(event);

    expect(component['utilsService'].upperCaseAllLetters).toHaveBeenCalledWith('lowercase text');
    expect(mockInputElement.value).toBe('LOWERCASE TEXT');
  });

  it('should focus and scroll to the error summary if present', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const errorSummaryElement = document.createElement('div');
    errorSummaryElement.classList.add('govuk-error-summary');
    document.body.appendChild(errorSummaryElement);
    // Spy on focus after appending to the DOM
    vi.spyOn(errorSummaryElement, 'focus');

    const scrollSpy = vi.spyOn(component['utilsService'], 'scrollToTop');

    component['focusAndScrollToErrorSummary']();

    expect(errorSummaryElement.focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(scrollSpy).toHaveBeenCalled();

    document.body.removeChild(errorSummaryElement);
  });

  it('should call focusAndScrollToErrorSummary when form is invalid on submit', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    // Make form invalid
    component.form.get('court')?.setValue(null);
    component.form.markAsTouched();

    // Provide a valid fieldErrors object for 'court'
    component['fieldErrors'] = {
      court: {
        required: {
          message: 'Select a court',
          priority: 1,
        },
      },
    };

    const errorSummary = document.createElement('div');
    errorSummary.classList.add('govuk-error-summary');
    document.body.appendChild(errorSummary);
    vi.spyOn(errorSummary, 'focus');

    const scrollSpy = vi.spyOn(component['utilsService'], 'scrollToTop');

    component.handleFormSubmit(new SubmitEvent('submit'));

    expect(errorSummary.focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(scrollSpy).toHaveBeenCalled();

    document.body.removeChild(errorSummary);
  });

  it('should update an existing control with new validators', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const controlName = 'surname';
    component.form.get(controlName)?.setValidators([]); // clear validators

    component['updateControl'](controlName, [Validators.required]);

    const control = component.form.get(controlName);
    expect(control?.hasValidator(Validators.required)).toBe(true);
  });

  it('should create a control if it does not exist when updating validators', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const controlName = 'newControl';
    component['updateControl'](controlName, [Validators.required]);

    const control = component.form.get(controlName);
    expect(control).toBeDefined();
    expect(control?.hasValidator(Validators.required)).toBe(true);
  });

  it('should emit formSubmit with nestedFlow true when valid form is submitted via nested-flow button', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const mockFormData = ABSTRACT_FORM_BASE_FORM_STATE_MOCK;
    component['rePopulateForm'](mockFormData);
    component.form.markAsDirty();

    const submitEvent = new SubmitEvent('submit', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });

    Object.defineProperty(submitEvent, 'submitter', {
      value: { className: 'nested-flow' },
    });

    const emitSpy = vi.spyOn(component['formSubmit'], 'emit');

    component.handleFormSubmit(submitEvent);

    expect(emitSpy).toHaveBeenCalledWith({
      formData: component.form.value,
      nestedFlow: true,
    });
  });

  it('should emit formSubmit with nestedFlow false when event.submitter is undefined', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const mockFormData = ABSTRACT_FORM_BASE_FORM_STATE_MOCK;
    component['rePopulateForm'](mockFormData);
    component.form.markAsDirty();

    const submitEvent = new SubmitEvent('submit');

    // Remove submitter
    Object.defineProperty(submitEvent, 'submitter', {
      value: undefined,
    });

    const emitSpy = vi.spyOn(component['formSubmit'], 'emit');

    component.handleFormSubmit(submitEvent);

    expect(emitSpy).toHaveBeenCalledWith({
      formData: component.form.value,
      nestedFlow: false,
    });
  });

  it('should clear all error messages', () => {
    if (!component) {
      throw new Error('Component is not initialized');
      return;
    }

    // Set up initial error messages and errors
    component.formControlErrorMessages = { field1: 'Error 1', field2: 'Error 2' };
    component.formErrorSummaryMessage = [
      { fieldId: 'field1', message: 'Error 1' },
      { fieldId: 'field2', message: 'Error 2' },
    ];
    component.formErrors = [{ fieldId: 'field1', message: 'Error 1', priority: 1, type: 'required' }];

    // Call the method under test
    component['clearAllErrorMessages']();

    // Assert that all error message containers are cleared
    expect(component.formControlErrorMessages).toEqual({});
    expect(component.formErrorSummaryMessage).toEqual([]);
    expect(component.formErrors).toEqual([]);
  });

  it('should return an error summary entry for a FormRecord control when the record has errors', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
      return;
    }

    // Arrange: set fieldErrors metadata for the FormRecord key
    component['fieldErrors'] = {
      myRecord: {
        required: {
          message: 'Please select at least one item',
          priority: 1,
        },
      },
    };

    // Create a form with a FormRecord and attach a record-level error
    component.form = new FormGroup({
      myRecord: new FormRecord({}),
    });

    // Mark the FormRecord as invalid via a record-level error
    const record = component.form.get('myRecord');
    record?.setErrors({ required: true });

    fixture.detectChanges();

    // Act: collect errors
    const result = component['getFormErrors'](component.form);

    // Assert: one error entry for the FormRecord itself, using the mapped message
    expect(result).toEqual([
      {
        fieldId: 'myRecord',
        message: 'Please select at least one item',
        priority: 1,
        type: 'required',
      },
    ]);
  });

  it('should create a default FormRecord error object (null, 999999999, null) and then filter it out when no fieldErrors mapping exists', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
      return;
    }

    // Ensure there is NO fieldErrors mapping for the FormRecord key
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component['fieldErrors'] = {} as any;

    // Create a form with a FormRecord and attach a record-level error
    component.form = new FormGroup({
      myRecord: new FormRecord({}),
    });

    // Mark the FormRecord as invalid via a record-level error
    const record = component.form.get('myRecord');
    record?.setErrors({ required: true });

    fixture.detectChanges();

    // Act: collect errors
    const result = component['getFormErrors'](component.form);

    // Because there is no fieldErrors mapping, the constructed entry will have
    // message=null, priority=999999999, type=null and then be FILTERED OUT
    // by the final `filter(item => item?.message !== null)` step.
    expect(result).toEqual([]);
  });

  it('should return null when controlPath is empty and controlKey is undefined (covers ternary true branch)', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
      return;
    }

    // Arrange: make the root form itself invalid via a form-level error
    // and call getFieldErrorDetails with an empty controlPath so controlKey === undefined
    component.form.setErrors({ required: true });
    fixture.detectChanges();

    // Act
    const result = component['getFieldErrorDetails']([]);

    // Assert: because fieldErrors mapping cannot be resolved when controlKey is undefined,
    // the method should return null
    expect(result).toBeNull();

    // Clean up
    component.form.setErrors(null);
  });

  it('should fall back to [] when Object.keys(controlErrors) returns undefined (covers || [] branch)', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
      return;
    }

    // Arrange: build a minimal form with a control-level error
    component['fieldErrors'] = {
      foo: {
        required: { message: 'Foo is required', priority: 1 },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    component.form = new FormGroup({
      foo: new FormControl(null, Validators.required),
    });

    // Sanity: make the control invalid so controlErrors is truthy
    component.form.get('foo')?.markAsTouched();
    fixture.detectChanges();

    // Spy on Object.keys to simulate an unexpected undefined return value,
    // forcing the `|| []` fallback to execute
    const keysSpy = vi.spyOn(Object, 'keys').mockReturnValue(undefined as unknown as string[]);

    // Act
    const result = component['getFieldErrorDetails'](['foo']);

    // Assert: because errorKeys becomes [], the method cannot resolve a highest-priority error and returns null
    expect(result).toBeNull();

    // Restore
    keysSpy.mockRestore();
  });

  it('should set fieldErrors to {} when controlKey is undefined', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
      return;
    }

    // Arrange: create a form with a control that will produce errors
    component.form = new FormGroup({
      test: new FormControl(null, Validators.required),
    });

    // Force the control into an invalid state
    const testControl = component.form.get('test');
    testControl?.markAsTouched();
    testControl?.setErrors({ required: true });

    // Act: call getFieldErrorDetails with an empty path so controlKey is undefined
    const result = component['getFieldErrorDetails']([]);

    // Assert: it should return null, and the internal fieldErrors branch with {} is covered
    expect(result).toBeNull();
  });

  it('should hit the fieldErrors = {} branch when controlKey is undefined and control has errors', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    // Ensure an empty controlPath so controlKey === undefined
    const emptyPath: (string | number)[] = [];

    // Spy on form.get to return a control-like object with errors so the code enters the `if (controlErrors)` block
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fakeControlWithErrors = { errors: { required: true } } as unknown as any;
    const getSpy = vi.spyOn(component.form, 'get').mockReturnValue(fakeControlWithErrors);

    // Act
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = (component as any)['getFieldErrorDetails'](emptyPath);

    // Assert
    expect(getSpy).toHaveBeenCalledWith(emptyPath);
    // With no fieldErrors mapping available for an undefined key, the method returns null
    expect(result).toBeNull();
  });

  it('objectFromFormRecord should map keys to numbers and values to booleans', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const record = new FormRecord({
      '5': new FormControl(true),
      '8': new FormControl(null),
      '9': new FormControl(false),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = (component as any)['objectFromFormRecord'](record, {
      mapKey: Number,
      mapValue: (v: boolean | null | undefined) => !!v,
    });

    expect(result).toEqual({ 5: true, 8: false, 9: false });
  });

  it('objectFromFormRecord should default to identity for keys and values when no mappers are provided', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const record = new FormRecord({
      a: new FormControl(1),
      b: new FormControl(2),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = (component as any)['objectFromFormRecord'](record);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('patchFormRecordFromObject should only update controls whose value changes (no emit)', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const r = new FormRecord({
      '1': new FormControl(false),
      '2': new FormControl(true),
    });

    const spy1 = vi.spyOn(r.get('1') as FormControl<boolean>, 'setValue');
    const spy2 = vi.spyOn(r.get('2') as FormControl<boolean>, 'setValue');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any)['patchFormRecordFromObject'](r, { '1': true, '2': true }, { emitEvent: false });

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith(true, { emitEvent: false });
    expect(spy2).not.toHaveBeenCalled();
  });

  it('patchFormRecordFromObject should respect mapKey and emitEvent=true by emitting once per changed control', async () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const r = new FormRecord({
      '10': new FormControl(0),
      '11': new FormControl(1),
    });

    let emissions = 0;
    const sub = r.valueChanges.subscribe(() => emissions++);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any)['patchFormRecordFromObject'](
      r,
      { 10: 2, 11: 1 },
      { emitEvent: true, mapKey: (k: number) => k.toString() },
    );

    setTimeout(() => {
      expect((r.get('10') as FormControl<number>).value).toBe(2);
      expect((r.get('11') as FormControl<number>).value).toBe(1);
      expect(emissions).toBe(1); // only key '10' changed
      sub.unsubscribe();
    }, 0);
  });

  it('patchFormRecordFromObject should skip setValue when isEqual comparator deems values equal', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    type Obj = {
      x: number;
    };
    const r = new FormRecord({
      a: new FormControl<Obj>({ x: 1 }),
    });

    const spy = vi.spyOn(r.get('a') as FormControl<Obj>, 'setValue');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any)['patchFormRecordFromObject'](
      r,
      { a: { x: 1 } as Obj },
      { emitEvent: false, isEqual: (lhs: Obj, rhs: Obj) => lhs?.x === rhs?.x },
    );

    expect(spy).not.toHaveBeenCalled();
  });

  it('patchFormRecordFromObject should default emitEvent to false when not provided', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const r = new FormRecord({
      '1': new FormControl(false),
      '2': new FormControl(true),
    });

    const spy1 = vi.spyOn(r.get('1') as FormControl<boolean>, 'setValue');
    const spy2 = vi.spyOn(r.get('2') as FormControl<boolean>, 'setValue');

    // Call without opts (no emitEvent specified) → should default to { emitEvent: false }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any)['patchFormRecordFromObject'](r, { '1': true, '2': true });

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith(true, { emitEvent: false });
    expect(spy2).not.toHaveBeenCalled();
  });

  it('patchFormRecordFromObject should skip keys that do not map to a control (covers continue)', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const r = new FormRecord({
      existing: new FormControl('keep'),
    });

    const setSpy = vi.spyOn(r.get('existing') as FormControl<string>, 'setValue');

    // Provide a key that doesn't exist in the FormRecord to trigger the `continue` branch
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any)['patchFormRecordFromObject'](r, { missing: 'new' });

    expect(setSpy).not.toHaveBeenCalled();
    expect((r.get('existing') as FormControl<string>).value).toBe('keep');
  });

  it('should return true for an element with a tabIndex >= 0 and no disabled attribute', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const element = document.createElement('div');
    element.tabIndex = 0;

    const result = component['canReceiveFocus'](element as unknown as HTMLAnchorElement);

    expect(result).toBe(true);
  });

  it('should return false for an element with a tabIndex >= 0 but with a disabled attribute', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const element = document.createElement('div');
    element.tabIndex = 0;
    element.setAttribute('disabled', '');

    const result = component['canReceiveFocus'](element);

    expect(result).toBe(false);
  });

  it('should return true for an anchor element with a valid href', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const element = document.createElement('a');
    element.tabIndex = -1; // Ensure the anchor is not focusable by default
    element.href = 'https://example.com';

    const result = component['canReceiveFocus'](element);

    expect(result).toBe(true);
  });

  it('should return true for an enabled input element', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const element = document.createElement('input');

    const result = component['canReceiveFocus'](element);

    expect(result).toBe(true);
  });

  it('should return false for a disabled input element', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const element = document.createElement('input');
    element.disabled = true;

    const result = component['canReceiveFocus'](element);

    expect(result).toBe(false);
  });

  it('should return true for an enabled select element', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const element = document.createElement('select');

    const result = component['canReceiveFocus'](element);

    expect(result).toBe(true);
  });

  it('should return false for a disabled select element', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const element = document.createElement('select');
    element.disabled = true;

    const result = component['canReceiveFocus'](element);

    expect(result).toBe(false);
  });

  it('should return true for an enabled textarea element', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const element = document.createElement('textarea');

    const result = component['canReceiveFocus'](element);

    expect(result).toBe(true);
  });

  it('should return false for a disabled textarea element', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const element = document.createElement('textarea');
    element.disabled = true;

    const result = component['canReceiveFocus'](element);

    expect(result).toBe(false);
  });

  it('should return true for an enabled button element', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const element = document.createElement('button');

    const result = component['canReceiveFocus'](element);

    expect(result).toBe(true);
  });

  it('should return false for a disabled button element', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const element = document.createElement('button');
    element.disabled = true;

    const result = component['canReceiveFocus'](element);

    expect(result).toBe(false);
  });

  it('should return false for an element that is not focusable', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const element = document.createElement('span');

    const result = component['canReceiveFocus'](element);

    expect(result).toBe(false);
  });

  it('should scroll to and focus on the autocomplete label if present', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const fieldId = 'testField';
    const autocompleteLabel = document.createElement('label');
    autocompleteLabel.setAttribute('for', `${fieldId}-autocomplete`);
    document.body.appendChild(autocompleteLabel);

    vi.spyOn(autocompleteLabel, 'scrollIntoView');

    component['scroll'](fieldId);

    expect(autocompleteLabel.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(autocompleteLabel);
  });

  it('should scroll to and focus on the regular label if present', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const fieldId = 'testField';
    const regularLabel = document.createElement('label');
    regularLabel.setAttribute('for', fieldId);
    document.body.appendChild(regularLabel);
    vi.spyOn(regularLabel, 'scrollIntoView');

    component['scroll'](fieldId);

    expect(regularLabel.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(regularLabel);
  });

  it('should scroll to and focus on the fieldset legend if present', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const fieldId = 'testField';
    const fieldset = document.createElement('div');
    fieldset.id = fieldId;
    const legend = document.createElement('div');
    legend.classList.add('govuk-fieldset__legend');
    fieldset.appendChild(legend);
    document.body.appendChild(fieldset);

    vi.spyOn(fieldset, 'focus');
    vi.spyOn(legend, 'scrollIntoView');

    component['scroll'](fieldId);

    expect(legend.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    expect(fieldset.focus).toHaveBeenCalled();

    document.body.removeChild(fieldset);
  });

  it('should scroll to and focus on the field element if no label or legend is found', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const fieldId = 'testField';
    const fieldElement = document.createElement('input');
    fieldElement.id = fieldId;
    document.body.appendChild(fieldElement);
    vi.spyOn(fieldElement, 'focus');
    vi.spyOn(fieldElement, 'scrollIntoView');

    component['scroll'](fieldId);

    expect(fieldElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    expect(fieldElement.focus).toHaveBeenCalled();

    document.body.removeChild(fieldElement);
  });

  it('should scroll to and focus on a nested focusable element if the field element is not focusable', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const fieldId = 'testField';
    const fieldElement = document.createElement('div');
    fieldElement.id = fieldId;
    const nestedInput = document.createElement('input');
    fieldElement.appendChild(nestedInput);
    document.body.appendChild(fieldElement);
    vi.spyOn(nestedInput, 'focus');
    vi.spyOn(nestedInput, 'scrollIntoView');

    component['scroll'](fieldId);

    expect(nestedInput.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    expect(nestedInput.focus).toHaveBeenCalled();

    document.body.removeChild(fieldElement);
  });

  // it('should not throw an error if no matching elements are found', () => {
  //   if (!component) {
  //     fail('component returned null');
  //     return;
  //   }

  //   const fieldId = 'nonExistentField';
  //   const scrollSpy = spyOn(component['utilsService'], 'scrollToTop');

  //   expect(() => {
  //     if (!component) {
  //       fail('component returned null');
  //       return;
  //     }
  //     component['scroll'](fieldId);
  //   }).not.toThrow();
  //   expect(scrollSpy).not.toHaveBeenCalled();
  // });
});
