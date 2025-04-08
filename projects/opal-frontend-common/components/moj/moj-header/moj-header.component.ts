import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IMojHeaderLinks } from './interfaces/moj-header-links.interface';

@Component({
  selector: 'opal-lib-moj-header',
  imports: [RouterLink],
  templateUrl: './moj-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojHeaderComponent {
  @Input() public headerLinks!: IMojHeaderLinks;
}
