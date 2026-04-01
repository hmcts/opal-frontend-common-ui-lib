import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukSummaryCardListComponent } from './govuk-summary-card-list.component';
import { Component } from '@angular/core';
import { describe, beforeEach, afterAll, it, expect } from 'vitest';

@Component({
  template: `<opal-lib-govuk-summary-card-list summaryCardListId="test" cardTitle="Testing Summary Card List"
    ><li actions>Test</li>
    <p content>Hello World</p></opal-lib-govuk-summary-card-list
  >`,
  imports: [GovukSummaryCardListComponent],
})
class TestHostComponent {}

describe('GovukSummaryCardListComponent', () => {
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

  it('should render card title and content correctly', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    const element = fixture.nativeElement;

    // Check the card title
    const cardTitle = element.querySelector('.govuk-summary-card__title')?.textContent?.trim();
    expect(cardTitle).toBe('Testing Summary Card List');

    // Check for the presence of the li element with the word 'Test'
    const liElement = element.querySelector('.govuk-summary-card__actions li');
    expect(liElement).toBeTruthy();
    expect(liElement?.textContent?.trim()).toBe('Test');

    // Check the content
    const content = element.querySelector('.govuk-summary-card__content p')?.textContent?.trim();
    expect(content).toBe('Hello World');

    // Check the id
    const id = element.querySelector('#test-summary-card-list');
    expect(id).toBeTruthy();
  });
});
