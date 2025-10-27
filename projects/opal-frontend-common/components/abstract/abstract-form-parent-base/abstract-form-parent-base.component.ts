import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CanDeactivateTypes } from '@hmcts/opal-frontend-common/guards/can-deactivate/types';

export abstract class AbstractFormParentBaseComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  public stateUnsavedChanges!: boolean;

  /**
   * Navigates to a specified route using the Angular Router.
   *
   * @param route - The target route to navigate to.
   * @param nonRelative - A boolean indicating whether the navigation should be absolute (true)
   *                      or relative to the current route (false). Defaults to false.
   * @param event - (Optional) The event object, typically from a click event, to prevent its default behavior.
   * @param routeData - (Optional) Additional data to pass to the target route's state.
   */
  protected routerNavigate(
    route: string,
    nonRelative: boolean = false,
    event?: Event,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    routeData?: any,
    fragment?: string,
  ): void {
    if (event) {
      event.preventDefault();
    }

    const navigationExtras = {
      ...(nonRelative ? {} : { relativeTo: this.activatedRoute.parent }),
      ...(routeData ? { state: routeData } : {}),
      ...(fragment ? { fragment } : {}),
    };

    this.router.navigate([route], navigationExtras);
  }

  /**
   * Checks if an object has any non-empty values.
   *
   * @param form - The object representing form data with key-value pairs.
   * @returns A boolean indicating whether the object has any non-empty values.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected hasFormValues(form: { [key: string]: any }): boolean {
    return Object.values(form).some(Boolean);
  }

  /**
   * If the user navigates externally from the site or closes the tab
   * Check if there is unsaved changes form state -> warning message
   * Otherwise -> no warning message
   *
   * @returns boolean
   */
  protected canDeactivate(): CanDeactivateTypes {
    if (this.stateUnsavedChanges) {
      return false;
    } else {
      return true;
    }
  }
}
