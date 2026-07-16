export interface IAbstractReportSummaryListFilterState {
  dateFilter: 'last7Days' | 'customDays' | 'dateRange';
  days: string;
  dateFrom: string;
  dateTo: string;
}
