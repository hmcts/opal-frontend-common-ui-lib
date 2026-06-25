import { IHistoryTransformationConfig } from '../interfaces/history-transformation-service-config.interface';
import {
  createHistoryDetails,
  createHistoryTextPart,
  getHistoryString,
} from '../utils/history-transformation-service.utils';

const HISTORY_TEST_ALIAS_PATH_PREFIXES = ['', 'details.', 'data.', 'payload.'];
const HISTORY_TEST_DATE_FORMAT = {
  input: 'yyyy-MM-dd',
  output: 'dd/MM/yyyy',
};
const HISTORY_TEST_EMPTY_VALUES: readonly unknown[] = [null, undefined, ''];

export const HISTORY_TRANSFORMATION_CONFIG_MOCK: IHistoryTransformationConfig = {
  aliasPathPrefixes: HISTORY_TEST_ALIAS_PATH_PREFIXES,
  dateFormat: HISTORY_TEST_DATE_FORMAT,
  emptyValues: HISTORY_TEST_EMPTY_VALUES,
  fallbackAliases: ['details.description'],
  historyItemTypeAliases: ['type'],
  transformers: {
    note: (item) =>
      createHistoryDetails([
        createHistoryTextPart(
          getHistoryString(item, ['details.noteText'], HISTORY_TEST_ALIAS_PATH_PREFIXES, HISTORY_TEST_EMPTY_VALUES),
        ),
      ]),
  },
};
