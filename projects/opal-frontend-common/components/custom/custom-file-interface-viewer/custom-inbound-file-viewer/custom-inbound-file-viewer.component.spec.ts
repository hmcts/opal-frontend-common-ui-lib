import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';

import { CustomFileInterfaceViewerFiltersComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-filters';
import {
  CustomFileInterfaceViewerFileStatus,
  CustomFileInterfaceViewerFileSupportedDomain,
  CustomFileInterfaceViewerFileType,
} from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/constants';
import {
  CustomInboundAutocompleteField,
  CustomInboundFileViewerComponent,
  CustomInboundFileViewerControl,
  CustomInboundFileViewerItem,
} from './custom-inbound-file-viewer.component';

describe('CustomInboundFileViewerComponent', () => {
  let component: CustomInboundFileViewerComponent;
  let fixture: ComponentFixture<CustomInboundFileViewerComponent>;
  let inboundControl: CustomInboundFileViewerControl;
  let outboundControl: CustomInboundFileViewerControl;
  let items: CustomInboundFileViewerItem[];

  const businessUnitsAutoComplete = [{ name: 'Business unit', value: 'business-unit' }];
  const fileSourceAutoComplete = [{ name: 'Source', value: 'source' }];
  const fileTypeAutoComplete = [{ name: 'Type', value: 'type' }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomInboundFileViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomInboundFileViewerComponent);
    component = fixture.componentInstance;
    inboundControl = new FormControl<string | null>(null);
    outboundControl = new FormControl<string | null>(null);
    items = [
      {
        autoCompleteItems: [{ name: 'Libra', value: 'libra' }],
        control: inboundControl,
        id: 'inbound-custom-field',
        inputId: 'inbound-custom',
        inputName: 'inboundCustom',
        labelText: 'Inbound custom',
        type: 'autocomplete',
      },
      {
        autoCompleteItems: [{ name: 'Phoenix', value: 'phoenix' }],
        control: outboundControl,
        id: 'outbound-custom-field',
        inputId: 'outbound-custom',
        inputName: 'outboundCustom',
        labelText: 'Outbound custom',
        type: 'autocomplete',
        errorMessage: 'Select a valid outbound custom',
      },
    ];
    fixture.componentRef.setInput('businessUnitsAutoComplete', businessUnitsAutoComplete);
    fixture.componentRef.setInput('direction', 'inbound');
    fixture.componentRef.setInput('fileSourceAutoComplete', fileSourceAutoComplete);
    fixture.componentRef.setInput('fileTypeAutoComplete', fileTypeAutoComplete);
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose file interface enums', () => {
    expect(component.interfaceFileType).toBe(CustomFileInterfaceViewerFileType);
    expect(component.interfaceFileSupportedDomain).toBe(CustomFileInterfaceViewerFileSupportedDomain);
    expect(component.interfaceFileStatus).toBe(CustomFileInterfaceViewerFileStatus);
  });

  it('should render the common filters component', () => {
    const filters = fixture.debugElement.query(By.directive(CustomFileInterfaceViewerFiltersComponent))
      .componentInstance as CustomFileInterfaceViewerFiltersComponent;

    expect(filters).toBeTruthy();
  });

  it('should pass filter inputs to the common filters component', () => {
    const filters = fixture.debugElement.query(By.directive(CustomFileInterfaceViewerFiltersComponent))
      .componentInstance as CustomFileInterfaceViewerFiltersComponent;

    expect(filters.businessUnitsAutoComplete).toBe(businessUnitsAutoComplete);
    expect(filters.direction).toBe('inbound');
    expect(filters.fileSourceAutoComplete).toBe(fileSourceAutoComplete);
    expect(filters.fileTypeAutoComplete).toBe(fileTypeAutoComplete);
  });

  it('should keep each configured field linked to its own parent form control', () => {
    inboundControl.setValue('libra');
    outboundControl.setValue('phoenix');

    const autocompleteItems = items as CustomInboundAutocompleteField[];

    expect(autocompleteItems[0].control.value).toBe('libra');
    expect(autocompleteItems[1].control.value).toBe('phoenix');
  });

  it('should use the configured field error message when its control is invalid and touched', () => {
    outboundControl.setErrors({ invalid: true });
    outboundControl.markAsTouched();

    expect(component.getAutocompleteErrors(items[1])).toBe('Select a valid outbound custom');
  });
});
