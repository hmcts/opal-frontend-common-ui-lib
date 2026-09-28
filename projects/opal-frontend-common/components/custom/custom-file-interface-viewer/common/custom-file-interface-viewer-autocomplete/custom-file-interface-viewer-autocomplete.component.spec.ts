import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { beforeEach, describe, expect, it } from 'vitest';

import { CustomFileInterfaceViewerAutocompleteComponent } from './custom-file-interface-viewer-autocomplete.component';

describe('CustomFileInterfaceViewerAutocompleteComponent', () => {
  let component: CustomFileInterfaceViewerAutocompleteComponent;
  let fixture: ComponentFixture<CustomFileInterfaceViewerAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomFileInterfaceViewerAutocompleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomFileInterfaceViewerAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('labelText', 'Filter by business unit');
    fixture.componentRef.setInput('inputId', 'business-unit');
    fixture.componentRef.setInput('inputName', 'businessUnit');
    fixture.componentRef.setInput('autoCompleteItems', [
      {
        name: 'Libra',
        value: 'libra',
      },
      {
        name: 'Phoenix',
        value: 'phoenix',
      },
    ]);
    fixture.componentRef.setInput('control', new FormControl<string | null>(null));
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
