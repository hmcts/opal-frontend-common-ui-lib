import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'opal-lib-concurrency-failure',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './concurrency-failure.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConcurrencyFailureComponent {}
