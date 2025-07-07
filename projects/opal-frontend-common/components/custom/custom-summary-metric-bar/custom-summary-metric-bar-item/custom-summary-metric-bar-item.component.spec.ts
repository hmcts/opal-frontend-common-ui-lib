import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSummaryMetricBarItemComponent } from './custom-summary-metric-bar-item.component';

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

  it('should use the default host class from itemClasses ("govuk-grid-column-one-fifth")', () => {
    expect(component.itemClasses).toBe('govuk-grid-column-one-fifth');
    expect(component.hostClasses).toBe('govuk-grid-column-one-fifth');
    expect(hostEl.className).toContain('govuk-grid-column-one-fifth');
  });

  it('should update host class when itemClasses is changed', () => {
    component.itemClasses = 'custom-class';
    fixture.detectChanges();
    expect(component.hostClasses).toBe('custom-class');
    expect(hostEl.className).toContain('custom-class');
  });
});
