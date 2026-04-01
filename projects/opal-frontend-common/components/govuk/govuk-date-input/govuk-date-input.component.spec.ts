import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukDateInputComponent } from './govuk-date-input.component';
import { FormControl, FormGroup } from '@angular/forms';
import { GOVUK_DATE_INPUTS_MOCK } from './mocks/govuk-date-inputs.mock';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, afterAll, it, expect } from 'vitest';

describe('GovukDateInputComponent', () => {
  let component: GovukDateInputComponent | null;
  let fixture: ComponentFixture<GovukDateInputComponent> | null;
  let formGroup: FormGroup | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukDateInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukDateInputComponent);
    component = fixture.componentInstance;
    formGroup = new FormGroup({
      dayOfBirth: new FormControl(),
      monthOfBirth: new FormControl(),
      yearOfBirth: new FormControl(),
    });

    component.group = formGroup;
    component.fieldSetId = 'dateOfBirth';
    component.legendText = 'Date of Birth';
    component.legendHint = 'For example, 04 06 1991';
    component.legendClasses = 'test-class';
    component.dateInputs = GOVUK_DATE_INPUTS_MOCK;

    fixture.detectChanges();
  });

  afterAll(() => {
    fixture = null;
    component = null;
    formGroup = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have legend text', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    const elem = fixture.debugElement.query(By.css('#dateOfBirth .govuk-fieldset__legend')).nativeElement;

    expect(elem.textContent).toContain('Date of Birth');
  });

  it('should have legend hint', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    const elem = fixture.debugElement.query(By.css('#dateOfBirth #dateOfBirth-hint')).nativeElement;

    expect(elem.textContent).toContain('For example, 04 06 1991');
  });

  it('should have date inputs', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    const day = fixture.debugElement.query(By.css('#dateOfBirth #dayOfBirth')).nativeElement;
    const month = fixture.debugElement.query(By.css('#dateOfBirth #monthOfBirth')).nativeElement;
    const year = fixture.debugElement.query(By.css('#dateOfBirth #yearOfBirth')).nativeElement;

    expect(day).toBeTruthy();
    expect(month).toBeTruthy();
    expect(year).toBeTruthy();
  });

  it('should have added a class to the legend', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    const elem = fixture.debugElement.query(By.css('#dateOfBirth .govuk-fieldset__legend.test-class')).nativeElement;
    expect(elem).toBeTruthy();
  });

  it('should have added a class to the day input', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    const day = fixture.debugElement.query(By.css('#dateOfBirth #dayOfBirth.govuk-input--width-2')).nativeElement;
    const month = fixture.debugElement.query(By.css('#dateOfBirth #monthOfBirth.govuk-input--width-2')).nativeElement;
    const year = fixture.debugElement.query(By.css('#dateOfBirth #yearOfBirth.govuk-input--width-4')).nativeElement;

    expect(day).toBeTruthy();
    expect(month).toBeTruthy();
    expect(year).toBeTruthy();
  });

  it('should set aria-describedby with hint only', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
    }

    fixture.componentRef.setInput('legendHint', 'For example, 04 06 1991');
    fixture.componentRef.setInput('errorDay', null);
    fixture.componentRef.setInput('errorMonth', null);
    fixture.componentRef.setInput('errorYear', null);
    fixture.detectChanges();

    const fieldset = fixture.debugElement.query(By.css('#dateOfBirth')).nativeElement;
    expect(fieldset.getAttribute('aria-describedby')).toBe('dateOfBirth-hint');
  });

  it('should set aria-describedby with error only', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
    }

    fixture.componentRef.setInput('legendHint', '');
    fixture.componentRef.setInput('errorDay', 'Day error');
    fixture.componentRef.setInput('errorMonth', null);
    fixture.componentRef.setInput('errorYear', null);
    fixture.detectChanges();

    const fieldset = fixture.debugElement.query(By.css('#dateOfBirth')).nativeElement;
    expect(fieldset.getAttribute('aria-describedby')).toBe('dateOfBirth-error-message');
  });

  it('should set aria-describedby with hint and error', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
    }

    fixture.componentRef.setInput('legendHint', 'For example, 04 06 1991');
    fixture.componentRef.setInput('errorDay', null);
    fixture.componentRef.setInput('errorMonth', 'Month error');
    fixture.componentRef.setInput('errorYear', null);
    fixture.detectChanges();

    const fieldset = fixture.debugElement.query(By.css('#dateOfBirth')).nativeElement;
    expect(fieldset.getAttribute('aria-describedby')).toBe('dateOfBirth-hint dateOfBirth-error-message');
  });

  it('should not set aria-describedby when hint and errors are missing', () => {
    if (!component || !fixture) {
      throw new Error('component or fixture returned null');
    }

    fixture.componentRef.setInput('legendHint', '');
    fixture.componentRef.setInput('errorDay', null);
    fixture.componentRef.setInput('errorMonth', null);
    fixture.componentRef.setInput('errorYear', null);
    fixture.detectChanges();

    const fieldset = fixture.debugElement.query(By.css('#dateOfBirth')).nativeElement;
    expect(fieldset.getAttribute('aria-describedby')).toBeNull();
  });
});
