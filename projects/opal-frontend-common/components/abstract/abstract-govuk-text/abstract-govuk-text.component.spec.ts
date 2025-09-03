import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { AbstractGovukTextComponent } from './abstract-govuk-text.component';

@Component({
  template: '',
})
class TestComponent extends AbstractGovukTextComponent {}

describe('AbstractGovukTextComponent', () => {
  let component: TestComponent;
  let formControl: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;

    formControl = new FormControl('');
    component.labelText = 'test';
    component.inputId = 'test';
    component.inputName = 'test';
    component.control = formControl;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the control correctly', () => {
    const control = new FormControl('test value');
    component.control = control;
    expect(component.getControl).toBe(control);
  });

  it('should initialize _controlValue signal with current form control value', () => {
    const control = new FormControl('initial value');
    component.control = control;

    expect(component['_controlValue']()).toBe('initial value');
  });

  it('should update _controlValue signal when form control value changes', () => {
    expect(component['_controlValue']()).toBe('');

    formControl.setValue('new value');
    expect(component['_controlValue']()).toBe('new value');
  });

  it('should convert null/undefined values to empty string in _controlValue signal', () => {
    // Test with null value
    const controlWithNull = new FormControl(null);
    component.control = controlWithNull;
    expect(component['_controlValue']()).toBe('');

    // Test with undefined value
    const controlWithUndefined = new FormControl(undefined);
    component.control = controlWithUndefined;
    expect(component['_controlValue']()).toBe('');

    // Test value changes to null
    const control = new FormControl('some text');
    component.control = control;
    expect(component['_controlValue']()).toBe('some text');

    control.setValue(null);
    expect(component['_controlValue']()).toBe('');
  });

  it('should calculate remaining character count correctly', () => {
    component.maxCharacterLimit = 100;

    const control = new FormControl('hello');
    component.control = control;

    expect(component['remainingCharacterCount']()).toBe(95); // 100 - 5
  });

  it('should update remaining character count when control value changes', () => {
    component.maxCharacterLimit = 50;

    formControl.setValue('test');
    expect(component['remainingCharacterCount']()).toBe(46); // 50 - 4

    formControl.setValue('hello world');
    expect(component['remainingCharacterCount']()).toBe(39); // 50 - 11
  });

  it('should handle empty string values correctly', () => {
    component.maxCharacterLimit = 100;

    formControl.setValue('');
    expect(component['remainingCharacterCount']()).toBe(100);
  });
});
