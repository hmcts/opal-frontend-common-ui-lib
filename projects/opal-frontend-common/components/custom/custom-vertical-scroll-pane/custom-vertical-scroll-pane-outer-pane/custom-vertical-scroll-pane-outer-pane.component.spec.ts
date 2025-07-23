import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomVerticalScrollPaneOuterPaneComponent } from './custom-vertical-scroll-pane-outer-pane.component';

@Component({
  template: `
    <opal-lib-custom-vertical-scroll-pane-outer-pane>
      <p class="test-content">Scrollable content</p>
    </opal-lib-custom-vertical-scroll-pane-outer-pane>
  `,
  standalone: true,
  imports: [CustomVerticalScrollPaneOuterPaneComponent],
})
class TestHostComponent {}

describe('CustomVerticalScrollPaneOuterPaneComponent', () => {
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
    const scrollWrapper = fixture.nativeElement.querySelector('.custom-vertical-scroll-pane-outer-pane');
    expect(scrollWrapper).toBeTruthy();
  });

  it('should apply the given height input to the host element', () => {
    const componentInstance = fixture.debugElement.children[0].componentInstance;
    componentInstance.height = '500px';
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
    const componentInstance = fixture.debugElement.children[0].componentInstance;
    componentInstance.height = 'random';
    fixture.detectChanges();
    const hostElement = fixture.nativeElement.querySelector('.custom-vertical-scroll-pane-outer-pane');
    expect(hostElement.style.height).toBe('100%');
  });
});
