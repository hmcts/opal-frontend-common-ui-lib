import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, it, expect } from 'vitest';
import { GovukButtonDirective } from './govuk-button.directive';

@Component({
  template: `
    <button
      opalLibGovukButton
      buttonId="host-button"
      buttonClasses="extra-class"
      type="button"
      (buttonClickEvent)="clicked = $event"
    >
      Action
    </button>
  `,
  imports: [GovukButtonDirective],
})
class TestHostComponent {
  clicked = false;
}

describe('GovukButtonDirective', () => {
  let directive: GovukButtonDirective;

  beforeEach(() => {
    directive = new GovukButtonDirective();
  });
  it('should create an instance', () => {
    const directive = new GovukButtonDirective();
    expect(directive).toBeTruthy();
  });

  it('should bind the id attribute from buttonId input', () => {
    directive.buttonId = 'test-id';
    expect(directive.id).toEqual('test-id');
  });

  it('should bind the type attribute from type input', () => {
    directive.buttonId = 'btn'; // Required input
    directive.type = 'button';
    expect(directive.buttonType).toEqual('button');

    directive.type = 'reset';
    expect(directive.buttonType).toEqual('reset');
  });

  it('should compute the correct classes', () => {
    directive.buttonId = 'btn';
    directive.buttonClasses = '';
    expect(directive.classes).toEqual('govuk-button');

    directive.buttonClasses = 'extra-class';
    expect(directive.classes).toEqual('govuk-button extra-class');
  });

  it('should have the dataModule attribute set to "govuk-button"', () => {
    expect(directive.dataModule).toEqual('govuk-button');
  });

  it('should emit buttonClickEvent on handleButtonClick()', async () => {
    directive.buttonId = 'btn'; // Required input to instantiate properly
    directive.buttonClickEvent.subscribe((value) => {
      expect(value).toBe(true);
    });
    directive.handleButtonClick();
  });

  it('should bind host attributes and emit from a template', () => {
    const fixture: ComponentFixture<TestHostComponent> = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.id).toBe('host-button');
    expect(button.type).toBe('button');
    expect(button.classList.contains('govuk-button')).toBe(true);
    expect(button.classList.contains('extra-class')).toBe(true);
    expect(button.getAttribute('data-module')).toBe('govuk-button');

    const hostDirective = fixture.debugElement
      .query(By.directive(GovukButtonDirective))
      .injector.get(GovukButtonDirective);
    hostDirective.handleButtonClick();

    expect(fixture.componentInstance.clicked).toBe(true);
  });
});
