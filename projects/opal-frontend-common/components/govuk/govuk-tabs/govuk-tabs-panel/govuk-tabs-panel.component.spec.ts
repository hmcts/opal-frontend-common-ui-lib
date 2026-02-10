import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GovukTabsPanelComponent } from './govuk-tabs-panel.component';
import { Component } from '@angular/core';
import { describe, beforeEach, afterAll, it, expect } from 'vitest';

@Component({
  template: `<opal-lib-govuk-tabs-panel id="test-panel">Hello World</opal-lib-govuk-tabs-panel>`,
  imports: [GovukTabsPanelComponent],
})
class TestHostComponent {}

@Component({
  template: `<opal-lib-govuk-tabs-panel id="custom-panel" tabItemId="custom-tab">Hello</opal-lib-govuk-tabs-panel>`,
  imports: [GovukTabsPanelComponent],
})
class CustomTabIdHostComponent {}

@Component({
  template: `<opal-lib-govuk-tabs-panel>No id</opal-lib-govuk-tabs-panel>`,
  imports: [GovukTabsPanelComponent],
})
class NoIdHostComponent {}
describe('GovukTabsPanelComponent', () => {
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

  it('should render into list ng-content', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }
    const element = fixture.nativeElement.querySelector('#test-panel');
    expect(element.textContent ?? '').toContain('Hello World');
  });

  it('should link the panel to the default tab id', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }
    const element = fixture.nativeElement.querySelector('#test-panel');
    expect(element.getAttribute('aria-labelledby')).toBe('tab-test-panel');
  });

  it('should render as a block element', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    const element = fixture.nativeElement.querySelector('#test-panel') as HTMLElement;
    expect(element.style.display).toBe('block');
  });
});

describe('GovukTabsPanelComponent with custom tab id', () => {
  let fixture: ComponentFixture<CustomTabIdHostComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomTabIdHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomTabIdHostComponent);
    fixture.detectChanges();
  });

  afterAll(() => {
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should use the provided tabItemId for aria-labelledby', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    const element = fixture.nativeElement.querySelector('#custom-panel');
    expect(element.getAttribute('aria-labelledby')).toBe('custom-tab');
  });
});

describe('GovukTabsPanelComponent without id', () => {
  let fixture: ComponentFixture<NoIdHostComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoIdHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoIdHostComponent);
    fixture.detectChanges();
  });

  afterAll(() => {
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should not set aria-labelledby when no id is present', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    const element = fixture.nativeElement.querySelector('opal-lib-govuk-tabs-panel');
    expect(element.getAttribute('aria-labelledby')).toBeNull();
  });
});
