import { IHistoryDetailsDateFormat } from './history-details-date-format.interface';
import { THistoryDetailsTransformerConfig } from '../types/history-details-transformer-config.type';

export interface IHistoryTransformationConfig {
  aliasPathPrefixes: string[];
  dateFormat: IHistoryDetailsDateFormat;
  emptyValues: readonly unknown[];
  fallbackAliases: string[];
  historyItemTypeAliases: string[];
  transformers: THistoryDetailsTransformerConfig;
}
