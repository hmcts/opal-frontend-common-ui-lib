import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSummaryMetricBarItemValueComponent } from './custom-summary-metric-bar-item-value.component';

describe('CustomSummaryMetricBarItemValueComponent', () => {
  let component: CustomSummaryMetricBarItemValueComponent;
  let fixture: ComponentFixture<CustomSummaryMetricBarItemValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSummaryMetricBarItemValueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSummaryMetricBarItemValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind the correct host class', () => {
    const expectedClass = 'govuk-!-font-size-24 govuk-!-font-weight-bold govuk-!-margin-0 govuk-body';
    const hostElement: HTMLElement = fixture.nativeElement;
    expect(hostElement.className).toBe(expectedClass);
  });
});
