import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { AbstractNestedFormBaseComponent } from './abstract-nested-form-base.component';
import { IAbstractFormBaseFieldErrors } from '@hmcts/opal-frontend-common/components/abstract/abstract-form-base/interfaces';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

// Minimal concrete to exercise the abstract logic without Angular TestBed
class TestAbstractNestedFormBaseComponent extends AbstractNestedFormBaseComponent {
  public override form: FormGroup = new FormGroup({});
  public override fieldErrors: IAbstractFormBaseFieldErrors = {};
  // Expose ngUnsubscribe for tests if needed (parent sets it; ensure it exists here)
  public override ngOnInit(): void {}
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
      fail('component returned null');
      return;
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
      fail('component returned null');
      return;
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
      fail('component returned null');
      return;
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

  it('setValidatorPresence should add/remove a single validator and update validity', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    // early-return branch when control is null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(component['setValidatorPresence'](null as unknown as any, Validators.required, true)).toBeFalse();

    const c = new FormControl<string | null>(null);

    // add required
    const nowPresent = component['setValidatorPresence'](c, Validators.required, true);
    expect(nowPresent).toBeTrue();
    c.updateValueAndValidity({ onlySelf: true });
    expect(c.hasError('required')).toBeTrue();

    // remove required
    const nowAbsent = component['setValidatorPresence'](c, Validators.required, false);
    expect(nowAbsent).toBeFalse();
    c.updateValueAndValidity({ onlySelf: true });
    expect(c.hasError('required')).toBeFalse();
  });

  it('setValidatorPresence should add/remove multiple validators at once', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const c = new FormControl<string | null>('AB', []);

    // add minlength(3) and pattern(/^[A-Z]+$/)
    const validators = [Validators.minLength(3), Validators.pattern(/^[A-Z]+$/)];
    component['setValidatorPresence'](c, validators, true);
    c.updateValueAndValidity({ onlySelf: true });

    // 'AB' fails minlength but passes pattern
    expect(c.hasError('minlength')).toBeTrue();
    expect(c.hasError('pattern')).toBeFalse();

    // remove both validators
    component['setValidatorPresence'](c, validators, false);
    c.updateValueAndValidity({ onlySelf: true });

    expect(c.errors).toBeNull();
  });

  it('resetAndValidateControls should clear values and errors and update validity', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const c1 = new FormControl<string | null>('x', Validators.required);
    c1.setErrors({ custom: true });
    const c2 = new FormControl<number | null>(42);

    component['resetAndValidateControls']([c1, c2]);

    expect(c1.value).toBeNull();
    // custom error should be cleared, but required should be re-applied by updateValueAndValidity
    expect(c1.hasError('required')).toBeTrue();
    expect(c1.errors).not.toEqual(jasmine.objectContaining({ custom: true }));
    expect(c1.valid).toBeFalse(); // required + null

    expect(c2.value).toBeNull();
    expect(c2.errors).toBeNull();
    expect(c2.valid).toBeTrue();
  });

  it('resetAndValidateControls should safely ignore null entries and still process others', () => {
    if (!component) {
      fail('component returned null');
      return;
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
    expect(c1.hasError('required')).toBeTrue();
    expect(c1.errors).not.toEqual(jasmine.objectContaining({ custom: true }));

    // c2 processed
    expect(c2.value).toBeNull();
    expect(c2.errors).toBeNull();
    expect(c2.valid).toBeTrue();
  });

  it('resetAndValidateFormGroup should reset value/touched/pristine and update validity', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const g = new FormGroup({
      a: new FormControl<string | null>(null, Validators.required),
    });
    g.get('a')?.markAsTouched();
    g.get('a')?.setValue('1');

    component['resetAndValidateFormGroup'](g);

    expect(g.value).toEqual({ a: null });
    expect(g.touched).toBeFalse();
    expect(g.pristine).toBeTrue();
    expect(g.valid).toBeFalse();
  });

  it('subscribeValidation should call handler on any source control change and unsubscribe on destroy', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const a = new FormControl<string | null>(null);
    const b = new FormControl<string | null>(null);
    const handler = jasmine.createSpy('handler');

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
      fail('component returned null');
      return;
    }
    const handler = jasmine.createSpy('handler');
    component['subscribeValidation'](handler /* no controls */);
    // nothing to trigger; ensure no calls and no throw
    expect(handler).not.toHaveBeenCalled();
  });

  it('registerNestedFormFieldErrors should merge child errors without overwriting existing, and unregister should remove only what was added', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component['fieldErrors'] = {
      controlA: {
        required: { message: 'Parent required', priority: 1 },
      },
    };

    const childErrors: IAbstractFormBaseFieldErrors = {
      controlA: {
        required: { message: 'Child required (should NOT overwrite)', priority: 99 },
        maxlength: { message: 'Too long', priority: 2 },
      },
      controlB: {
        pattern: { message: 'Invalid', priority: 3 },
      },
    };

    component['registerNestedFormFieldErrors'](childErrors);

    // existing parent message preserved; new types added
    expect(component['fieldErrors']['controlA']['required'].message).toBe('Parent required');
    expect(component['fieldErrors']['controlA']['maxlength'].message).toBe('Too long');
    expect(component['fieldErrors']['controlB']['pattern'].message).toBe('Invalid');

    // Unregister removes only what the child added
    component['unregisterNestedFormFieldErrors']();

    expect(component['fieldErrors']['controlA']['required'].message).toBe('Parent required');
    expect(component['fieldErrors']['controlA']['maxlength']).toBeUndefined();
    expect(component['fieldErrors']['controlB']).toBeUndefined();
  });

  it('registerNestedFormFieldErrors should init fieldErrors map when undefined', () => {
    if (!component) {
      fail('component returned null');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).fieldErrors = undefined; // hit init branch
    component['registerNestedFormFieldErrors']({
      foo: { required: { message: 'm', priority: 1 } },
    });
    expect(component['fieldErrors']['foo']['required'].message).toBe('m');
  });

  it('registerNestedFormFieldErrors should ignore falsy input', () => {
    if (!component) {
      fail('component returned null');
      return;
    }
    component['fieldErrors'] = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component['registerNestedFormFieldErrors'](null as unknown as any);
    expect(component['fieldErrors']).toEqual({});
  });

  it('unregisterNestedFormFieldErrors should no-op when registry or fieldErrors are falsy', () => {
    if (!component) {
      fail('component returned null');
      return;
    }
    // Case 1: empty registry
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).registeredFieldErrors = {};
    expect(() => {
      if (!component) {
        fail('component returned null');
        return;
      }
      component['unregisterNestedFormFieldErrors']();
    }).not.toThrow();

    // Case 2: undefined fieldErrors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).registeredFieldErrors = { ghost: ['required'] };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).fieldErrors = undefined;
    expect(() => {
      if (!component) {
        fail('component returned null');
        return;
      }
      component['unregisterNestedFormFieldErrors']();
    }).not.toThrow();
  });

  it('unregisterNestedFormFieldErrors should skip keys that are not present in fieldErrors', () => {
    if (!component) {
      fail('component returned null');
      return;
    }
    component['fieldErrors'] = { keep: { required: { message: 'keep', priority: 1 } } };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (component as any).registeredFieldErrors = { missing: ['maxlength'] };
    expect(() => {
      if (!component) {
        fail('component returned null');
        return;
      }
      component['unregisterNestedFormFieldErrors']();
    }).not.toThrow();
    expect(component['fieldErrors']['keep']['required'].message).toBe('keep');
  });

  it('ngOnDestroy should unregister field errors and clear nested form controls when the form has a parent', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    // Prepare field errors with a child entry that will be unregistered
    component['fieldErrors'] = { XYZ: { required: { message: 'msg', priority: 1 } } };
    component['registerNestedFormFieldErrors']({ XYZ: { minlength: { message: 'm', priority: 2 } } });

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
