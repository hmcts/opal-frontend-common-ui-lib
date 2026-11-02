import type { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { CUSTOM_FILE_INTERFACE_VIEWER_FILES_ALL_BUSINESS_UNITS } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/constants';

export const CUSTOM_FILE_INTERFACE_VIEWER_ALL_BUSINESS_UNITS_OPTION = {
  name: CUSTOM_FILE_INTERFACE_VIEWER_FILES_ALL_BUSINESS_UNITS,
  value: '',
} as const satisfies IAlphagovAccessibleAutocompleteItem;
