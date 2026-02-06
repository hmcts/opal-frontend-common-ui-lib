import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MojFilterComponent } from './moj-filter.component';
import { describe, beforeEach, it, expect } from 'vitest';

@Component({
  template: `
    <opal-lib-moj-filter>
      <ng-container mojFilterPanel><div class="mock-filter">Filter Panel</div></ng-container>
      <ng-container mojFilterContent><div class="mock-content">Main Content</div></ng-container>
    </opal-lib-moj-filter>
  `,
  imports: [MojFilterComponent],
})
class TestHostComponent {}

describe('MojFilterComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render the filter and content slots', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.mock-filter')).toBeTruthy();
    expect(compiled.querySelector('.mock-content')).toBeTruthy();
  });

  it('should toggle showFilter when the button is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button') as HTMLButtonElement;
    const filterPanel = compiled.querySelector('.moj-filter-layout__filter') as HTMLElement;

    expect(button.getAttribute('aria-expanded')).toBe('false');
    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(filterPanel.hasAttribute('hidden')).toBe(false);
    expect(button.getAttribute('aria-controls')).toBe(filterPanel.id);
  });
});
