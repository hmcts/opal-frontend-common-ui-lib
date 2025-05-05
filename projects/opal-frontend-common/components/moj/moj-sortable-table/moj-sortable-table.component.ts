import { afterNextRender, ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { addGdsBodyClass } from '@hmcts/opal-frontend-common/components/govuk/helpers';

@Component({
  selector: 'opal-lib-moj-sortable-table',

  templateUrl: './moj-sortable-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojSortableTableComponent {
  @Input({ required: false }) public tableClasses!: string;

  constructor() {
    afterNextRender(() => {
      // Only trigger the render of the component in the browser
      this.configureSortableTable();
    });
  }

  /**
   * Configures the sortable functionality using the moj library.
   */
  public configureSortableTable(): void {
    import('@ministryofjustice/frontend/moj/all').then((sortableTable) => {
      addGdsBodyClass();
      sortableTable.initAll();
    });
  }
}
