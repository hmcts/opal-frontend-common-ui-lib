import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { GovukCheckboxesItemComponent } from '../../components/govuk/govuk-checkboxes/govuk-checkboxes-item/govuk-checkboxes-item.component';
import { MojMultiSelectHeadDirective } from './moj-multi-select-head.directive';

@Component({
  standalone: true,
  imports: [GovukCheckboxesItemComponent, MojMultiSelectHeadDirective],
  template: `
    <opal-lib-govuk-checkboxes-item
      opalLibMojMultiSelectHead
      [control]="control"
      inputId="select-all"
      inputName="select-all"
      labelText="Select all"
      [selectAllIndeterminate]="selectAllIndeterminate"
      [extraClasses]="extraClasses"
      [ariaLabel]="ariaLabel"
      (toggleAll)="onToggleAll($event)"
    ></opal-lib-govuk-checkboxes-item>
  `,
})
class HeadHostComponent {
  public control = new FormControl(false);
  public selectAllIndeterminate = false;
  public extraClasses = '';
  public ariaLabel = 'Select all rows';
  public onToggleAll = vi.fn();
}

describe('MojMultiSelectHeadDirective', () => {
  let fixture: ComponentFixture<HeadHostComponent>;
  let hostComponent: HeadHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeadHostComponent);
    hostComponent = fixture.componentInstance;
  });

  it('should add moj multi-select classes to host', () => {
    fixture.detectChanges();

    const hostElement = fixture.nativeElement.querySelector('opal-lib-govuk-checkboxes-item') as HTMLElement;

    expect(hostElement.classList.contains('govuk-checkboxes--small')).toBe(true);
    expect(hostElement.classList.contains('moj-multi-select__checkbox')).toBe(true);
  });

  it('should apply indeterminate state and aria label to input', () => {
    hostComponent.selectAllIndeterminate = true;
    hostComponent.ariaLabel = 'Select all defendants';
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(input.indeterminate).toBe(true);
    expect(input.getAttribute('aria-label')).toBe('Select all defendants');
  });

  it('should emit toggleAll when checkbox changes', () => {
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(hostComponent.onToggleAll).toHaveBeenCalledWith(true);
  });

  it('should apply extra classes', () => {
    hostComponent.extraClasses = 'custom-class';
    fixture.detectChanges();

    const hostElement = fixture.nativeElement.querySelector('opal-lib-govuk-checkboxes-item') as HTMLElement;

    expect(hostElement.classList.contains('custom-class')).toBe(true);
  });
});
