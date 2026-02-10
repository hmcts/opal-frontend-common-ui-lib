import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTaskListComponent } from './govuk-task-list.component';
import { Component } from '@angular/core';
import { describe, beforeEach, afterAll, it, expect } from 'vitest';

@Component({
  template: `<opal-lib-govuk-task-list taskListId="test" taskListClasses="test-class"
    >Hello World</opal-lib-govuk-task-list
  >`,
  imports: [GovukTaskListComponent],
})
class TestHostComponent {}

describe('GovukTaskListComponent', () => {
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

  it('should render into list ng-content', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    const element = fixture.nativeElement.querySelector('#test');
    expect(element.textContent?.trim()).toBe('Hello World');
  });

  it('should have the added class', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    const element = fixture.nativeElement.querySelector('.test-class');
    expect(element.textContent?.trim()).toBe('Hello World');
  });
});
