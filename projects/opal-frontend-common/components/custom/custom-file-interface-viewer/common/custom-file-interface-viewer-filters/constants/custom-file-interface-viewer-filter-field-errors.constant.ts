import type { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

export const CUSTOM_FILE_INTERFACE_VIEWER_FILTER_FIELD_ERRORS: IAbstractFormBaseFieldErrors = {
  days: {
    required: {
      message: 'Enter the number of days',
      priority: 1,
    },
    numericalTextPattern: {
      message: 'Days must be a number',
      priority: 2,
    },
    zeroValue: {
      message: 'Days must be greater than zero',
      priority: 3,
    },
  },
  dateFrom: {
    required: {
      message: 'You must enter at least 1 of date from or date to',
      priority: 1,
    },
    dateFromAfterDateTo: {
      message: 'The Date from cannot be after the Date to',
      priority: 4,
    },
    invalidDateFormat: {
      message: 'Date from must be in the format DD/MM/YYYY',
      priority: 1,
    },
    invalidDate: {
      message: 'Date from must be a real date',
      priority: 2,
    },
    invalidFutureDate: {
      message: 'Date from must be in the past',
      priority: 3,
    },
  },
  dateTo: {
    invalidDateFormat: {
      message: 'Date to must be in the format DD/MM/YYYY',
      priority: 1,
    },
    invalidDate: {
      message: 'Date to must be a real date',
      priority: 2,
    },
    invalidFutureDate: {
      message: 'Date to must be in the past',
      priority: 3,
    },
  },
};
