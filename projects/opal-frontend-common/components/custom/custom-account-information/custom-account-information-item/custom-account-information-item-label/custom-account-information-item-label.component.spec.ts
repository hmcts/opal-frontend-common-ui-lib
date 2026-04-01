import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAccountInformationItemLabelComponent } from './custom-account-information-item-label.component';
import { describe, beforeEach, it, expect } from 'vitest';

describe('CustomAccountInformationItemLabelComponent', () => {
  let component: CustomAccountInformationItemLabelComponent;
  let fixture: ComponentFixture<CustomAccountInformationItemLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomAccountInformationItemLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomAccountInformationItemLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct hostClass binding', () => {
    const hostElement: HTMLElement = fixture.nativeElement;
    expect(hostElement.className).toContain('govuk-body');
    expect(hostElement.className).toContain('govuk-!-font-size-16');
    expect(hostElement.className).toContain('govuk-!-font-weight-bold');
    expect(hostElement.className).toContain('govuk-!-margin-0');
  });
});
