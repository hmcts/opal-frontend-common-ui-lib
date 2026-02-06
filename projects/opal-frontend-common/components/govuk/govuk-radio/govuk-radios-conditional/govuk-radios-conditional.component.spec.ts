import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukRadiosConditionalComponent } from './govuk-radios-conditional.component';
import { Component } from '@angular/core';
import { GovukRadiosItemComponent } from '../govuk-radios-item/govuk-radios-item.component';
import { FormControl } from '@angular/forms';
import { describe, beforeEach, afterAll, it, expect } from 'vitest';

@Component({
  template: `
    <div
      opal-lib-govuk-radios-item
      labelText="Option"
      inputId="option"
      inputName="group"
      inputValue="option"
      ariaControls="test-panel"
      [control]="control"
    ></div>
    <opal-lib-govuk-radios-conditional conditionalId="test-panel"> Hello World</opal-lib-govuk-radios-conditional>
  `,
  imports: [GovukRadiosConditionalComponent, GovukRadiosItemComponent],
})
class TestHostComponent {
  control = new FormControl(null);
}
describe('GovukRadiosConditionalComponent', () => {
  let component: TestHostComponent | null;
  let fixture: ComponentFixture<TestHostComponent> | null;

  beforeEach(async () => {
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

  it('should create with id', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('#test-panel');
    expect(element.textContent?.trim()).toBe('Hello World');
  });

  it('should render the conditional panel hidden by default', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('#test-panel');
    expect(element.classList.contains('govuk-radios__conditional--hidden')).toBe(true);
  });

  it('should match aria-controls with the conditional panel id', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
      return;
    }

    const input = fixture.nativeElement.querySelector('input[type="radio"]');
    const panel = fixture.nativeElement.querySelector('#test-panel');
    expect(input.getAttribute('aria-controls')).toBe(panel.getAttribute('id'));
    expect(input.getAttribute('aria-expanded')).toBeNull();
  });
});
