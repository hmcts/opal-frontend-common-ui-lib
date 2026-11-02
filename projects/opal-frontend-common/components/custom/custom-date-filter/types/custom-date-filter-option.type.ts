import {
  CUSTOM_DATE_FILTER_LAST_7_DAYS,
  CUSTOM_DATE_FILTER_CUSTOM_DAYS,
  CUSTOM_DATE_FILTER_DATE_RANGE,
} from '@hmcts/opal-frontend-common/components/custom/custom-date-filter/constants';

export type CustomDateFilterOption =
  typeof CUSTOM_DATE_FILTER_LAST_7_DAYS | typeof CUSTOM_DATE_FILTER_CUSTOM_DAYS | typeof CUSTOM_DATE_FILTER_DATE_RANGE;
