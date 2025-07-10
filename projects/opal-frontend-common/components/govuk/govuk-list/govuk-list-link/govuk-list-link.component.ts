import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'opal-lib-govuk-list-link',
  templateUrl: './govuk-list-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukListLinkComponent {
  @Input({ required: true }) linkText!: string;
  @Output() linkClickEvent = new EventEmitter<void>();

  public handleClick(event: Event): void {
    if (event.preventDefault) {
      event.preventDefault();
    }
    this.linkClickEvent.emit();
  }
}
