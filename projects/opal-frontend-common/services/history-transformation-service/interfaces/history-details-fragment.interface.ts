import { IHistoryDetailsLink } from './history-details-link.interface';

export interface IHistoryDetailsFragment {
  text: string;
  bold: boolean;
  hyphen: boolean;
  link?: IHistoryDetailsLink | null;
}
