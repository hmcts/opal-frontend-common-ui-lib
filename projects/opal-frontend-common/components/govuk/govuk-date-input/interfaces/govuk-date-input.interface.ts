interface IDateInput {
  inputName: string;
  inputClasses: string;
  inputId: string;
  inputLabel: string;
}

export interface IGovUkDateInputAutoCompleteValue {
  day: string;
  month: string;
  year: string;
}

export interface IGovUkDateInput {
  day: IDateInput;
  month: IDateInput;
  year: IDateInput;
}
