import { FormControl, FormGroup } from '@angular/forms';
import { DateTime } from 'luxon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import type { ICustomDateFilterControls } from '@hmcts/opal-frontend-common/components/custom/custom-date-filter/interfaces';
import type { CustomDateFilterOption } from '@hmcts/opal-frontend-common/components/custom/custom-date-filter/types';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import {
  getCustomFileInterfaceViewerDateFilterErrors,
  setCustomFileInterfaceViewerDateValidators,
  validateCustomFileInterfaceViewerDateRange,
} from './custom-file-interface-viewer-filters.utils';

function createControls(dateFilter: CustomDateFilterOption | null = 'last7Days'): ICustomDateFilterControls {
  return {
    dateFilter: new FormControl<CustomDateFilterOption | null>(dateFilter),
    days: new FormControl<string | null>(''),
    dateFrom: new FormControl<string | null>(''),
    dateTo: new FormControl<string | null>(''),
  };
}

function createRangeControls(dateFrom: string | null = '', dateTo: string | null = ''): ICustomDateFilterControls {
  const controls = createControls('dateRange');
  controls.dateFrom.setValue(dateFrom);
  controls.dateTo.setValue(dateTo);
  setCustomFileInterfaceViewerDateValidators(controls);
  return controls;
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-21T12:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('setCustomFileInterfaceViewerDateValidators', () => {
  it.each([
    { days: '', error: 'required' },
    { days: null, error: 'required' },
    { days: '0', error: 'zeroValue' },
    { days: '00', error: 'zeroValue' },
    { days: 'abc', error: 'numericalTextPattern' },
    { days: '1.5', error: 'numericalTextPattern' },
    { days: '-1', error: 'numericalTextPattern' },
    { days: ' 1 ', error: 'numericalTextPattern' },
    { days: '1', error: null },
    { days: '14', error: null },
  ])('validates custom days $days using the existing shared error keys', ({ days, error }) => {
    const controls = createControls('customDays');
    controls.days.setValue(days);
    controls.dateFrom.setValue('invalid inactive date');
    controls.dateTo.setValue('01/01/2999');

    setCustomFileInterfaceViewerDateValidators(controls);

    expect(controls.days.errors).toEqual(error ? { [error]: true } : null);
    expect(controls.dateFrom.errors).toBeNull();
    expect(controls.dateTo.errors).toBeNull();
  });

  it.each([
    { field: 'dateFrom', value: '2020-01-01', error: 'invalidDateFormat' },
    { field: 'dateTo', value: '2020-01-01', error: 'invalidDateFormat' },
    { field: 'dateFrom', value: '31/02/2020', error: 'invalidDate' },
    { field: 'dateTo', value: '31/02/2020', error: 'invalidDate' },
    { field: 'dateFrom', value: '01/01/2999', error: 'invalidFutureDate' },
    { field: 'dateTo', value: '01/01/2999', error: 'invalidFutureDate' },
  ] as const)('preserves the shared $error validation for $field', ({ field, value, error }) => {
    const controls = createControls('dateRange');
    controls[field].setValue(value);
    controls.days.setValue('invalid inactive days');

    setCustomFileInterfaceViewerDateValidators(controls);

    expect(controls[field].errors).toEqual({ [error]: { value } });
    expect(controls.days.errors).toBeNull();
  });

  it('allows empty, valid past and current-day range values without requiring an individual boundary', () => {
    const controls = createRangeControls();
    expect(controls.dateFrom.errors).toBeNull();
    expect(controls.dateTo.errors).toBeNull();

    controls.dateFrom.setValue('20/10/2026');
    controls.dateTo.setValue('21/10/2026');

    expect(controls.dateFrom.errors).toBeNull();
    expect(controls.dateTo.errors).toBeNull();
  });

  it.each(['last7Days', null] as const)(
    'replaces obsolete validators when changing through date modes to %s',
    (dateFilter) => {
      const controls = createControls('customDays');
      controls.days.setValue('0');
      controls.dateFrom.setValue('2020-01-01');
      controls.dateTo.setValue('01/01/2999');
      setCustomFileInterfaceViewerDateValidators(controls);
      expect(controls.days.errors).toEqual({ zeroValue: true });

      controls.dateFilter.setValue('dateRange');
      setCustomFileInterfaceViewerDateValidators(controls);
      expect(controls.days.errors).toBeNull();
      expect(controls.dateFrom.hasError('invalidDateFormat')).toBe(true);
      expect(controls.dateTo.hasError('invalidFutureDate')).toBe(true);

      controls.dateFilter.setValue(dateFilter);
      setCustomFileInterfaceViewerDateValidators(controls);

      expect(controls.days.errors).toBeNull();
      expect(controls.dateFrom.errors).toBeNull();
      expect(controls.dateTo.errors).toBeNull();
      expect(controls.days.value).toBe('0');
      expect(controls.dateFrom.value).toBe('2020-01-01');
      expect(controls.dateTo.value).toBe('01/01/2999');
    },
  );

  it('updates control and parent validity without emitting value or status changes', () => {
    const form = new FormGroup(createControls('customDays'));
    form.controls.days.setValue('0');
    const valueChanges = vi.fn();
    const statusChanges = vi.fn();
    const subscriptions = [form, ...Object.values(form.controls)].flatMap((control) => [
      control.valueChanges.subscribe(valueChanges),
      control.statusChanges.subscribe(statusChanges),
    ]);

    setCustomFileInterfaceViewerDateValidators(form.controls);

    expect(form.invalid).toBe(true);
    expect(form.controls.days.errors).toEqual({ zeroValue: true });
    expect(valueChanges).not.toHaveBeenCalled();
    expect(statusChanges).not.toHaveBeenCalled();
    subscriptions.forEach((subscription) => subscription.unsubscribe());
  });
});

describe('validateCustomFileInterfaceViewerDateRange', () => {
  let dateService: DateService;

  beforeEach(() => {
    dateService = new DateService();
  });

  it.each(['last7Days', 'customDays', null] as const)(
    'clears an obsolete range error and skips comparison for %s',
    (dateFilter) => {
      const controls = createControls(dateFilter);
      setCustomFileInterfaceViewerDateValidators(controls);
      controls.dateFrom.setErrors({ dateFromAfterDateTo: true });
      const compare = vi.spyOn(dateService, 'calculateDaysBetweenDates');

      validateCustomFileInterfaceViewerDateRange(controls, dateService);

      expect(controls.dateFrom.errors).toBeNull();
      expect(compare).not.toHaveBeenCalled();
    },
  );

  it.each([
    { dateFrom: '', dateTo: '' },
    { dateFrom: null, dateTo: null },
    { dateFrom: '', dateTo: null },
  ])('requires one range boundary when both values are empty: $dateFrom / $dateTo', ({ dateFrom, dateTo }) => {
    const controls = createRangeControls(dateFrom, dateTo);
    const compare = vi.spyOn(dateService, 'calculateDaysBetweenDates');

    validateCustomFileInterfaceViewerDateRange(controls, dateService);

    expect(controls.dateFrom.errors).toEqual({ required: true });
    expect(controls.dateTo.errors).toBeNull();
    expect(compare).not.toHaveBeenCalled();
  });

  it.each([
    { dateFrom: '', dateTo: '03/01/2020' },
    { dateFrom: '01/01/2020', dateTo: '' },
    { dateFrom: null, dateTo: '03/01/2020' },
    { dateFrom: '01/01/2020', dateTo: null },
    { dateFrom: '01/01/2020', dateTo: '03/01/2020' },
    { dateFrom: '01/01/2020', dateTo: '01/01/2020' },
  ])('accepts the open, ascending or equal range $dateFrom / $dateTo', ({ dateFrom, dateTo }) => {
    const controls = createRangeControls(dateFrom, dateTo);
    const compare = vi.spyOn(dateService, 'calculateDaysBetweenDates');

    validateCustomFileInterfaceViewerDateRange(controls, dateService);

    expect(controls.dateFrom.errors).toBeNull();
    expect(controls.dateTo.errors).toBeNull();
    if (dateFrom && dateTo) {
      expect(compare).toHaveBeenCalledExactlyOnceWith(dateFrom, dateTo);
    } else {
      expect(compare).not.toHaveBeenCalled();
    }
  });

  it('rejects a reversed range and clears its error when the to-date is corrected', () => {
    const controls = createRangeControls('03/01/2020', '01/01/2020');

    validateCustomFileInterfaceViewerDateRange(controls, dateService);
    expect(controls.dateFrom.errors).toEqual({ dateFromAfterDateTo: true });

    controls.dateTo.setValue('04/01/2020');
    validateCustomFileInterfaceViewerDateRange(controls, dateService);

    expect(controls.dateFrom.errors).toBeNull();
    expect(controls.dateTo.errors).toBeNull();
  });

  it.each(['dateFrom', 'dateTo'] as const)('clears the missing-range error after entering only %s', (field) => {
    const controls = createRangeControls();
    validateCustomFileInterfaceViewerDateRange(controls, dateService);
    expect(controls.dateFrom.hasError('required')).toBe(true);

    controls[field].setValue('01/01/2020');
    validateCustomFileInterfaceViewerDateRange(controls, dateService);

    expect(controls.dateFrom.errors).toBeNull();
    expect(controls.dateTo.errors).toBeNull();
  });

  it.each([
    { field: 'dateFrom', value: '2020-01-01', error: 'invalidDateFormat' },
    { field: 'dateTo', value: '31/02/2020', error: 'invalidDate' },
    { field: 'dateFrom', value: '01/01/2999', error: 'invalidFutureDate' },
    { field: 'dateTo', value: '01/01/2999', error: 'invalidFutureDate' },
  ] as const)('retains $field $error without adding an order error', ({ field, value, error }) => {
    const controls = createRangeControls('03/01/2020', '01/01/2020');
    controls[field].setValue(value);
    const compare = vi.spyOn(dateService, 'calculateDaysBetweenDates');

    validateCustomFileInterfaceViewerDateRange(controls, dateService);

    expect(controls[field].errors).toEqual({ [error]: { value } });
    expect(controls.dateFrom.hasError('dateFromAfterDateTo')).toBe(false);
    expect(compare).not.toHaveBeenCalled();
  });

  it.each([
    { from: DateTime.invalid('unparseable'), to: DateTime.fromISO('2020-01-03') },
    { from: DateTime.fromISO('2020-01-01'), to: DateTime.invalid('unparseable') },
  ])('does not add an order error when DateService cannot parse a boundary', ({ from, to }) => {
    const controls = createRangeControls('01/01/2020', '03/01/2020');
    vi.spyOn(dateService, 'getFromFormat').mockReturnValueOnce(from).mockReturnValueOnce(to);
    const compare = vi.spyOn(dateService, 'calculateDaysBetweenDates');

    validateCustomFileInterfaceViewerDateRange(controls, dateService);

    expect(compare).toHaveBeenCalledExactlyOnceWith('01/01/2020', '03/01/2020');
    expect(compare).toHaveReturnedWith(Number.NaN);
    expect(controls.dateFrom.errors).toBeNull();
    expect(controls.dateTo.errors).toBeNull();
  });
});

describe('getCustomFileInterfaceViewerDateFilterErrors', () => {
  it('maps only date-field messages to their rendered input IDs without changing the source map', () => {
    const messages = Object.freeze({
      days: 'Enter the number of days',
      dateFrom: 'Date from must be a real date',
      dateTo: 'Date to must be in the past',
      source: 'Unrelated source error',
    });

    expect(getCustomFileInterfaceViewerDateFilterErrors(messages)).toEqual({
      'custom-file-interface-viewer-days': 'Enter the number of days',
      'custom-file-interface-viewer-date-from': 'Date from must be a real date',
      'custom-file-interface-viewer-date-to': 'Date to must be in the past',
    });
    expect(messages).toEqual({
      days: 'Enter the number of days',
      dateFrom: 'Date from must be a real date',
      dateTo: 'Date to must be in the past',
      source: 'Unrelated source error',
    });
  });

  it.each<IAbstractFormControlErrorMessage>([
    {},
    { days: null, dateFrom: null, dateTo: null },
    { days: '', dateFrom: '', dateTo: '' },
  ])('uses empty child messages for absent, null or cleared errors: %j', (messages) => {
    expect(getCustomFileInterfaceViewerDateFilterErrors(messages)).toEqual({
      'custom-file-interface-viewer-days': '',
      'custom-file-interface-viewer-date-from': '',
      'custom-file-interface-viewer-date-to': '',
    });
  });
});
