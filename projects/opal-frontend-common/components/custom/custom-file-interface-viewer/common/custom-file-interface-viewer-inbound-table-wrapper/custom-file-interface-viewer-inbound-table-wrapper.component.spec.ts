import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CustomFileInterfaceViewerInboundTableWrapperComponent } from './custom-file-interface-viewer-inbound-table-wrapper.component';

describe('CustomFileInterfaceViewerInboundTableWrapperComponent', () => {
  let component: CustomFileInterfaceViewerInboundTableWrapperComponent;
  let fixture: ComponentFixture<CustomFileInterfaceViewerInboundTableWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomFileInterfaceViewerInboundTableWrapperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomFileInterfaceViewerInboundTableWrapperComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tableData', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
