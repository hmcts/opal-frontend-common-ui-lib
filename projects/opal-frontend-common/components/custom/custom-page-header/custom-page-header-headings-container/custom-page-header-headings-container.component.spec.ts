import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPageHeaderHeadingsContainerComponent } from './custom-page-header-headings-container.component';

describe('CustomPageHeaderHeadingsContainerComponent', () => {
  let component: CustomPageHeaderHeadingsContainerComponent;
  let fixture: ComponentFixture<CustomPageHeaderHeadingsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomPageHeaderHeadingsContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomPageHeaderHeadingsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
