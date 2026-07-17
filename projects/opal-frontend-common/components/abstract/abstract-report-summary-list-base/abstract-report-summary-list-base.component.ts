import { Component, computed, inject, signal } from '@angular/core';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IAbstractFormBaseFormErrorSummaryMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import {
  ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS,
  ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE,
  ABSTRACT_REPORT_SUMMARY_LIST_FILTER_STATE,
  ABSTRACT_REPORT_SUMMARY_LIST_LAST_7_DAYS,
} from './constants/abstract-report-summary-list-filter-state.constant';
import {
  ABSTRACT_REPORT_SUMMARY_LIST_STATUS,
  ABSTRACT_REPORT_SUMMARY_LIST_STATUS_DISPLAY,
} from './constants/abstract-report-summary-list-status.constant';
import { IAbstractReportSummaryListDateFieldIds } from './interfaces/abstract-report-summary-list-date-field-ids.interface';
import { IAbstractReportSummaryListDateFormats } from './interfaces/abstract-report-summary-list-date-formats.interface';
import { IAbstractReportSummaryListDateValidationMessages } from './interfaces/abstract-report-summary-list-date-validation-messages.interface';
import { IAbstractReportSummaryListFilterState } from './interfaces/abstract-report-summary-list-filter-state.interface';
import { IAbstractReportSummaryListQueryState } from './interfaces/abstract-report-summary-list-query-state.interface';
import { AbstractReportSummaryListDateFilter } from './types/abstract-report-summary-list-date-filter.type';

const ABSTRACT_REPORT_SUMMARY_LIST_DATE_FORMATS: IAbstractReportSummaryListDateFormats = {
  input: 'dd/MM/yyyy',
  output: 'yyyy-MM-dd',
};

@Component({ template: '' })
export abstract class AbstractReportSummaryListBaseComponent<TFilterForm = unknown> {
  protected readonly dateService = inject(DateService);
  protected readonly fieldErrors = signal<Record<string, string>>({});
  protected abstract readonly dateValidationMessages: IAbstractReportSummaryListDateValidationMessages;
  protected readonly dateFormats: IAbstractReportSummaryListDateFormats = ABSTRACT_REPORT_SUMMARY_LIST_DATE_FORMATS;

  public readonly dateFilterLast7Days = ABSTRACT_REPORT_SUMMARY_LIST_LAST_7_DAYS;
  public readonly dateFilterCustomDays = ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS;
  public readonly dateFilterDateRange = ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE;
  public readonly dateFilter = signal<AbstractReportSummaryListDateFilter>(
    ABSTRACT_REPORT_SUMMARY_LIST_FILTER_STATE.dateFilter,
  );
  public readonly errorSummaryMessages = computed<IAbstractFormBaseFormErrorSummaryMessage[]>(() =>
    Object.entries(this.fieldErrors()).map(([fieldId, message]) => ({ fieldId, message })),
  );

  /**
   * Builds the default report query for the last 7 days.
   *
   * @param dateService - The date service used to calculate and format the date range.
   * @param dateFormats - The input and output date formats used by the consuming application.
   * @returns A report query state with a last 7 days date range.
   */
  public static getDefaultReportQuery(
    dateService: DateService,
    dateFormats: IAbstractReportSummaryListDateFormats = ABSTRACT_REPORT_SUMMARY_LIST_DATE_FORMATS,
  ): IAbstractReportSummaryListQueryState {
    const dateRange = dateService.getDateRange(6, 0, dateFormats.output);

    return {
      fromDate: dateRange.from,
      toDate: dateRange.to,
    };
  }

  /**
   * Builds a report query from the selected report filter state.
   *
   * @param filters - The selected report filter state.
   * @param dateService - The date service used to calculate and format date values.
   * @param dateFormats - The input and output date formats used by the consuming application.
   * @returns A report query state suitable for report instance API requests.
   */
  public static getReportQueryFromFilters(
    filters: IAbstractReportSummaryListFilterState,
    dateService: DateService,
    dateFormats: IAbstractReportSummaryListDateFormats = ABSTRACT_REPORT_SUMMARY_LIST_DATE_FORMATS,
  ): IAbstractReportSummaryListQueryState {
    if (filters.dateFilter === ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS) {
      const days = Number(filters.days);
      const dateRange = dateService.getDateRange(days - 1, 0, dateFormats.output);

      return {
        fromDate: dateRange.from,
        toDate: dateRange.to,
      };
    }

    if (filters.dateFilter === ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE) {
      return {
        fromDate: filters.dateFrom
          ? dateService.getFromFormatToFormat(filters.dateFrom, dateFormats.input, dateFormats.output)
          : null,
        toDate: filters.dateTo
          ? dateService.getFromFormatToFormat(filters.dateTo, dateFormats.input, dateFormats.output)
          : null,
      };
    }

    return AbstractReportSummaryListBaseComponent.getDefaultReportQuery(dateService, dateFormats);
  }

