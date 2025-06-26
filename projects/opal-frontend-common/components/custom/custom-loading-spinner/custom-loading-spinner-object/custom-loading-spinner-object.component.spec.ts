import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomLoadingSpinnerObjectComponent } from './custom-loading-spinner-object.component';

describe('CustomLoadingSpinnerObjectComponent', () => {
  let component: CustomLoadingSpinnerObjectComponent;
  let fixture: ComponentFixture<CustomLoadingSpinnerObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomLoadingSpinnerObjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomLoadingSpinnerObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
