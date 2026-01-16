import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GovukTextInputComponent } from './govuk-text-input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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

  it('should set aria-describedby with hint only', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    fixture.componentRef.setInput('hintText', 'Hint text');
    fixture.componentRef.setInput('errors', null);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('#test')).nativeElement;
    expect(input.getAttribute('aria-describedby')).toBe('test-hint');
  });

  it('should set aria-describedby with hintHtml only', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    fixture.componentRef.setInput('hintText', '');
    fixture.componentRef.setInput('hintHtml', true);
    fixture.componentRef.setInput('errors', null);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('#test')).nativeElement;
    expect(input.getAttribute('aria-describedby')).toBe('test-hint');
  });

  it('should set aria-describedby with error only', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    fixture.componentRef.setInput('hintText', '');
    fixture.componentRef.setInput('hintHtml', false);
    fixture.componentRef.setInput('errors', 'Error message');
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('#test')).nativeElement;
    expect(input.getAttribute('aria-describedby')).toBe('test-error-message');
  });

  it('should set aria-describedby with hint and error', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    fixture.componentRef.setInput('hintText', 'Hint text');
    fixture.componentRef.setInput('hintHtml', false);
    fixture.componentRef.setInput('errors', 'Error message');
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('#test')).nativeElement;
    expect(input.getAttribute('aria-describedby')).toBe('test-hint test-error-message');
  });

  it('should not set aria-describedby when hint and error are missing', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    fixture.componentRef.setInput('hintText', '');
    fixture.componentRef.setInput('hintHtml', false);
    fixture.componentRef.setInput('errors', null);
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('#test')).nativeElement;
    expect(input.getAttribute('aria-describedby')).toBeNull();
  });
});
