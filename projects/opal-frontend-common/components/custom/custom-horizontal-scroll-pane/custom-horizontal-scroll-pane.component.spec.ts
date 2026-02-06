import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomHorizontalScrollPaneComponent } from './custom-horizontal-scroll-pane.component';
import { describe, beforeEach, it, expect } from 'vitest';

@Component({
  template: `
    <opal-lib-custom-horizontal-scroll-pane>
      <p class="test-content">Scrollable content</p>
    </opal-lib-custom-horizontal-scroll-pane>
  `,
  standalone: true,
  imports: [CustomHorizontalScrollPaneComponent],
})
class TestHostComponent {}

describe('CustomHorizontalScrollPaneComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render projected content', () => {
    const projected = fixture.nativeElement.querySelector('.test-content');
    expect(projected?.textContent).toContain('Scrollable content');
  });

  it('should have the correct CSS class applied', () => {
    const scrollWrapper = fixture.nativeElement.querySelector('.custom-horizontal-scroll-pane');
    expect(scrollWrapper).toBeTruthy();
  });
});
