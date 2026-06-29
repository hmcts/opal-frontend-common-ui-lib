import { IHistoryMappingFragmentPrefixOptions } from './history-mapping-fragment-prefix-options.interface';

export interface IHistoryMappingDetailsTextOptions extends IHistoryMappingFragmentPrefixOptions {
  detailsLineSeparator: string;
  fragmentJoiner?: string;
  partSeparator: string;
}
