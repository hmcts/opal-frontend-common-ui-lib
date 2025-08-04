import { Directive, OnChanges, Input, ElementRef, Renderer2, inject } from '@angular/core';
import { MojAlertType } from '../../constants/alert-types.constant';
import { MOJ_ALERT_ICON_PATHS } from './constants/alert-icon-path.constant';
@Directive({
  selector: '[opalLibMojAlertSortIcon]',
  standalone: true,
})
export class MojAlertPathDirective implements OnChanges {
  private readonly icons = MOJ_ALERT_ICON_PATHS;
  private readonly el = inject(ElementRef<SVGSVGElement>);
  private readonly renderer = inject(Renderer2);

  @Input('opalLibMojAlertSortIcon') type: MojAlertType = 'information';

  /**
   * Retrieves the SVG path(s) corresponding to a given alert type.
   *
   * @param type - The alert type for which to get the icon path. Valid values include 'information', 'success', 'warning', and 'error'.
   * @returns An array containing the SVG path string for the specified alert type.
   *
   * If the provided type does not match any known alert types, the function defaults to returning the 'information' icon path.
   */
  private getPathsForType(type: MojAlertType): string[] {
    switch (type) {
      case 'information':
        return [this.icons.information];
      case 'success':
        return [this.icons.success];
      case 'warning':
        return [this.icons.warning];
      case 'error':
        return [this.icons.error];
      default:
        return [this.icons.information];
    }
  }

  /**
   * Angular lifecycle hook that is called when any data-bound property of a directive changes.
   *
   * This method updates the SVG element by setting its namespace and fill attributes,
   * removing all existing child nodes, and appending new <path> elements corresponding
   * to the alert type. Each new path element is created with the appropriate attributes,
   * ensuring that the SVG reflects the current alert type consistently.
   */
  public ngOnChanges(): void {
    const svg = this.el.nativeElement;
    this.renderer.setAttribute(svg, 'xmlns', 'http://www.w3.org/2000/svg');
    this.renderer.setAttribute(svg, 'fill', 'none');

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const paths = this.getPathsForType(this.type);
    paths.forEach((pathD) => {
      const path = this.renderer.createElement('path', 'svg');
      this.renderer.setAttribute(path, 'd', pathD);
      this.renderer.setAttribute(path, 'fill', 'currentColor');
      this.renderer.setAttribute(path, 'fill-rule', 'evenodd');
      this.renderer.setAttribute(path, 'clip-rule', 'evenodd');

      svg.appendChild(path);
    });
  }
}
