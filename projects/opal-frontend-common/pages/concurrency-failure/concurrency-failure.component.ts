import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'opal-lib-concurrency-failure',
  standalone: true,
  imports: [],
  templateUrl: './concurrency-failure.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConcurrencyFailureComponent {}
