import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojFilterPanelComponent } from './moj-filter-panel.component';
import { describe, beforeEach, it, expect } from 'vitest';

@Component({
  template: `
    <opal-lib-moj-filter-panel>
      <ng-container mojFilterPanelHeader><div class="header-slot">Header</div></ng-container>
      <ng-container mojFilterPanelSelected><div class="selected-slot">Selected</div></ng-container>
      <ng-container mojFilterPanelOption><div class="option-slot">Option</div></ng-container>
    </opal-lib-moj-filter-panel>
  `,
  imports: [MojFilterPanelComponent],
})
class TestHostComponent {}

describe('MojFilterPanelComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render the panel wrapper with .moj-filter class', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.moj-filter')).toBeTruthy();
  });

  it('should project content into all three panel sections', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.header-slot')?.textContent).toContain('Header');
    expect(compiled.querySelector('.selected-slot')?.textContent).toContain('Selected');
    expect(compiled.querySelector('.option-slot')?.textContent).toContain('Option');
  });
});
