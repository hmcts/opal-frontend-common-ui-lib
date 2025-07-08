import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'opal-lib-govuk-list-link',
  imports: [],
  templateUrl: './govuk-list-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukListLinkComponent {
  @Input({ required: true }) linkText!: string;
  @Output() linkClickEvent = new EventEmitter<void>();

  handleClick(event: MouseEvent): void {
    event.preventDefault();
    this.linkClickEvent.emit();
  }
}
