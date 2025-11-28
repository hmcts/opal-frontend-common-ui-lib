export interface ITransformItemDateConfig {
  inputFormat: string;
  outputFormat: string;
}

export interface ITransformItemTimeConfig {
  addOffset: boolean;
  removeOffset: boolean;
}

export interface ITransformItemNINumberConfig {
  addSpaces: boolean;
  removeSpaces: boolean;
}

export interface ITransformItem {
  key: string;
  transformType: string;
  dateConfig: ITransformItemDateConfig | null;
  timeConfig: ITransformItemTimeConfig | null;
  niNumberConfig: ITransformItemNINumberConfig | null;
}
