import type { ICustomDateFilterControls } from '@hmcts/opal-frontend-common/components/custom/custom-date-filter/interfaces';
import type { CustomDateFilterOption } from '@hmcts/opal-frontend-common/components/custom/custom-date-filter/types';
import {
  CUSTOM_DATE_FILTER_CUSTOM_DAYS,
  CUSTOM_DATE_FILTER_DATE_RANGE,
} from '@hmcts/opal-frontend-common/components/custom/custom-date-filter/constants';

/** Clears only date fields that do not apply to the selected option. */
export function clearInactiveCustomDateFilterFields(
  controls: ICustomDateFilterControls,
  dateFilter: CustomDateFilterOption | null,
): void {
  if (dateFilter !== CUSTOM_DATE_FILTER_CUSTOM_DAYS) {
    controls.days.setValue('', { emitEvent: false });
  }

  if (dateFilter !== CUSTOM_DATE_FILTER_DATE_RANGE) {
    controls.dateFrom.setValue('', { emitEvent: false });
    controls.dateTo.setValue('', { emitEvent: false });
  }
}
