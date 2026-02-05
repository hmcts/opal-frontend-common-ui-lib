import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SignInStubComponent } from './sign-in-stub/sign-in-stub.component';
import { ISignInStubForm } from './interfaces';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { SSO_ENDPOINTS } from '@hmcts/opal-frontend-common/services/auth-service/constants';

@Component({
  selector: 'opal-lib-sign-in',
  imports: [SignInStubComponent],
  templateUrl: './sign-in.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {
  private readonly document = inject(DOCUMENT);

  public readonly globalStore = inject(GlobalStore);
  public ssoEnabled: boolean | null = true;

  /**
   * Handles the submission of the stub sign-in form.
   * Redirects the user to the SSO login page with the provided email.
   * @param formData - The form data containing the email.
   */
  public handleStubSignInFormSubmit(formData: ISignInStubForm): void {
    this.document.location.href = `${SSO_ENDPOINTS.login}?email=${formData.email}`;
  }
}
