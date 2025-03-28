import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk';

@Component({
    selector: 'opal-lib-sign-in-sso',
    imports: [CommonModule, GovukButtonComponent],
    templateUrl: './sign-in-sso.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInSsoComponent {
  @Output() private readonly signInButtonClick = new EventEmitter();

  /**
   * Handles the button click event.
   * Emits the `signInButtonClick` event.
   */
  public handleButtonClick(): void {
    this.signInButtonClick.emit();
  }
}
