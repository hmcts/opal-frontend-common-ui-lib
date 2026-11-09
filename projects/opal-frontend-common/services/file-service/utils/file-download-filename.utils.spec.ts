import { describe, expect, it } from 'vitest';
import { getFileDownloadFilename } from './file-download-filename.utils';

describe('getFileDownloadFilename', () => {
  it.each<[string | null, string]>([
    [null, 'fallback.xml'],
    ['attachment', 'fallback.xml'],
    ['attachment; filename="original.xml"', 'original.xml'],
    ['attachment; filename=original.xlsx', 'original.xlsx'],
    ['attachment; FILENAME = " original.csv "', 'original.csv'],
    ['attachment; filename= original.csv ; size=10', 'original.csv'],
    ['attachment; filename=   ', 'fallback.xml'],
    ['attachment; filename="   "', 'fallback.xml'],
    ["attachment; filename*=UTF-8''mock-%C3%A9.xml; filename=plain.xml", 'mock-é.xml'],
    ["attachment; FILENAME* = utf-8''encoded%20file.csv", 'encoded file.csv'],
    ["attachment; filename*=UTF-8'en'caf%C3%A9.xml", 'café.xml'],
    ["attachment; filename*=UTF-8'en-GB'caf%C3%A9.xml; filename=plain.xml", 'café.xml'],
    ["attachment; filename*=UTF-8'en'%invalid; filename=plain.xml", 'plain.xml'],
    ["attachment; filename*=UTF-8'en'%invalid", 'fallback.xml'],
    ["attachment; filename*=UTF-8''%invalid; filename=plain.xml", 'plain.xml'],
    ["attachment; filename*=UTF-8''%invalid", 'fallback.xml'],
  ])('uses the filename %s supplies or the fallback', (contentDisposition, expected) => {
    expect(getFileDownloadFilename(contentDisposition, 'fallback.xml')).toBe(expected);
  });
});
