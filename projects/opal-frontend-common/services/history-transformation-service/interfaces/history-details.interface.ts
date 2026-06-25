import { IHistoryDetailsPart } from './history-details-part.interface';

export interface IHistoryDetails {
  line1: IHistoryDetailsPart[];
  line2: IHistoryDetailsPart[] | null;
}
