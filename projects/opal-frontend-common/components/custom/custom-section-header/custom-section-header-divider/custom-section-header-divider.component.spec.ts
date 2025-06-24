import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSectionHeaderDividerComponent } from './custom-section-header-divider.component';

describe('CustomSectionHeaderDividerComponent', () => {
  let component: CustomSectionHeaderDividerComponent;
  let fixture: ComponentFixture<CustomSectionHeaderDividerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSectionHeaderDividerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomSectionHeaderDividerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
