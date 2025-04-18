import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-header-navigation-item, [opal-lib-moj-header-navigation-item]',
  templateUrl: './moj-header-navigation-item.component.html',
})
export class MojHeaderNavigationItemComponent {
  @Output() public actionClick = new EventEmitter<boolean>();

  /**
   * Handles the click event for the action button.
   * @param event - The click event.
   */
  handleClick(event: Event): void {
    event.preventDefault();
    this.actionClick.emit(true);
  }
}