  /**
   * Gets the display status for a report instance.
   *
   * @param status - The report instance status code.
   * @param records - The number of records in the report instance, where available.
   * @param displayName - The API-provided status display name, where available.
   * @returns The display status for the report instance.
   */
  public static getReportInstanceDisplayStatus(
    status: string,
    records?: number | null,
    displayName?: string | null,
  ): string {
    if (status === ABSTRACT_REPORT_SUMMARY_LIST_STATUS.requested) {
      return ABSTRACT_REPORT_SUMMARY_LIST_STATUS_DISPLAY.inProgress;
    }

    if (status === ABSTRACT_REPORT_SUMMARY_LIST_STATUS.ready && records === 0) {
      return ABSTRACT_REPORT_SUMMARY_LIST_STATUS_DISPLAY.noContent;
    }

    if (status === ABSTRACT_REPORT_SUMMARY_LIST_STATUS.inProgress) {
      return ABSTRACT_REPORT_SUMMARY_LIST_STATUS_DISPLAY.inProgress;
    }

    return displayName || AbstractReportSummaryListBaseComponent.toReportDisplayStatus(status);
  }

  /**
   * Converts a report status code into title case display text.
   *
   * @param status - The report status code to convert.
   * @returns A display-friendly status value.
   */
  public static toReportDisplayStatus(status: string): string {
    return status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : '';
  }

  /**
   * Builds the default report query for the current component instance.
   *
   * @returns A report query state with a last 7 days date range.
   */
  protected getDefaultReportQuery(): IAbstractReportSummaryListQueryState {
    return AbstractReportSummaryListBaseComponent.getDefaultReportQuery(this.dateService, this.dateFormats);
  }

  /**
   * Builds a report query from the selected report filter state for the current component instance.
   *
   * @param filters - The selected report filter state.
   * @returns A report query state suitable for report instance API requests.
   */
  protected getReportQueryFromFilters(
    filters: IAbstractReportSummaryListFilterState,
  ): IAbstractReportSummaryListQueryState {
    return AbstractReportSummaryListBaseComponent.getReportQueryFromFilters(filters, this.dateService, this.dateFormats);
  }

  /**
   * Reads the consuming application's report filter form into a normalized filter state object.
   *
   * @param filtersForm - The consuming application's report filter form to read from.
   * @returns A normalized report filter state.
   */
  protected abstract getFiltersFromForm(filtersForm: TFilterForm): IAbstractReportSummaryListFilterState;

  /**
   * Clears consuming application form fields that do not apply to the selected date filter.
   *
   * @param filtersForm - The consuming application's report filter form to update.
   * @param dateFilter - The selected date filter.
   */
  protected abstract clearInactiveDateFilterFields(
    filtersForm: TFilterForm,
    dateFilter: AbstractReportSummaryListDateFilter | null,
  ): void;

  /**
   * Builds validation messages for the active report date filter fields.
   *
   * @param filters - The selected report filter state.
   * @param fieldIds - The field ids used by the consuming application template.
   * @returns A field error map keyed by field id.
   */
  protected buildReportDateFieldErrors(
    filters: IAbstractReportSummaryListFilterState,
    fieldIds: IAbstractReportSummaryListDateFieldIds,
  ): Record<string, string> {
    if (filters.dateFilter === ABSTRACT_REPORT_SUMMARY_LIST_CUSTOM_DAYS) {
      return this.buildCustomDaysFieldErrors(filters, fieldIds);
    }

    if (filters.dateFilter === ABSTRACT_REPORT_SUMMARY_LIST_DATE_RANGE) {
      return this.buildDateRangeFieldErrors(filters, fieldIds);
    }

    return {};
  }

  /**
   * Builds validation messages for the custom days report date filter.
   *
   * @param filters - The selected report filter state.
   * @param fieldIds - The field ids used by the consuming application template.
   * @returns A field error map keyed by field id.
   */
  protected buildCustomDaysFieldErrors(
    filters: IAbstractReportSummaryListFilterState,
    fieldIds: IAbstractReportSummaryListDateFieldIds,
  ): Record<string, string> {
    const days = Number(filters.days);

    if (!filters.days || !Number.isFinite(days) || !Number.isInteger(days) || days < 1) {
      return { [fieldIds.days]: this.dateValidationMessages.customDaysRequired };
    }

    return {};
  }

  /**
   * Builds validation messages for the date range report date filter.
   *
   * @param filters - The selected report filter state.
   * @param fieldIds - The field ids used by the consuming application template.
   * @returns A field error map keyed by field id.
   */
  protected buildDateRangeFieldErrors(
    filters: IAbstractReportSummaryListFilterState,
    fieldIds: IAbstractReportSummaryListDateFieldIds,
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    this.addRequiredDateRangeError(errors, filters, fieldIds);
    this.addDateFormatErrors(errors, filters, fieldIds);
    this.addFutureDateErrors(errors, filters, fieldIds);
    this.addDateOrderError(errors, filters, fieldIds);

    return errors;
  }

