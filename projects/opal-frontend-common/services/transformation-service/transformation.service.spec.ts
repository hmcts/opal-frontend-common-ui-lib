import { TestBed } from '@angular/core/testing';
import { TransformationService } from './transformation.service';
import { ITransformItem } from '@hmcts/opal-frontend-common/services/transformation-service/interfaces';
import { TRANSFORM_ITEM_DEFAULTS } from './constants/transform-item.constants';

describe('TransformationService', () => {
  let service: TransformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransformationService],
    });

    service = TestBed.inject(TransformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('applyTransformation', () => {
    it('should return the original value if no transformation is applied', () => {
      const value = 'test';
      const transformItem: ITransformItem = {
        ...TRANSFORM_ITEM_DEFAULTS,
        key: 'testKey',
        transformType: 'none',
      };
      const result = service['applyTransformation'](value, transformItem);
      expect(result).toBe(value);
    });

    it('should return the original value if no value is sent', () => {
      const value = null;
      const transformItem: ITransformItem = {
        ...TRANSFORM_ITEM_DEFAULTS,
        key: 'testKey',
        transformType: 'date',
        dateConfig: {
          inputFormat: 'dd/MM/yyyy',
          outputFormat: 'yyyy-MM-dd',
        },
      };
      const result = service['applyTransformation'](value, transformItem);
      expect(result).toBe(value);
    });

    it('should transform date values correctly', () => {
      const value = '04/06/1991';
      const transformItem: ITransformItem = {
        ...TRANSFORM_ITEM_DEFAULTS,
        key: 'dateKey',
        transformType: 'date',
        dateConfig: {
          inputFormat: 'dd/MM/yyyy',
          outputFormat: 'yyyy-MM-dd',
        },
      };

      const result = service['applyTransformation'](value, transformItem);
      expect(result).toBe('1991-06-04');
    });

    it('should not transform date if date is not valid', () => {
      const value = '13/13/1991';
      const transformItem: ITransformItem = {
        ...TRANSFORM_ITEM_DEFAULTS,
        key: 'dateKey',
        transformType: 'date',
        dateConfig: {
          inputFormat: 'dd/MM/yyyy',
          outputFormat: 'yyyy-MM-dd',
        },
      };

      const result = service['applyTransformation'](value, transformItem);
      expect(result).toBe('13/13/1991');
    });

    it('should transform time values correctly by adding offset', () => {
      const value = '14:30';
      const transformItem: ITransformItem = {
        ...TRANSFORM_ITEM_DEFAULTS,
        key: 'timeKey',
        transformType: 'time',
        timeConfig: {
          addOffset: true,
          removeOffset: false,
        },
      };

      const result = service['applyTransformation'](value, transformItem);
      expect(result).toBe('14:30:00Z');
    });

    it('should transform time values correctly by removing offset', () => {
      const value = '14:30:00Z';
      const transformItem: ITransformItem = {
        ...TRANSFORM_ITEM_DEFAULTS,
        key: 'timeKey',
        transformType: 'time',
        timeConfig: {
          removeOffset: true,
          addOffset: false,
        },
      };

      const result = service['applyTransformation'](value, transformItem);
      expect(result).toBe('14:30');
    });
  });

  describe('transformObjectValues', () => {
    it('should return the input if it is not an object', () => {
      const input = 'not an object';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = service.transformObjectValues(input as any, []);
      expect(result).toBe(input);
    });

    it('should transform object values based on the given configuration', () => {
      const input = { dateKey: '01/01/1991', otherKey: 'value' };
      const transformItems: ITransformItem[] = [
        {
          ...TRANSFORM_ITEM_DEFAULTS,
          key: 'dateKey',
          transformType: 'date',
          dateConfig: {
            inputFormat: 'dd/MM/yyyy',
            outputFormat: 'yyyy-MM-dd',
          },
        },
      ];

      const result = service.transformObjectValues(input, transformItems);
      expect(result.dateKey).toBe('1991-01-01');
    });

    it('should recursively transform nested objects', () => {
      const input = { nested: { dateKey: '01/01/1991' } };
      const transformItems: ITransformItem[] = [
        {
          ...TRANSFORM_ITEM_DEFAULTS,
          key: 'dateKey',
          transformType: 'date',
          dateConfig: {
            inputFormat: 'dd/MM/yyyy',
            outputFormat: 'yyyy-MM-dd',
          },
        },
      ];
      expect(service.transformObjectValues(input, transformItems)).toEqual({ nested: { dateKey: '1991-01-01' } });
    });

    it('should transform objects in arrays', () => {
      const input = { nested: [{ dateKey: '01/01/1991' }] };
      const transformItems: ITransformItem[] = [
        {
          ...TRANSFORM_ITEM_DEFAULTS,
          key: 'dateKey',
          transformType: 'date',
          dateConfig: {
            inputFormat: 'dd/MM/yyyy',
            outputFormat: 'yyyy-MM-dd',
          },
        },
      ];
      expect(service.transformObjectValues(input, transformItems)).toEqual({ nested: [{ dateKey: '1991-01-01' }] });
    });
  });

  describe('replaceKeys', () => {
    it('should replace keys in an object based on the provided params', () => {
      const input = { old_name: 'name', old_age: 20, id: 1 };
      const output = { new_name: 'name', new_age: 20, id: 1 };
      const currentPrefix = 'old_';
      const replacementPrefix = 'new_';

      const result = service.replaceKeys(input, currentPrefix, replacementPrefix);

      expect(result).toEqual(output);
    });

    it('should return the input object if no keys match the current prefix', () => {
      const input = { name: 'name', age: 20, id: 1 };
      const currentPrefix = 'old_';
      const replacementPrefix = 'new_';

      const result = service.replaceKeys(input, currentPrefix, replacementPrefix);

      expect(result).toEqual(input);
    });

    it('should return an empty object if the input is null, undefined or not an object type', () => {
      const input = null;
      const currentPrefix = 'old_';
      const replacementPrefix = 'new_';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = service.replaceKeys(input as any, currentPrefix, replacementPrefix);

      expect(result).toEqual({});

      const undefinedInput = undefined;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resultUndefined = service.replaceKeys(undefinedInput as any, currentPrefix, replacementPrefix);

      expect(resultUndefined).toEqual({});

      const notAnObjectInput = 'string';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resultNotAnObject = service.replaceKeys(notAnObjectInput as any, currentPrefix, replacementPrefix);

      expect(resultNotAnObject).toEqual({});
    });
  });
});
