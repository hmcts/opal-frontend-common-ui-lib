import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukSummaryListComponent } from './govuk-summary-list.component';
import { Component } from '@angular/core';

@Component({
  template: `<opal-lib-govuk-summary-list summaryListId="test">Hello World</opal-lib-govuk-summary-list>`,
  imports: [GovukSummaryListComponent],
})
class TestHostComponent {}

describe('GovukSummaryListComponent', () => {
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
      fail('fixture returned null');
      return;
    }
    const element = fixture.nativeElement.querySelector('#test');
    expect(element.innerText).toBe('Hello World');
  });
});
