import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it, vi } from 'vitest';
import type { CustomDateFilterOption } from '../types/custom-date-filter-option.type';
import { clearInactiveCustomDateFilterFields } from './custom-date-filter.utils';

function createForm(dateFilter: CustomDateFilterOption | null) {
  return new FormGroup({
    dateFilter: new FormControl<CustomDateFilterOption | null>(dateFilter),
    days: new FormControl<string | null>('14'),
    dateFrom: new FormControl<string | null>('01/06/2026'),
    dateTo: new FormControl<string | null>('08/06/2026'),
    status: new FormControl('open'),
  });
}

describe('clearInactiveCustomDateFilterFields', () => {
  it('clears all conditional fields for Last 7 days', () => {
    const form = createForm('last7Days');

    clearInactiveCustomDateFilterFields(form.controls, form.controls.dateFilter.value);

    expect(form.getRawValue()).toEqual({
      dateFilter: 'last7Days',
      days: '',
      dateFrom: '',
      dateTo: '',
      status: 'open',
    });
  });

  it('preserves custom days and clears both dates for Custom days', () => {
    const form = createForm('customDays');

    clearInactiveCustomDateFilterFields(form.controls, form.controls.dateFilter.value);

    expect(form.getRawValue()).toEqual({
      dateFilter: 'customDays',
      days: '14',
      dateFrom: '',
      dateTo: '',
      status: 'open',
    });
  });

  it('preserves both dates and clears custom days for Date range', () => {
    const form = createForm('dateRange');

    clearInactiveCustomDateFilterFields(form.controls, form.controls.dateFilter.value);

    expect(form.getRawValue()).toEqual({
      dateFilter: 'dateRange',
      days: '',
      dateFrom: '01/06/2026',
      dateTo: '08/06/2026',
      status: 'open',
    });
  });

  it('clears all conditional fields when the selected option is null', () => {
    const form = createForm(null);

    clearInactiveCustomDateFilterFields(form.controls, form.controls.dateFilter.value);

    expect(form.getRawValue()).toEqual({
      dateFilter: null,
      days: '',
      dateFrom: '',
      dateTo: '',
      status: 'open',
    });
  });

  it('allows open date ranges and preserves null values in active fields', () => {
    const form = createForm('dateRange');
    form.controls.dateFrom.setValue(null);

    clearInactiveCustomDateFilterFields(form.controls, form.controls.dateFilter.value);

    expect(form.controls.dateFrom.value).toBeNull();
    expect(form.controls.dateTo.value).toBe('08/06/2026');
    expect(form.controls.days.value).toBe('');
  });

  it('clears inactive fields without emitting control or parent form change events', () => {
    const form = createForm('last7Days');
    const valueChanges = vi.fn();
    const statusChanges = vi.fn();
    const observedControls: AbstractControl[] = [form, ...Object.values(form.controls)];
    const subscriptions = observedControls.flatMap((control) => [
      control.valueChanges.subscribe(valueChanges),
      control.statusChanges.subscribe(statusChanges),
    ]);

    clearInactiveCustomDateFilterFields(form.controls, form.controls.dateFilter.value);

    expect(valueChanges).not.toHaveBeenCalled();
    expect(statusChanges).not.toHaveBeenCalled();
    expect(form.controls.days.value).toBe('');
    expect(form.controls.dateFrom.value).toBe('');
    expect(form.controls.dateTo.value).toBe('');
    subscriptions.forEach((subscription) => subscription.unsubscribe());
  });
});
