import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTabsComponent } from './govuk-tabs.component';
import { Component } from '@angular/core';
import { addGdsBodyClass } from '../helpers/add-gds-body-class';

@Component({
  template: `<opal-lib-govuk-tabs tabsId="test"
    ><span items>Test Content</span><span panels>More Test Content</span></opal-lib-govuk-tabs
  >`,
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
    expect(element.innerText).toBe('Test Content');
  });

  it('should render into panels ng-content', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }
    const element = fixture.nativeElement.querySelector('.govuk-tabs > span');
    expect(element.innerText).toBe('More Test Content');
  });
});
