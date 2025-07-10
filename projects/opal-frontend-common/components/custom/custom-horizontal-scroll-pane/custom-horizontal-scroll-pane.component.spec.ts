import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomHorizontalScrollPaneComponent } from './custom-horizontal-scroll-pane.component';

describe('CustomHorizontalScrollPaneComponent', () => {
  let component: CustomHorizontalScrollPaneComponent;
  let fixture: ComponentFixture<CustomHorizontalScrollPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomHorizontalScrollPaneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomHorizontalScrollPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
