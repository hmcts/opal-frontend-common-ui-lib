import { Pipe, PipeTransform, inject } from '@angular/core';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

type MonetaryFormat = 'default' | 'remove-minus-symbol';

@Pipe({
  name: 'monetary',
  standalone: true,
})

/**
 * Converts a numeric or string value into a monetary string.
 *
 * @param value The value to format as currency.
 * @param format The output format. Use `remove-minus-symbol` to strip a leading minus sign.
 * @returns The formatted monetary value.
 */
export class MonetaryPipe implements PipeTransform {
  private readonly utilsService: UtilsService = inject(UtilsService);

  transform(value: number | string, format: MonetaryFormat = 'default'): string {
    const monetaryValue = this.utilsService.convertToMonetaryString(value);

    return format === 'remove-minus-symbol' ? monetaryValue.replace(/^-/, '') : monetaryValue;
  }
}
