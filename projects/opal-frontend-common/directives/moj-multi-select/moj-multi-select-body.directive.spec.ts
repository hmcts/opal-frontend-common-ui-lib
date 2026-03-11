import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { GovukCheckboxesItemComponent } from '../../components/govuk/govuk-checkboxes/govuk-checkboxes-item/govuk-checkboxes-item.component';
import { MojMultiSelectBodyDirective } from './moj-multi-select-body.directive';

@Component({
  standalone: true,
  imports: [GovukCheckboxesItemComponent, MojMultiSelectBodyDirective],
  template: `
    <opal-lib-govuk-checkboxes-item
      opalLibMojMultiSelectBody
      [control]="control"
      inputId="row-a"
      inputName="row-a"
      labelText="Row A"
      [rowId]="rowId"
      [rowIndex]="rowIndex"
      [ariaLabel]="ariaLabel"
      [extraClasses]="extraClasses"
      (selectionChange)="onSelectionChange($event)"
    ></opal-lib-govuk-checkboxes-item>
  `,
})
class BodyHostComponent {
  public control = new FormControl(false);
  public rowId: string = 'row-a';
  public rowIndex = 1;
  public ariaLabel = '';
  public extraClasses = '';
  public onSelectionChange = vi.fn();
}

describe('MojMultiSelectBodyDirective', () => {
  let fixture: ComponentFixture<BodyHostComponent>;
  let hostComponent: BodyHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BodyHostComponent);
    hostComponent = fixture.componentInstance;
  });

  it('should add moj body classes to host', () => {
    fixture.detectChanges();

    const hostElement = fixture.nativeElement.querySelector('opal-lib-govuk-checkboxes-item') as HTMLElement;

    expect(hostElement.classList.contains('moj-multi-select__checkbox')).toBe(true);
    expect(hostElement.classList.contains('body-checkbox')).toBe(true);
  });

  it('should apply default aria label from row index', () => {
    hostComponent.ariaLabel = '';
    hostComponent.rowIndex = 2;
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(input.getAttribute('aria-label')).toBe('Select row 3');
  });

  it('should emit row id and checked state when checkbox changes', () => {
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(hostComponent.onSelectionChange).toHaveBeenCalledWith({ rowId: 'row-a', checked: true });
  });

  it('should apply custom classes and custom aria label', () => {
    hostComponent.extraClasses = 'custom-class';
    hostComponent.ariaLabel = 'Select defendant A';
    fixture.detectChanges();

    const hostElement = fixture.nativeElement.querySelector('opal-lib-govuk-checkboxes-item') as HTMLElement;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(hostElement.classList.contains('custom-class')).toBe(true);
    expect(input.getAttribute('aria-label')).toBe('Select defendant A');
  });
});
