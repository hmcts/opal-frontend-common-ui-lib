import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GovukTabsPanelComponent } from './govuk-tabs-panel.component';
import { Component } from '@angular/core';

@Component({
  template: `<opal-lib-govuk-tabs-panel id="test-panel">Hello World</opal-lib-govuk-tabs-panel>`,
  imports: [GovukTabsPanelComponent],
})
class TestHostComponent {}
describe('GovukTabsPanelComponent', () => {
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
    const element = fixture.nativeElement.querySelector('#test-panel');
    expect(element.innerText).toContain('Hello World');
  });
});
