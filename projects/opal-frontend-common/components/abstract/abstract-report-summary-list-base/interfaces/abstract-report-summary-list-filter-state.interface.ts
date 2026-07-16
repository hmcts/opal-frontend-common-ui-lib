import { AbstractReportSummaryListDateFilter } from '../types/abstract-report-summary-list-date-filter.type';

export interface IAbstractReportSummaryListFilterState {
  businessUnit: string;
  dateFilter: AbstractReportSummaryListDateFilter;
  days: string;
  dateFrom: string;
  dateTo: string;
}
