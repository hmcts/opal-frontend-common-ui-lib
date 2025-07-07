import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSummaryMetricBarComponent } from './custom-summary-metric-bar.component';

describe('CustomSummaryMetricBarComponent', () => {
  let component: CustomSummaryMetricBarComponent;
  let fixture: ComponentFixture<CustomSummaryMetricBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSummaryMetricBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSummaryMetricBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the host binding class "govuk-grid-row" on its element', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.classList.contains('govuk-grid-row')).toBeTrue();
  });
});
