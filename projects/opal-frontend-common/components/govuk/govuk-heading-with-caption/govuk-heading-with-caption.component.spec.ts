import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukHeadingWithCaptionComponent } from './govuk-heading-with-caption.component';

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
