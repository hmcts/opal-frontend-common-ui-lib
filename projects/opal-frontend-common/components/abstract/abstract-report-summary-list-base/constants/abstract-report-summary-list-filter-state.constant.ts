import { IAbstractReportSummaryListFilterState } from '../interfaces/abstract-report-summary-list-filter-state.interface';

export const ABSTRACT_REPORT_SUMMARY_LIST_ALL_BUSINESS_UNITS = 'all';
export const ABSTRACT_REPORT_SUMMARY_LIST_LAST_7_DAYS = 'last7Days';
export const ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS = 'customDays';
export const ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE = 'dateRange';

export const ABSTRACT_REPORT_SUMMARY_LIST_FILTER_STATE: IAbstractReportSummaryListFilterState = {
  businessUnit: ABSTRACT_REPORT_SUMMARY_LIST_ALL_BUSINESS_UNITS,
  dateFilter: ABSTRACT_REPORT_SUMMARY_LIST_LAST_7_DAYS,
  days: '',
  dateFrom: '',
  dateTo: '',
};
