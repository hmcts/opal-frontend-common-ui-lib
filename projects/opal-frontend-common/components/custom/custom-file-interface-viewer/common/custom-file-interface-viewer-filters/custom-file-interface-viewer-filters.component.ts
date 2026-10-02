import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  ],
  templateUrl: './custom-file-interface-viewer-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomFileInterfaceViewerFiltersComponent extends AbstractFormBaseComponent {
  protected override fieldErrors: IAbstractFormBaseFieldErrors = {};

  @Input({ required: true }) public direction = '';
  @Input({ required: true }) public businessUnitsAutoComplete: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input({ required: true }) public fileSourceAutoComplete: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input({ required: true }) public fileTypeAutoComplete: IAlphagovAccessibleAutocompleteItem[] = [];

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

  public override form = this.filtersForm;

  public get dateFilter(): CustomFileInterfaceViewerDateFilter | null {
    return this.filtersForm.controls.dateFilter.value;
  }


  /*public handleSubmit(): void {
    this.filtersForm.markAllAsTouched();
    console.log('Filters submitted:', this.filtersForm.getRawValue());
  }
  */

  public onDateChange(controlName: CustomFileInterfaceViewerDateControlName, value: string): void {
    this.filtersForm.controls[controlName].setValue(value);
  }

  public getFieldError(controlName: string): string | null {
    return this.formControlErrorMessages?.[controlName] ?? null;
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }
}
