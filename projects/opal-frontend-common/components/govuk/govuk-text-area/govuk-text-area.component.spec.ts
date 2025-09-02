import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, AbstractControl } from '@angular/forms';
import { GovukTextAreaComponent } from './govuk-text-area.component';

describe('GovukTextAreaComponent', () => {
  let component: GovukTextAreaComponent | null;
  let fixture: ComponentFixture<GovukTextAreaComponent> | null;
  let formControl: FormControl | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTextAreaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukTextAreaComponent);
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

  it('should set the control correctly', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const control: FormControl = new FormControl();
    component.control = control;
    expect(component.getControl).toBe(control);
  });

  it('should calculate the remaining character count correctly', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const control: AbstractControl = new FormControl('Hello, World!');
    component.control = control;
    expect(component['remainingCharacterCount']()).toBe(500 - 13);
  });

  it('should return the remaining character count when value is undefined', () => {
    if (!component) {
      fail('component returned null');
      return;
    }
    const control: AbstractControl = new FormControl(undefined);
    component.control = control;
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
