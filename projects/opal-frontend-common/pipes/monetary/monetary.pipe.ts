import { Pipe, PipeTransform, inject } from '@angular/core';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

@Pipe({
  name: 'monetary',
  standalone: true,
})
export class MonetaryPipe implements PipeTransform {
  private readonly utilsService = inject(UtilsService);

  transform(value: number | string): string {
    return this.utilsService.convertToMonetaryString(value);
  }
}
