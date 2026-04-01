import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
import { GovukTextInputPrefixSuffixComponent } from './govuk-text-input-prefix-suffix.component';
import { describe, beforeEach, afterAll, it, expect } from 'vitest';

describe('GovukTextInputPrefixSuffixComponent', () => {
  let component: GovukTextInputPrefixSuffixComponent | null;
  let fixture: ComponentFixture<GovukTextInputPrefixSuffixComponent> | null;
  let formControl: FormControl | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukTextInputPrefixSuffixComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukTextInputPrefixSuffixComponent);
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
      throw new Error('fixture returned null');
    }

    const elem = fixture.debugElement.query(By.css('.govuk-label.govuk-label--l')).nativeElement;
    expect(elem).toBeTruthy();
  });

  it('should have labelText', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    const elem = fixture.debugElement.query(By.css('.govuk-label.govuk-label--l')).nativeElement;
    expect(elem.textContent).toContain('test');
  });

  it('should have extra input classes', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
    }

    const labelClass = 'govuk-input--width-20';
    component.inputClasses = labelClass;
    fixture.detectChanges();

    const elem = fixture.debugElement.query(By.css('.govuk-input'));

    const cdr = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
    cdr.detectChanges();

    expect(elem.classes[labelClass]).toBeTruthy();
  });

  it('should have a prefix and suffix attached to the input', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
    }

    component.prefixText = '£';
    component.suffixText = 'per item';
    fixture.detectChanges();

    const cdr = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
    cdr.detectChanges();

    const prefixElem = fixture.debugElement.query(By.css('.govuk-input__prefix'));
    const suffixElem = fixture.debugElement.query(By.css('.govuk-input__suffix'));

    expect(prefixElem.nativeElement.textContent.trim()).toBe(component.prefixText);
    expect(suffixElem.nativeElement.textContent.trim()).toBe(component.suffixText);
  });

  it('should format value to two decimal places on blur', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
    }

    // Arrange
    const value = '10.123';
    component['_control'].setValue(value);

    // Act
    component.onBlurFormatToTwoDecimalPlaces();

    // Assert
    expect(component['_control'].value).toBe('10.123');
  });

  it('should not format value if it is already formatted to two decimal places on blur', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
    }

    // Arrange
    const value = '10.1';
    component['_control'].setValue(value);

    // Act
    component.onBlurFormatToTwoDecimalPlaces();

    // Assert
    expect(component['_control'].value).toBe('10.10');
  });

  it('should not format value if it is not a number on blur', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    // Arrange
    const value = 'abc';
    component['_control'].setValue(value);

    // Act
    component.onBlurFormatToTwoDecimalPlaces();

    // Assert
    expect(component['_control'].value).toBe(value);
  });

  it('should set aria-describedby with error only', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
    }

    fixture.componentRef.setInput('errors', 'Error message');
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('#test')).nativeElement;
    expect(input.getAttribute('aria-describedby')).toBe('test-error-message');
  });

  it('should not set aria-describedby when error is missing', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
    }

    fixture.componentRef.setInput('errors', null);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('#test')).nativeElement;
    expect(input.getAttribute('aria-describedby')).toBeNull();
  });
});
