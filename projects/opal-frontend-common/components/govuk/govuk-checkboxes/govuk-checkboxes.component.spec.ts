import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukCheckboxesComponent } from './govuk-checkboxes.component';
import { Component } from '@angular/core';

@Component({
  template: `<opal-lib-govuk-checkboxes
    fieldSetId="test"
    legendText="Legend Text"
    legendHint="Legend Hint"
    legendClasses="legend-class"
    checkboxClasses="checkbox-class"
  >
    Hello World</opal-lib-govuk-checkboxes
  >`,
  imports: [GovukCheckboxesComponent],
})
class TestHostComponent {}
describe('GovukCheckboxesNewComponent', () => {
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

  it('should render into the Legend Text', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }
    const element = fixture.nativeElement.querySelector('#test > .govuk-fieldset__legend ');
    expect(element.innerText).toBe('Legend Text');
  });

  it('should render into the Legend Hint', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('#testHint');
    expect(element.innerText).toBe('Legend Hint');
  });

  it('should add a legend class', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('#test > .govuk-fieldset__legend.legend-class');
    expect(element.innerText).toBe('Legend Text');
  });

  it('should add a checkbox class', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const element = fixture.nativeElement.querySelector('#test > .checkbox-class');
    expect(element.innerText).toBe('Hello World');
  });
});
