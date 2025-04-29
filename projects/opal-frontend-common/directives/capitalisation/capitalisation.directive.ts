import { Directive, HostListener, Renderer2, inject } from '@angular/core';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

@Directive({
  selector: '[opalLibCapitaliseAllCharacters]',
})
export class CapitalisationDirective {
  private readonly renderer = inject(Renderer2);
  private readonly utilsService = inject(UtilsService);

  /**
   * Handles the input event on the associated HTML element.
   * Captures the input value, applies capitalisation, and updates the element's value.
   *
   * @param event - The input event triggered by the user.
   */
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (!value) {
      return;
    }

    const capitalisedValue = this.utilsService.upperCaseAllLetters(value);

    if (value !== capitalisedValue) {
      this.renderer.setProperty(target, 'value', capitalisedValue);
      target.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
