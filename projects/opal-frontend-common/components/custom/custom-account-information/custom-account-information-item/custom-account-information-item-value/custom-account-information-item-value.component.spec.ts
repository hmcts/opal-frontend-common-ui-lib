import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAccountInformationItemValueComponent } from './custom-account-information-item-value.component';

describe('CustomAccountInformationItemValueComponent', () => {
  let component: CustomAccountInformationItemValueComponent;
  let fixture: ComponentFixture<CustomAccountInformationItemValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomAccountInformationItemValueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomAccountInformationItemValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct default host classes', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.classList.contains('govuk-body')).toBeTruthy();
    expect(element.classList.contains('govuk-!-font-size-16')).toBeTruthy();
    expect(element.classList.contains('govuk-!-margin-0')).toBeTruthy();
  });
});
