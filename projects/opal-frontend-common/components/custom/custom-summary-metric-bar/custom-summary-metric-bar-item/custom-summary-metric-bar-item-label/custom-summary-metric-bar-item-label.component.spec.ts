import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSummaryMetricBarItemLabelComponent } from './custom-summary-metric-bar-item-label.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('CustomSummaryMetricBarItemLabelComponent', () => {
  let component: CustomSummaryMetricBarItemLabelComponent;
  let fixture: ComponentFixture<CustomSummaryMetricBarItemLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSummaryMetricBarItemLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSummaryMetricBarItemLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind the correct host class with default textColour', () => {
    const hostElement: HTMLElement = fixture.nativeElement;
    expect(hostElement.classList).toContain('govuk-body');
    expect(hostElement.classList).toContain('govuk-!-font-size-19');
    expect(hostElement.classList).toContain('govuk-!-font-weight-bold');
    expect(hostElement.classList).toContain('govuk-!-margin-0');
    expect(hostElement.classList).toContain('govuk-dark-grey-text-colour');
  });

  it('should update the host class when textColour input changes', () => {
    const newTextColour = 'custom-text-colour';
    fixture.componentRef.setInput('textColour', newTextColour);
    fixture.detectChanges();
    const hostElement: HTMLElement = fixture.nativeElement;
    expect(hostElement.classList).toContain('govuk-body');
    expect(hostElement.classList).toContain('govuk-!-font-size-19');
    expect(hostElement.classList).toContain('govuk-!-font-weight-bold');
    expect(hostElement.classList).toContain('govuk-!-margin-0');
    expect(hostElement.classList).toContain(newTextColour);
  });
});
