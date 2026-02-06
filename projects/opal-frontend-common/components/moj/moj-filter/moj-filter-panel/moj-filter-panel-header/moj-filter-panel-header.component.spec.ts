import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojFilterPanelHeaderComponent } from './moj-filter-panel-header.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('MojFilterPanelHeaderComponent', () => {
  let component: MojFilterPanelHeaderComponent;
  let fixture: ComponentFixture<MojFilterPanelHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojFilterPanelHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojFilterPanelHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the default title when none is provided', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent?.trim()).toBe('Filter');
  });

  it('should render the custom title when provided', () => {
    fixture.componentRef.setInput('title', 'Offence filters');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent?.trim()).toBe('Offence filters');
  });
});
