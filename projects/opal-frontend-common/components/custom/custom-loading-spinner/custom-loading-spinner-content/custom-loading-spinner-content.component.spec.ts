import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomLoadingSpinnerContentComponent } from './custom-loading-spinner-content.component';

describe('CustomLoadingSpinnerContentComponent', () => {
  let component: CustomLoadingSpinnerContentComponent;
  let fixture: ComponentFixture<CustomLoadingSpinnerContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomLoadingSpinnerContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomLoadingSpinnerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
