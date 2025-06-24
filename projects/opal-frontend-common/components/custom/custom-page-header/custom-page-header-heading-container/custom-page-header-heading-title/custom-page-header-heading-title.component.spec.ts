import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPageHeaderHeadingTitleComponent } from './custom-page-header-heading-title.component';

describe('CustomPageHeaderHeadingNameComponent', () => {
  let component: CustomPageHeaderHeadingTitleComponent;
  let fixture: ComponentFixture<CustomPageHeaderHeadingTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomPageHeaderHeadingTitleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomPageHeaderHeadingTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
