import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukRadiosConditionalComponent } from './govuk-radios-conditional.component';
import { Component } from '@angular/core';

@Component({
  template: `<opal-lib-govuk-radios-conditional conditionalId="test"> Hello World</opal-lib-govuk-radios-conditional>`,
  imports: [GovukRadiosConditionalComponent],
})
class TestHostComponent {}
describe('GovukRadiosConditionalComponent', () => {
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
