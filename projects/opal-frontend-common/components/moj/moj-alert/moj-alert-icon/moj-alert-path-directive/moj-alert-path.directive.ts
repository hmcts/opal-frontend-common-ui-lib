import { Directive, OnChanges, Input, ElementRef, Renderer2 } from '@angular/core';
import { MojAlertType } from '../../constants/alert-types.constant';
import { MOJ_ALERT_ICON_PATHS } from './constants/alert-icon-path.constant';

@Directive({
  selector: '[opalLibMojAlertSortIcon]',
  standalone: true,
})
export class MojAlertPathDirective implements OnChanges {
  @Input('opalLibMojAlertSortIcon') type: MojAlertType = 'information';

  constructor(
    private readonly el: ElementRef<SVGSVGElement>,
    private readonly renderer: Renderer2,
  ) {}

  private getPathsForAlertTypes(type: MojAlertType): string[] {
    const icons = MOJ_ALERT_ICON_PATHS;
    switch (type) {
      case 'information':
        return [icons.information];
      case 'success':
        return [icons.success];
      case 'warning':
        return [icons.warning];
      case 'error':
        return [icons.error];
      default:
        return [icons.information];
    }
  }

  public ngOnChanges(): void {
    const svg = this.el.nativeElement;
    this.renderer.setAttribute(svg, 'xmlns', 'http://www.w3.org/2000/svg');
    this.renderer.setAttribute(svg, 'fill', 'none');

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const paths = this.getPathsForAlertTypes(this.type);
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
