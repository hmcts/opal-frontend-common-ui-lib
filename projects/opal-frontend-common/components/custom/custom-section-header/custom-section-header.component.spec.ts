import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSectionHeaderComponent } from './custom-section-header.component';

describe('CustomSectionHeaderComponent', () => {
  let component: CustomSectionHeaderComponent;
  let fixture: ComponentFixture<CustomSectionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSectionHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomSectionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
