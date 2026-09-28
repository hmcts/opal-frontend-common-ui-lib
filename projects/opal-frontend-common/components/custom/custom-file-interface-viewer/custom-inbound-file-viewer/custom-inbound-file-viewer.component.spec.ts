import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, it, expect } from 'vitest';

import { CustomFileInterfaceViewerAutocompleteComponent } from '../common/custom-file-interface-viewer-autocomplete/custom-file-interface-viewer-autocomplete.component';
import {
  InterfaceFileStatus,
  InterfaceFileSupportedDomain,
  InterfaceFileType,
  InterfaceType,
} from '../constants/custom-file-interface-viewer-enums.constant';
import { CustomInboundFileViewerComponent } from './custom-inbound-file-viewer.component';

describe('CustomInboundFileViewerComponent', () => {
  let component: CustomInboundFileViewerComponent;
  let fixture: ComponentFixture<CustomInboundFileViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomInboundFileViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomInboundFileViewerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('autoCompleteBusinessUnitItems', [
      {
        name: 'Libra',
        value: 'libra',
      },
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose file interface enums', () => {
    expect(component.interfaceType).toBe(InterfaceType);
    expect(component.interfaceFileType).toBe(InterfaceFileType);
    expect(component.interfaceFileSupportedDomain).toBe(InterfaceFileSupportedDomain);
    expect(component.interfaceFileStatus).toBe(InterfaceFileStatus);
  });

  it('should pass the business unit autocomplete inputs to the common autocomplete component', () => {
    const autocomplete = fixture.debugElement.query(By.directive(CustomFileInterfaceViewerAutocompleteComponent))
      .componentInstance as CustomFileInterfaceViewerAutocompleteComponent;

    expect(autocomplete.autoCompleteItems).toEqual([{ name: 'Libra', value: 'libra' }]);
    expect(autocomplete.control).toBe(component.businessUnitControl);
    expect(autocomplete.errors).toBeNull();
    expect(autocomplete.hintText).toBe(component.businessUnitAutocompleteHintText);
    expect(autocomplete.inputClasses).toBe(component.businessUnitAutocompleteInputClasses);
    expect(autocomplete.inputId).toBe(component.businessUnitAutocompleteInputId);
    expect(autocomplete.inputName).toBe(component.businessUnitAutocompleteInputName);
    expect(autocomplete.labelClasses).toBe(component.businessUnitAutocompleteLabelClasses);
    expect(autocomplete.labelText).toBe(component.businessUnitAutocompleteLabelText);
    expect(autocomplete.showAllValues).toBe(component.businessUnitAutocompleteShowAllValues);
  });

  it('should allow consuming apps to configure the business unit autocomplete label, input id, and input name', () => {
    fixture.componentRef.setInput('businessUnitAutocompleteLabelText', 'Choose a business unit');
    fixture.componentRef.setInput('businessUnitAutocompleteInputId', 'custom-business-unit-id');
    fixture.componentRef.setInput('businessUnitAutocompleteInputName', 'customBusinessUnitName');
    fixture.detectChanges();

    const autocomplete = fixture.debugElement.query(By.directive(CustomFileInterfaceViewerAutocompleteComponent))
      .componentInstance as CustomFileInterfaceViewerAutocompleteComponent;

    expect(autocomplete.labelText).toBe('Choose a business unit');
    expect(autocomplete.inputId).toBe('custom-business-unit-id');
    expect(autocomplete.inputName).toBe('customBusinessUnitName');
  });
});
