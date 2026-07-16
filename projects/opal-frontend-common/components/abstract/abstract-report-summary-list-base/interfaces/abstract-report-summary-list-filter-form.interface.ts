import { FormControl, FormGroup } from '@angular/forms';
import { AbstractReportSummaryListDateFilter } from '../types/abstract-report-summary-list-date-filter.type';

export type IAbstractReportSummaryListFilterForm = FormGroup<{
  businessUnit: FormControl<string | null>;
  dateFilter: FormControl<AbstractReportSummaryListDateFilter | null>;
  days: FormControl<string | null>;
  dateFrom: FormControl<string | null>;
  dateTo: FormControl<string | null>;
}>;
