export interface ITransformItem {
  key: string;
  transformType: string;
  dateInputFormat?: string | null;
  dateOutputFormat?: string | null;
  timeInputFormat?: string | null;
  timeOutputFormat?: string | null;
}
