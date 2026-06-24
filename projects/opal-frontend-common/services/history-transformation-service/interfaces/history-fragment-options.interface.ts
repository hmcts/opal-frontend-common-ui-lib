import { IHistoryDetailsLink } from './history-details-link.interface';

export interface IHistoryFragmentOptions {
  bold?: boolean;
  hyphen?: boolean;
  link?: IHistoryDetailsLink | null;
}
