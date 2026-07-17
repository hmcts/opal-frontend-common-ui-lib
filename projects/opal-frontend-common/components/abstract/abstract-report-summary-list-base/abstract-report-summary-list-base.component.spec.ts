import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { DateTime } from 'luxon';
import { describe, afterEach, beforeEach, expect, it, vi } from 'vitest';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { AbstractReportSummaryListBaseComponent } from './abstract-report-summary-list-base.component';
import {
  ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS,
  ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE,
  ABSTRACT_REPORT_SUMMARY_LIST_LAST_7_DAYS,
} from './constants/abstract-report-summary-list-filter-state.constant';
import { IAbstractReportSummaryListDateValidationMessages } from './interfaces/abstract-report-summary-list-date-validation-messages.interface';
import { IAbstractReportSummaryListFilterState } from './interfaces/abstract-report-summary-list-filter-state.interface';
import { AbstractReportSummaryListDateFilter } from './types/abstract-report-summary-list-date-filter.type';

type TestReportSummaryListFilterForm = FormGroup<{
  businessUnit: FormControl<string | null>;
  dateFilter: FormControl<AbstractReportSummaryListDateFilter | null>;
  days: FormControl<string | null>;
  dateFrom: FormControl<string | null>;
  dateTo: FormControl<string | null>;
}>;

interface TestReportSummaryListFilterFormValues extends IAbstractReportSummaryListFilterState {
  businessUnit: string;
}

@Component({ template: '' })
class TestReportSummaryListBaseComponent extends AbstractReportSummaryListBaseComponent<TestReportSummaryListFilterForm> {
  protected readonly dateValidationMessages: IAbstractReportSummaryListDateValidationMessages = {
    customDaysRequired: 'Enter number of days',
    dateRangeRequired: 'You must enter at least 1 of date from or date to',
    invalidDate: 'Date must be in the format DD/MM/YYYY',
    futureDate: 'Date cannot be in the future',
    dateFromAfterDateTo: 'The Date from cannot be after the Date to',
  };

  protected getFiltersFromForm(filtersForm: TestReportSummaryListFilterForm): IAbstractReportSummaryListFilterState {
    return {
      dateFilter: filtersForm.controls.dateFilter.value ?? this.dateFilterLast7Days,
      days: filtersForm.controls.days.value ?? '',
      dateFrom: filtersForm.controls.dateFrom.value ?? '',
      dateTo: filtersForm.controls.dateTo.value ?? '',
    };
  }

  protected clearInactiveDateFilterFields(
    filtersForm: TestReportSummaryListFilterForm,
    dateFilter: AbstractReportSummaryListDateFilter | null,
  ): void {
    if (dateFilter !== this.dateFilterCustomDays) {
      filtersForm.controls.days.setValue('', { emitEvent: false });
    }

    if (dateFilter !== this.dateFilterDateRange) {
      filtersForm.controls.dateFrom.setValue('', { emitEvent: false });
      filtersForm.controls.dateTo.setValue('', { emitEvent: false });
    }
  }

  public getDefaultQuery() {
    return this.getDefaultReportQuery();
  }

  public getQueryFromFilters(filters: IAbstractReportSummaryListFilterState) {
    return this.getReportQueryFromFilters(filters);
  }

  public getFilters(filtersForm: TestReportSummaryListFilterForm) {
    return this.getFiltersFromForm(filtersForm);
  }

  public clearInactiveFields(
    filtersForm: TestReportSummaryListFilterForm,
    dateFilter: AbstractReportSummaryListDateFilter | null,
  ) {
    this.clearInactiveDateFilterFields(filtersForm, dateFilter);
  }

  public getDateFieldErrors(filters: IAbstractReportSummaryListFilterState) {
    return this.buildReportDateFieldErrors(filters, {
      days: 'days',
      dateFrom: 'dateFrom',
      dateTo: 'dateTo',
    });
  }

