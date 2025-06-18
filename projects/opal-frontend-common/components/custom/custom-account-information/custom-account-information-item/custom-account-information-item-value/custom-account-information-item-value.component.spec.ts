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
});
