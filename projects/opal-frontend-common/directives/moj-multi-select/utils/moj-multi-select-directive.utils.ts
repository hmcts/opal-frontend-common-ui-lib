/**
 * Returns the first checkbox input found within a directive host element.
 *
 * @param hostElement - Host element containing checkbox markup.
 */
export const getCheckboxInputFromHost = (hostElement: HTMLElement): HTMLInputElement | null =>
  hostElement.querySelector('input[type="checkbox"]');
