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
});
