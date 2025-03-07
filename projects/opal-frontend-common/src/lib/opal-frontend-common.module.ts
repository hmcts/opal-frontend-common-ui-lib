import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GovukTextInputComponent } from './components/govuk/govuk-text-input/govuk-text-input.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    GovukTextInputComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    GovukTextInputComponent,
  ],
})
export class OpalFrontendCommonModule { }
