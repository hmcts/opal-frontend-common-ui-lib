import { Directive, OnChanges, Input, ElementRef, Renderer2, inject } from '@angular/core';
import { MOJ_SORTABLE_TABLE_HEADER_SORT_ICONS } from './constants/moj-sortable-table-header-sort-icons.constant';

@Directive({
  selector: '[opalLibMojSortableTableHeaderSortIcon]',
  standalone: true,
})
export class MojSortableTableHeaderSortIconDirective implements OnChanges {
  private readonly el = inject(ElementRef<SVGSVGElement>);
  private readonly renderer = inject(Renderer2);
  @Input('opalLibMojSortableTableHeaderSortIcon') sortDirection: 'ascending' | 'descending' | 'none' = 'none';

  /**
   * Returns the SVG path(s) for the sort icon based on the specified direction.
   *
   * @param dir - The sort direction, which can be 'ascending', 'descending', or 'none'.
   * @returns An array of SVG path strings corresponding to the given sort direction.
   */
  private getPathsForDirection(dir: 'ascending' | 'descending' | 'none'): string[] {
    const icons = MOJ_SORTABLE_TABLE_HEADER_SORT_ICONS;
    switch (dir) {
      case 'ascending':
        return [icons.ascending];
      case 'descending':
        return [icons.descending];
      default:
        return icons.none;
    }
  }

  public ngOnChanges(): void {
    const svg = this.el.nativeElement;
    this.renderer.setAttribute(svg, 'xmlns', 'http://www.w3.org/2000/svg');
    this.renderer.setAttribute(svg, 'fill', 'none');

    // Clear existing <path> children
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Append new <path> elements based on sortDirection
    const paths = this.getPathsForDirection(this.sortDirection);
    paths.forEach((pathD) => {
      const path = this.renderer.createElement('path', 'svg');
      this.renderer.setAttribute(path, 'd', pathD);
      this.renderer.setAttribute(path, 'fill', 'currentColor');

      svg.appendChild(path);
    });
  }
}
