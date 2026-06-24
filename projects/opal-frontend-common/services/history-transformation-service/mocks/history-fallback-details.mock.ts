import { IHistoryDetails } from '../interfaces/history-details.interface';

export const HISTORY_FALLBACK_DETAILS_MOCK: IHistoryDetails = {
  line1: [
    {
      fragments: [{ text: 'Order generated', bold: false, hyphen: false }],
    },
  ],
  line2: null,
};
