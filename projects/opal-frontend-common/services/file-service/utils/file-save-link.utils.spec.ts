import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { saveFileToLink } from './file-save-link.utils';

describe('saveFileToLink', () => {
  let link: HTMLAnchorElement;
  const createObjectURL = vi.fn();
  const revokeObjectURL = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    createObjectURL.mockReset().mockReturnValue('blob:mock-download');
    revokeObjectURL.mockReset();
    vi.stubGlobal(
      'URL',
      class extends URL {
        static override createObjectURL = createObjectURL;
        static override revokeObjectURL = revokeObjectURL;
      },
    );
    link = document.createElement('a');
    document.body.appendChild(link);
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    link.remove();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it.each([false, true])(
    'restores the exact caller-owned attributes when existing attributes are %s',
    (hasAttributes) => {
      if (hasAttributes) {
        link.setAttribute('href', '/original?query=1');
        link.setAttribute('download', 'original.csv');
      }
      const blob = new Blob(['mock']);
      const click = vi.spyOn(link, 'click').mockImplementation(() => {
        expect(link.getAttribute('href')).toBe('blob:mock-download');
        expect(link.download).toBe('saved.csv');
      });

      saveFileToLink(blob, link, 'saved.csv');

      expect(createObjectURL).toHaveBeenCalledExactlyOnceWith(blob);
      expect(click).toHaveBeenCalledOnce();
      expect(link.getAttribute('href')).toBe(hasAttributes ? '/original?query=1' : null);
      expect(link.getAttribute('download')).toBe(hasAttributes ? 'original.csv' : null);
      expect(link.isConnected).toBe(true);
      expect(revokeObjectURL).not.toHaveBeenCalled();
      vi.runOnlyPendingTimers();
      expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith('blob:mock-download');
    },
  );

  it('restores the caller link and revokes its temporary URL when the native click throws', () => {
    link.setAttribute('href', '/original');
    link.setAttribute('download', 'original.xml');
    const error = new Error('Native download failed');
    vi.spyOn(link, 'click').mockImplementation(() => {
      throw error;
    });

    expect(() => saveFileToLink(new Blob(['mock']), link, 'saved.xml')).toThrow(error);
    expect(link.getAttribute('href')).toBe('/original');
    expect(link.getAttribute('download')).toBe('original.xml');
    expect(link.isConnected).toBe(true);
    vi.runOnlyPendingTimers();
    expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith('blob:mock-download');
  });
});
