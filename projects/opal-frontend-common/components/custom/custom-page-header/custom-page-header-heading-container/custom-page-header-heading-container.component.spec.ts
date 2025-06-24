import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPageHeaderHeadingContainerComponent } from './custom-page-header-heading-container.component';

describe('CustomPageHeaderHeadingsContainerComponent', () => {
  let component: CustomPageHeaderHeadingContainerComponent;
  let fixture: ComponentFixture<CustomPageHeaderHeadingContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomPageHeaderHeadingContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomPageHeaderHeadingContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
