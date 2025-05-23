import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukTabPanelComponent } from './govuk-tab-panel.component';
import { Component } from '@angular/core';

@Component({
  template: `<opal-lib-govuk-tab-panel tabsId="testOne" tabsPanelId="testTwo">Hello World</opal-lib-govuk-tab-panel>`,
  imports: [GovukTabPanelComponent],
})
class TestHostComponent {}
describe('GovukTabPanelComponent', () => {
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

    const element = fixture.nativeElement.querySelector('#testOneTestTwo');
    expect(element.innerText).toBe('Hello World');
  });
});
