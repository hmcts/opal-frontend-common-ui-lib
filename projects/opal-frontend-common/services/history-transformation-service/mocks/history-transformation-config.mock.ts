import { HISTORY_DETAILS_DEFAULT_ALIAS_PATH_PREFIXES } from '../constants/history-details-default-alias-path-prefixes.constant';
import { HISTORY_DETAILS_DEFAULT_DATE_FORMAT } from '../constants/history-details-default-date-format.constant';
import { HISTORY_DETAILS_DEFAULT_EMPTY_VALUES } from '../constants/history-details-default-empty-values.constant';
import { IHistoryTransformationConfig } from '../interfaces/history-transformation-service-config.interface';
import {
  createHistoryDetails,
  createHistoryTextPart,
  getHistoryString,
} from '../utils/history-transformation-service.utils';

export const HISTORY_TRANSFORMATION_CONFIG_MOCK: IHistoryTransformationConfig = {
  aliasPathPrefixes: HISTORY_DETAILS_DEFAULT_ALIAS_PATH_PREFIXES,
  dateFormat: HISTORY_DETAILS_DEFAULT_DATE_FORMAT,
  emptyValues: HISTORY_DETAILS_DEFAULT_EMPTY_VALUES,
  fallbackAliases: ['details.description'],
  historyItemTypeAliases: ['type'],
  transformers: {
    note: (item) =>
      createHistoryDetails([
        createHistoryTextPart(
          getHistoryString(
            item,
            ['details.noteText'],
            HISTORY_DETAILS_DEFAULT_ALIAS_PATH_PREFIXES,
            HISTORY_DETAILS_DEFAULT_EMPTY_VALUES,
          ),
        ),
      ]),
  },
};
