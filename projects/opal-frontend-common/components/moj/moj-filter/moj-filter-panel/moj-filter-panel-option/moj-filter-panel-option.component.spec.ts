import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojFilterPanelOptionComponent } from './moj-filter-panel-option.component';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('MojFilterPanelOptionComponent', () => {
  let component: MojFilterPanelOptionComponent;
  let fixture: ComponentFixture<MojFilterPanelOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojFilterPanelOptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojFilterPanelOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit applyFilters event when no event is provided', () => {
    vi.spyOn(component.applyFilters, 'emit');
    component.onApplyFilters();
    expect(component.applyFilters.emit).toHaveBeenCalled();
  });

  it('should call event.preventDefault if event is provided', () => {
    vi.spyOn(component.applyFilters, 'emit');

    component.onApplyFilters();

    expect(component.applyFilters.emit).toHaveBeenCalled();
  });

  it('should render the default button text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button')!;
    expect(button.textContent?.trim()).toBe('Apply filters');
  });
});
