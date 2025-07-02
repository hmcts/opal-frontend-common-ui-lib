import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HodLoadingSpinnerTextComponent } from './hod-loading-spinner-text.component';

describe('HodLoadingSpinnerTextComponent', () => {
  let component: HodLoadingSpinnerTextComponent;
  let fixture: ComponentFixture<HodLoadingSpinnerTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HodLoadingSpinnerTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HodLoadingSpinnerTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have host class "govuk-!-margin-0"', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.classList.contains('govuk-!-margin-0')).toBe(true);
  });
});
