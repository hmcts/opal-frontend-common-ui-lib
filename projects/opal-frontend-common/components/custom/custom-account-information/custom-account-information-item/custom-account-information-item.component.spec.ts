import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAccountInformationItemComponent } from './custom-account-information-item.component';

describe('CustomAccountInformationItemComponent', () => {
  let component: CustomAccountInformationItemComponent;
  let fixture: ComponentFixture<CustomAccountInformationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomAccountInformationItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomAccountInformationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply the default host class', () => {
    fixture.detectChanges();
    const hostEl: HTMLElement = fixture.nativeElement;
    expect(component.govukGridClass).toBe('govuk-grid-column-one-third');
    expect(hostEl.classList).toContain('govuk-grid-column-one-third');
  });

  it('should update the host class when govukGridClass changes', () => {
    component.govukGridClass = 'custom-class';
    fixture.detectChanges();
    const hostEl: HTMLElement = fixture.nativeElement;
    expect(hostEl.classList).toContain('custom-class');
  });
});
