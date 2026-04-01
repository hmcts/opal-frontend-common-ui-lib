import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojButtonMenuComponent } from './moj-button-menu.component';
import { describe, beforeEach, it, expect } from 'vitest';

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

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return menuButtonTitle as dataButtonText', () => {
    expect(component.dataButtonText).toBe('Test Button');
  });

  it('should toggle aria-expanded attribute and isExpanded property', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button') as HTMLButtonElement;
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(component.isExpanded).toBe(false);

    // Toggle to expanded state
    button.click();
    fixture.detectChanges();
    const expandedMenuId = button.getAttribute('aria-controls');
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(component.isExpanded).toBe(true);
    expect(expandedMenuId).toBeTruthy();
    expect(compiled.querySelector(`#${expandedMenuId}`)).toBeTruthy();

    // Toggle back to collapsed state
    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(component.isExpanded).toBe(false);
  });
});
