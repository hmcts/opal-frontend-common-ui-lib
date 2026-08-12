import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { MonetaryPipe } from '@hmcts/opal-frontend-common/pipes/monetary';

type MonetaryFormat = 'default' | 'remove-minus-symbol';

@Component({
  selector: 'opal-lib-custom-accessible-monetary',
  imports: [],
  providers: [MonetaryPipe],
  templateUrl: './custom-accessible-monetary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomAccessibleMonetaryComponent {
  private readonly monetaryPipe = inject(MonetaryPipe);

  @Input({ required: true }) public value: number | string | null | undefined;
  @Input() public format: MonetaryFormat = 'default';

  /**
   * Formats the provided value using the shared monetary pipe.
   *
   * @returns The formatted monetary string for display.
   */
  public get formattedValue(): string {
    return this.monetaryPipe.transform(this.value, this.format);
  }

  /**
   * Determines whether the formatted value is negative and needs accessible split rendering.
   *
   * @returns `true` when the formatted value starts with a minus sign; otherwise `false`.
   */
  public get hasAccessibleNegativeValue(): boolean {
    return this.formattedValue.startsWith('-');
  }

  /**
   * Builds the screen-reader-friendly text for negative amounts.
   *
   * @returns The accessible value, prefixing negative amounts with the word `minus`.
   */
  public get accessibleValue(): string {
    if (!this.hasAccessibleNegativeValue) {
      return this.formattedValue;
    }

    return `minus ${this.formattedValue.slice(1)}`;
  }
}