  /**
   * Adds a validation message when no date range boundary has been entered.
   *
   * @param errors - The field error map to update.
   * @param filters - The selected report filter state.
   * @param fieldIds - The field ids used by the consuming application template.
   */
  protected addRequiredDateRangeError(
    errors: Record<string, string>,
    filters: IAbstractReportSummaryListFilterState,
    fieldIds: IAbstractReportSummaryListDateFieldIds,
  ): void {
    if (!filters.dateFrom && !filters.dateTo) {
      errors[fieldIds.dateFrom] = this.dateValidationMessages.dateRangeRequired;
    }
  }

  /**
   * Adds validation messages for date values with an invalid format.
   *
   * @param errors - The field error map to update.
   * @param filters - The selected report filter state.
   * @param fieldIds - The field ids used by the consuming application template.
   */
  protected addDateFormatErrors(
    errors: Record<string, string>,
    filters: IAbstractReportSummaryListFilterState,
    fieldIds: IAbstractReportSummaryListDateFieldIds,
  ): void {
    if (filters.dateFrom && this.isReportDateInvalid(filters.dateFrom)) {
      errors[fieldIds.dateFrom] = this.dateValidationMessages.invalidDate;
    }

    if (filters.dateTo && this.isReportDateInvalid(filters.dateTo)) {
      errors[fieldIds.dateTo] = this.dateValidationMessages.invalidDate;
    }
  }

  /**
   * Adds validation messages for date values in the future.
   *
   * @param errors - The field error map to update.
   * @param filters - The selected report filter state.
   * @param fieldIds - The field ids used by the consuming application template.
   */
  protected addFutureDateErrors(
    errors: Record<string, string>,
    filters: IAbstractReportSummaryListFilterState,
    fieldIds: IAbstractReportSummaryListDateFieldIds,
  ): void {
    if (!errors[fieldIds.dateFrom] && filters.dateFrom && this.isReportDateInFuture(filters.dateFrom)) {
      errors[fieldIds.dateFrom] = this.dateValidationMessages.futureDate;
    }

    if (!errors[fieldIds.dateTo] && filters.dateTo && this.isReportDateInFuture(filters.dateTo)) {
      errors[fieldIds.dateTo] = this.dateValidationMessages.futureDate;
    }
  }

  /**
   * Adds a validation message when date from is after date to.
   *
   * @param errors - The field error map to update.
   * @param filters - The selected report filter state.
   * @param fieldIds - The field ids used by the consuming application template.
   */
  protected addDateOrderError(
    errors: Record<string, string>,
    filters: IAbstractReportSummaryListFilterState,
    fieldIds: IAbstractReportSummaryListDateFieldIds,
  ): void {
    if (errors[fieldIds.dateFrom] || errors[fieldIds.dateTo] || !filters.dateFrom || !filters.dateTo) {
      return;
    }

    if (this.isReportDateFromAfterDateTo(filters.dateFrom, filters.dateTo)) {
      errors[fieldIds.dateFrom] = this.dateValidationMessages.dateFromAfterDateTo;
    }
  }

  /**
   * Checks whether a report date string is invalid.
   *
   * @param value - The date value to validate.
   * @returns True when the date value is invalid, otherwise false.
   */
  protected isReportDateInvalid(value: string): boolean {
    return !this.dateService.isValidDate(value, this.dateFormats.input);
  }

  /**
   * Checks whether a report date string is in the future.
   *
   * @param value - The date value to validate.
   * @returns True when the date value is valid and in the future, otherwise false.
   */
  protected isReportDateInFuture(value: string): boolean {
    return (
      this.dateService.isValidDate(value, this.dateFormats.input) &&
      this.dateService.isDateInTheFuture(value, undefined, this.dateFormats.input)
    );
  }

  /**
   * Checks whether the report date from value is after the report date to value.
   *
   * @param dateFrom - The start date value.
   * @param dateTo - The end date value.
   * @returns True when both dates are valid and date from is after date to, otherwise false.
   */
  protected isReportDateFromAfterDateTo(dateFrom: string, dateTo: string): boolean {
    const from = this.dateService.getFromFormat(dateFrom, this.dateFormats.input).startOf('day');
    const to = this.dateService.getFromFormat(dateTo, this.dateFormats.input).startOf('day');
    return from.isValid && to.isValid && from > to;
  }

  /**
   * Returns the current validation message for a field.
   *
   * @param fieldId - The field id to get an error for.
   * @returns The field error message, or null when there is no error.
   */
  public getFieldError(fieldId: string): string | null {
    return this.fieldErrors()[fieldId] ?? null;
  }
}
