import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomScrollablePanesComponent } from './custom-scrollable-panes.component';
import { describe, beforeEach, it, expect } from 'vitest';

@Component({
  template: `
    <opal-lib-custom-scrollable-panes [height]="height">
      <p class="test-content">Scrollable content</p>
    </opal-lib-custom-scrollable-panes>
  `,
  standalone: true,
  imports: [CustomScrollablePanesComponent],
})
class TestHostComponent {
  height = '100%';
}

describe('CustomScrollablePanesComponent', () => {
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
    const scrollWrapper = fixture.nativeElement.querySelector('.custom-scrollable-pane');
    expect(scrollWrapper).toBeTruthy();
  });

  it('should apply the correct height when height input is set', () => {
    hostComponent.height = '300px';
    fixture.detectChanges();
    const scrollWrapper = fixture.nativeElement.querySelector('.custom-scrollable-pane');
    expect(scrollWrapper.style.height).toBe('300px');
  });

  it('should fallback to default height when invalid value is provided', () => {
    hostComponent.height = 'invalid-value';
    fixture.detectChanges();
    const scrollWrapper = fixture.nativeElement.querySelector('.custom-scrollable-pane');
    // Invalid CSS values are ignored by the browser, resulting in empty string
    expect(scrollWrapper.style.height).toBe('');
  });

  it('should fallback to default height when no value is provided', () => {
    fixture.detectChanges();
    const scrollWrapper = fixture.nativeElement.querySelector('.custom-scrollable-pane');
    expect(scrollWrapper.style.height).toBe('100%');
  });
});
