import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IMojHeaderLinks } from './interfaces/moj-header-links.interface';

@Component({
  selector: 'opal-lib-moj-header',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './moj-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MojHeaderComponent {
  @Input() public headerLinks!: IMojHeaderLinks;
}
