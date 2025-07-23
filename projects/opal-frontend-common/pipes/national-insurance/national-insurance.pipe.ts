import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nationalInsurance',
  standalone: true,
})
export class NationalInsurancePipe implements PipeTransform {
  transform(value: string | null): string {
    if (!value) {
      return '';
    }

    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    if (cleaned.length < 9) return value;

    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
  }
}
