import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IAlphagovAccessibleAutocompleteItem } from '../../../alphagov/alphagov-accessible-autocomplete/interfaces/alphagov-accessible-autocomplete-item.interface';
import { CustomFileInterfaceViewerAutocompleteComponent } from '../common/custom-file-interface-viewer-autocomplete/custom-file-interface-viewer-autocomplete.component';
import {
  InterfaceFileStatus,
  InterfaceFileSupportedDomain,
  InterfaceFileType,
  InterfaceType,
} from '../constants/custom-file-interface-viewer-enums.constant';

type FinesReportsSummaryListFilterForm = FormGroup<{
  businessUnit: FormControl<string | null>;
}>;

@Component({
  selector: 'opal-lib-custom-inbound-file-viewer',
  imports: [CustomFileInterfaceViewerAutocompleteComponent, ReactiveFormsModule],
  templateUrl: './custom-inbound-file-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInboundFileViewerComponent {
  @Input({ required: true }) public autoCompleteBusinessUnitItems: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input({ required: false }) public businessUnitAutocompleteInputId = 'inbound-file-viewer-business-unit';
  @Input({ required: false }) public businessUnitAutocompleteInputName = 'inbound-file-viewer-business-unit';
  @Input({ required: false }) public businessUnitAutocompleteLabelText = 'Filter by business unit';

  @Input({ required: true })
  form!: FormGroup<{
    autoCompleteItemsBusinessUnits: FormControl<string | null>;
  }>;

  @Input({ required: true }) public autoCompleteItems: IAlphagovAccessibleAutocompleteItem[] = [];

  public readonly businessUnitAutocompleteHintText = '';
  public readonly businessUnitAutocompleteInputClasses = '';
  public readonly businessUnitAutocompleteLabelClasses = 'govuk-label--s';
  public readonly businessUnitAutocompleteShowAllValues = true;
  public readonly interfaceFileStatus = InterfaceFileStatus;
  public readonly interfaceFileSupportedDomain = InterfaceFileSupportedDomain;
  public readonly interfaceFileType = InterfaceFileType;
  public readonly interfaceType = InterfaceType;

  // 1 element for now
  public readonly filtersForm: FinesReportsSummaryListFilterForm = new FormGroup({
    businessUnit: new FormControl<string | null>(null),
  });

  public get businessUnitControl(): FormControl<string | null> {
    return this.filtersForm.controls.businessUnit;
  }

  public get businessUnitErrors(): string | null {
    return this.businessUnitControl.touched && this.businessUnitControl.errors ? 'Select a valid business unit' : null;
  }

  handleSubmit(): void {
    console.log('Form raw value' + JSON.stringify(this.filtersForm.getRawValue()));
  }
}
