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
});
