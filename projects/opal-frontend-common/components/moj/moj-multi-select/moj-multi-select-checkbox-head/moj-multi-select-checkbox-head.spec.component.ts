import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojMultiSelectCheckboxComponentHead } from './moj-multi-select-checkbox-head.component';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('MojMultiSelectTableComponent', () => {
  let component: MojMultiSelectCheckboxComponentHead;
  let fixture: ComponentFixture<MojMultiSelectCheckboxComponentHead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojMultiSelectCheckboxComponentHead],
    }).compileComponents();

    fixture = TestBed.createComponent(MojMultiSelectCheckboxComponentHead);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit toggleAll when select all checkbox changes', () => {
    const emitSpy = vi.spyOn(component.toggleAll, 'emit');
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.checked = true;
    input.dispatchEvent(new Event('change'));

    expect(emitSpy).toHaveBeenCalledWith(true);
  });

  it('should apply indeterminate state to checkbox input', () => {
    component.selectAllIndeterminate = true;
    fixture.detectChanges();
    component.ngAfterViewInit();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
  });
});
