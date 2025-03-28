import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-pagination-list , [opal-lib-moj-pagination-list]',
  imports: [],
  templateUrl: './moj-pagination-list.component.html',
})
export class MojPaginationListComponent {
  @HostBinding('class') class = 'moj-pagination__list';
}
