import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojMultiSelectCheckboxComponentBody } from './moj-multi-select-checkbox-body.component';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('MojMultiSelectTableComponent', () => {
  let component: MojMultiSelectCheckboxComponentBody;
  let fixture: ComponentFixture<MojMultiSelectCheckboxComponentBody>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojMultiSelectCheckboxComponentBody],
    }).compileComponents();

    fixture = TestBed.createComponent(MojMultiSelectCheckboxComponentBody);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit row id and checked state when row checkbox changes', () => {
    component.rowId = 'row-a';
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.selectionChange, 'emit');
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.checked = true;
    input.dispatchEvent(new Event('change'));

    expect(emitSpy).toHaveBeenCalledWith({ rowId: 'row-a', checked: true });
  });

  it('should expose a default accessible row label', () => {
    component.rowIndex = 2;
    fixture.detectChanges();

    expect(component.rowAriaLabel).toBe('Select row 3');
  });
});
