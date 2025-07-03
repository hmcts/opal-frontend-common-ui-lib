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

  it('should have default host class "light-grey-item"', () => {
    expect(component.hostClasses).toBe('light-grey-item');
    expect(hostEl.className).toContain('light-grey-item');
  });

  it('should update host class when itemColour is set to "blue"', () => {
    component.itemColour = 'blue';
    fixture.detectChanges();
    expect(component.hostClasses).toBe('blue-item');
    expect(hostEl.className).toContain('blue-item');
  });

  it('should update host class when itemColour is set to "light-blue"', () => {
    component.itemColour = 'light-blue';
    fixture.detectChanges();
    expect(component.hostClasses).toBe('light-blue-item');
    expect(hostEl.className).toContain('light-blue-item');
  });
});
