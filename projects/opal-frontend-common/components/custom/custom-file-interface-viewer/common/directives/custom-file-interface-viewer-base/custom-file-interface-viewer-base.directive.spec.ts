import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { CustomFileInterfaceViewerComponent } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common';
import type { ICustomFileInterfaceViewerTableData } from '@hmcts/opal-frontend-common/components/custom/custom-file-interface-viewer/common/interfaces';
import { CustomFileInterfaceViewerBase } from './custom-file-interface-viewer-base.directive';

@Component({
  imports: [CustomFileInterfaceViewerComponent],
  template: `
    <opal-lib-custom-file-interface-viewer
      [isInbound]="isInbound"
      [businessUnits]="businessUnits"
      [tableData]="tableData"
      [tableSort]="tableSort"
      [actionTemplate]="actionTemplate"
      (formSubmit)="formSubmit.emit($event)"
    ></opal-lib-custom-file-interface-viewer>
  `,
})
class FileInterfaceViewerHarness extends CustomFileInterfaceViewerBase<ICustomFileInterfaceViewerTableData> {
  public readonly isInbound = false;
}

describe('CustomFileInterfaceViewerBase', () => {
  it('provides common presentational inputs and forwards form submissions without service providers', async () => {
    await TestBed.configureTestingModule({
      imports: [FileInterfaceViewerHarness],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(FileInterfaceViewerHarness);
    const businessUnits = [{ value: '0046', name: 'Test business unit' }];
    fixture.componentRef.setInput('businessUnits', businessUnits);
    const submit = vi.spyOn(fixture.componentInstance.formSubmit, 'emit');
    fixture.detectChanges();
    const viewer = fixture.debugElement.query(By.directive(CustomFileInterfaceViewerComponent))
      .componentInstance as CustomFileInterfaceViewerComponent;
    expect(viewer.businessUnits).toBe(businessUnits);
    expect(viewer.isInbound).toBe(false);
    expect(viewer.tableData).toBeNull();
    expect(viewer.actionTemplate).toBeNull();
    expect(viewer.tableSort).toBe(fixture.componentInstance.tableSort);
    expect(fixture.componentInstance.source).toEqual([]);
    expect(fixture.componentInstance.sourceList).toEqual([]);
    const form = { formData: { businessUnit: '0046' }, nestedFlow: false };
    viewer.formSubmit.emit(form);
    expect(submit).toHaveBeenCalledExactlyOnceWith(form);
  });
});
