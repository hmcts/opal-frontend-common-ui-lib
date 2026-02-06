import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { GovukErrorSummaryComponent } from './govuk-error-summary.component';

describe('GovukErrorSummaryComponent', () => {
  let component: GovukErrorSummaryComponent | null;
  let fixture: ComponentFixture<GovukErrorSummaryComponent> | null;
  let eventMock: Event | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukErrorSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukErrorSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    eventMock = { preventDefault: vi.fn() } as unknown as Event;
    vi.spyOn(component.errorClick, 'emit');
  });

  afterAll(() => {
    fixture = null;
    component = null;
    eventMock = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test handleErrorClick', () => {
    if (!component || !eventMock) {
      throw new Error('component or eventMock returned null');
    }

    component.handleErrorClick(eventMock, 'testFieldId');
    expect(eventMock.preventDefault).toHaveBeenCalled();
    expect(component.errorClick.emit).toHaveBeenCalledWith('testFieldId');
  });
});
