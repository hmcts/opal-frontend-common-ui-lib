import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-button-menu-item',
  templateUrl: './moj-button-menu-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojButtonMenuItemComponent {
  @Input({ required: true }) itemText!: string;
  @Output() actionClick = new EventEmitter<void>();

  public handleClick(event: Event) {
    event.preventDefault();
    this.actionClick.emit();
  }
}
