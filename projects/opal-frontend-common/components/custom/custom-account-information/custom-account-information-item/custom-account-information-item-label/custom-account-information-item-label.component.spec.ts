import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAccountInformationItemLabelComponent } from './custom-account-information-item-label.component';

describe('CustomAccountInformationItemLabelComponent', () => {
  let component: CustomAccountInformationItemLabelComponent;
  let fixture: ComponentFixture<CustomAccountInformationItemLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomAccountInformationItemLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomAccountInformationItemLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
