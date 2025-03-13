import { NgModule } from '@angular/core';
import { GovukButtonComponent } from './components/govuk/govuk-button/govuk-button.component';
import { GovukTextInputComponent } from './components/govuk/govuk-text-input/govuk-text-input.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

export const GOV_UI_COMPONENTS = [GovukButtonComponent, GovukTextInputComponent];

@NgModule({
  imports: [...GOV_UI_COMPONENTS, CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild([])],
  exports: [...GOV_UI_COMPONENTS],
})
export class OpalFrontendCommonModule {}
