import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { CustomDateFilterComponent } from './custom-date-filter.component';
import type { ICustomDateFilterControls } from './interfaces/custom-date-filter-controls.interface';
import type { CustomDateFilterOption } from './types/custom-date-filter-option.type';

function createControls(dateFilter: CustomDateFilterOption | null = 'last7Days'): ICustomDateFilterControls {
  return {
    dateFilter: new FormControl<CustomDateFilterOption | null>(dateFilter),
    days: new FormControl<string | null>(''),
    dateFrom: new FormControl<string | null>(''),
    dateTo: new FormControl<string | null>(''),
  };
}

@Component({
  imports: [ReactiveFormsModule, CustomDateFilterComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input id="status" formControlName="status" />
      <opal-lib-custom-date-filter idPrefix="search" [controls]="form.controls" />
      <opal-lib-custom-date-filter idPrefix="archive" [controls]="archiveControls" />
      <button type="submit">Apply filters</button>
    </form>
  `,
})
class TestHostComponent {
  readonly form = new FormGroup({ status: new FormControl('open'), ...createControls() });
  readonly archiveControls = createControls();
  readonly submit = vi.fn();
}

describe('CustomDateFilterComponent', () => {
  let fixture: ComponentFixture<CustomDateFilterComponent>;
  let controls: ICustomDateFilterControls;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDateFilterComponent, TestHostComponent],
    }).compileComponents();
    controls = createControls();
    fixture = TestBed.createComponent(CustomDateFilterComponent);
    fixture.componentRef.setInput('controls', controls);
    fixture.componentRef.setInput('idPrefix', 'search');
  });

  it('renders the three date options without adding a form or submit button', () => {
    fixture.detectChanges();

    const radios: HTMLInputElement[] = Array.from(fixture.nativeElement.querySelectorAll('input[type="radio"]'));
    expect(radios.map((radio) => radio.value)).toEqual(['last7Days', 'customDays', 'dateRange']);
    expect(radios[0].checked).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Filter by date');
    expect(fixture.nativeElement.querySelector('.govuk-radios__conditional')).toBeNull();
    expect(fixture.nativeElement.querySelector('form, button[type="submit"]')).toBeNull();
  });

  it('restores custom days and writes user input to the parent control', () => {
    controls.dateFilter.setValue('customDays');
    controls.days.setValue('30');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('#search-days') as HTMLInputElement;
    expect(input.value).toBe('30');
    input.value = '14';
    input.dispatchEvent(new Event('input'));
    expect(controls.days.value).toBe('14');
  });

  it('keeps radio aria-controls references valid as conditional fields appear and disappear', () => {
    fixture.detectChanges();

    for (const selected of ['last7Days', 'customDays', 'dateRange', 'last7Days'] as const) {
      controls.dateFilter.setValue(selected);
      fixture.detectChanges();

      const radios = fixture.nativeElement.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
      for (const radio of radios) {
        const targetId = radio.getAttribute('aria-controls');
        if (radio.value === selected && selected !== 'last7Days') {
          expect(targetId).toBe(`search-${selected === 'customDays' ? 'custom-days' : 'date-range'}`);
          expect(fixture.nativeElement.querySelector(`#${targetId}`)).not.toBeNull();
        } else {
          expect(targetId).toBeNull();
        }
      }
    }
  });

  it('updates conditional fields when the parent changes the date option', () => {
    fixture.detectChanges();

    controls.dateFilter.setValue('customDays');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#search-days')).toBeTruthy();

    controls.days.setValue('10');
    controls.dateFilter.setValue('dateRange');
    fixture.detectChanges();
    expect(controls.days.value).toBe('');
    expect(fixture.nativeElement.querySelector('#search-days')).toBeNull();
    expect(fixture.nativeElement.querySelector('#search-date-from')).toBeTruthy();
  });

  it('clears inactive dates and days when the user selects Last 7 days', () => {
    controls.dateFilter.setValue('dateRange');
    controls.dateFrom.setValue('01/06/2026');
    controls.dateTo.setValue('08/06/2026');
    fixture.detectChanges();

    fixture.nativeElement.querySelector('#search-date-filter-last-7-days').click();
    fixture.detectChanges();

    expect(controls.dateFilter.value).toBe('last7Days');
    expect(controls.dateFrom.value).toBe('');
    expect(controls.dateTo.value).toBe('');
    expect(controls.days.value).toBe('');
    expect(fixture.nativeElement.querySelector('#search-date-range')).toBeNull();
  });

  it('keeps restored dates pristine and marks picker edits dirty in the matching controls', () => {
    controls.dateFilter.setValue('dateRange');
    controls.dateFrom.setValue('01/06/2026');
    controls.dateTo.setValue('08/06/2026');
    fixture.detectChanges();

    const pickers = fixture.debugElement.queryAll(By.directive(MojDatePickerComponent));
    expect(pickers[0].componentInstance.getControl.value).toBe('01/06/2026');
    expect(pickers[1].componentInstance.getControl.value).toBe('08/06/2026');
    expect(controls.dateFrom.pristine).toBe(true);
    expect(controls.dateTo.pristine).toBe(true);

    pickers[0].componentInstance.dateChange.emit('02/06/2026');
    expect(controls.dateFrom.value).toBe('02/06/2026');
    expect(controls.dateFrom.dirty).toBe(true);
    expect(controls.dateTo.pristine).toBe(true);

    pickers[1].componentInstance.dateChange.emit('07/06/2026');
    expect(controls.dateTo.value).toBe('07/06/2026');
    expect(controls.dateTo.dirty).toBe(true);
  });

  it('connects the custom days error to its input', () => {
    controls.dateFilter.setValue('customDays');
    fixture.componentRef.setInput('errors', { 'search-days': 'Enter number of days' });
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('#search-days');
    expect(input.getAttribute('aria-describedby')).toBe('search-days-error-message');
    expect(fixture.nativeElement.querySelector('#search-days-error-message').textContent).toContain(
      'Enter number of days',
    );
    expect(input.closest('.govuk-form-group--error')).toBeTruthy();
  });

  it('passes each date error to its picker and allows custom legend and hint text', () => {
    controls.dateFilter.setValue('dateRange');
    fixture.componentRef.setInput('legendText', 'Created date');
    fixture.componentRef.setInput('dateHintText', 'For example, 01/06/2026');
    fixture.componentRef.setInput('errors', { 'search-date-from': 'Invalid start', 'search-date-to': 'Invalid end' });
    fixture.detectChanges();

    const pickers = fixture.debugElement.queryAll(By.directive(MojDatePickerComponent));
    expect(pickers.map((picker) => picker.componentInstance.errors)).toEqual(['Invalid start', 'Invalid end']);
    expect(pickers[0].componentInstance.hintText).toBe('For example, 01/06/2026');
    expect(fixture.nativeElement.querySelector('legend').textContent).toContain('Created date');
  });

  it('detaches from replaced controls and handles null options like the default', () => {
    fixture.detectChanges();
    const replacement = createControls('customDays');
    replacement.days.setValue('14');
    fixture.componentRef.setInput('controls', replacement);
    fixture.detectChanges();

    controls.days.setValue('30');
    controls.dateFilter.setValue('last7Days');
    expect(controls.days.value).toBe('30');
    expect(replacement.days.value).toBe('14');

    replacement.dateFilter.setValue(null);
    fixture.detectChanges();
    expect(replacement.days.value).toBe('');
    expect(fixture.nativeElement.querySelector('.govuk-radios__conditional')).toBeNull();
  });

  it('unsubscribes when destroyed', () => {
    fixture.detectChanges();
    fixture.destroy();
    controls.days.setValue('14');
    controls.dateFilter.setValue('last7Days');
    expect(controls.days.value).toBe('14');
  });

  it('composes with another filter and a second date filter in one parent form', () => {
    const host = TestBed.createComponent(TestHostComponent);
    host.detectChanges();

    host.nativeElement.querySelector('#search-date-filter-custom-days').click();
    host.detectChanges();
    const days: HTMLInputElement = host.nativeElement.querySelector('#search-days');
    days.value = '14';
    days.dispatchEvent(new Event('input'));
    host.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(host.componentInstance.submit).toHaveBeenCalledOnce();
    expect(host.componentInstance.form.value).toEqual({
      status: 'open',
      dateFilter: 'customDays',
      days: '14',
      dateFrom: '',
      dateTo: '',
    });
    expect(host.componentInstance.archiveControls.dateFilter.value).toBe('last7Days');
    const ids = Array.from(host.nativeElement.querySelectorAll('[id]'), (element: Element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(host.nativeElement.querySelectorAll('form')).toHaveLength(1);
  });
});
