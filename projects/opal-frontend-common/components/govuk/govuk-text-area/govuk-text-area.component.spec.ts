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

  it('should update remainingCharacterCount when form control value changes', () => {
    if (!component) {
      fail('component returned null');
      return;
    }
    component.maxCharacterLimit = 100;

    const control: FormControl = new FormControl('initial');
    component.control = control;
    expect(component['remainingCharacterCount']()).toBe(93); // 100 - 7

    control.setValue('new value');
    expect(component['remainingCharacterCount']()).toBe(91); // 100 - 9
  });

  it('should handle null and undefined values in valueChanges subscription', () => {
    if (!component) {
      fail('component returned null');
      return;
    }
    component.maxCharacterLimit = 100;

    const control: FormControl = new FormControl('initial');
    component.control = control;
    expect(component['remainingCharacterCount']()).toBe(93); // 100 - 7

    control.setValue(null);
    expect(component['remainingCharacterCount']()).toBe(100); // 100 - 0 (empty string)

    control.setValue(undefined);
    expect(component['remainingCharacterCount']()).toBe(100); // 100 - 0 (empty string)

    control.setValue('');
    expect(component['remainingCharacterCount']()).toBe(100); // 100 - 0
  });
});
