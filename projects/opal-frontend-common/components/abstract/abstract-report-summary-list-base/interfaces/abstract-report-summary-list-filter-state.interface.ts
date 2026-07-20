import type { AbstractReportSummaryListDateFilter } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base/types';

export interface IAbstractReportSummaryListFilterState {
  dateFilter: AbstractReportSummaryListDateFilter;
  days: string;
  dateFrom: string;
  dateTo: string;
}
