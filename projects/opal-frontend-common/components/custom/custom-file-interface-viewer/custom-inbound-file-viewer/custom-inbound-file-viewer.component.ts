import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IAlphagovAccessibleAutocompleteItem } from '@hmcts/opal-frontend-common/components/alphagov/alphagov-accessible-autocomplete/interfaces';
import { CustomFileInterfaceViewerFiltersComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-filters';
import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';

@Component({
  selector: 'opal-lib-custom-inbound-file-viewer',
  imports: [CustomFileInterfaceViewerFiltersComponent],
  templateUrl: './custom-inbound-file-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomInboundFileViewerComponent implements OnInit, OnDestroy {
  @Input({ required: true }) public businessUnitsAutoComplete: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input({ required: true }) public direction = '';
  @Input({ required: true }) public fileSourceAutoComplete: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input({ required: true }) public fileTypeAutoComplete: IAlphagovAccessibleAutocompleteItem[] = [];

  @Output() public formSubmit = new EventEmitter<IAbstractFormBaseForm<unknown>>();

  public ngOnInit(): void {
    console.log('CustomInboundFileViewerComponent initialized with direction:', this.direction);
  }

  public ngOnDestroy(): void {
    console.log('CustomInboundFileViewerComponent destroyed');
  }
}
