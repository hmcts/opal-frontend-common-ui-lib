import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  Input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { CustomDateFilterComponent } from '@hmcts/opal-frontend-common/components/custom/custom-date-filter';
import type { CustomDateFilterOption } from '@hmcts/opal-frontend-common/components/custom/custom-date-filter/types';
import { clearInactiveCustomDateFilterFields } from '@hmcts/opal-frontend-common/components/custom/custom-date-filter/utils';

import { CUSTOM_FILE_INTERFACE_VIEWER_ALL_BUSINESS_UNITS_OPTION } from './constants/custom-file-interface-viewer-all-business-units-option.constant';
import { CUSTOM_FILE_INTERFACE_VIEWER_ALL_SOURCES_OPTION } from './constants/custom-file-interface-viewer-all-sources-option.constant';
import { CUSTOM_FILE_INTERFACE_VIEWER_ALL_TYPES_OPTION } from './constants/custom-file-interface-viewer-all-types-option.constant';
import { CUSTOM_FILE_INTERFACE_VIEWER_FILTER_FORM_DEFAULTS } from './constants/custom-file-interface-viewer-filter-form-defaults.constant';
import { CUSTOM_FILE_INTERFACE_VIEWER_FILTER_FIELD_ERRORS } from './constants/custom-file-interface-viewer-filter-field-errors.constant';
import { CUSTOM_FILE_INTERFACE_VIEWER_DATE_FILTER_FIELD_IDS } from './constants/custom-file-interface-viewer-date-filter-field-ids.constant';
import { CustomFileInterfaceViewerFilterForm } from './types/custom-file-interface-viewer-filter-form.type';
import { AbstractFormBaseComponent } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base';
import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import {
  getCustomFileInterfaceViewerDateFilterErrors,
  setCustomFileInterfaceViewerDateValidators,
  validateCustomFileInterfaceViewerDateRange,
} from './utils/custom-file-interface-viewer-filters.utils';

