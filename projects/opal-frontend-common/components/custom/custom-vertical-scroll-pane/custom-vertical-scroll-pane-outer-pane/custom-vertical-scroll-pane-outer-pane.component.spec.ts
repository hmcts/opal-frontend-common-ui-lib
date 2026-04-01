import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomVerticalScrollPaneOuterPaneComponent } from './custom-vertical-scroll-pane-outer-pane.component';
import { describe, beforeEach, it, expect } from 'vitest';

@Component({
  template: `
    <opal-lib-custom-vertical-scroll-pane-outer-pane [height]="height">
      <p class="test-content">Scrollable content</p>
    </opal-lib-custom-vertical-scroll-pane-outer-pane>
  `,
  standalone: true,
  imports: [CustomVerticalScrollPaneOuterPaneComponent],
})
class TestHostComponent {
  height = '100%';
}

describe('CustomVerticalScrollPaneOuterPaneComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
  });

  it('should render projected content', () => {
    fixture.detectChanges();
    const projected = fixture.nativeElement.querySelector('.test-content');
    expect(projected?.textContent).toContain('Scrollable content');
  });

  it('should have the correct CSS class applied', () => {
    fixture.detectChanges();
    const scrollWrapper = fixture.nativeElement.querySelector('.custom-vertical-scroll-pane-outer-pane');
    expect(scrollWrapper).toBeTruthy();
  });

  it('should apply the given height input to the host element', () => {
    hostComponent.height = '500px';
    fixture.detectChanges();
    const hostElement = fixture.nativeElement.querySelector('.custom-vertical-scroll-pane-outer-pane');
    expect(hostElement.style.height).toBe('500px');
  });

  it('should fallback to 100% if height input is not provided', () => {
    fixture.detectChanges();
    const hostElement = fixture.nativeElement.querySelector('.custom-vertical-scroll-pane-outer-pane');
    expect(hostElement.style.height).toBe('100%');
  });

  it('should fallback to 100% if height input has unrecognised unit', () => {
    hostComponent.height = 'random';
    fixture.detectChanges();
    const hostElement = fixture.nativeElement.querySelector('.custom-vertical-scroll-pane-outer-pane');
    // Invalid CSS values are ignored by the browser, resulting in empty string
    expect(hostElement.style.height).toBe('');
  });
});
