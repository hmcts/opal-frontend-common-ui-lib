import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojAlertIconComponent } from './moj-alert-icon.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('MojAlertIconComponent', () => {
  let component: MojAlertIconComponent;
  let fixture: ComponentFixture<MojAlertIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojAlertIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojAlertIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
