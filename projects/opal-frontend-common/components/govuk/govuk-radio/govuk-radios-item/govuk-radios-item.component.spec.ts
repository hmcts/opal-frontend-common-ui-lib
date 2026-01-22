import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukRadiosItemComponent } from './govuk-radios-item.component';
import { FormControl } from '@angular/forms';

describe('GovukRadiosItemComponent', () => {
  let component: GovukRadiosItemComponent | null;
  let fixture: ComponentFixture<GovukRadiosItemComponent> | null;
  let formControl: FormControl;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukRadiosItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukRadiosItemComponent);
    component = fixture.componentInstance;
    formControl = new FormControl(null);

    component.labelText = 'test';
    component.labelClasses = 'govuk-label--l';
    component.inputId = 'test';
    component.inputName = 'test';
    component.inputClasses = 'govuk-input--width-20';
    component.inputValue = 'value';
    component.control = formControl;

    fixture.detectChanges();
  });

  afterAll(() => {
    fixture = null;
    component = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have extra label classes', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const elem = fixture.nativeElement.querySelector('.govuk-radios__label.govuk-label--l');
    expect(elem).toBeTruthy();
  });

  it('should have labelText', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const elem = fixture.nativeElement.querySelector('.govuk-label.govuk-label--l');
    expect(elem.textContent).toContain('test');
  });

  it('should have extra input classes', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const elem = fixture.nativeElement.querySelector('.govuk-radios__input.govuk-input--width-20');
    expect(elem).toBeTruthy();
  });

  it('should have an input id', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const elem = fixture.nativeElement.querySelector('#test');
    expect(elem).toBeTruthy();
  });

  it('should prefix the input id with the input name when needed', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    fixture.componentRef.setInput('inputName', 'group');
    fixture.componentRef.setInput('inputId', 'option');
    fixture.detectChanges();

    const elem = fixture.nativeElement.querySelector('#group-option');
    expect(elem).toBeTruthy();
  });

  it('resolvedInputName should trim whitespace and default to empty string', () => {
    if (!fixture || !component) {
      fail('fixture/component returned null');
      return;
    }

    fixture.componentRef.setInput('inputName', '  group  ');
    fixture.detectChanges();

    expect(component.resolvedInputName).toBe('group');

    fixture.componentRef.setInput('inputName', '   ');
    fixture.detectChanges();

    expect(component.resolvedInputName).toBe('');
  });

  it('resolvedInputId should not double-prefix when already prefixed', () => {
    if (!fixture || !component) {
      fail('fixture/component returned null');
      return;
    }

    fixture.componentRef.setInput('inputName', 'group');
    fixture.componentRef.setInput('inputId', 'group-option');
    fixture.detectChanges();

    expect(component.resolvedInputId).toBe('group-option');

    const elem = fixture.nativeElement.querySelector('#group-option');
    expect(elem).toBeTruthy();
  });

  it('resolvedInputId should return the base id when base id equals input name', () => {
    if (!fixture || !component) {
      fail('fixture/component returned null');
      return;
    }

    fixture.componentRef.setInput('inputName', 'group');
    fixture.componentRef.setInput('inputId', 'group');
    fixture.detectChanges();

    expect(component.resolvedInputId).toBe('group');

    const elem = fixture.nativeElement.querySelector('#group');
    expect(elem).toBeTruthy();
  });

  it('dataAriaControls should return null for empty/whitespace values and trimmed value otherwise', () => {
    if (!fixture || !component) {
      fail('fixture/component returned null');
      return;
    }

    fixture.componentRef.setInput('ariaControls', '   ');
    fixture.detectChanges();
    expect(component.dataAriaControls).toBeNull();

    fixture.componentRef.setInput('ariaControls', '  conditional-panel  ');
    fixture.detectChanges();
    expect(component.dataAriaControls).toBe('conditional-panel');
  });

  it('resolvedInputValue should stringify boolean values', () => {
    if (!fixture || !component) {
      fail('fixture/component returned null');
      return;
    }

    fixture.componentRef.setInput('inputValue', true);
    fixture.detectChanges();
    expect(component.resolvedInputValue).toBe('true');

    fixture.componentRef.setInput('inputValue', false);
    fixture.detectChanges();
    expect(component.resolvedInputValue).toBe('false');
  });

  it('should expose the bound FormControl via getControl', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    expect(component.getControl).toBe(formControl);
  });

  it('should set the name and value attributes', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const input = fixture.nativeElement.querySelector('input[type="radio"]');
    expect(input.getAttribute('name')).toBe('test');
    expect(input.getAttribute('value')).toBe('value');
  });

  it('should set aria-controls only when provided', () => {
    if (!fixture || !component) {
      fail('fixture/component returned null');
      return;
    }

    let input = fixture.nativeElement.querySelector('input[type="radio"]');
    expect(input.getAttribute('aria-controls')).toBeNull();
    expect(input.getAttribute('aria-expanded')).toBeNull();

    fixture.componentRef.setInput('ariaControls', 'conditional-panel');
    fixture.detectChanges();

    input = fixture.nativeElement.querySelector('input[type="radio"]');
    expect(input.getAttribute('aria-controls')).toBe('conditional-panel');
    expect(input.getAttribute('aria-expanded')).toBeNull();
    expect(component.dataAriaControls).toBe('conditional-panel');
  });

  it('should link the label for to the input id', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    const input = fixture.nativeElement.querySelector('input[type="radio"]');
    const label = fixture.nativeElement.querySelector('label.govuk-radios__label');
    expect(label.getAttribute('for')).toBe(input.getAttribute('id'));
  });

  it('should link item hint to the input', () => {
    if (!fixture) {
      fail('fixture returned null');
      return;
    }

    fixture.componentRef.setInput('inputValueHint', 'Help text');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('#test');
    expect(input.getAttribute('aria-describedby')).toBe('test-item-hint');
  });

  it('resolvedInputName should return empty string when inputName is undefined', () => {
    if (!fixture || !component) {
      fail('fixture/component returned null');
      return;
    }

    fixture.componentRef.setInput('inputName', undefined as unknown as string);
    fixture.detectChanges();

    expect(component.resolvedInputName).toBe('');
  });

  it('resolvedInputId should return empty string when inputId is undefined', () => {
    if (!fixture || !component) {
      fail('fixture/component returned null');
      return;
    }

    fixture.componentRef.setInput('inputName', 'group');
    fixture.componentRef.setInput('inputId', undefined as unknown as string);
    fixture.detectChanges();

    expect(component.resolvedInputId).toBe('');
  });

  it('resolvedInputId should return base id when inputName is empty', () => {
    if (!fixture || !component) {
      fail('fixture/component returned null');
      return;
    }

    fixture.componentRef.setInput('inputName', '');
    fixture.componentRef.setInput('inputId', 'option');
    fixture.detectChanges();

    expect(component.resolvedInputId).toBe('option');
  });

  it('resolvedInputId should return empty string when both inputName and inputId are empty', () => {
    if (!fixture || !component) {
      fail('fixture/component returned null');
      return;
    }

    fixture.componentRef.setInput('inputName', '');
    fixture.componentRef.setInput('inputId', '');
    fixture.detectChanges();

    expect(component.resolvedInputId).toBe('');
  });
});
