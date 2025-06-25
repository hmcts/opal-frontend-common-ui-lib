import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPageHeaderHeadingCaptionComponent } from './custom-page-header-heading-caption.component';

describe('CustomPageHeaderHeadingCaptionComponent', () => {
  let component: CustomPageHeaderHeadingCaptionComponent;
  let fixture: ComponentFixture<CustomPageHeaderHeadingCaptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomPageHeaderHeadingCaptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomPageHeaderHeadingCaptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
