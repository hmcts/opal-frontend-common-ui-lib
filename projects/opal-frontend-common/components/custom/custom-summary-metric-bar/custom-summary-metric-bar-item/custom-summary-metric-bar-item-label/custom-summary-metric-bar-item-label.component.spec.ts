import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSummaryMetricBarItemLabelComponent } from './custom-summary-metric-bar-item-label.component';

describe('CustomSummaryMetricBarItemLabelComponent', () => {
  let component: CustomSummaryMetricBarItemLabelComponent;
  let fixture: ComponentFixture<CustomSummaryMetricBarItemLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSummaryMetricBarItemLabelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomSummaryMetricBarItemLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
