import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSummaryMetricBarItemComponent } from './custom-summary-metric-bar-item.component';

describe('CustomSummaryMetricBarItemComponent', () => {
  let component: CustomSummaryMetricBarItemComponent;
  let fixture: ComponentFixture<CustomSummaryMetricBarItemComponent>;
  let hostEl: HTMLElement;

  function hexToRgb(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }

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

  it('should have default input values', () => {
    expect(component.backgroundColour).toBe('#EEEFEF');
    expect(component.textColour).toBe('#383F43');
  });

  it('should bind the backgroundColour input to the host element style', () => {
    expect(component.backgroundColourStyle).toBe(component.backgroundColour);
    component.backgroundColour = '#123456';
    fixture.detectChanges();
    expect(component.backgroundColourStyle).toBe('#123456');
    expect(hostEl.style.backgroundColor).toBe(hexToRgb('#123456'));
  });

  it('should bind the textColour input to the host element style', () => {
    expect(component.textColourStyle).toBe(component.textColour);
    component.textColour = '#abcdef';
    fixture.detectChanges();
    expect(component.textColourStyle).toBe('#abcdef');
    expect(hostEl.style.color).toBe(hexToRgb('#abcdef'));
  });
});
