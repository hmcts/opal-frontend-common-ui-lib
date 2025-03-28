import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-pagination-item , [opal-lib-moj-pagination-item]',
  imports: [],
  templateUrl: './moj-pagination-item.component.html',
})
export class MojPaginationItemComponent {
  @HostBinding('class') class = 'moj-pagination__item';
}
