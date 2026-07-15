import { DateTime } from 'luxon';
import { describe, expect, it, vi } from 'vitest';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import {
  REPORT_ALL_BUSINESS_UNITS,
  REPORT_DATE_FILTER_CUSTOM_DAYS,
  REPORT_DATE_FILTER_DATE_RANGE,
} from './constants/report-date-filter.constant';
import {
  getDefaultReportQuery,
  getReportQueryFromFilters,
  isReportDateFromAfterDateTo,
  isReportDateInFuture,
  isReportDateInvalid,
} from './report-date.utils';
import { getReportInstanceDisplayStatus } from './report-status.utils';

describe('report service utilities', () => {
  const dateService = new DateService();

  it('should create the default last 7 days query', () => {
    vi.spyOn(DateTime, 'now').mockReturnValue(DateTime.fromISO('2026-07-15') as DateTime<true>);

    expect(getDefaultReportQuery(dateService)).toEqual({
      fromDate: '2026-07-09',
      toDate: '2026-07-15',
      businessUnit: null,
    });
  });

  it('should create a custom days query with a selected business unit', () => {
    vi.spyOn(DateTime, 'now').mockReturnValue(DateTime.fromISO('2026-07-15') as DateTime<true>);

    expect(
      getReportQueryFromFilters(
        {
          businessUnit: '67',
          dateFilter: REPORT_DATE_FILTER_CUSTOM_DAYS,
          days: '3',
          dateFrom: '',
          dateTo: '',
        },
        dateService,
      ),
    ).toEqual({
      fromDate: '2026-07-13',
      toDate: '2026-07-15',
      businessUnit: '67',
    });
  });

  it('should create a date range query', () => {
    expect(
      getReportQueryFromFilters(
        {
          businessUnit: REPORT_ALL_BUSINESS_UNITS,
          dateFilter: REPORT_DATE_FILTER_DATE_RANGE,
          days: '',
          dateFrom: '01/07/2026',
          dateTo: '15/07/2026',
        },
        dateService,
      ),
    ).toEqual({
      fromDate: '2026-07-01',
      toDate: '2026-07-15',
      businessUnit: null,
    });
  });

  it('should validate report dates', () => {
    vi.spyOn(DateTime, 'now').mockReturnValue(DateTime.fromISO('2026-07-15') as DateTime<true>);

    expect(isReportDateInvalid('31/02/2026', dateService)).toBe(true);
    expect(isReportDateInFuture('16/07/2026', dateService)).toBe(true);
    expect(isReportDateFromAfterDateTo('15/07/2026', '14/07/2026', dateService)).toBe(true);
  });

  it('should display report instance statuses', () => {
    expect(getReportInstanceDisplayStatus('REQUESTED')).toBe('In progress');
    expect(getReportInstanceDisplayStatus('IN_PROGRESS')).toBe('In progress');
    expect(getReportInstanceDisplayStatus('READY', 0)).toBe('No content');
    expect(getReportInstanceDisplayStatus('READY', 1, 'Ready')).toBe('Ready');
  });
});
