import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojSortableTableComponent } from './moj-sortable-table.component';
import { describe, beforeEach, it, expect } from 'vitest';

@Component({
  imports: [MojSortableTableComponent],
  template: '<opal-lib-moj-sortable-table><span caption>{{ caption }}</span></opal-lib-moj-sortable-table>',
})
class TestCaptionSortableTableComponent {
  public caption = 'Custom sortable table caption';
}

describe('MojSortableTableComponent', () => {
  let component: MojSortableTableComponent;
  let fixture: ComponentFixture<MojSortableTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojSortableTableComponent, TestCaptionSortableTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojSortableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default tableClasses as undefined', () => {
    expect(component.tableClasses).toBeUndefined();
  });

  it('should accept tableClasses as input', () => {
    component.tableClasses = 'test-class';
    fixture.detectChanges();
    expect(component.tableClasses).toBe('test-class');
  });

  it('should render the default visually hidden caption', () => {
    const caption = fixture.nativeElement.querySelector('caption');

    expect(caption.textContent.trim()).toBe('Column headers with buttons are sortable');
    expect(caption.querySelector('.govuk-visually-hidden')).toBeTruthy();
  });

  it('should render a provided caption instead of the default caption', () => {
    const hostFixture = TestBed.createComponent(TestCaptionSortableTableComponent);
    hostFixture.detectChanges();

    const caption = hostFixture.nativeElement.querySelector('caption');

    expect(caption.textContent.trim()).toBe('Custom sortable table caption');
    expect(caption.querySelector('.govuk-visually-hidden')).toBeNull();
  });
});
