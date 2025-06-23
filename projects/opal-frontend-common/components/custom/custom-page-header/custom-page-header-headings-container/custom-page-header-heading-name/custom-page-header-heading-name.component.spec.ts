import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPageHeaderHeadingNameComponent } from './custom-page-header-heading-name.component';

describe('CustomPageHeaderHeadingNameComponent', () => {
  let component: CustomPageHeaderHeadingNameComponent;
  let fixture: ComponentFixture<CustomPageHeaderHeadingNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomPageHeaderHeadingNameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomPageHeaderHeadingNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