@Component({
  selector: 'opal-lib-custom-file-interface-viewer-filters',
  imports: [
    AlphagovAccessibleAutocompleteComponent,
    CustomDateFilterComponent,
    ReactiveFormsModule,
    GovukErrorSummaryComponent,
  ],
  templateUrl: './custom-file-interface-viewer-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomFileInterfaceViewerFiltersComponent extends AbstractFormBaseComponent implements OnInit {
  private readonly dateService = inject(DateService);
  private readonly businessUnitOptions = signal<IAlphagovAccessibleAutocompleteItem[]>([]);
  private readonly sourceOptions = signal<IAlphagovAccessibleAutocompleteItem[]>([]);
  private readonly typeOptions = signal<IAlphagovAccessibleAutocompleteItem[]>([]);

  @ViewChild('errorSummary', { read: ElementRef })
  private readonly errorSummary?: ElementRef<HTMLElement>;

  protected override fieldErrors: IAbstractFormBaseFieldErrors = structuredClone(
    CUSTOM_FILE_INTERFACE_VIEWER_FILTER_FIELD_ERRORS,
  );

  @Input({ required: true }) public isInbound: boolean = false;
  /**
   * Updates the permitted business-unit choices used by the filter.
   * @param value - Business-unit names and API codes, excluding the All option.
   */
  @Input({ required: true }) public set businessUnits(value: IAlphagovAccessibleAutocompleteItem[]) {
    this.businessUnitOptions.set(value);
  }
  /**
   * Updates the available source choices used by the filter.
   * @param value - Source names and API values, excluding the All option.
   */
  @Input({ required: true }) public set source(value: IAlphagovAccessibleAutocompleteItem[]) {
    this.sourceOptions.set(value);
  }
  /**
   * Updates the available file-type choices used by the filter.
   * @param value - File-type names and API values, excluding the All option.
   */
  @Input({ required: true }) public set sourceList(value: IAlphagovAccessibleAutocompleteItem[]) {
    this.typeOptions.set(value);
  }

  public readonly businessUnitFilterOptions = computed(() => [
    CUSTOM_FILE_INTERFACE_VIEWER_ALL_BUSINESS_UNITS_OPTION,
    ...this.businessUnitOptions(),
  ]);
  public readonly sourceFilterOptions = computed(() => [
    CUSTOM_FILE_INTERFACE_VIEWER_ALL_SOURCES_OPTION,
    ...this.sourceOptions(),
  ]);
  public readonly typeFilterOptions = computed(() => [
    CUSTOM_FILE_INTERFACE_VIEWER_ALL_TYPES_OPTION,
    ...this.typeOptions(),
  ]);

  public readonly dateFilterFieldIds = CUSTOM_FILE_INTERFACE_VIEWER_DATE_FILTER_FIELD_IDS;
  public dateFilterErrors: Readonly<Record<string, string>> = {};
  public readonly filtersForm: CustomFileInterfaceViewerFilterForm = new FormGroup({
    businessUnit: new FormControl<string | null>(CUSTOM_FILE_INTERFACE_VIEWER_FILTER_FORM_DEFAULTS.businessUnit),
    dateFilter: new FormControl<CustomDateFilterOption | null>(
      CUSTOM_FILE_INTERFACE_VIEWER_FILTER_FORM_DEFAULTS.dateFilter,
    ),
    days: new FormControl<string | null>(CUSTOM_FILE_INTERFACE_VIEWER_FILTER_FORM_DEFAULTS.days),
    dateFrom: new FormControl<string | null>(CUSTOM_FILE_INTERFACE_VIEWER_FILTER_FORM_DEFAULTS.dateFrom),
    dateTo: new FormControl<string | null>(CUSTOM_FILE_INTERFACE_VIEWER_FILTER_FORM_DEFAULTS.dateTo),
    fileType: new FormControl<string | null>(CUSTOM_FILE_INTERFACE_VIEWER_FILTER_FORM_DEFAULTS.fileType),
    source: new FormControl<string | null>(CUSTOM_FILE_INTERFACE_VIEWER_FILTER_FORM_DEFAULTS.source),
  });

  public override form: CustomFileInterfaceViewerFilterForm = this.filtersForm;

  /**
   * Moves focus to the filter error summary after validation messages are rendered.
   */
  private focusFilterErrorSummary(): void {
    setTimeout(() => {
      this.errorSummary?.nativeElement.querySelector<HTMLElement>('.govuk-error-summary')?.focus();
    });
  }

  /**
   * Applies date validators for the initial selection and subsequent radio changes.
   */
  private setupDateFilterValidation(): void {
    const dateFilterControl = this.filtersForm.controls.dateFilter;
    clearInactiveCustomDateFilterFields(this.filtersForm.controls, dateFilterControl.value);
    setCustomFileInterfaceViewerDateValidators(this.filtersForm.controls);

    dateFilterControl.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
      setCustomFileInterfaceViewerDateValidators(this.filtersForm.controls);
    });
  }

  /**
   * Gets the permitted business-unit choices supplied to the filter.
   * @returns Business-unit choices without the synthetic All option.
   */
  public get businessUnits(): IAlphagovAccessibleAutocompleteItem[] {
    return this.businessUnitOptions();
  }

  /**
   * Gets the source choices supplied to the filter.
   * @returns Source choices without the synthetic All option.
   */
  public get source(): IAlphagovAccessibleAutocompleteItem[] {
    return this.sourceOptions();
  }

  /**
   * Gets the file-type choices supplied to the filter.
   * @returns File-type choices without the synthetic All option.
   */
  public get sourceList(): IAlphagovAccessibleAutocompleteItem[] {
    return this.typeOptions();
  }

  /**
   * Validates the filters, emits valid form data and marks the applied form pristine.
   *
   * @param event - Native form submission event.
   */
  public override handleFormSubmit(event: SubmitEvent): void {
    event.preventDefault();
    validateCustomFileInterfaceViewerDateRange(this.filtersForm.controls, this.dateService);
    this.handleErrorMessages();
    this.dateFilterErrors = getCustomFileInterfaceViewerDateFilterErrors(this.formControlErrorMessages);

    if (this.form.invalid) {
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

  /**
   * Initializes date validators and the inherited form behavior.
   */
  override ngOnInit(): void {
    this.setupDateFilterValidation();
    super.ngOnInit();
  }
}
