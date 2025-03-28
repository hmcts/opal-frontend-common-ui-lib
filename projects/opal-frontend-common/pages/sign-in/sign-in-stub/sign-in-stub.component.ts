import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ISignInStubForm } from '../interfaces';
import { GovukTextInputComponent, GovukButtonComponent } from '@hmcts/opal-frontend-common/components/govuk';

@Component({
    selector: 'opal-lib-sign-in-stub',
    imports: [FormsModule, ReactiveFormsModule, GovukTextInputComponent, GovukButtonComponent],
    templateUrl: './sign-in-stub.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInStubComponent implements OnInit {
  public signInForm!: FormGroup;
  @Output() private readonly signInFormSubmit = new EventEmitter<ISignInStubForm>();

  /**
   * Sets up the sign-in form.
   */
  private setupSignInForm(): void {
    this.signInForm = new FormGroup({
      email: new FormControl(null, [Validators.required]),
    });
  }

  /**
   * Handles the form submission.
   * If the signInForm is valid, emits the signInForm value using the signInFormSubmit event.
   */
  public handleFormSubmit(): void {
    if (this.signInForm.valid) {
      this.signInFormSubmit.emit(this.signInForm.value);
    }
  }

  public ngOnInit(): void {
    this.setupSignInForm();
  }
}
