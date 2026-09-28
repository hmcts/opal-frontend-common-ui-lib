import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { AlphagovAccessibleAutocompleteComponent } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';

@Component({
  selector: 'opal-lib-custom-file-interface-viewer-autocomplete',
  imports: [AlphagovAccessibleAutocompleteComponent],
  templateUrl: './custom-file-interface-viewer-autocomplete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomFileInterfaceViewerAutocompleteComponent {
  @Input({ required: true }) public autoCompleteItems: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input({ required: true }) public control: AbstractControl | null = null;
  @Input({ required: false }) public errors: string | null = null;
  @Input({ required: false }) public hintText = '';
  @Input({ required: false }) public inputClasses = '';
  @Input({ required: true }) public inputId = '';
  @Input({ required: true }) public inputName = '';
  @Input({ required: false }) public labelClasses = 'govuk-label--s';
  @Input({ required: true }) public labelText = '';
  @Input({ required: false }) public showAllValues = true;
  @Input({ required: false }) public suggestionTemplate?: (label: string) => string;
}
