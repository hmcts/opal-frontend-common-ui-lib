import { describe, expect, it } from 'vitest';
import { buildInterfaceFilesParams, getPathWithFileId } from './opal-file-handling-service.utils';

describe('getPathWithFileId', () => {
  it('inserts the requested file ID into the content endpoint', () => {
    expect(getPathWithFileId('/interface-files/{id}/content', 123)).toBe('/interface-files/123/content');
  });
});

describe('buildInterfaceFilesParams', () => {
  it('returns no query parameters when optional search criteria are absent', () => {
    expect(buildInterfaceFilesParams().keys()).toEqual([]);
  });

  it('retains exact business-unit codes and scalar values while omitting empty optional filters', () => {
    const params = buildInterfaceFilesParams({
      domain: 'FINES',
      target: 'OPAL',
      business_unit_code: '0046',
      source: null,
      status: '',
      not_target: undefined,
    });
    expect(params.keys()).toEqual(['domain', 'target', 'business_unit_code']);
    expect(params.get('business_unit_code')).toBe('0046');
    expect(params.get('domain')).toBe('FINES');
    expect(params.get('target')).toBe('OPAL');
  });

  it('serializes array filters once as comma-separated values without mutating the supplied arrays', () => {
    const types = Object.freeze(['SOURCE', '', null, undefined, 'TRANSFORMED_JSON']);
    const params = buildInterfaceFilesParams({
      type: types as unknown as string[],
      not_status: ['FAILED', 'INGESTED'],
    });
    expect(params.getAll('type')).toEqual(['SOURCE,TRANSFORMED_JSON']);
    expect(params.getAll('not_status')).toEqual(['FAILED,INGESTED']);
    expect(types).toEqual(['SOURCE', '', null, undefined, 'TRANSFORMED_JSON']);
  });

  it('omits empty arrays and arrays whose elements are all empty', () => {
    const params = buildInterfaceFilesParams({ type: [], not_status: [''] });
    expect(params.keys()).toEqual([]);
  });
});
