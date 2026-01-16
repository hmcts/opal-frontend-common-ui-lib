import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HodLoadingSpinnerComponent } from './hod-loading-spinner.component';

describe('HodLoadingSpinnerComponent', () => {
  let component: HodLoadingSpinnerComponent;
  let fixture: ComponentFixture<HodLoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HodLoadingSpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HodLoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have hostClasses set to "hods-loading-spinner"', () => {
    expect(component.hostClasses).toEqual('hods-loading-spinner');
  });

  it('should render the host element with "hods-loading-spinner" class', () => {
    const hostElement: HTMLElement = fixture.nativeElement;
    expect(hostElement.classList.contains('hods-loading-spinner')).toBe(true);
  });

  it('should have role attribute set to "status"', () => {
    const hostElement: HTMLElement = fixture.nativeElement;
    expect(hostElement.getAttribute('role')).toBe('status');
  });

  it('should render default screen reader status text', () => {
    const hostElement: HTMLElement = fixture.nativeElement;
    const statusText = hostElement.querySelector('.govuk-visually-hidden');
    expect(statusText?.textContent?.trim()).toBe('Loading...');
  });
});
