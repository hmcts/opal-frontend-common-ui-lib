import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukRadioComponent } from './govuk-radio.component';
import { Component } from '@angular/core';

@Component({
  template: `<opal-lib-govuk-radio
    [fieldSetId]="fieldSetId"
    [legendText]="legendText"
    [legendHint]="legendHint"
    [legendClasses]="legendClasses"
    [radioClasses]="radioClasses"
    [errors]="errors"
  >
    <input class="govuk-radios__input" id="test-radio" name="test-radio" type="radio" value="test" />
    Hello World</opal-lib-govuk-radio
  >`,
  imports: [GovukRadioComponent],
})
class TestHostComponent {
  fieldSetId = 'test';
  legendText = 'Legend Text';
  legendHint = 'Legend Hint';
  legendClasses = 'legend-class';
  radioClasses = 'radio-class';
  errors: string | null = null;
}
describe('GovukRadioComponent', () => {
  let component: TestHostComponent | null;
  let fixture: ComponentFixture<TestHostComponent> | null;

  beforeEach(async () => {
    document.body.classList.add('govuk-frontend-supported');

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('#test > .govuk-fieldset__legend ');
    expect(element.innerText).toBe('Legend Text');
  });

  it('should render into the Legend Hint', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('#test-hint');
    expect(element.innerText).toBe('Legend Hint');
  });

  it('should add a legend class', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('#test > .govuk-fieldset__legend.legend-class');
    expect(element.innerText).toBe('Legend Text');
  });

  it('should add a radio class', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }
    const element = fixture.nativeElement.querySelector('#test > .radio-class');
    expect(element.textContent?.trim()).toBe('Hello World');
  });

  it('should set aria-describedby with hint only', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const fieldset = fixture.nativeElement.querySelector('#test');
    expect(fieldset.getAttribute('aria-describedby')).toBe('test-hint');
  });

  it('should set aria-describedby with error only', () => {
    if (!fixture || !component) {
      fail('component or fixture returned null');
      return;
    }

    component.legendHint = '';
    component.errors = 'Error';
    fixture.detectChanges();

    const fieldset = fixture.nativeElement.querySelector('#test');
    expect(fieldset.getAttribute('aria-describedby')).toBe('test-error-message');
  });

  it('should set aria-describedby with hint and error', () => {
    if (!fixture || !component) {
      fail('component or fixture returned null');
      return;
    }

    component.errors = 'Error';
    fixture.detectChanges();

    const fieldset = fixture.nativeElement.querySelector('#test');
    expect(fieldset.getAttribute('aria-describedby')).toBe('test-hint test-error-message');
  });

  it('should not set aria-describedby when hint and error are missing', () => {
    if (!fixture || !component) {
      fail('component or fixture returned null');
      return;
    }

    component.legendHint = '';
    component.errors = null;
    fixture.detectChanges();

    const fieldset = fixture.nativeElement.querySelector('#test');
    expect(fieldset.getAttribute('aria-describedby')).toBeNull();
  });
});
