export interface IFilterOption {
  label: string;
  value: string | number;
  count: number;
  selected: boolean;
}

export interface IFilterCategory {
  categoryName: string;
  options: IFilterOption[];
}
