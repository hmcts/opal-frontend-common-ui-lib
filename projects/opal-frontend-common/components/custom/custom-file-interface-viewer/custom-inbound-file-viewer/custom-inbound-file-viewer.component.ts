import { ChangeDetectionStrategy, booleanAttribute, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
  @Input({ required: true }) public businessUnits: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input({ required: true }) public source: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input({ required: true }) public sourceList: IAlphagovAccessibleAutocompleteItem[] = [];
  @Input({ required: true }) public domain: string = '';
  @Input({ transform: booleanAttribute }) public isInbound: boolean = false;

  @Output() public formSubmit = new EventEmitter<IAbstractFormBaseForm<unknown>>();

  public ngOnInit(): void {
    console.log('CustomInboundFileViewerComponent initialized with direction:', this.isInbound ? 'inbound' : 'outbound');
  }

  public ngOnDestroy(): void {
    console.log('CustomInboundFileViewerComponent destroyed');
  }
}
