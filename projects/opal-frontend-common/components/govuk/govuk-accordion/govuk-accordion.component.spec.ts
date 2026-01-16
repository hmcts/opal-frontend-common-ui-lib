import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukAccordionComponent, GovukAccordionSection } from './govuk-accordion.component';

@Component({
  template: `
    <ng-template #contentTemplate>Template content</ng-template>
    <opal-lib-govuk-accordion [sections]="sections"></opal-lib-govuk-accordion>
  `,
  imports: [GovukAccordionComponent],
})
class AccordionTemplateHostComponent {
  @ViewChild('contentTemplate', { static: true }) contentTemplate!: TemplateRef<unknown>;
  public sections: GovukAccordionSection[] = [];
}

describe('GovukAccordionComponent', () => {
  let component: GovukAccordionComponent;
  let fixture: ComponentFixture<GovukAccordionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GovukAccordionComponent],
    });

    fixture = TestBed.createComponent(GovukAccordionComponent);
    component = fixture.componentInstance;
    component.accordionId = 'test-accordion';
    component.sections = [
      { heading: 'First section', content: 'First content' },
      { heading: 'Second section', content: 'Second content', expanded: true },
    ];
    fixture.detectChanges();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set aria attributes and toggle expansion', () => {
    const firstButton = fixture.nativeElement.querySelector('#test-accordion-section-1-heading') as HTMLButtonElement;
    const firstContent = fixture.nativeElement.querySelector('#test-accordion-section-1-content') as HTMLElement;

    expect(firstButton.getAttribute('aria-expanded')).toBe('false');
    expect(firstButton.getAttribute('aria-controls')).toBe('test-accordion-section-1-content');
    expect(firstContent.hasAttribute('hidden')).toBeTrue();

    firstButton.click();
    fixture.detectChanges();

    expect(firstButton.getAttribute('aria-expanded')).toBe('true');
    expect(firstContent.hasAttribute('hidden')).toBeFalse();
  });

  it('should emit expand and collapse when toggling a section by index', () => {
    const expandSpy = spyOn(component.expand, 'emit');
    const collapseSpy = spyOn(component.collapse, 'emit');

    component.toggleSectionByIndex(0);
    fixture.detectChanges();

    expect(component.isExpanded(0)).toBeTrue();
    expect(expandSpy).toHaveBeenCalledWith('test-accordion-section-1');

    component.toggleSectionByIndex(0);
    fixture.detectChanges();

    expect(component.isExpanded(0)).toBeFalse();
    expect(collapseSpy).toHaveBeenCalledWith('test-accordion-section-1');
  });

  it('should expand and collapse all sections', () => {
    const expandSpy = spyOn(component.expand, 'emit');
    const collapseSpy = spyOn(component.collapse, 'emit');

    component.expandAllSections();

    expect(component.isExpanded(0)).toBeTrue();
    expect(component.isExpanded(1)).toBeTrue();
    expect(expandSpy.calls.allArgs()).toEqual([['test-accordion-section-1'], ['test-accordion-section-2']]);

    component.collapseAllSections();

    expect(component.isExpanded(0)).toBeFalse();
    expect(component.isExpanded(1)).toBeFalse();
    expect(collapseSpy.calls.allArgs()).toEqual([['test-accordion-section-1'], ['test-accordion-section-2']]);
  });

  it('should ignore toggleSection when the id is not found', () => {
    const expandSpy = spyOn(component.expand, 'emit');
    const collapseSpy = spyOn(component.collapse, 'emit');

    component.toggleSection('missing-section');

    expect(component.isExpanded(0)).toBeFalse();
    expect(component.isExpanded(1)).toBeTrue();
    expect(expandSpy).not.toHaveBeenCalled();
    expect(collapseSpy).not.toHaveBeenCalled();
  });

  it('should toggle the matching section when using toggleSection', () => {
    const expandSpy = spyOn(component.expand, 'emit');

    component.toggleSection('test-accordion-section-1');

    expect(component.isExpanded(0)).toBeTrue();
    expect(expandSpy).toHaveBeenCalledWith('test-accordion-section-1');
  });

  it('should use custom section ids when provided', () => {
    fixture.componentRef.setInput('sections', [{ id: 'custom-section', heading: 'Custom', content: 'Custom content' }]);
    fixture.detectChanges();

    const headingId = component.getHeadingId(0);
    const contentId = component.getContentId(0);
    const heading = fixture.nativeElement.querySelector(`#${headingId}`) as HTMLElement;
    const content = fixture.nativeElement.querySelector(`#${contentId}`) as HTMLElement;

    expect(heading).toBeTruthy();
    expect(content).toBeTruthy();
  });

  it('should default sections to an empty array when input is nullish', () => {
    fixture.componentRef.setInput('sections', undefined as unknown as GovukAccordionSection[]);
    fixture.detectChanges();

    expect(component.sections).toEqual([]);
    expect(component.isExpanded(0)).toBeFalse();
  });

  it('should return false when checking an out-of-range expanded state', () => {
    expect(component.isExpanded(5)).toBeFalse();
  });
});

describe('GovukAccordionComponent with template content', () => {
  let fixture: ComponentFixture<AccordionTemplateHostComponent>;
  let hostComponent: AccordionTemplateHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionTemplateHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccordionTemplateHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
    hostComponent.sections = [{ heading: 'Template section', content: hostComponent.contentTemplate, expanded: true }];
    fixture.detectChanges();
  });

  it('should render template content when provided', () => {
    const content = fixture.nativeElement.querySelector('.govuk-accordion__section-content') as HTMLElement;
    expect(content.innerText).toContain('Template content');
  });
});
