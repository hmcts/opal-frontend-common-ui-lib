import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukCheckboxesConditionalComponent } from './govuk-checkboxes-conditional.component';
import { Component } from '@angular/core';
import { describe, beforeEach, afterAll, it, expect } from 'vitest';

@Component({
  template: `<opal-lib-govuk-checkboxes-conditional conditionalId="test">
    Hello World</opal-lib-govuk-checkboxes-conditional
  >`,
  imports: [GovukCheckboxesConditionalComponent],
})
class TestHostComponent {}
describe('GovukCheckboxesConditionalComponent', () => {
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
    }
    const element = fixture.nativeElement.querySelector('#test-conditional');
    expect(element.textContent?.trim()).toBe('Hello World');
  });
});
