import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomScrollablePanesComponent } from './custom-scrollable-panes.component';

@Component({
  template: `
    <opal-lib-custom-scrollable-panes>
      <p class="test-content">Scrollable content</p>
    </opal-lib-custom-scrollable-panes>
  `,
  standalone: true,
  imports: [CustomScrollablePanesComponent],
})
class TestHostComponent {}

describe('CustomScrollablePanesComponent', () => {
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
    const scrollWrapper = fixture.nativeElement.querySelector('.custom-scrollable-pane');
    expect(scrollWrapper).toBeTruthy();
  });

  it('should apply the correct height when height input is set', () => {
    const componentInstance = fixture.debugElement.children[0].componentInstance as CustomScrollablePanesComponent;
    componentInstance.height = '300px';
    fixture.detectChanges();
    const scrollWrapper = fixture.nativeElement.querySelector('.custom-scrollable-pane');
    expect(scrollWrapper.style.height).toBe('300px');
  });

  it('should fallback to default height when invalid value is provided', () => {
    const componentInstance = fixture.debugElement.children[0].componentInstance as CustomScrollablePanesComponent;
    componentInstance.height = 'invalid-value';
    fixture.detectChanges();
    const scrollWrapper = fixture.nativeElement.querySelector('.custom-scrollable-pane');
    expect(scrollWrapper.style.height).toBe('100%');
  });

  it('should fallback to default height when no value is provided', () => {
    fixture.detectChanges();
    const scrollWrapper = fixture.nativeElement.querySelector('.custom-scrollable-pane');
    expect(scrollWrapper.style.height).toBe('100%');
  });
});
