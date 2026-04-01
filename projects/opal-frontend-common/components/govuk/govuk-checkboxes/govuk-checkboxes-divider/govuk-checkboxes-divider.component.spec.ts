import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukCheckboxesDividerComponent } from './govuk-checkboxes-divider.component';
import { Component } from '@angular/core';
import { describe, beforeEach, afterAll, it, expect } from 'vitest';

@Component({
  template: `<opal-lib-govuk-checkboxes-divider> Hello World</opal-lib-govuk-checkboxes-divider>`,
  imports: [GovukCheckboxesDividerComponent],
})
class TestHostComponent {}
describe('GovukCheckboxesDividerComponent', () => {
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

  it('should project the ng-content', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }
    const element = fixture.nativeElement.querySelector('.govuk-checkboxes__divider');
    expect(element.textContent?.trim()).toBe('Hello World');
  });
});
