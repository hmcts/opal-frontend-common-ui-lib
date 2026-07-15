import { ReportDateFilter } from '../types/report-date-filter.type';

export interface IReportFilterState {
  businessUnit: string;
  dateFilter: ReportDateFilter;
  days: string;
  dateFrom: string;
  dateTo: string;
}
