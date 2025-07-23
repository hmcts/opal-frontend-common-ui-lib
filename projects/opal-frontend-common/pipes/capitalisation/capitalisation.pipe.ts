import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'uppercaseAll' })
export class UppercaseAllPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return value ? value.toUpperCase() : '';
  }
}
