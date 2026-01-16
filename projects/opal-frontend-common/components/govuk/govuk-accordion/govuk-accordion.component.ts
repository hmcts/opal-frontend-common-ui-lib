import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface GovukAccordionSection {
  id?: string;
  heading: string;
  content?: string | TemplateRef<unknown>;
  expanded?: boolean;
}

let nextAccordionId = 0;

@Component({
  selector: 'opal-lib-govuk-accordion',
  imports: [CommonModule],
  templateUrl: './govuk-accordion.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukAccordionComponent {
  private _sections: GovukAccordionSection[] = [];
  private expandedStates: boolean[] = [];

  @Input({ required: false }) accordionId = `govuk-accordion-${++nextAccordionId}`;
  /**
   * Sets accordion sections and syncs default expanded states.
   */
  @Input({ required: true }) set sections(value: GovukAccordionSection[]) {
    this._sections = value ?? [];
    this.expandedStates = this._sections.map((section) => !!section.expanded);
  }
  /**
   * Returns the current accordion sections.
   */
  get sections(): GovukAccordionSection[] {
    return this._sections;
  }

  @Output() expand = new EventEmitter<string>();
  @Output() collapse = new EventEmitter<string>();

  /**
   * Resolves the unique section ID for a given index.
   */
  private getSectionId(index: number): string {
    const section = this.sections[index];
    const suffix = index + 1;
    return section?.id ?? `${this.accordionId}-section-${suffix}`;
  }

  /**
   * Toggles a section by its resolved ID.
   */
  public toggleSection(sectionId: string): void {
    const index = this.sections.findIndex((section, sectionIndex) => this.getSectionId(sectionIndex) === sectionId);
    if (index === -1) {
      return;
    }

    this.toggleSectionByIndex(index);
  }

  /**
   * Expands all sections and emits expand events.
   */
  public expandAllSections(): void {
    this.expandedStates = this.sections.map(() => true);
    this.sections.forEach((_section, index) => this.expand.emit(this.getSectionId(index)));
  }

  /**
   * Collapses all sections and emits collapse events.
   */
  public collapseAllSections(): void {
    this.expandedStates = this.sections.map(() => false);
    this.sections.forEach((_section, index) => this.collapse.emit(this.getSectionId(index)));
  }

  /**
   * Returns whether a section is expanded by index.
   */
  public isExpanded(index: number): boolean {
    return this.expandedStates[index] ?? false;
  }

  /**
   * Toggles a section by index and emits the appropriate event.
   */
  public toggleSectionByIndex(index: number): void {
    const nextStates = [...this.expandedStates];
    const nextValue = !nextStates[index];
    nextStates[index] = nextValue;
    this.expandedStates = nextStates;

    const sectionId = this.getSectionId(index);
    if (nextValue) {
      this.expand.emit(sectionId);
    } else {
      this.collapse.emit(sectionId);
    }
  }

  /**
   * Builds the heading ID for a section.
   */
  public getHeadingId(index: number): string {
    return `${this.getSectionId(index)}-heading`;
  }

  /**
   * Builds the content ID for a section.
   */
  public getContentId(index: number): string {
    return `${this.getSectionId(index)}-content`;
  }

  /**
   * Type guard for template content.
   */
  public isTemplateRef(content: GovukAccordionSection['content']): content is TemplateRef<unknown> {
    return content instanceof TemplateRef;
  }
}
