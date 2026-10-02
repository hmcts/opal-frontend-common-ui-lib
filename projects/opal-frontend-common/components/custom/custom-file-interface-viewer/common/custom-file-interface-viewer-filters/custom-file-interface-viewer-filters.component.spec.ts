import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { CustomFileInterfaceViewerFiltersComponent } from './custom-file-interface-viewer-filters.component';

describe('CustomFileInterfaceViewerFiltersComponent', () => {
  let component: CustomFileInterfaceViewerFiltersComponent;
  let fixture: ComponentFixture<CustomFileInterfaceViewerFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomFileInterfaceViewerFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomFileInterfaceViewerFiltersComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('direction', 'inbound');
    fixture.componentRef.setInput('businessUnitsAutoComplete', []);
    fixture.componentRef.setInput('fileSourceAutoComplete', []);
    fixture.componentRef.setInput('fileTypeAutoComplete', []);
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
