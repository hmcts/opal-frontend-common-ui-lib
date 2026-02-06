import { Component } from '@angular/core';
import { AbstractFormArrayParentBaseComponent } from './abstract-form-array-parent-base.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { describe, beforeEach, afterAll, it, expect } from 'vitest';

@Component({
  selector: 'opal-lib-test-form-array-parent-base',
  template: '',
})
class TestAbstractFormArrayParentBaseComponent extends AbstractFormArrayParentBaseComponent {
  constructor() {
    super();
  }
}

describe('AbstractFormParentBaseComponent', () => {
  let component: TestAbstractFormArrayParentBaseComponent | null;
  let fixture: ComponentFixture<TestAbstractFormArrayParentBaseComponent> | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestAbstractFormArrayParentBaseComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestAbstractFormArrayParentBaseComponent);
    component = fixture.componentInstance;
  });

  afterAll(() => {
    component = null;
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should handle non-indexed keys correctly', () => {
    if (!component) {
      throw new Error('component returned null');
    }
    const input = [
      { name_0: 'John', age_0: 30, country: 'USA' },
      { name_1: 'Jane', age_1: 25 },
    ];

    const expectedOutput = [
      { name: 'John', age: 30, country: 'USA' },
      { name: 'Jane', age: 25 },
    ];

    const result = component.removeIndexFromFormArrayData(input);
    expect(result).toEqual(expectedOutput);
  });

  it('should initialize result array when currentIndex is first used for non-indexed key', () => {
    if (!component) {
      throw new Error('component returned null');
    }
    const input = [{ name_0: 'John', extra: 'data' }];

    const expectedOutput = [{ name: 'John', extra: 'data' }];

    const result = component.removeIndexFromFormArrayData(input);
    expect(result).toEqual(expectedOutput);
  });

  it('should handle multiple non-indexed keys for the same index', () => {
    if (!component) {
      throw new Error('component returned null');
    }
    const input = [{ name_0: 'John', metadata: 'value1', note: 'value2' }];

    const expectedOutput = [{ name: 'John', metadata: 'value1', note: 'value2' }];

    const result = component.removeIndexFromFormArrayData(input);
    expect(result).toEqual(expectedOutput);
  });

  it('should handle object with only non-indexed keys', () => {
    if (!component) {
      throw new Error('component returned null');
    }
    const input = [{ country: 'USA', city: 'New York' }];

    const result = component.removeIndexFromFormArrayData(input);
    // When there are no indexed keys, currentIndex is undefined, so result should be sparse/empty
    expect(result.length).toBe(0);
  });
});
