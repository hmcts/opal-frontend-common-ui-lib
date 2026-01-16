import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { AlphagovAccessibleAutocompleteComponent } from './alphagov-accessible-autocomplete.component';
import { AccessibleAutocompleteProps } from 'accessible-autocomplete';
import { FormControl, Validators } from '@angular/forms';
import { ALPHAGOV_ACCESSIBLE_AUTOCOMPLETE_ITEMS_MOCK } from './mocks/alphagov-accessible-autocomplete-items.mock';

describe('AlphagovAccessibleAutocompleteComponent', () => {
  let component: AlphagovAccessibleAutocompleteComponent | null;
  let fixture: ComponentFixture<AlphagovAccessibleAutocompleteComponent> | null;
  let formControl: FormControl | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphagovAccessibleAutocompleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlphagovAccessibleAutocompleteComponent);
    component = fixture.componentInstance;
    formControl = new FormControl(null, [Validators.required]);

    component.labelText = 'Test';
    component.labelClasses = 'test';
    component.inputName = 'test';
    component.inputId = 'test';
    component.inputClasses = 'test';
    component.autoCompleteItems = ALPHAGOV_ACCESSIBLE_AUTOCOMPLETE_ITEMS_MOCK;
    component.control = formControl;

    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    formControl = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build autocomplete props correctly', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const expectedProps: AccessibleAutocompleteProps = {
      id: component.autoCompleteId,
      element: component.autocompleteContainer.nativeElement,
      source: component.autoCompleteItems.map((item) => item.name),
      name: component.autoCompleteId,
      showAllValues: component.showAllValues,
      defaultValue: component['_control'].value || '',
      onConfirm: (selectedName: string) => {
        if (component) {
          component['handleOnConfirm'](selectedName);
        }
      },
    };

    const actualProps = component['buildAutoCompleteProps']();

    expect(actualProps.id).toEqual(expectedProps.id);
    expect(actualProps.element).toEqual(expectedProps.element);
    expect(actualProps.source).toEqual(expectedProps.source);
    expect(actualProps.name).toEqual(expectedProps.name);
    expect(actualProps.showAllValues).toEqual(expectedProps.showAllValues);
    expect(actualProps.defaultValue).toEqual(expectedProps.defaultValue);
  });

  it('should apply describedby to the visible input with hint and error ids', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.hintText = 'Test hint';
    component.errors = 'Test error';

    const input = document.createElement('input');
    input.id = component.autoCompleteId;
    input.setAttribute('aria-describedby', `${component.autoCompleteId}__assistiveHint`);
    component.autocompleteContainer.nativeElement.innerHTML = '';
    component.autocompleteContainer.nativeElement.appendChild(input);

    component['applyDescribedBy']();

    const describedBy = input.getAttribute('aria-describedby') ?? '';
    expect(describedBy).toContain(`${component.inputId}-hint`);
    expect(describedBy).toContain(`${component.autoCompleteId}-error-message`);
    expect(describedBy).toContain(`${component.autoCompleteId}__assistiveHint`);
  });

  it('should add describedby when missing on the input', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.hintText = 'Test hint';
    component.errors = null;

    const input = document.createElement('input');
    input.id = component.autoCompleteId;
    component.autocompleteContainer.nativeElement.innerHTML = '';
    component.autocompleteContainer.nativeElement.appendChild(input);

    component['applyDescribedBy']();

    expect(input.getAttribute('aria-describedby')).toEqual(`${component.inputId}-hint`);
  });

  it('should remove managed describedby ids when hint and error are cleared', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.hintText = '';
    component.errors = null;

    const input = document.createElement('input');
    input.id = component.autoCompleteId;
    input.setAttribute(
      'aria-describedby',
      `${component.inputId}-hint ${component.autoCompleteId}-error-message ${component.autoCompleteId}__assistiveHint`,
    );
    component.autocompleteContainer.nativeElement.innerHTML = '';
    component.autocompleteContainer.nativeElement.appendChild(input);

    component['applyDescribedBy']();

    expect(input.getAttribute('aria-describedby')).toEqual(`${component.autoCompleteId}__assistiveHint`);
  });

  it('should remove describedby when no ids remain', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.hintText = '';
    component.errors = null;

    const input = document.createElement('input');
    input.id = component.autoCompleteId;
    input.setAttribute('aria-describedby', `${component.inputId}-hint ${component.autoCompleteId}-error-message`);
    component.autocompleteContainer.nativeElement.innerHTML = '';
    component.autocompleteContainer.nativeElement.appendChild(input);

    component['applyDescribedBy']();

    expect(input.hasAttribute('aria-describedby')).toBeFalse();
  });

  it('should skip describedby updates when the input is missing', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.autocompleteContainer.nativeElement.innerHTML = '';

    expect(() => {
      if (!component) {
        fail('component returned null');
        return;
      }
      component['applyDescribedBy']();
    }).not.toThrow();
  });

  it('should return early when MutationObserver is unavailable', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalMutationObserver = (globalThis as any).MutationObserver;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).MutationObserver = undefined;

    const input = document.createElement('input');
    input.id = component.autoCompleteId;
    component.autocompleteContainer.nativeElement.innerHTML = '';
    component.autocompleteContainer.nativeElement.appendChild(input);

    component['observeDescribedBy']();
    component.autocompleteContainer.nativeElement.innerHTML = '';
    component['waitForInputAndApply']();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((component as any).describedByObserver).toBeNull();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((component as any).containerObserver).toBeNull();
    expect(input.hasAttribute('aria-describedby')).toBeFalse();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).MutationObserver = originalMutationObserver;
  });

  it('should observe and apply describedby when the input is rendered later', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.hintText = 'Test hint';
    component.errors = null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalMutationObserver = (globalThis as any).MutationObserver;
    const autoCompleteId = component.autoCompleteId;

    class FakeMutationObserver {
      private readonly callback: MutationCallback;

      constructor(callback: MutationCallback) {
        this.callback = callback;
      }

      observe(target: Node): void {
        if (target instanceof HTMLElement && target.id === `${autoCompleteId}-container`) {
          const input = document.createElement('input');
          input.id = autoCompleteId;
          target.appendChild(input);
        }
        this.callback([], this as unknown as MutationObserver);
      }

      disconnect(): void {
        // no-op for tests
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).MutationObserver = FakeMutationObserver;

    component.autocompleteContainer.nativeElement.innerHTML = '';
    component['waitForInputAndApply']();

    const input = component.autocompleteContainer.nativeElement.querySelector(`#${autoCompleteId}`) as HTMLInputElement;
    expect(input.getAttribute('aria-describedby')).toEqual(`${component.inputId}-hint`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).MutationObserver = originalMutationObserver;
  });

  it('should apply describedby on changes to hint or error inputs', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(component as any, 'applyDescribedBy');

    component.ngOnChanges({
      hintText: new SimpleChange('', 'Updated hint', false),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((component as any).applyDescribedBy).toHaveBeenCalled();
  });

  it('should not apply describedby on unrelated input changes', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn(component as any, 'applyDescribedBy');

    component.ngOnChanges({
      labelText: new SimpleChange('Old', 'New', false),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((component as any).applyDescribedBy).not.toHaveBeenCalled();
  });

  it('should handle on confirm and input should be marked as dirty', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }
    const selectedName = ALPHAGOV_ACCESSIBLE_AUTOCOMPLETE_ITEMS_MOCK[0].name;
    const inputValue = ALPHAGOV_ACCESSIBLE_AUTOCOMPLETE_ITEMS_MOCK[0].name;
    const selectedItem = ALPHAGOV_ACCESSIBLE_AUTOCOMPLETE_ITEMS_MOCK[0];

    // Mock document.querySelector
    const mockInputElement = document.createElement('input');
    mockInputElement.value = inputValue;
    spyOn(document, 'querySelector').and.returnValue(mockInputElement);
    spyOn(component['changeDetector'], 'detectChanges');

    component['_control'].reset();

    component['handleOnConfirm'](selectedName);

    expect(component['_control'].value).toEqual(selectedItem.value);
    expect(component['_control'].touched).toBeTrue();

    expect(component['_control'].pristine).not.toBeTrue();
    expect(component['_control'].dirty).toBeTrue();

    expect(component['_control'].valid).toBeTrue();
    expect(component['changeDetector'].detectChanges).toHaveBeenCalled();
  });

  it('should handle on confirm and input should be marked as pristine', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    const selectedName = undefined;
    const inputValue = '';
    const selectedItem = null;

    // Mock document.querySelector
    const mockInputElement = document.createElement('input');
    mockInputElement.value = inputValue;
    spyOn(document, 'querySelector').and.returnValue(mockInputElement);
    spyOn(component['changeDetector'], 'detectChanges');

    component['_control'].reset();

    component['handleOnConfirm'](selectedName);

    expect(component['_control'].value).toEqual(selectedItem);
    expect(component['_control'].touched).toBeTrue();
    expect(component['_control'].pristine).toBeTrue();
    expect(component['_control'].dirty).not.toBeTrue();

    expect(component['_control'].valid).not.toBeTrue();
    expect(component['changeDetector'].detectChanges).toHaveBeenCalled();
  });

  it('should get the control', () => {
    if (!component || !fixture) {
      fail('component or fixture returned null');
      return;
    }

    const result = component.getControl;

    expect(result).toEqual(component['_control']);
  });

  it('should get the default value', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const controlValue = ALPHAGOV_ACCESSIBLE_AUTOCOMPLETE_ITEMS_MOCK[0].value;
    const selectedItem = ALPHAGOV_ACCESSIBLE_AUTOCOMPLETE_ITEMS_MOCK[0];

    component['_control'].setValue(controlValue);

    const result = component['getDefaultValue']();

    expect(result).toEqual(selectedItem.name);
  });

  it('should return an empty string if control value is falsy', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component['_control'].setValue(null);

    const result = component['getDefaultValue']();

    expect(result).toEqual('');
  });

  it('should return an empty string if control value does not match any item', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const controlValue = 'test';

    component['_control'].setValue(controlValue);

    const result = component['getDefaultValue']();

    expect(result).toEqual('');
  });

  it('should not clear the autocomplete as we have a value', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'configureAutoComplete');

    component['ngUnsubscribe'].next();
    component['ngUnsubscribe'].complete();
    component['setupControlSub']();
    component['_control'].setValue('Hello');

    expect(component['configureAutoComplete']).not.toHaveBeenCalled();
  });

  it('should clear autocomplete when control value changes to null', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'configureAutoComplete');

    component['ngUnsubscribe'].next();
    component['ngUnsubscribe'].complete();

    component['setupControlSub']();

    component['_control'].setValue('Hello');
    component['_control'].setValue(null);

    expect(component['configureAutoComplete']).toHaveBeenCalled();
    expect(component['autocompleteContainer'].nativeElement.innerHTML).toEqual('');
  });

  it('should not do anything as we have no values', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'configureAutoComplete');

    component['ngUnsubscribe'].next();
    component['ngUnsubscribe'].complete();

    component['setupControlSub']();

    component['_control'].setValue(null);
    component['_control'].setValue(null);

    expect(component['configureAutoComplete']).not.toHaveBeenCalled();
  });

  it('should render custom dropdown arrow with correct class name', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const className = 'custom-arrow-class';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const svgOutput = (component as any).renderDropdownArrow(className);

    expect(svgOutput).toContain(`<svg class="${className}"`);
    expect(svgOutput).toContain('<path d="M256,298.3');
    expect(svgOutput).toContain('</svg>');
  });

  interface PrivateFunctionsComponent {
    handleOnConfirm: (arg: string) => void;
  }

  it('it should test the onConfirm section of buildAutoCompleteProps', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const autoCompleteProps = component['buildAutoCompleteProps']();
    if (typeof autoCompleteProps.onConfirm === 'function') {
      const onConfirm = autoCompleteProps.onConfirm;

      spyOn(component as unknown as PrivateFunctionsComponent, 'handleOnConfirm').and.callThrough();

      onConfirm('france');

      expect(component['handleOnConfirm']).toHaveBeenCalledWith('france');
    } else {
      fail('onConfirm is not a function or is undefined');
    }
  });
});
