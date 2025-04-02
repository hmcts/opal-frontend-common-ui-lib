import { Pipe, PipeTransform } from '@angular/core';
import { DateService } from '@hmcts/opal-frontend-common/services';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  constructor(private readonly dateService: DateService) {}

  transform(value: string | null | undefined, inputFormat: string, outputFormat: string): string {
    if (!value) return '—';

    const formatted = this.dateService.getFromFormatToFormat(value, inputFormat, outputFormat);

    return formatted;
  }
}
