import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTagComponent } from './govuk-tag.component';
import { Component } from '@angular/core';
import { describe, beforeEach, afterAll, it, expect } from 'vitest';
@Component({
  template: `<opal-lib-govuk-tag tagId="test" tagClasses="test-class">Test</opal-lib-govuk-tag>`,
  imports: [GovukTagComponent],
})
class TestHostComponent {}
describe('GovukTagComponent', () => {
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

  it('should add the id', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    const element = fixture.nativeElement.querySelector('#test');

    expect(element).not.toBe(null);
  });

  it('should add the class', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    const element = fixture.nativeElement.querySelector('.test-class');

    expect(element).not.toBe(null);
  });

  it('should render into  ng-content', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    const element = fixture.nativeElement.querySelector('#test');
    expect(element.textContent?.trim()).toBe('Test');
  });
});
