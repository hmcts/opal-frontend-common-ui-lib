import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSummaryMetricBarItemComponent } from './custom-summary-metric-bar-item.component';

describe('CustomSummaryMetricBarItemComponent', () => {
  let component: CustomSummaryMetricBarItemComponent;
  let fixture: ComponentFixture<CustomSummaryMetricBarItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSummaryMetricBarItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSummaryMetricBarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
