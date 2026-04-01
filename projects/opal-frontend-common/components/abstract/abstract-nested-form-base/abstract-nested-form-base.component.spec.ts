import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { AbstractNestedFormBaseComponent } from './abstract-nested-form-base.component';
import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

class TestAbstractNestedFormBaseComponent extends AbstractNestedFormBaseComponent {
  public override form: FormGroup = new FormGroup({});
  public override fieldErrors: IAbstractFormBaseFieldErrors = {};
  // Expose protected helper for tests
  public testHasValue(v: unknown): boolean {
    return this.hasValue(v);
  }
}

describe('AbstractNestedFormBaseComponent', () => {
  let component: TestAbstractNestedFormBaseComponent | null;
  let fixture: ComponentFixture<TestAbstractNestedFormBaseComponent> | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAbstractNestedFormBaseComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAbstractNestedFormBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    component = null;
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('addControlsToNestedFormGroup should add controls into the default target (this.form)', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const source = new FormGroup({ x: new FormControl('x'), y: new FormControl('y') });

    // default target is component.form
    component['addControlsToNestedFormGroup'](source);

    expect(Object.keys(component.form.controls).sort()).toEqual(['x', 'y']);
    expect(component.form.get('x')?.value).toBe('x');
    expect(component.form.get('y')?.value).toBe('y');
  });

  it('removeControlsFromNestedFormGroup should remove only the specified controls', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const source = new FormGroup({
      a: new FormControl(null),
      b: new FormControl(null),
    });
    const target = new FormGroup({
      a: new FormControl(1),
      b: new FormControl(2),
      c: new FormControl(3),
    });

    component['removeControlsFromNestedFormGroup'](source, target);
    expect(Object.keys(target.controls).sort()).toEqual(['c']);
  });

  it('removeControlsFromNestedFormGroup should default target to this.form', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    // Add some controls to the component.form
    component.form.addControl('foo', new FormControl('foo'));
    component.form.addControl('bar', new FormControl('bar'));
    component.form.addControl('baz', new FormControl('baz'));

    // Build a source group with only foo + bar
    const source = new FormGroup({
      foo: new FormControl(null),
      bar: new FormControl(null),
    });

    // Call without specifying target so it defaults to this.form
    component['removeControlsFromNestedFormGroup'](source);

    // Expect only baz to remain in the component.form
    expect(Object.keys(component.form.controls)).toEqual(['baz']);
  });

  describe('hasValue (in abstract)', () => {
    it('returns false for null and undefined', () => {
      if (!component) {
        throw new Error('component returned null');
      }
      expect(component.testHasValue(null)).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(component.testHasValue(undefined as any)).toBe(false);
    });

    it('returns false for empty or whitespace-only strings', () => {
      if (!component) {
        throw new Error('component returned null');
      }
      expect(component.testHasValue('')).toBe(false);
      expect(component.testHasValue('   ')).toBe(false);
      expect(component.testHasValue('\n\t')).toBe(false);
    });

    it('returns true for non-empty strings', () => {
      if (!component) {
        throw new Error('component returned null');
      }
      expect(component.testHasValue('x')).toBe(true);
      expect(component.testHasValue('  x  ')).toBe(true);
    });

    it('returns true for non-string values', () => {
      if (!component) {
        throw new Error('component returned null');
      }
      expect(component.testHasValue(0)).toBe(true);
      expect(component.testHasValue(false)).toBe(true);
      expect(component.testHasValue({})).toBe(true);
      expect(component.testHasValue([])).toBe(true);
      const d = new Date();
      expect(component.testHasValue(d)).toBe(true);
    });
  });

  it('setValidatorPresence should add/remove a single validator and update validity', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    // early-return branch when control is null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(component['setValidatorPresence'](null as unknown as any, Validators.required, true)).toBe(false);

    const c = new FormControl<string | null>(null);

    // add required
    const nowPresent = component['setValidatorPresence'](c, Validators.required, true);
    expect(nowPresent).toBe(true);
    c.updateValueAndValidity({ onlySelf: true });
    expect(c.hasError('required')).toBe(true);

    // remove required
    const nowAbsent = component['setValidatorPresence'](c, Validators.required, false);
    expect(nowAbsent).toBe(false);
    c.updateValueAndValidity({ onlySelf: true });
    expect(c.hasError('required')).toBe(false);
  });

  it('setValidatorPresence should add/remove multiple validators at once', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const c = new FormControl<string | null>('AB', []);

    // add minlength(3) and pattern(/^[A-Z]+$/)
    const validators = [Validators.minLength(3), Validators.pattern(/^[A-Z]+$/)];
    component['setValidatorPresence'](c, validators, true);
    c.updateValueAndValidity({ onlySelf: true });

    // 'AB' fails minlength but passes pattern
    expect(c.hasError('minlength')).toBe(true);
    expect(c.hasError('pattern')).toBe(false);

    // remove both validators
    component['setValidatorPresence'](c, validators, false);
    c.updateValueAndValidity({ onlySelf: true });

    expect(c.errors).toBeNull();
  });

  it('resetAndValidateControls should clear values and errors and update validity', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const c1 = new FormControl<string | null>('x', Validators.required);
    c1.setErrors({ custom: true });
    const c2 = new FormControl<number | null>(42);

    component['resetAndValidateControls']([c1, c2]);

    expect(c1.value).toBeNull();
    // custom error should be cleared, but required should be re-applied by updateValueAndValidity
    expect(c1.hasError('required')).toBe(true);
    expect(c1.errors).not.toEqual(expect.objectContaining({ custom: true }));
    expect(c1.valid).toBe(false); // required + null

    expect(c2.value).toBeNull();
    expect(c2.errors).toBeNull();
    expect(c2.valid).toBe(true);
  });

  it('resetAndValidateControls should safely ignore null entries and still process others', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const c1 = new FormControl<string | null>('x', Validators.required);
    c1.setErrors({ custom: true });
    const c2 = new FormControl<number | null>(42);

    // Include a null in the middle to hit the `if (!c) return;` branch
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const list = [c1, null as unknown as any, c2];

    expect(() => component!['resetAndValidateControls'](list)).not.toThrow();

    // c1 processed
    expect(c1.value).toBeNull();
    expect(c1.hasError('required')).toBe(true);
    expect(c1.errors).not.toEqual(expect.objectContaining({ custom: true }));

    // c2 processed
    expect(c2.value).toBeNull();
    expect(c2.errors).toBeNull();
    expect(c2.valid).toBe(true);
  });

  it('resetAndValidateFormGroup should reset value/touched/pristine and update validity', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const g = new FormGroup({
      a: new FormControl<string | null>(null, Validators.required),
    });
    g.get('a')?.markAsTouched();
    g.get('a')?.setValue('1');

    component['resetAndValidateFormGroup'](g);

    expect(g.value).toEqual({ a: null });
    expect(g.touched).toBe(false);
    expect(g.pristine).toBe(true);
    expect(g.valid).toBe(false);
  });

  it('subscribeValidation should call handler on any source control change and unsubscribe on destroy', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    const a = new FormControl<string | null>(null);
    const b = new FormControl<string | null>(null);
    const handler = vi.fn();

    component['subscribeValidation'](handler, a, b);

    a.setValue('X');
    b.setValue('Y');
    expect(handler).toHaveBeenCalledTimes(2);

    component.ngOnDestroy(); // should trigger takeUntil and clear controls (none attached in this test)

    a.setValue('Z');
    b.setValue('Q');
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('subscribeValidation should no-op when no controls provided', () => {
    if (!component) {
      throw new Error('component returned null');
    }
    const handler = vi.fn();
    component['subscribeValidation'](handler /* no controls */);
    // nothing to trigger; ensure no calls and no throw
    expect(handler).not.toHaveBeenCalled();
  });

  it('ngOnDestroy should unregister field errors and clear nested form controls when the form has a parent', () => {
    if (!component) {
      throw new Error('component returned null');
    }

    // Prepare field errors with a child entry that will be unregistered
    component['fieldErrors'] = { XYZ: { required: { message: 'msg', priority: 1 } } };

    // Put component.form under a parent so parent-child relationship exists
    const root = new FormGroup({});
    root.addControl('child', component.form);

    // Add a control so we can verify it gets removed
    component.form.addControl('a', new FormControl('1'));

    component.ngOnDestroy();

    // Errors: child-added entry removed, original remains
    expect(component['fieldErrors']['XYZ']['required'].message).toBe('msg');
    expect(component['fieldErrors']['XYZ']['minlength']).toBeUndefined();

    // Controls: cleared because form had a parent
    expect(Object.keys(component.form.controls).length).toBe(0);
  });
});
