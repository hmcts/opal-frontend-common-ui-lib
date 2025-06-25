import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPageHeaderComponent } from './custom-page-header.component';

describe('CustomPageHeaderComponent', () => {
  let component: CustomPageHeaderComponent;
  let fixture: ComponentFixture<CustomPageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomPageHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
