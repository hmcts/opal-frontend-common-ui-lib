import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAccountInformationComponent } from './custom-account-information.component';

describe('CustomAccountInformationComponent', () => {
  let component: CustomAccountInformationComponent;
  let fixture: ComponentFixture<CustomAccountInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomAccountInformationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomAccountInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
