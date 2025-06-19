export interface IFilterOption {
  label: string;
  value: string | number;
  count: number;
  selected: boolean;
}

export interface IFilterSelectedTagGroup {
  categoryName: string;
  options: IFilterOption[];
}
