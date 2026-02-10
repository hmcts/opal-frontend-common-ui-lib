import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CustomVerticalScrollPaneInnerPaneComponent } from './custom-vertical-scroll-pane-inner-pane.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('CustomVerticalScrollPaneInnerPaneComponent', () => {
  let component: CustomVerticalScrollPaneInnerPaneComponent;
  let fixture: ComponentFixture<CustomVerticalScrollPaneInnerPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomVerticalScrollPaneInnerPaneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomVerticalScrollPaneInnerPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply default max-height if no value is provided', () => {
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('.custom-vertical-scroll-pane-inner-pane')).nativeElement;
    expect(div.style.maxHeight).toBe('500px');
  });

  it('should apply provided max-height', () => {
    fixture.componentRef.setInput('maxHeight', '300px');
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('.custom-vertical-scroll-pane-inner-pane')).nativeElement;
    expect(div.style.maxHeight).toBe('300px');
  });

  it('should apply sticky-headers class when stickyHeadersEnabled is true', () => {
    fixture.componentRef.setInput('stickyHeadersEnabled', true);
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('.custom-vertical-scroll-pane-inner-pane'));
    expect(div.nativeElement.classList.contains('sticky-headers')).toBe(true);
  });

  it('should not apply sticky-headers class when stickyHeadersEnabled is false', () => {
    fixture.componentRef.setInput('stickyHeadersEnabled', false);
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('.custom-vertical-scroll-pane-inner-pane'));
    expect(div.nativeElement.classList.contains('sticky-headers')).toBe(false);
  });
});
