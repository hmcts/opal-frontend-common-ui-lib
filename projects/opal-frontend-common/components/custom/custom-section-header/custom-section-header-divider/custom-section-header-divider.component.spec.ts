import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSectionHeaderDividerComponent } from './custom-section-header-divider.component';

describe('CustomSectionHeaderDividerComponent', () => {
  let component: CustomSectionHeaderDividerComponent;
  let fixture: ComponentFixture<CustomSectionHeaderDividerComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomSectionHeaderDividerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomSectionHeaderDividerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default divider colour', () => {
    fixture.detectChanges();
    expect(element.style.backgroundColor).toBe('rgb(29, 112, 184)');
  });

  it('should update background color when dividerColour is changed', () => {
    const newColor = '#ff0000';
    component.dividerColour = newColor;
    fixture.detectChanges();
    // '#ff0000' appears as rgb(255, 0, 0)
    expect(element.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });
});
