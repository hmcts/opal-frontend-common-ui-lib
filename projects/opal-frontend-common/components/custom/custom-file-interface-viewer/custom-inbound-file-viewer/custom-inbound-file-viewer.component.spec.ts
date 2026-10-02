import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { IAbstractFormBaseForm } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { CustomFileInterfaceViewerFiltersComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/custom-file-interface-viewer-filters';
import { CustomInboundFileViewerComponent } from './custom-inbound-file-viewer.component';

describe('CustomInboundFileViewerComponent', () => {
  let component: CustomInboundFileViewerComponent;
  let fixture: ComponentFixture<CustomInboundFileViewerComponent>;

  const businessUnitsAutoComplete = [{ name: 'Business unit', value: 'business-unit' }];
  const fileSourceAutoComplete = [{ name: 'Source', value: 'source' }];
  const fileTypeAutoComplete = [{ name: 'Type', value: 'type' }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomInboundFileViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomInboundFileViewerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('businessUnitsAutoComplete', businessUnitsAutoComplete);
    fixture.componentRef.setInput('direction', 'inbound');
    fixture.componentRef.setInput('fileSourceAutoComplete', fileSourceAutoComplete);
    fixture.componentRef.setInput('fileTypeAutoComplete', fileTypeAutoComplete);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the inbound interface files heading', () => {
    const heading = fixture.debugElement.query(By.css('h1')).nativeElement as HTMLHeadingElement;

    expect(heading.textContent?.trim()).toBe('Inbound interface files');
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

  it('should re-emit filter form submissions', () => {
    const formSubmit = vi.spyOn(component.formSubmit, 'emit');
    const form = {
      formData: { businessUnit: 'business-unit' },
      nestedFlow: false,
    } as IAbstractFormBaseForm<unknown>;
    const filters = fixture.debugElement.query(By.directive(CustomFileInterfaceViewerFiltersComponent))
      .componentInstance as CustomFileInterfaceViewerFiltersComponent & {
      formSubmit: EventEmitter<IAbstractFormBaseForm<unknown>>;
    };

    filters.formSubmit.emit(form);

    expect(formSubmit).toHaveBeenCalledWith(form);
  });

  it('should log the direction when initialized', () => {
    const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    component.ngOnInit();

    expect(consoleLog).toHaveBeenCalledWith('CustomInboundFileViewerComponent initialized with direction:', 'inbound');
  });

  it('should log when destroyed', () => {
    const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => undefined);

    component.ngOnDestroy();

    expect(consoleLog).toHaveBeenCalledWith('CustomInboundFileViewerComponent destroyed');
  });
});
