import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukHeadingWithCaptionComponent } from './govuk-heading-with-caption.component';
import { describe, beforeEach, afterAll, it, expect } from 'vitest';

describe('GovukHeadingWithCaptionComponent', () => {
  let component: GovukHeadingWithCaptionComponent | null;
  let fixture: ComponentFixture<GovukHeadingWithCaptionComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukHeadingWithCaptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukHeadingWithCaptionComponent);
    component = fixture.componentInstance;

    // Set required inputs
    component.captionText = 'HY35014';
    component.headingText = 'Riding a bicycle on a footpath';

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

  it('should render default h1 heading with caption inside', () => {
    const compiled = fixture!.debugElement.nativeElement;
    const heading = compiled.querySelector('h1');
    const caption = heading.querySelector('span');

    expect(heading).toBeTruthy();
    expect(heading.textContent.trim()).toBe('HY35014 Riding a bicycle on a footpath');
    expect(caption.textContent).toBe('HY35014');
  });

  it('should render h2 heading when headingLevel is 2', () => {
    // Create a new component instance for this specific test
    const testFixture = TestBed.createComponent(GovukHeadingWithCaptionComponent);
    const testComponent = testFixture.componentInstance;

    testComponent.captionText = 'TEST123';
    testComponent.headingText = 'Test heading level 2';
    testComponent.headingLevel = 2;

    testFixture.detectChanges();

    const compiled = testFixture.debugElement.nativeElement;
    const heading = compiled.querySelector('h2');
    const caption = heading?.querySelector('span');

    expect(heading).toBeTruthy();
    expect(compiled.querySelector('h1')).toBeFalsy();
    expect(heading.textContent.trim()).toBe('TEST123 Test heading level 2');
    expect(caption?.textContent).toBe('TEST123');
  });

  it('should render h3 heading when headingLevel is 3', () => {
    const testFixture = TestBed.createComponent(GovukHeadingWithCaptionComponent);
    const testComponent = testFixture.componentInstance;

    testComponent.captionText = 'ABC456';
    testComponent.headingText = 'Test heading level 3';
    testComponent.headingLevel = 3;

    testFixture.detectChanges();

    const compiled = testFixture.debugElement.nativeElement;
    const heading = compiled.querySelector('h3');
    const caption = heading?.querySelector('span');

    expect(heading).toBeTruthy();
    expect(heading.textContent.trim()).toBe('ABC456 Test heading level 3');
    expect(caption?.textContent).toBe('ABC456');
  });

  it('should render h4 heading when headingLevel is 4', () => {
    const testFixture = TestBed.createComponent(GovukHeadingWithCaptionComponent);
    const testComponent = testFixture.componentInstance;

    testComponent.captionText = 'XYZ789';
    testComponent.headingText = 'Test heading level 4';
    testComponent.headingLevel = 4;

    testFixture.detectChanges();

    const compiled = testFixture.debugElement.nativeElement;
    const heading = compiled.querySelector('h4');
    const caption = heading?.querySelector('span');

    expect(heading).toBeTruthy();
    expect(heading.textContent.trim()).toBe('XYZ789 Test heading level 4');
    expect(caption?.textContent).toBe('XYZ789');
  });

  it('should render h5 heading when headingLevel is 5', () => {
    const testFixture = TestBed.createComponent(GovukHeadingWithCaptionComponent);
    const testComponent = testFixture.componentInstance;

    testComponent.captionText = 'DEF321';
    testComponent.headingText = 'Test heading level 5';
    testComponent.headingLevel = 5;

    testFixture.detectChanges();

    const compiled = testFixture.debugElement.nativeElement;
    const heading = compiled.querySelector('h5');
    const caption = heading?.querySelector('span');

    expect(heading).toBeTruthy();
    expect(heading.textContent.trim()).toBe('DEF321 Test heading level 5');
    expect(caption?.textContent).toBe('DEF321');
  });

  it('should render h6 heading when headingLevel is 6', () => {
    const testFixture = TestBed.createComponent(GovukHeadingWithCaptionComponent);
    const testComponent = testFixture.componentInstance;

    testComponent.captionText = 'GHI654';
    testComponent.headingText = 'Test heading level 6';
    testComponent.headingLevel = 6;

    testFixture.detectChanges();

    const compiled = testFixture.debugElement.nativeElement;
    const heading = compiled.querySelector('h6');
    const caption = heading?.querySelector('span');

    expect(heading).toBeTruthy();
    expect(heading.textContent.trim()).toBe('GHI654 Test heading level 6');
    expect(caption?.textContent).toBe('GHI654');
  });

  it('should only render the specified heading level and no others', () => {
    const testFixture = TestBed.createComponent(GovukHeadingWithCaptionComponent);
    const testComponent = testFixture.componentInstance;

    testComponent.captionText = 'UNIQUE';
    testComponent.headingText = 'Only h3 should exist';
    testComponent.headingLevel = 3;

    testFixture.detectChanges();

    const compiled = testFixture.debugElement.nativeElement;

    // Should have h3
    expect(compiled.querySelector('h3')).toBeTruthy();

    // Should not have any other heading levels
    expect(compiled.querySelector('h1')).toBeFalsy();
    expect(compiled.querySelector('h2')).toBeFalsy();
    expect(compiled.querySelector('h4')).toBeFalsy();
    expect(compiled.querySelector('h5')).toBeFalsy();
    expect(compiled.querySelector('h6')).toBeFalsy();
  });

  it('should have caption nested inside heading for accessibility', () => {
    const compiled = fixture!.debugElement.nativeElement;
    const heading = compiled.querySelector('h1');
    const caption = heading.querySelector('span');

    // Verify caption is a direct child of the heading
    expect(caption.parentElement).toBe(heading);

    // Verify the caption comes before the heading text in the accessible name
    expect(heading.textContent.trim()).toMatch(/^HY35014\s+Riding a bicycle on a footpath$/);
  });
});
