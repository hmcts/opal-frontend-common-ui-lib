import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, PLATFORM_ID, inject } from '@angular/core';

@Component({
  selector: 'opal-lib-govuk-tabs',
  templateUrl: './govuk-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovukTabsComponent implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Lifecycle hook that is called after Angular has fully initialized the component's view.
   * It is called only once after the first ngAfterContentChecked.
   * We use it to initialize the govuk-frontend component.
   */
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      import('govuk-frontend').then((govuk) => {
        govuk.initAll();
      });
    }
  }
}
