import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, AbstractControl } from '@angular/forms';
import { GovukTextAreaComponent } from './govuk-text-area.component';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, afterAll, it, expect } from 'vitest';

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
      throw new Error('component returned null');
    }

    const control: FormControl = new FormControl();
    component.control = control;
    expect(component.getControl).toBe(control);
  });

  it('should calculate the remaining character count correctly', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const control: AbstractControl = new FormControl('Hello, World!');
    component.control = control;
    expect(component['remainingCharacterCount']()).toBe(500 - 13);
  });

  it('should update remainingCharacterCount when form control value changes', () => {
    if (!component) {
      throw new Error('component returned null');
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
      throw new Error('component returned null');
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

  it('should set aria-describedby with hint only', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
    }

    fixture.componentRef.setInput('hintText', 'Hint text');
    fixture.componentRef.setInput('errors', null);
    fixture.componentRef.setInput('characterCountEnabled', false);
    fixture.detectChanges();

    const textarea = fixture.debugElement.query(By.css('#test')).nativeElement;
    expect(textarea.getAttribute('aria-describedby')).toBe('test-hint');
  });

  it('should set aria-describedby with error only', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
    }

    fixture.componentRef.setInput('hintText', '');
    fixture.componentRef.setInput('errors', 'Error message');
    fixture.componentRef.setInput('characterCountEnabled', false);
    fixture.detectChanges();

    const textarea = fixture.debugElement.query(By.css('#test')).nativeElement;
    expect(textarea.getAttribute('aria-describedby')).toBe('test-error-message');
  });

  it('should set aria-describedby with hint, error, and character count', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
    }

    fixture.componentRef.setInput('hintText', 'Hint text');
    fixture.componentRef.setInput('errors', 'Error message');
    fixture.componentRef.setInput('characterCountEnabled', true);
    fixture.detectChanges();

    const textarea = fixture.debugElement.query(By.css('#test')).nativeElement;
    expect(textarea.getAttribute('aria-describedby')).toBe('test-hint test-error-message test-with-hint-info');
  });

  it('should set aria-describedby with character count only', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
    }

    fixture.componentRef.setInput('hintText', '');
    fixture.componentRef.setInput('errors', null);
    fixture.componentRef.setInput('characterCountEnabled', true);
    fixture.detectChanges();

    const textarea = fixture.debugElement.query(By.css('#test')).nativeElement;
    expect(textarea.getAttribute('aria-describedby')).toBe('test-with-hint-info');
  });

  it('should not set aria-describedby when hint, error, and character count are missing', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
    }

    fixture.componentRef.setInput('hintText', '');
    fixture.componentRef.setInput('errors', null);
    fixture.componentRef.setInput('characterCountEnabled', false);
    fixture.detectChanges();

    const textarea = fixture.debugElement.query(By.css('#test')).nativeElement;
    expect(textarea.getAttribute('aria-describedby')).toBeNull();
  });
});
