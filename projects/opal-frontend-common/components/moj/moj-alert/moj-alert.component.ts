import { Component, ElementRef, inject, Input, Renderer2 } from '@angular/core';
import { MojAlertType } from './constants/alert-types.constant';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'opal-lib-moj-alert',
  imports: [CommonModule],
  templateUrl: './moj-alert.component.html',
})
export class MojAlertComponent {
  @Input({ required: true }) text: string = '';
  @Input({ required: true }) type: MojAlertType = 'information';

  private elref = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  /**
   * Removes the host element from the DOM.
   *
   * This method retrieves the native element reference from the component and its parent node.
   * If the parent element exists, it uses the renderer to remove the host element, effectively dismissing
   * the component from the user interface.
   */
  dismiss(): void {
    const hostElem = this.elref.nativeElement;
    const parent = hostElem.parentNode as HTMLElement;
    if (parent) {
      this.renderer.removeChild(parent, hostElem);
    }
  }
}
