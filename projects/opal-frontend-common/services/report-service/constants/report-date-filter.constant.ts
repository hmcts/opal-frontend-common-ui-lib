import { IReportFilterState } from '../interfaces/report-filter-state.interface';

export const REPORT_ALL_BUSINESS_UNITS = 'all';
export const REPORT_DATE_FILTER_LAST_7_DAYS = 'last7Days';
export const REPORT_DATE_FILTER_CUSTOM_DAYS = 'customDays';
export const REPORT_DATE_FILTER_DATE_RANGE = 'dateRange';

export const REPORT_FILTER_STATE: IReportFilterState = {
  businessUnit: REPORT_ALL_BUSINESS_UNITS,
  dateFilter: REPORT_DATE_FILTER_LAST_7_DAYS,
  days: '',
  dateFrom: '',
  dateTo: '',
};
