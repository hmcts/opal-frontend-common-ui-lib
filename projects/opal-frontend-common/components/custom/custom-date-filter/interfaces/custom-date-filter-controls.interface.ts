import { FormControl } from '@angular/forms';

import type { CustomDateFilterOption } from '@hmcts/opal-frontend-common/components/custom/custom-date-filter/types';

/** Parent-owned controls can belong to a form containing any other filters. */
export interface ICustomDateFilterControls {
  dateFilter: FormControl<CustomDateFilterOption | null>;
  days: FormControl<string | null>;
  dateFrom: FormControl<string | null>;
  dateTo: FormControl<string | null>;
}
