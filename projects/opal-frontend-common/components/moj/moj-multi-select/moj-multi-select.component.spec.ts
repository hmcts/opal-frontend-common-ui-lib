import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojMultiSelectComponent } from './moj-multi-select.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('MojMultiSelectTableComponent', () => {
  let component: MojMultiSelectComponent;
  let fixture: ComponentFixture<MojMultiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojMultiSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
