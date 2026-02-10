import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CustomScrollablePanesInnerPaneComponent } from './custom-scrollable-panes-inner-pane.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('CustomScrollablePanesInnerPaneComponent', () => {
  let component: CustomScrollablePanesInnerPaneComponent;
  let fixture: ComponentFixture<CustomScrollablePanesInnerPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomScrollablePanesInnerPaneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomScrollablePanesInnerPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply default max-height if no value is provided', () => {
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('.custom-scrollable-panes-inner-pane')).nativeElement;
    expect(div.style.maxHeight).toBe('500px');
  });

  it('should apply provided max-height', () => {
    fixture.componentRef.setInput('maxHeight', '300px');
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('.custom-scrollable-panes-inner-pane')).nativeElement;
    expect(div.style.maxHeight).toBe('300px');
  });

  it('should apply sticky-headers class by default', () => {
    const div = fixture.debugElement.query(By.css('.custom-scrollable-panes-inner-pane'));
    expect(div.classes['sticky-headers']).toBe(true);
  });

  it('should not apply sticky-headers class when stickyHeadersEnabled is false', () => {
    fixture.componentRef.setInput('stickyHeadersEnabled', false);
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('.custom-scrollable-panes-inner-pane'));
    expect(div.nativeElement.classList.contains('sticky-headers')).toBe(false);
  });
});
