import type { FormControl } from '@angular/forms';
import type { ICustomDateFilterControls } from '@hmcts/opal-frontend-common/components/custom/custom-date-filter/interfaces';

export interface ICustomFileInterfaceViewerFilterFormControls extends ICustomDateFilterControls {
  businessUnit: FormControl<string | null>;
  fileType: FormControl<string | null>;
  source: FormControl<string | null>;
}
