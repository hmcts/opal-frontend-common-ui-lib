import { ABSTRACT_REPORT_SUMMARY_LIST_FILTER_STATE } from '@hmcts/opal-frontend-common/components/abstract/abstract-report-summary-list-base/constants';

export const CUSTOM_FILE_INTERFACE_VIEWER_FILTER_FORM_DEFAULTS = {
  businessUnit: null,
  ...ABSTRACT_REPORT_SUMMARY_LIST_FILTER_STATE,
  fileType: null,
  source: null,
} as const;
