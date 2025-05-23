import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukCheckboxesConditionalComponent } from './govuk-checkboxes-conditional.component';
import { Component } from '@angular/core';

@Component({
  template: `<opal-lib-govuk-checkboxes-conditional conditionalId="test">
    Hello World</opal-lib-govuk-checkboxes-conditional
  >`,
  imports: [GovukCheckboxesConditionalComponent],
})
class TestHostComponent {}
describe('GovukCheckboxesConditionalComponent', () => {
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

  it('should create with id', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }
    const element = fixture.nativeElement.querySelector('#test-conditional');
    expect(element.innerText).toBe('Hello World');
  });
});
