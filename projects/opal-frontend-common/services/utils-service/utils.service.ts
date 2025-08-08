import { ViewportScroller } from '@angular/common';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private readonly viewportScroller = inject(ViewportScroller);

  /**
   * Converts the first letter of a string to uppercase.
   * @param str - The input string.
   * @returns The input string with the first letter capitalized.
   */
  public upperCaseFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Converts the entire string to uppercase.
   * @param str - The input string.
   * @returns The input string in uppercase.
   */
  public upperCaseAllLetters(str: string): string {
    return str.toUpperCase();
  }

  /**
   * Converts a number to a monetary string representation.
   * @param amount - The number to convert.
   * @returns The monetary string representation of the number.
   */
  public convertToMonetaryString(amount: number | string): string {
    let negativeValue = false;
    if (typeof amount === 'string') {
      amount = parseFloat(amount);
    }
    console.log(amount)
    if (amount < 0) {
      negativeValue = true;
      amount = Math.abs(amount);
    }
    return `${negativeValue ? '-' : ''}£${amount.toFixed(2)}`;
  }

  /**
   * Formats a 6-digit number or string as a sort code.
   * @param value - The 6-digit value to format.
   * @returns The formatted sort code string (xx-xx-xx).
   */
  public formatSortCode(value: string | number): string {
    const sortCode = value.toString();
    return `${sortCode.slice(0, 2)}-${sortCode.slice(2, 4)}-${sortCode.slice(4, 6)}`;
  }

  /**
   * Filters out null or empty strings from an array of address lines.
   *
   * @param address - An array of address lines which may contain strings or null values.
   * @returns A new array containing only non-empty strings from the input array.
   */
  public formatAddress(address: (string | null)[]): string[] {
    return address.filter((line): line is string => !!line?.trim());
  }

  /**
   * Scrolls the viewport to the top of the page.
   * Utilizes the `viewportScroller` service to scroll to the position [0, 0].
   */
  public scrollToTop(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public checkFormValues(form: { [key: string]: any }): boolean {
    return Object.values(form).some((value) => {
      return Array.isArray(value) ? value.length > 0 : Boolean(value);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public checkFormArrayValues(forms: { [key: string]: any }[]): boolean {
    return forms.every((form) => this.checkFormValues(form));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getFormStatus(form: { [key: string]: any }, providedMessage: string, notProvidedMessage: string): string {
    return this.checkFormValues(form) ? providedMessage : notProvidedMessage;
  }

  public getArrayFormStatus(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    forms: { [key: string]: any }[],
    providedMessage: string,
    notProvidedMessage: string,
  ): string {
    return forms.every((form) => this.checkFormValues(form)) ? providedMessage : notProvidedMessage;
  }

  /**
   * Copies the provided string value to the clipboard.
   *
   * @param value - The string value to be copied to the clipboard.
   *
   * @remarks
   * This method uses the `navigator.clipboard.writeText` API to copy text to the clipboard.
   * Ensure that the browser supports the Clipboard API before using this method.
   */
  public copyToClipboard(value: string): Promise<void> {
    return navigator.clipboard.writeText(value);
  }

  /**
   * Recursively filters out properties from an object where the value is `null` or `undefined`.
   *
   * @param obj - The object to filter. Can include nested objects.
   * @returns A new object with only non-null and non-undefined values.
   *
   * @example
   * ```ts
   * const input = {
   *   a: 1,
   *   b: null,
   *   c: undefined,
   *   d: 'hello',
   *   e: { x: null, y: 2 },
   *   f: { z: undefined },
   * };
   * const result = filterNullOrUndefined(input);
   * console.log(result); // Output: { a: 1, d: 'hello', e: { y: 2 } }
   * ```
   */
  public filterNullOrUndefined(obj: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(obj)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key, value]) => {
          if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            return [key, this.filterNullOrUndefined(value as Record<string, unknown>)];
          }
          return [key, value];
        }),
    );
  }
}
