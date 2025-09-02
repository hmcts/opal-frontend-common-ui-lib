import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GovukTextInputComponent } from './govuk-text-input.component';
import { FormControl, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';

describe('GovukTextInputComponent', () => {
  let component: GovukTextInputComponent | null;
  let fixture: ComponentFixture<GovukTextInputComponent> | null;
  let formControl: FormControl | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTextInputComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukTextInputComponent);
    component = fixture.componentInstance;
    formControl = new FormControl(null);

    component.labelText = 'test';
    component.labelClasses = 'govuk-label--l';
    component.inputId = 'test';
    component.inputName = 'test';
    component.control = formControl;

    fixture.detectChanges();
  });

  afterAll(() => {
    fixture = null;
    component = null;
    formControl = null;

    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have extra label classes', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const elem = fixture.debugElement.query(By.css('.govuk-label.govuk-label--l')).nativeElement;
    expect(elem).toBeTruthy();
  });

  it('should have labelText', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const elem = fixture.debugElement.query(By.css('.govuk-label.govuk-label--l')).nativeElement;
    expect(elem.textContent).toContain('test');
  });

  it('should have extra input classes', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    const labelClass = 'govuk-input--width-20';
    component.inputClasses = labelClass;
    fixture.detectChanges();

    const elem = fixture.debugElement.query(By.css('.govuk-input'));

    const cdr = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
    cdr.detectChanges();

    expect(elem.classes[labelClass]).toBeTruthy();
  });

  it('should calculate the remaining character count correctly', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const control: AbstractControl = new FormControl('Hello, World!');
    component.control = control;
    component.maxCharacterLimit = 500;
    expect(component['remainingCharacterCount']()).toBe(500 - 13);
  });

  it('should return the remaining character count when value is undefined', () => {
    if (!component) {
      fail('component returned null');
      return;
    }
    const control: AbstractControl = new FormControl(undefined);
    component.control = control;
    component.maxCharacterLimit = 500;
    expect(component['remainingCharacterCount']()).toBe(500);
  });
  it('should initialize _controlValue signal with current form control value', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const control = new FormControl('initial value');
    component.control = control;

    expect(component['_controlValue']()).toBe('initial value');
  });

  it('should update _controlValue signal when form control value changes', () => {
    if (!component || !formControl) {
      fail('component or formControl returned null');
      return;
    }

    expect(component['_controlValue']()).toBe('');

    formControl.setValue('new value');
    expect(component['_controlValue']()).toBe('new value');
  });

  it('should convert null/undefined values to empty string in _controlValue signal', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const controlWithNull = new FormControl(null);
    component.control = controlWithNull;
    expect(component['_controlValue']()).toBe('');

    const controlWithUndefined = new FormControl(undefined);
    component.control = controlWithUndefined;
    expect(component['_controlValue']()).toBe('');

    const control = new FormControl('some text');
    component.control = control;
    expect(component['_controlValue']()).toBe('some text');

    control.setValue(null);
    expect(component['_controlValue']()).toBe('');
  });
});
