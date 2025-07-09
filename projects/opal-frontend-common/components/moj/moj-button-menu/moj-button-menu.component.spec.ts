import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { MojButtonMenuComponent } from './moj-button-menu.component';

describe('MojButtonMenuComponent', () => {
  let component: MojButtonMenuComponent;
  let fixture: ComponentFixture<MojButtonMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojButtonMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MojButtonMenuComponent);
    component = fixture.componentInstance;
    // Set the required input
    component.menuButtonTitle = 'Test Button';

    // Create a dummy button element to simulate the ViewChild element
    const dummyButton = document.createElement('button');
    dummyButton.setAttribute('aria-expanded', 'false');
    component.menuButton = new ElementRef(dummyButton);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return menuButtonTitle as dataButtonText', () => {
    expect(component.dataButtonText).toBe('Test Button');
  });

  it('should toggle aria-expanded attribute and isExpanded property', () => {
    // Verify initial state
    let button = component.menuButton.nativeElement;
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(component.isExpanded).toBeFalse();

    // Toggle to expanded state
    component.toggleButtonMenu();
    button = component.menuButton.nativeElement;
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(component.isExpanded).toBeTrue();

    // Toggle back to collapsed state
    component.toggleButtonMenu();
    button = component.menuButton.nativeElement;
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(component.isExpanded).toBeFalse();
  });
});
