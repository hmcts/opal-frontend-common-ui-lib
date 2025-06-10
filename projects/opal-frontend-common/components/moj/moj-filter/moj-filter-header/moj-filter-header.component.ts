import { Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-moj-filter-header',
  imports: [],
  templateUrl: './moj-filter-header.component.html',
})
export class MojFilterHeaderComponent {
  @Input({ required: false }) title: string = 'Filter';
}
