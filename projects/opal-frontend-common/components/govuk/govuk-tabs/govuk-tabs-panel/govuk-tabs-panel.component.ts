import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, inject } from '@angular/core';

@Component({
  selector: 'opal-lib-govuk-tabs-panel',
  templateUrl: './govuk-tabs-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTabsPanelComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  @Input({ required: false }) tabItemId?: string;

  @HostBinding('class') hostClass = 'govuk-tabs__panel';
  @HostBinding('attr.role') role = 'tabpanel';
  /**
   * Ensures the panel renders as a block element so GOV.UK padding/border styles wrap content correctly.
   */
  @HostBinding('style.display') display = 'block';

  @HostBinding('attr.aria-labelledby')
  /**
   * Associates the panel with its tab by ID.
   */
  get ariaLabelledBy(): string | null {
    if (this.tabItemId) {
      return this.tabItemId;
    }

    const panelId = this.elementRef.nativeElement.id;
    if (!panelId) {
      return null;
    }

    const prefix = this.elementRef.nativeElement.closest('.govuk-tabs')?.id ?? 'tab';
    return `${prefix}-${panelId}`;
  }
}
