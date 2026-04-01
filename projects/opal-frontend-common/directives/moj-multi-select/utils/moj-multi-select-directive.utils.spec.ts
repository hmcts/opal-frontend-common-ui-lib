import { describe, expect, it } from 'vitest';
import { getCheckboxInputFromHost } from './moj-multi-select-directive.utils';

describe('moj-multi-select-directive.utils', () => {
  it('should return the checkbox input from the host element', () => {
    const hostElement = document.createElement('div');
    hostElement.innerHTML = `
      <input type="text" />
      <label>
        <input type="checkbox" id="row-a" />
      </label>
    `;

    const checkbox = getCheckboxInputFromHost(hostElement);

    expect(checkbox).not.toBeNull();
    expect(checkbox?.id).toBe('row-a');
  });

  it('should return null when the host element does not contain a checkbox input', () => {
    const hostElement = document.createElement('div');
    hostElement.innerHTML = '<input type="text" />';

    expect(getCheckboxInputFromHost(hostElement)).toBeNull();
  });
});
