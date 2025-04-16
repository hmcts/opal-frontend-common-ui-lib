import { Directive, ElementRef, Renderer2, inject, AfterViewInit, OnDestroy } from '@angular/core';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

@Directive({
  selector: '[opalLibCapitaliseAllCharacters]',
})
export class CapitalisationDirective implements AfterViewInit, OnDestroy {
  private inputElement!: HTMLInputElement | null;
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly utilsService = inject(UtilsService);

  /**
   * A callback function that removes an event listener when invoked.
   * If no listener is currently attached, this will be `null`.
   */
  private removeListener: (() => void) | null = null;

  /**
   * Lifecycle hook that is called after Angular has fully initialized a component's view.
   * This method sets up an event listener on an input element within the directive's host element.
   * The listener capitalizes the input value in real-time as the user types.
   *
   * - It first queries for an `input` element within the host element.
   * - If the input element is found, it attaches an `input` event listener.
   * - On each input event, the listener:
   *   - Retrieves the current value of the input field.
   *   - Capitalizes the value using the `capitalise` method.
   *   - Updates the input field's value with the capitalized text.
   *
   * This ensures that the input value is always displayed in a capitalized format.
   */
  ngAfterViewInit(): void {
    this.inputElement = this.el.nativeElement.querySelector('input');

    if (this.inputElement) {
      this.removeListener = this.renderer.listen(this.inputElement, 'input', (event: Event) => {
        const target = event.target as HTMLInputElement;
        const capitalized = this.capitalise(target.value);

        this.renderer.setProperty(this.inputElement, 'value', capitalized);
      });
    }
  }

  /**
   * Lifecycle hook that is called when the directive is destroyed.
   * Cleans up any resources or event listeners to prevent memory leaks.
   * If a listener removal function is defined, it is invoked and set to null.
   */
  ngOnDestroy(): void {
    if (this.removeListener) {
      this.removeListener();
      this.removeListener = null;
    }
  }

  /**
   * Converts the given string to uppercase using the utility service.
   *
   * @param value - The string to be capitalised.
   * @returns The capitalised string with all letters in uppercase.
   */
  private capitalise(value: string): string {
    return this.utilsService.upperCaseAllLetters(value);
  }
}
