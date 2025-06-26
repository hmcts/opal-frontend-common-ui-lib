import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HodLoadingSpinnerContentComponent } from './hod-loading-spinner-content.component';

describe('HodLoadingSpinnerContentComponent', () => {
  let component: HodLoadingSpinnerContentComponent;
  let fixture: ComponentFixture<HodLoadingSpinnerContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HodLoadingSpinnerContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HodLoadingSpinnerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct host classes applied to the host element', () => {
    const hostElement: HTMLElement = fixture.nativeElement;
    expect(hostElement.classList.contains('hods-loading-spinner__content')).toBe(true);
  });
});
