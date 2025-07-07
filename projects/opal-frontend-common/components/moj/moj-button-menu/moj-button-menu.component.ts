import { ChangeDetectionStrategy, Component, Input, HostBinding, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-button-menu',
  templateUrl: './moj-button-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojButtonMenuComponent {
  @Input({ required: true }) menuButtonTitle!: string;
  @ViewChild('menuButton') menuButton!: ElementRef<HTMLElement>;

  @HostBinding('class') hostClasses = 'moj-button-menu';
  @HostBinding('attr.data-module') dataModule = 'moj-button-menu';
  @HostBinding('attr.data-button-text') get dataButtonText() {
    return this.menuButtonTitle;
  }
  @HostBinding('attr.data-button-classes') dataButtonClasses = 'govuk-button--secondary';
  @HostBinding('attr.data-moj-button-menu-init') dataMojButtonMenuInit = '';

  public isExpanded = false;

  /**
   * Toggles the expanded state of the button menu.
   *
   * This method retrieves the current "aria-expanded" state from the menu button,
   * inverts the state, and then updates both the "aria-expanded" attribute and the
   * internal component property "isExpanded" accordingly.
   *
   * @returns void
   */
  public toggleButtonMenu() {
    const button = this.menuButton.nativeElement;
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isExpanded));
    this.isExpanded = !isExpanded;
  }
}
