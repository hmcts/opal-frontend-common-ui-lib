import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import {
  REPORT_ALL_BUSINESS_UNITS,
  REPORT_DATE_FILTER_CUSTOM_DAYS,
  REPORT_DATE_FILTER_DATE_RANGE,
} from './constants/report-date-filter.constant';
import { IReportFilterState } from './interfaces/report-filter-state.interface';
import { IReportQueryState } from './interfaces/report-query-state.interface';

const DATE_FORMAT = 'dd/MM/yyyy';
const API_DATE_FORMAT = 'yyyy-MM-dd';

export const reportDateFormat = DATE_FORMAT;

/**
 * Builds the default report query for the last 7 days.
 *
 * @param dateService - The date service used to calculate and format the date range.
 * @returns A report query state with a last 7 days date range and no business unit filter.
 */
export const getDefaultReportQuery = (dateService: DateService): IReportQueryState => {
  const dateRange = dateService.getDateRange(6, 0, API_DATE_FORMAT);

  return {
    fromDate: dateRange.from,
    toDate: dateRange.to,
    businessUnit: null,
  };
};

/**
 * Builds a report query from the selected report filter state.
 *
 * @param filters - The selected report filter state.
 * @param dateService - The date service used to calculate and format date values.
 * @returns A report query state suitable for report instance API requests.
 */
export const getReportQueryFromFilters = (filters: IReportFilterState, dateService: DateService): IReportQueryState => {
  const businessUnit =
    filters.businessUnit && filters.businessUnit !== REPORT_ALL_BUSINESS_UNITS ? filters.businessUnit : null;

  if (filters.dateFilter === REPORT_DATE_FILTER_CUSTOM_DAYS) {
    const days = Number(filters.days);
    const dateRange = dateService.getDateRange(days - 1, 0, API_DATE_FORMAT);

    return {
      fromDate: dateRange.from,
      toDate: dateRange.to,
      businessUnit,
    };
  }

  if (filters.dateFilter === REPORT_DATE_FILTER_DATE_RANGE) {
    return {
      fromDate: filters.dateFrom
        ? dateService.getFromFormatToFormat(filters.dateFrom, DATE_FORMAT, API_DATE_FORMAT)
        : null,
      toDate: filters.dateTo ? dateService.getFromFormatToFormat(filters.dateTo, DATE_FORMAT, API_DATE_FORMAT) : null,
      businessUnit,
    };
  }

  return {
    ...getDefaultReportQuery(dateService),
    businessUnit,
  };
};

/**
 * Checks whether a report date string is invalid.
 *
 * @param value - The date value to validate.
 * @param dateService - The date service used to validate the value.
 * @returns True when the date value is invalid, otherwise false.
 */
export const isReportDateInvalid = (value: string, dateService: DateService): boolean => {
  return !dateService.isValidDate(value, DATE_FORMAT);
};

/**
 * Checks whether a report date string is in the future.
 *
 * @param value - The date value to validate.
 * @param dateService - The date service used to validate the value.
 * @returns True when the date value is valid and in the future, otherwise false.
 */
export const isReportDateInFuture = (value: string, dateService: DateService): boolean => {
  return dateService.isValidDate(value, DATE_FORMAT) && dateService.isDateInTheFuture(value, undefined, DATE_FORMAT);
};

/**
 * Checks whether the report date from value is after the report date to value.
 *
 * @param dateFrom - The start date value.
 * @param dateTo - The end date value.
 * @param dateService - The date service used to parse the values.
 * @returns True when both dates are valid and date from is after date to, otherwise false.
 */
export const isReportDateFromAfterDateTo = (dateFrom: string, dateTo: string, dateService: DateService): boolean => {
  const from = dateService.getFromFormat(dateFrom, DATE_FORMAT).startOf('day');
  const to = dateService.getFromFormat(dateTo, DATE_FORMAT).startOf('day');
  return from.isValid && to.isValid && from > to;
};
