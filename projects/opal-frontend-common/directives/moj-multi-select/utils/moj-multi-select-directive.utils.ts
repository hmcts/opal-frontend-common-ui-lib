export const getCheckboxInputFromHost = (hostElement: HTMLElement): HTMLInputElement | null =>
  hostElement.querySelector('input[type="checkbox"]');

export const getDefaultBodyAriaLabel = (rowIndex: number): string => `Select row ${rowIndex + 1}`;
