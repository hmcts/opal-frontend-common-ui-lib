import { describe, expect, it } from 'vitest';
import { getFileDownloadFilename } from './file-download-filename.utils';

describe('getFileDownloadFilename', () => {
  it.each<[string | null, string]>([
    [null, 'fallback.xml'],
    ['attachment', 'fallback.xml'],
    ['attachment; filename="original.xml"', 'original.xml'],
    ['attachment; filename=original.xlsx', 'original.xlsx'],
    ['attachment; filename=   ', 'fallback.xml'],
    ['attachment; filename="   "', 'fallback.xml'],
    ["attachment; filename*=UTF-8''mock-%C3%A9.xml; filename=plain.xml", 'mock-é.xml'],
    ["attachment; filename*=UTF-8''%invalid; filename=plain.xml", 'plain.xml'],
    ["attachment; filename*=UTF-8''%invalid", 'fallback.xml'],
  ])('uses the filename %s supplies or the fallback', (contentDisposition, expected) => {
    expect(getFileDownloadFilename(contentDisposition, 'fallback.xml')).toBe(expected);
  });
});
