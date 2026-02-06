import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojFilterPanelSelectedComponent } from './moj-filter-panel-selected.component';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('MojFilterPanelSelectedComponent', () => {
  let component: MojFilterPanelSelectedComponent;
  let fixture: ComponentFixture<MojFilterPanelSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojFilterPanelSelectedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojFilterPanelSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clearFilters when clearTag is called without an event', () => {
    vi.spyOn(component.clearFilters, 'emit');
    component.clearTag();
    expect(component.clearFilters.emit).toHaveBeenCalled();
  });

  it('should call preventDefault and emit clearFilters when clearTag is called with an event', () => {
    const fakeEvent = { preventDefault: vi.fn() } as unknown as Event;
    vi.spyOn(component.clearFilters, 'emit');
    component.clearTag(fakeEvent);
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(component.clearFilters.emit).toHaveBeenCalled();
  });

  it('should render default heading and link text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.moj-filter__heading-title h2')?.textContent?.trim()).toBe('Selected filters');
    expect(compiled.querySelector('.moj-filter__heading-action a')?.textContent?.trim()).toBe('Clear filters');
  });
});
