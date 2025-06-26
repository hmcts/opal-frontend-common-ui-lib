import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomLoadingSpinnerComponent } from './custom-loading-spinner.component';

describe('CustomLoadingSpinnerComponent', () => {
  let component: CustomLoadingSpinnerComponent;
  let fixture: ComponentFixture<CustomLoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomLoadingSpinnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomLoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
