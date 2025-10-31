import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'opal-lib-permission-denied',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './permission-denied.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionDeniedComponent {
  private readonly document = inject(DOCUMENT);

  /**
   * Retrieves the URL to navigate back to, based on the document's referrer.
   * If the referrer is valid and not the current page's URL, it returns the referrer.
   * Otherwise, it defaults to the root path ('/').
   *
   * @returns {string} The URL to navigate back to.
   */
  public get backLinkHref(): string {
    const referrer = this.document.referrer?.trim();
    if (referrer && referrer !== this.document.location.href) {
      return referrer;
    }
    return '/';
  }
}
