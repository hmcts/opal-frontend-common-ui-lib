import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTabsComponent } from './govuk-tabs.component';
import { Component } from '@angular/core';
import { addGdsBodyClass } from '../helpers/add-gds-body-class';

@Component({
  template: `<opal-lib-govuk-tabs>
    <ng-container tab-list-items><li>Test Tab</li></ng-container>
    <ng-container tab-panels><div class="govuk-tabs__panel">Test Panel</div></ng-container>
  </opal-lib-govuk-tabs>`,
  imports: [GovukTabsComponent],
})
class TestHostComponent {}

describe('GovukTabsComponent', () => {
  let component: TestHostComponent | null;
  let fixture: ComponentFixture<TestHostComponent> | null;

  beforeAll(addGdsBodyClass);
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
    const element = fixture.nativeElement.querySelector('.govuk-tabs__list');
    expect(element.innerText).toContain('Test Tab');
  });

  it('should render into panels ng-content', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }
    const element = fixture.nativeElement.querySelector('.govuk-tabs__panel');
    expect(element.innerText).toContain('Test Panel');
  });
});