  public setFieldErrors(errors: Record<string, string>) {
    this.fieldErrors.set(errors);
  }
}

@Component({ template: '' })
class TestCustomDateFormatReportSummaryListBaseComponent extends TestReportSummaryListBaseComponent {
  protected override readonly dateFormats = {
    input: 'yyyy/MM/dd',
    output: 'dd-MM-yyyy',
  };
}

describe('AbstractReportSummaryListBaseComponent', () => {
  let component: TestReportSummaryListBaseComponent;
  let fixture: ComponentFixture<TestReportSummaryListBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestReportSummaryListBaseComponent, TestCustomDateFormatReportSummaryListBaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestReportSummaryListBaseComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createFiltersForm = (values: TestReportSummaryListFilterFormValues): TestReportSummaryListFilterForm =>
    new FormGroup({
      businessUnit: new FormControl<string | null>(values.businessUnit),
      dateFilter: new FormControl<AbstractReportSummaryListDateFilter | null>(values.dateFilter),
      days: new FormControl<string | null>(values.days),
      dateFrom: new FormControl<string | null>(values.dateFrom),
      dateTo: new FormControl<string | null>(values.dateTo),
    });

  it('should build the default last 7 days query', () => {
    vi.spyOn(DateTime, 'now').mockReturnValue(DateTime.fromISO('2026-07-16') as DateTime<true>);

    expect(component.getDefaultQuery()).toEqual({
      fromDate: '2026-07-10',
      toDate: '2026-07-16',
    });
  });

  it('should build a custom days query from filters', () => {
    vi.spyOn(DateTime, 'now').mockReturnValue(DateTime.fromISO('2026-07-16') as DateTime<true>);

    expect(
      component.getQueryFromFilters({
        dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS,
        days: '3',
        dateFrom: '',
        dateTo: '',
      }),
    ).toEqual({
      fromDate: '2026-07-14',
      toDate: '2026-07-16',
    });
  });

  it('should build a date range query from filters', () => {
    expect(
      component.getQueryFromFilters({
        dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE,
        days: '',
        dateFrom: '01/07/2026',
        dateTo: '16/07/2026',
      }),
    ).toEqual({
      fromDate: '2026-07-01',
      toDate: '2026-07-16',
    });
  });

  it('should build an open date range query from partial filters', () => {
    expect(
      component.getQueryFromFilters({
        dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE,
        days: '',
        dateFrom: '',
        dateTo: '16/07/2026',
      }),
    ).toEqual({
      fromDate: null,
      toDate: '2026-07-16',
    });
  });

  it('should build an open date range query from a date from only', () => {
    expect(
      component.getQueryFromFilters({
        dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE,
        days: '',
        dateFrom: '01/07/2026',
        dateTo: '',
      }),
    ).toEqual({
      fromDate: '2026-07-01',
      toDate: null,
    });
  });

  it('should build date queries with custom date formats', () => {
    const customFixture = TestBed.createComponent(TestCustomDateFormatReportSummaryListBaseComponent);
    const customComponent = customFixture.componentInstance;

    vi.spyOn(DateTime, 'now').mockReturnValue(DateTime.fromISO('2026-07-16') as DateTime<true>);

    expect(customComponent.getDefaultQuery()).toEqual({
      fromDate: '10-07-2026',
      toDate: '16-07-2026',
    });

    expect(
      customComponent.getQueryFromFilters({
        dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE,
        days: '',
        dateFrom: '2026/07/01',
        dateTo: '2026/07/16',
      }),
    ).toEqual({
      fromDate: '01-07-2026',
      toDate: '16-07-2026',
    });
  });

  it('should build static date queries with custom date formats', () => {
    const dateService = TestBed.inject(DateService);

    expect(
      AbstractReportSummaryListBaseComponent.getReportQueryFromFilters(
        {
          dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE,
          days: '',
          dateFrom: '2026/07/01',
          dateTo: '2026/07/16',
        },
        dateService,
        {
          input: 'yyyy/MM/dd',
          output: 'dd-MM-yyyy',
        },
      ),
    ).toEqual({
      fromDate: '01-07-2026',
      toDate: '16-07-2026',
    });
  });

  it('should build the default query from non-custom date filters', () => {
    vi.spyOn(DateTime, 'now').mockReturnValue(DateTime.fromISO('2026-07-16') as DateTime<true>);

    expect(
      component.getQueryFromFilters({
        dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_LAST_7_DAYS,
        days: '',
        dateFrom: '',
        dateTo: '',
      }),
    ).toEqual({
      fromDate: '2026-07-10',
      toDate: '2026-07-16',
    });
  });

  it('should normalize filter form values', () => {
    const filtersForm = createFiltersForm({
      businessUnit: '67',
      dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS,
      days: '5',
      dateFrom: '',
      dateTo: '',
    });

    expect(component.getFilters(filtersForm)).toEqual({
      dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS,
      days: '5',
      dateFrom: '',
      dateTo: '',
    });
  });

  it('should clear inactive date filter fields', () => {
    const filtersForm = createFiltersForm({
      businessUnit: '67',
      dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS,
      days: '5',
      dateFrom: '01/07/2026',
      dateTo: '16/07/2026',
    });

    component.clearInactiveFields(filtersForm, ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS);

    expect(filtersForm.controls.days.value).toBe('5');
    expect(filtersForm.controls.dateFrom.value).toBe('');
    expect(filtersForm.controls.dateTo.value).toBe('');
  });

  it('should clear custom days when date range is selected', () => {
    const filtersForm = createFiltersForm({
      businessUnit: '67',
      dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE,
      days: '5',
      dateFrom: '01/07/2026',
      dateTo: '16/07/2026',
    });

    component.clearInactiveFields(filtersForm, ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE);

    expect(filtersForm.controls.days.value).toBe('');
    expect(filtersForm.controls.dateFrom.value).toBe('01/07/2026');
    expect(filtersForm.controls.dateTo.value).toBe('16/07/2026');
  });

  it('should build custom days field errors', () => {
    expect(
      component.getDateFieldErrors({
        dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS,
        days: '',
        dateFrom: '',
        dateTo: '',
      }),
    ).toEqual({
      days: 'Enter number of days',
    });

    expect(
      component.getDateFieldErrors({
        dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS,
        days: '0',
        dateFrom: '',
        dateTo: '',
      }),
    ).toEqual({
      days: 'Enter number of days',
    });

    expect(
      component.getDateFieldErrors({
        dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS,
        days: '-1',
        dateFrom: '',
        dateTo: '',
      }),
    ).toEqual({
      days: 'Enter number of days',
    });

    expect(
      component.getDateFieldErrors({
        dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS,
        days: 'abc',
        dateFrom: '',
        dateTo: '',
      }),
    ).toEqual({
      days: 'Enter number of days',
    });

    expect(
      component.getDateFieldErrors({
        dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS,
        days: '1.5',
        dateFrom: '',
        dateTo: '',
      }),
    ).toEqual({
      days: 'Enter number of days',
    });

    expect(
      component.getDateFieldErrors({
        dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS,
        days: 'Infinity',
        dateFrom: '',
        dateTo: '',
      }),
    ).toEqual({
      days: 'Enter number of days',
    });
  });

  it('should not build custom days field errors for valid days', () => {
    expect(
      component.getDateFieldErrors({
        dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS,
        days: '1',
        dateFrom: '',
        dateTo: '',
      }),
    ).toEqual({});
  });

  it('should build date range field errors when no date is entered', () => {
    expect(
      component.getDateFieldErrors({
        dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE,
        days: '',
        dateFrom: '',
        dateTo: '',
      }),
    ).toEqual({
      dateFrom: 'You must enter at least 1 of date from or date to',
    });
  });

  it('should build date range field errors for invalid dates', () => {
    expect(
      component.getDateFieldErrors({
        dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE,
        days: '',
        dateFrom: '31/02/2026',
        dateTo: 'not-a-date',
      }),
    ).toEqual({
      dateFrom: 'Date must be in the format DD/MM/YYYY',
      dateTo: 'Date must be in the format DD/MM/YYYY',
    });
  });

  it('should build date range field errors for future dates', () => {
    vi.spyOn(DateTime, 'now').mockReturnValue(DateTime.fromISO('2026-07-16') as DateTime<true>);

    expect(
      component.getDateFieldErrors({
        dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE,
        days: '',
        dateFrom: '17/07/2026',
        dateTo: '16/07/2026',
      }),
    ).toEqual({
      dateFrom: 'Date cannot be in the future',
    });
  });

  it('should build date range field errors for a future date to', () => {
    vi.spyOn(DateTime, 'now').mockReturnValue(DateTime.fromISO('2026-07-16') as DateTime<true>);

    expect(
      component.getDateFieldErrors({
        dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE,
        days: '',
        dateFrom: '16/07/2026',
        dateTo: '17/07/2026',
      }),
    ).toEqual({
      dateTo: 'Date cannot be in the future',
    });
  });

  it('should build date range field errors when date from is after date to', () => {
    vi.spyOn(DateTime, 'now').mockReturnValue(DateTime.fromISO('2026-07-16') as DateTime<true>);

    expect(
      component.getDateFieldErrors({
        dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE,
        days: '',
        dateFrom: '16/07/2026',
        dateTo: '15/07/2026',
      }),
    ).toEqual({
      dateFrom: 'The Date from cannot be after the Date to',
    });
  });

  it('should not build date field errors for last 7 days or valid date range filters', () => {
    vi.spyOn(DateTime, 'now').mockReturnValue(DateTime.fromISO('2026-07-16') as DateTime<true>);

    expect(
      component.getDateFieldErrors({
        dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_LAST_7_DAYS,
        days: '',
        dateFrom: '',
        dateTo: '',
      }),
    ).toEqual({});

    expect(
      component.getDateFieldErrors({
        dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE,
        days: '',
        dateFrom: '15/07/2026',
        dateTo: '16/07/2026',
      }),
    ).toEqual({});
  });

  it('should get report instance display statuses', () => {
    expect(AbstractReportSummaryListBaseComponent.getReportInstanceDisplayStatus('REQUESTED')).toBe('In progress');
    expect(AbstractReportSummaryListBaseComponent.getReportInstanceDisplayStatus('IN_PROGRESS')).toBe('In progress');
    expect(AbstractReportSummaryListBaseComponent.getReportInstanceDisplayStatus('READY', 0)).toBe('No content');
    expect(AbstractReportSummaryListBaseComponent.getReportInstanceDisplayStatus('READY', 1, 'Ready')).toBe('Ready');
    expect(AbstractReportSummaryListBaseComponent.getReportInstanceDisplayStatus('FAILED')).toBe('Failed');
    expect(AbstractReportSummaryListBaseComponent.getReportInstanceDisplayStatus('', null, 'Unknown')).toBe('Unknown');
    expect(AbstractReportSummaryListBaseComponent.toReportDisplayStatus('')).toBe('');
  });

  it('should expose field errors and error summary messages', () => {
    component.setFieldErrors({
      dateFrom: 'Date cannot be in the future',
      days: 'Enter number of days',
    });

    expect(component.getFieldError('dateFrom')).toBe('Date cannot be in the future');
    expect(component.getFieldError('dateTo')).toBeNull();
    expect(component.errorSummaryMessages()).toEqual([
      { fieldId: 'dateFrom', message: 'Date cannot be in the future' },
      { fieldId: 'days', message: 'Enter number of days' },
    ]);
  });
});
