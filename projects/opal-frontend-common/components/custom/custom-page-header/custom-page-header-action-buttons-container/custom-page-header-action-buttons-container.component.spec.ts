import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPageHeaderActionButtonsContainerComponent } from './custom-page-header-action-buttons-container.component';

describe('CustomPageHeaderActionButtonsContainerComponent', () => {
  let component: CustomPageHeaderActionButtonsContainerComponent;
  let fixture: ComponentFixture<CustomPageHeaderActionButtonsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomPageHeaderActionButtonsContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomPageHeaderActionButtonsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
