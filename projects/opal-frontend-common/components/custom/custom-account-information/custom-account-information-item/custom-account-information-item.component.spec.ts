import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAccountInformationItemComponent } from './custom-account-information-item.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('CustomAccountInformationItemComponent', () => {
  let component: CustomAccountInformationItemComponent;
  let fixture: ComponentFixture<CustomAccountInformationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomAccountInformationItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomAccountInformationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply the default host class', () => {
    fixture.detectChanges();
    const hostEl: HTMLElement = fixture.nativeElement;
    expect(component.itemClasses).toBe('govuk-grid-column-one-third');
    expect(hostEl.classList).toContain('govuk-grid-column-one-third');
  });

  it('should update the host class when itemClasses changes', () => {
    fixture.componentRef.setInput('itemClasses', 'custom-class');
    fixture.detectChanges();
    const hostEl: HTMLElement = fixture.nativeElement;
    expect(hostEl.classList).toContain('custom-class');
  });
});
