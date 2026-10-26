import type { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { CUSTOM_FILE_INTERFACE_VIEWER_ALL_FILE_TYPES } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/constants';

export const CUSTOM_FILE_INTERFACE_VIEWER_ALL_TYPES_OPTION = {
  name: CUSTOM_FILE_INTERFACE_VIEWER_ALL_FILE_TYPES,
  value: '',
} as const satisfies IAlphagovAccessibleAutocompleteItem;
