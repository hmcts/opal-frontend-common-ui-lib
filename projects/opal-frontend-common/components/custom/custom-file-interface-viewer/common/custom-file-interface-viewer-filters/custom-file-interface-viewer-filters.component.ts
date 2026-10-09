import { ChangeDetectionStrategy, Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import {
  GovukRadioComponent,
  GovukRadiosItemComponent,
} from '@hmcts/opal-frontend-common/components/govuk/govuk-radio';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';

import {
  CUSTOM_FILE_INTERFACE_VIEWER_ALL_FILE_SOURCES,
  CUSTOM_FILE_INTERFACE_VIEWER_ALL_FILE_TYPES,
  CUSTOM_FILE_INTERFACE_VIEWER_FILES_ALL_BUSINESS_UNITS,
} from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/constants';
import {
  CUSTOM_FILE_INTERFACE_VIEWER_DATE_FILTER_CUSTOM_DAYS,
  CUSTOM_FILE_INTERFACE_VIEWER_DATE_FILTER_DATE_RANGE,
  CUSTOM_FILE_INTERFACE_VIEWER_DATE_FILTER_LAST_7_DAYS,
  CUSTOM_FILE_INTERFACE_VIEWER_DATE_FILTER_STATE,
} from './constants/custom-file-interface-viewer-date-filter.constant';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { futureDateValidator } from '@hmcts/opal-frontend-common/validators/future-date';
import { nonZeroValueValidator } from '@hmcts/opal-frontend-common/validators/non-zero-value';
import { optionalValidDateValidator } from '@hmcts/opal-frontend-common/validators/optional-valid-date';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';

type CustomFileInterfaceViewerDateFilter = 'last7Days' | 'customDays' | 'dateRange';
type CustomFileInterfaceViewerDateControlName = 'dateFrom' | 'dateTo';

type CustomFileInterfaceViewerFilterForm = FormGroup<{
  businessUnit: FormControl<string | null>;
  dateFilter: FormControl<CustomFileInterfaceViewerDateFilter | null>;
  days: FormControl<string | null>;
  dateFrom: FormControl<string | null>;
  dateTo: FormControl<string | null>;
  fileType: FormControl<string | null>;
  source: FormControl<string | null>;
}>;

@Component({
  selector: 'opal-lib-custom-file-interface-viewer-filters',
  imports: [
    AlphagovAccessibleAutocompleteComponent,
    GovukRadioComponent,
    GovukRadiosItemComponent,
    MojDatePickerComponent,
    ReactiveFormsModule,
    GovukErrorSummaryComponent,
  ],
  templateUrl: './custom-file-interface-viewer-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomFileInterfaceViewerFiltersComponent extends AbstractFormBaseComponent implements OnInit {
  private readonly dateService = inject(DateService);

  @ViewChild('errorSummary', { read: ElementRef })
  private readonly errorSummary?: ElementRef<HTMLElement>;

  protected override fieldErrors: IAbstractFormBaseFieldErrors = {
    days: {
      required: {
        message: 'Enter the number of days',
        priority: 1,
      },
      numericalTextPattern: {
        message: 'Days must be a number',
        priority: 2,
      },
      zeroValue: {
        message: 'Days must be greater than zero',
        priority: 3,
      },
    },
    dateFrom: {
      invalidDateFormat: {
        message: 'Date from must be in the format DD/MM/YYYY',
        priority: 1,
      },
      invalidDate: {
        message: 'Date from must be a real date',
        priority: 2,
      },
      invalidFutureDate: {
        message: 'Date from must be in the past',
        priority: 3,
      },
    },
    dateTo: {
      invalidDateFormat: {
        message: 'Date to must be in the format DD/MM/YYYY',
        priority: 1,
      },
      invalidDate: {
        message: 'Date to must be a real date',
        priority: 2,
      },
      invalidFutureDate: {
        message: 'Date to must be in the past',
        priority: 3,
      },
    },
  };

  @Input({ required: true }) public isInbound: boolean = false;
  @Input({ required: true }) public businessUnits: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input({ required: true }) public source: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input({ required: true }) public sourceList: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input({ required: true }) public domain: string = '';

  public readonly dateFilterCustomDays = CUSTOM_FILE_INTERFACE_VIEWER_DATE_FILTER_CUSTOM_DAYS;
  public readonly dateFilterDateRange = CUSTOM_FILE_INTERFACE_VIEWER_DATE_FILTER_DATE_RANGE;
  public readonly dateFilterLast7Days = CUSTOM_FILE_INTERFACE_VIEWER_DATE_FILTER_LAST_7_DAYS;
  public readonly filtersForm: CustomFileInterfaceViewerFilterForm = new FormGroup({
    businessUnit: new FormControl<string | null>(CUSTOM_FILE_INTERFACE_VIEWER_FILES_ALL_BUSINESS_UNITS),
    dateFilter: new FormControl<CustomFileInterfaceViewerDateFilter | null>(
      CUSTOM_FILE_INTERFACE_VIEWER_DATE_FILTER_STATE.dateFilter as CustomFileInterfaceViewerDateFilter,
    ),
    days: new FormControl<string | null>(CUSTOM_FILE_INTERFACE_VIEWER_DATE_FILTER_STATE.days),
    dateFrom: new FormControl<string | null>(CUSTOM_FILE_INTERFACE_VIEWER_DATE_FILTER_STATE.dateFrom),
    dateTo: new FormControl<string | null>(CUSTOM_FILE_INTERFACE_VIEWER_DATE_FILTER_STATE.dateTo),
    fileType: new FormControl<string | null>(CUSTOM_FILE_INTERFACE_VIEWER_ALL_FILE_TYPES),
    source: new FormControl<string | null>(CUSTOM_FILE_INTERFACE_VIEWER_ALL_FILE_SOURCES),
  });

  public override form: CustomFileInterfaceViewerFilterForm = this.filtersForm;

  private focusFilterErrorSummary(): void {
    setTimeout(() => {
      this.errorSummary?.nativeElement.querySelector<HTMLElement>('.govuk-error-summary')?.focus();
    });
  }

  private setupDateFilterValidation(): void {
    const dateFilterControl = this.filtersForm.controls.dateFilter;
    this.applyDateFilterValidators(dateFilterControl.value);

    dateFilterControl.valueChanges.subscribe((dateFilter) => {
      this.applyDateFilterValidators(dateFilter);
    });
  }

  private applyDateFilterValidators(dateFilter: CustomFileInterfaceViewerDateFilter | null): void {
    console.log('applyDateFilterValidators starts', dateFilter);
    const { days, dateFrom, dateTo } = this.filtersForm.controls;

    days.clearValidators();
    dateFrom.clearValidators();
    dateTo.clearValidators();

    days.setErrors(null);
    dateFrom.setErrors(null);
    dateTo.setErrors(null);

    switch (dateFilter) {
      case 'customDays':
        dateFrom.setValue('', { emitEvent: false });
        dateTo.setValue('', { emitEvent: false });
        days.setValidators([
          Validators.required,
          patternValidator(/^\d+$/, 'numericalTextPattern'),
          nonZeroValueValidator(),
        ]);
        break;
      case 'dateRange':
        days.setValue('', { emitEvent: false });
        dateFrom.setValidators([optionalValidDateValidator(), futureDateValidator()]);
        dateTo.setValidators([optionalValidDateValidator(), futureDateValidator()]);
        break;
      default:
        days.setValue('', { emitEvent: false });
        dateFrom.setValue('', { emitEvent: false });
        dateTo.setValue('', { emitEvent: false });
        break;
    }

    days.updateValueAndValidity();
    dateFrom.updateValueAndValidity();
    dateTo.updateValueAndValidity();
    console.log('applyDateFilterValidators ends', dateFilter);
  }

  private addDateRangeValidationErrors(): void {
    console.log('addDateRangeValidationErrors starts');
    const { dateFilter, dateFrom, dateTo } = this.filtersForm.controls;

    if (dateFilter.value !== 'dateRange') {
      return;
    }
    console.log('addDateRangeValidationErrors - main');

    if (!dateFrom.value && !dateTo.value) {
      console.log('addDateRangeValidationErrors - main no dates');
      this.addDateRangeFieldError('You must enter at least 1 of date from or date to');
      return;
    }

    if (dateFrom.invalid || dateTo.invalid || !dateFrom.value || !dateTo.value) {
      console.log('addDateRangeValidationErrors - invalid');
      return;
    }

    console.log('addDateRangeValidationErrors - convert');
    const from = this.dateService.getFromFormat(dateFrom.value, 'dd/MM/yyyy').startOf('day');
    const to = this.dateService.getFromFormat(dateTo.value, 'dd/MM/yyyy').startOf('day');

    if (from.isValid && to.isValid && from > to) {
      console.log('addDateRangeValidationErrors -The Date from cannot');
      this.addDateRangeFieldError('The Date from cannot be after the Date to');
    }
    console.log('addDateRangeValidationErrors ends');
  }

  private addDateRangeFieldError(message: string): void {
    console.log('addDateRangeFieldErrorstarts', message);
    this.formControlErrorMessages['dateFrom'] = message;

    this.formErrorSummaryMessage.push({
      fieldId: 'custom-file-interface-viewer-date-from',
      message,
    });
    console.log('addDateRangeFieldError ends', message);
  }

  public get dateFilter(): CustomFileInterfaceViewerDateFilter | null {
    return this.filtersForm.controls.dateFilter.value;
  }

  public onDateChange(controlName: CustomFileInterfaceViewerDateControlName, value: string): void {
    this.filtersForm.controls[controlName].setValue(value);
  }

  public getFieldError(controlName: string): string | null {
    console.log('getFieldError triggered for ', controlName);
    return this.formControlErrorMessages?.[controlName] ?? null;
  }

  public override handleFormSubmit(event: SubmitEvent): void {
    void event;
    this.handleErrorMessages();
    this.addDateRangeValidationErrors();

    if (this.form.invalid || this.formErrorSummaryMessage.length) {
      this.focusFilterErrorSummary();
      return;
    }

    this.formSubmitted = true;
    this.formSubmit.emit({
      formData: this.filtersForm.value,
      nestedFlow: false,
    });

    this.filtersForm.markAsPristine();
  }

  override ngOnInit(): void {
    this.setupDateFilterValidation();
    super.ngOnInit();
  }
}
