import { describe, expect, it } from 'vitest';
import { getFileBlob } from './file-blob.utils';

function readBytes(blob: Blob): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(Array.from(new Uint8Array(reader.result as ArrayBuffer)));
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
}

describe('getFileBlob', () => {
  it.each([undefined, 'application/xml', 'APPLICATION/XML'])('retains Blob identity for MIME option %s', (mimeType) => {
    const content = new Blob(['<root />'], { type: 'application/xml' });
    expect(getFileBlob(content, mimeType)).toBe(content);
  });

  it.each(['application/pdf', ''])(
    'changes the MIME label to %s while retaining every original byte',
    async (mimeType) => {
      const bytes = [0, 255, 10, 13];
      const content = new Blob([new Uint8Array(bytes)], { type: 'application/octet-stream' });
      const result = getFileBlob(content, mimeType);

      expect(result).not.toBe(content);
      expect(result.type).toBe(mimeType);
      expect(await readBytes(result)).toEqual(bytes);
      expect(content.type).toBe('application/octet-stream');
    },
  );

  it('encodes text without assigning a MIME type when no label is supplied', async () => {
    const result = getFileBlob('amount,£12.34');
    expect(result.type).toBe('');
    expect(await readBytes(result)).toEqual(Array.from(new TextEncoder().encode('amount,£12.34')));
  });

  it('wraps only the bytes in a supplied typed-array view', async () => {
    const result = getFileBlob(new Uint8Array([90, 0, 255, 90]).subarray(1, 3), 'application/octet-stream');
    expect(result.type).toBe('application/octet-stream');
    expect(await readBytes(result)).toEqual([0, 255]);
  });
});
