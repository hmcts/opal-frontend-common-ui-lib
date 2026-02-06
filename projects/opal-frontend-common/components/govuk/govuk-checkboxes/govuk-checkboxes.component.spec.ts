import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukCheckboxesComponent } from './govuk-checkboxes.component';
import { Component } from '@angular/core';
import { describe, beforeEach, afterAll, it, expect } from 'vitest';

@Component({
  template: `<opal-lib-govuk-checkboxes
    [fieldSetId]="fieldSetId"
    [legendText]="legendText"
    [legendHint]="legendHint"
    [legendClasses]="legendClasses"
    [checkboxClasses]="checkboxClasses"
    [errors]="errors"
  >
    Hello World</opal-lib-govuk-checkboxes
  >`,
  imports: [GovukCheckboxesComponent],
})
class TestHostComponent {
  fieldSetId = 'test';
  legendText = 'Legend Text';
  legendHint = 'Legend Hint';
  legendClasses = 'legend-class';
  checkboxClasses = 'checkbox-class';
  errors: string | null = null;
}
describe('GovukCheckboxesNewComponent', () => {
  let component: TestHostComponent | null;
  let fixture: ComponentFixture<TestHostComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  afterAll(() => {
    fixture = null;
    component = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render into the Legend Text', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
      return;
    }
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('#test > .govuk-fieldset__legend ');
    expect(element.textContent?.trim()).toBe('Legend Text');
  });

  it('should render into the Legend Hint', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
      return;
    }

    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('#test-hint');
    expect(element.textContent?.trim()).toBe('Legend Hint');
  });

  it('should add a legend class', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
      return;
    }

    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('#test > .govuk-fieldset__legend.legend-class');
    expect(element.textContent?.trim()).toBe('Legend Text');
  });

  it('should add a checkbox class', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
      return;
    }

    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('#test > .checkbox-class');
    expect(element.textContent?.trim()).toBe('Hello World');
  });

  it('should set aria-describedby with hint only', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    fixture.detectChanges();
    const fieldset = fixture.nativeElement.querySelector('#test');
    expect(fieldset.getAttribute('aria-describedby')).toBe('test-hint');
  });

  it('should set aria-describedby with error only', () => {
    if (!fixture || !component) {
      throw new Error('component or fixture returned null');
    }

    component.legendHint = '';
    component.errors = 'Error';
    fixture.detectChanges();

    const fieldset = fixture.nativeElement.querySelector('#test');
    expect(fieldset.getAttribute('aria-describedby')).toBe('test-error-message');
  });

  it('should set aria-describedby with hint and error', () => {
    if (!fixture || !component) {
      throw new Error('component or fixture returned null');
    }

    component.errors = 'Error';
    fixture.detectChanges();

    const fieldset = fixture.nativeElement.querySelector('#test');
    expect(fieldset.getAttribute('aria-describedby')).toBe('test-hint test-error-message');
  });

  it('should not set aria-describedby when hint and error are missing', () => {
    if (!fixture || !component) {
      throw new Error('component or fixture returned null');
    }

    component.legendHint = '';
    component.errors = null;
    fixture.detectChanges();

    const fieldset = fixture.nativeElement.querySelector('#test');
    expect(fieldset.getAttribute('aria-describedby')).toBeNull();
  });
});
