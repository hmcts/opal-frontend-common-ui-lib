import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSummaryMetricBarItemComponent } from './custom-summary-metric-bar-item.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('CustomSummaryMetricBarItemComponent', () => {
  let component: CustomSummaryMetricBarItemComponent;
  let fixture: ComponentFixture<CustomSummaryMetricBarItemComponent>;
  let hostEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSummaryMetricBarItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSummaryMetricBarItemComponent);
    component = fixture.componentInstance;
    hostEl = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use the default host class from itemClasses ("govuk-grid-column-one-quarter")', () => {
    expect(component.itemClasses).toBe('govuk-grid-column-one-quarter');
    expect(component.hostClasses).toBe('govuk-grid-column-one-quarter');
    expect(hostEl.className).toContain('govuk-grid-column-one-quarter');
  });

  it('should update host class when itemClasses is changed', () => {
    fixture.componentRef.setInput('itemClasses', 'custom-class');
    fixture.detectChanges();
    expect(component.hostClasses).toBe('custom-class');
    expect(hostEl.className).toContain('custom-class');
  });

  it('should return correct classes for default colours', () => {
    const expected = `custom-summary-metric-bar-item-frame ${component.backgroundColour}`;
    expect(component.getSummaryMetricBarItemClasses()).toBe(expected);
  });

  it('should return updated classes when backgroundColour and textColour are changed', () => {
    component.backgroundColour = 'new-bg-colour';
    const expected = `custom-summary-metric-bar-item-frame new-bg-colour`;
    expect(component.getSummaryMetricBarItemClasses()).toBe(expected);
  });
});
