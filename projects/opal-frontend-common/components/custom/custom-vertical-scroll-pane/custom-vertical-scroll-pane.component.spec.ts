import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomVerticalScrollPaneComponent } from './custom-vertical-scroll-pane.component';

describe('CustomVerticalScrollPaneComponent', () => {
  let component: CustomVerticalScrollPaneComponent;
  let fixture: ComponentFixture<CustomVerticalScrollPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomVerticalScrollPaneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomVerticalScrollPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
