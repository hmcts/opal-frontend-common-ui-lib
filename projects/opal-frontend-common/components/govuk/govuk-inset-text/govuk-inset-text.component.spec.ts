import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukInsetTextComponent } from './govuk-inset-text.component';
import { Component } from '@angular/core';
import { describe, beforeEach, afterAll, it, expect } from 'vitest';

@Component({
  template: `<opal-lib-govuk-inset-text insetTextId="test" [classes]="classes">Hello World</opal-lib-govuk-inset-text>`,
  imports: [GovukInsetTextComponent],
})
class TestHostComponent {
  public classes: string | null = 'custom-inset-class';
}

describe('GovukInsetTextComponent', () => {
  let component: TestHostComponent | null;
  let fixture: ComponentFixture<TestHostComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    fixture = null;
    component = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render into inset-text', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    const element = fixture.nativeElement.querySelector('#test');
    expect(element.textContent?.trim()).toBe('Hello World');
  });

  it('should apply additional classes when provided', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    const element = fixture.nativeElement.querySelector('#test');
    expect(element.classList.contains('custom-inset-class')).toBe(true);
  });
});
