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

  it('should assign the CSS class to the host element', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.classList).toContain('govuk-grid-column-one-fifth');
  });
});
