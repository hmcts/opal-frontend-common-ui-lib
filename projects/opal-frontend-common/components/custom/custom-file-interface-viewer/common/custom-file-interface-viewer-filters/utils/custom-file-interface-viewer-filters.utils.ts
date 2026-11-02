import { Validators } from '@angular/forms';
import type { IAbstractFormControlErrorMessage } from '@hmcts/opal-frontend-common/components/abstract/interfaces';
import {
  CUSTOM_DATE_FILTER_CUSTOM_DAYS,
  CUSTOM_DATE_FILTER_DATE_RANGE,
} from '@hmcts/opal-frontend-common/components/custom/custom-date-filter/constants';
import type { ICustomDateFilterControls } from '@hmcts/opal-frontend-common/components/custom/custom-date-filter/interfaces';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { futureDateValidator } from '@hmcts/opal-frontend-common/validators/future-date';
import { nonZeroValueValidator } from '@hmcts/opal-frontend-common/validators/non-zero-value';
import { optionalValidDateValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-date';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';
import { CUSTOM_FILE_INTERFACE_VIEWER_DATE_FILTER_FIELD_IDS } from '../constants/custom-file-interface-viewer-date-filter-field-ids.constant';

/**
 * Applies existing library validators only to fields used by the selected date mode.
 * @param controls - Parent-owned date filter controls.
 */
export function setCustomFileInterfaceViewerDateValidators(controls: ICustomDateFilterControls): void {
  const { dateFilter, days, dateFrom, dateTo } = controls;
  const customDays = dateFilter.value === CUSTOM_DATE_FILTER_CUSTOM_DAYS;
  const dateRange = dateFilter.value === CUSTOM_DATE_FILTER_DATE_RANGE;

  days.setValidators(
    customDays ? [Validators.required, patternValidator(/^\d+$/, 'numericalTextPattern'), nonZeroValueValidator()] : [],
  );
  const dateValidators = dateRange ? [optionalValidDateValidator(), futureDateValidator()] : [];
  dateFrom.setValidators(dateValidators);
  dateTo.setValidators(dateValidators);

  for (const control of [days, dateFrom, dateTo]) {
    control.updateValueAndValidity({ emitEvent: false });
  }
}

/**
 * Applies cross-field date-range errors for the standard form-base error definitions.
 * @param controls - Parent-owned date filter controls.
 * @param dateService - Existing date service used to compare calendar dates.
 */
export function validateCustomFileInterfaceViewerDateRange(
  controls: ICustomDateFilterControls,
  dateService: DateService,
): void {
  const { dateFilter, dateFrom, dateTo } = controls;
  dateFrom.updateValueAndValidity({ emitEvent: false });

  if (dateFilter.value !== CUSTOM_DATE_FILTER_DATE_RANGE) {
    return;
  }

  if (!dateFrom.value && !dateTo.value) {
    dateFrom.setErrors({ required: true });
    return;
  }

  if (dateFrom.invalid || dateTo.invalid || !dateFrom.value || !dateTo.value) {
    return;
  }

  if (dateService.calculateDaysBetweenDates(dateFrom.value, dateTo.value) < 0) {
    dateFrom.setErrors({ dateFromAfterDateTo: true });
  }
}

/**
 * Adapts form-base messages to the shared date component's generated field IDs.
 * @param messages - Messages resolved by AbstractFormBase using field-error priorities.
 * @returns Inline date messages keyed by their rendered input IDs.
 */
export function getCustomFileInterfaceViewerDateFilterErrors(
  messages: IAbstractFormControlErrorMessage,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(CUSTOM_FILE_INTERFACE_VIEWER_DATE_FILTER_FIELD_IDS).map(([controlName, fieldId]) => [
      fieldId,
      messages[controlName] ?? '',
    ]),
  );
}
