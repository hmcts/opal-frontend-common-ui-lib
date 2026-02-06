import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GovukRadioComponent } from './govuk-radio.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { vi, expect } from 'vitest';

@Component({
  template: `<opal-lib-govuk-radio
    [fieldSetId]="fieldSetId"
    [legendText]="legendText"
    [legendHint]="legendHint"
    [legendClasses]="legendClasses"
    [radioClasses]="radioClasses"
    [errors]="errors"
  >
    <input class="govuk-radios__input" id="test-radio" name="test-radio" type="radio" value="test" />
    Hello World</opal-lib-govuk-radio
  >`,
  imports: [GovukRadioComponent],
})
class TestHostComponent {
  fieldSetId = 'test';
  legendText = 'Legend Text';
  legendHint = 'Legend Hint';
  legendClasses = 'legend-class';
  radioClasses = 'radio-class';
  errors: string | null = null;
}

function ThrowingRadios() {
  throw new Error('ctor failed');
}

describe('GovukRadioComponent', () => {
  let component: TestHostComponent | null;
  let fixture: ComponentFixture<TestHostComponent> | null;

  beforeEach(async () => {
    document.body.classList.add('govuk-frontend-supported', 'js-enabled');

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  afterAll(() => {
    fixture = null;
    component = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render into the Legend Text', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('#test > .govuk-fieldset__legend ');
    expect(element.textContent?.trim()).toBe('Legend Text');
  });

  it('should render into the Legend Hint', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('#test-hint');
    expect(element.textContent?.trim()).toBe('Legend Hint');
  });

  it('should add a legend class', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('#test > .govuk-fieldset__legend.legend-class');
    expect(element.textContent?.trim()).toBe('Legend Text');
  });

  it('should add a radio class', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('#test > .radio-class');
    expect(element.textContent?.trim()).toBe('Hello World');
  });

  it('should set aria-describedby with hint only', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    fixture.detectChanges();
    const fieldset = fixture.nativeElement.querySelector('#test');
    expect(fieldset.getAttribute('aria-describedby')).toBe('test-hint');
  });

  it('should set aria-describedby with error only', () => {
    if (!fixture || !component) {
      throw new Error('component or fixture returned null');
    }

    component.legendHint = '';
    component.errors = 'Error';
    fixture.detectChanges();

    const fieldset = fixture.nativeElement.querySelector('#test');
    expect(fieldset.getAttribute('aria-describedby')).toBe('test-error-message');
  });

  it('should set aria-describedby with hint and error', () => {
    if (!fixture || !component) {
      throw new Error('component or fixture returned null');
    }

    component.errors = 'Error';
    fixture.detectChanges();

    const fieldset = fixture.nativeElement.querySelector('#test');
    expect(fieldset.getAttribute('aria-describedby')).toBe('test-hint test-error-message');
  });

  it('should not set aria-describedby when hint and error are missing', () => {
    if (!fixture || !component) {
      throw new Error('component or fixture returned null');
    }

    component.legendHint = '';
    component.errors = null;
    fixture.detectChanges();

    const fieldset = fixture.nativeElement.querySelector('#test');
    expect(fieldset.getAttribute('aria-describedby')).toBeNull();
  });

  it('should return early when radios root is missing', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    fixture.detectChanges();
    const debugElement = fixture.debugElement.query(By.directive(GovukRadioComponent));
    const host = debugElement.nativeElement as HTMLElement;
    const radios = host.querySelector('.govuk-radios');
    radios?.remove();

    const radioComponent = debugElement.componentInstance as GovukRadioComponent;
    radioComponent['initOuterRadios']();

    expect(host.querySelector('.govuk-radios')).toBeNull();
  });

  it('should return early when radios are already initialised', () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    fixture.detectChanges();
    const debugElement = fixture.debugElement.query(By.directive(GovukRadioComponent));
    const host = debugElement.nativeElement as HTMLElement;
    const radios = host.querySelector('.govuk-radios') as HTMLElement;

    if (!radios) {
      throw new Error('radios element missing');
    }

    radios.dataset['opalGovukRadiosInitialised'] = 'true';

    const radioComponent = debugElement.componentInstance as GovukRadioComponent;
    radioComponent['initOuterRadios']();

    expect(radios.dataset['opalGovukRadiosInitialised']).toBe('true');
  });

  it('should mark radios as initialised when inputs are present', async () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    fixture.detectChanges();
    const debugElement = fixture.debugElement.query(By.directive(GovukRadioComponent));
    const host = debugElement.nativeElement as HTMLElement;
    const radios = host.querySelector('.govuk-radios') as HTMLElement;

    if (!radios) {
      throw new Error('radios element missing');
    }

    delete radios.dataset['opalGovukRadiosInitialised'];

    const radioComponent = debugElement.componentInstance as GovukRadioComponent;
    const loadSpy = vi
      .spyOn(
        radioComponent as unknown as {
          loadGovukFrontend: () => Promise<unknown>;
        },
        'loadGovukFrontend',
      )
      .mockReturnValue(Promise.resolve({ Radios: function () {} }));
    radioComponent['initOuterRadios']();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(loadSpy).toHaveBeenCalled();
    expect(radios.dataset['opalGovukRadiosInitialised']).toBe('true');
  });

  it('should fall back when radios constructor fails', async () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    fixture.detectChanges();
    const debugElement = fixture.debugElement.query(By.directive(GovukRadioComponent));
    const host = debugElement.nativeElement as HTMLElement;
    const radios = host.querySelector('.govuk-radios') as HTMLElement;

    if (!radios) {
      throw new Error('radios element missing');
    }

    delete radios.dataset['opalGovukRadiosInitialised'];

    // Simulate a govuk-frontend module where the Radios constructor exists but throws.
    const initAllSpy = vi.fn();
    const warnSpy = vi.spyOn(console, 'warn');

    const radioComponent = debugElement.componentInstance as GovukRadioComponent;
    const loadSpy = vi
      .spyOn(
        radioComponent as unknown as {
          loadGovukFrontend: () => Promise<unknown>;
        },
        'loadGovukFrontend',
      )
      .mockReturnValue(Promise.resolve({ Radios: ThrowingRadios, initAll: initAllSpy }));

    radioComponent['initOuterRadios']();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(loadSpy).toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      'Govuk Radios constructor failed for rootRadios, falling back to initAll',
      expect.anything(),
    );
    expect(initAllSpy).toHaveBeenCalledWith({ scope: radios });
    expect(radios.dataset['opalGovukRadiosInitialised']).toBe('true');
  });

  it('should call Radios constructor when Radios is provided by govuk-frontend', async () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    fixture.detectChanges();
    const debugElement = fixture.debugElement.query(By.directive(GovukRadioComponent));
    const host = debugElement.nativeElement as HTMLElement;
    const radios = host.querySelector('.govuk-radios') as HTMLElement;
    if (!radios) {
      throw new Error('radios element missing');
    }

    // Ensure not initialised
    delete radios.dataset['opalGovukRadiosInitialised'];

    // Create fake Radios constructor that marks root element
    const FakeRadios = function (root: HTMLElement) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (root as any).__fakeRadiosConstructed = true;
    };

    const radioComponent = debugElement.componentInstance as GovukRadioComponent;
    // Stub loadGovukFrontend instead of spying on import()
    const loadSpy = vi
      .spyOn(
        radioComponent as unknown as {
          loadGovukFrontend: () => Promise<unknown>;
        },
        'loadGovukFrontend',
      )
      .mockReturnValue(Promise.resolve({ Radios: FakeRadios }));

    radioComponent['initOuterRadios']();

    // wait microtask queue for the dynamic promise to resolve
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(loadSpy).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((radios as any).__fakeRadiosConstructed).toBe(true);
    // dataset should be set to prevent double init
    expect(radios.dataset['opalGovukRadiosInitialised']).toBe('true');
  });

  it('should call initAll(scope) when initAll is provided and Radios is absent', async () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    fixture.detectChanges();
    const debugElement = fixture.debugElement.query(By.directive(GovukRadioComponent));
    const host = debugElement.nativeElement as HTMLElement;
    const radios = host.querySelector('.govuk-radios') as HTMLElement;
    if (!radios) {
      throw new Error('radios element missing');
    }

    delete radios.dataset['opalGovukRadiosInitialised'];

    // module provides initAll
    const fakeModule = {
      initAll: ({ scope }: { scope: HTMLElement }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (scope as any).__initAllInvoked = true;
      },
    };

    const radioComponent = debugElement.componentInstance as GovukRadioComponent;
    // Stub loadGovukFrontend instead of spying on import()
    const loadSpy = vi
      .spyOn(
        radioComponent as unknown as {
          loadGovukFrontend: () => Promise<unknown>;
        },
        'loadGovukFrontend',
      )
      .mockReturnValue(Promise.resolve(fakeModule));

    radioComponent['initOuterRadios']();

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(loadSpy).toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((radios as any).__initAllInvoked).toBe(true);
    expect(radios.dataset['opalGovukRadiosInitialised']).toBe('true');
  });

  it('should load govuk-frontend via loadGovukFrontend', async () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    fixture.detectChanges();
    const debugElement = fixture.debugElement.query(By.directive(GovukRadioComponent));
    const radioComponent = debugElement.componentInstance as GovukRadioComponent;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const module = await (radioComponent as any).loadGovukFrontend();
    expect(typeof module?.initAll === 'function' || typeof module?.default?.initAll === 'function').toBe(true);
  });

  it('should log an error when import fails', async () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    fixture.detectChanges();
    const debugElement = fixture.debugElement.query(By.directive(GovukRadioComponent));
    const host = debugElement.nativeElement as HTMLElement;
    const radios = host.querySelector('.govuk-radios') as HTMLElement;
    if (!radios) {
      throw new Error('radios element missing');
    }

    delete radios.dataset['opalGovukRadiosInitialised'];

    const radioComponent = debugElement.componentInstance as GovukRadioComponent;
    // Stub loadGovukFrontend instead of spying on import()
    const loadSpy = vi
      .spyOn(
        radioComponent as unknown as {
          loadGovukFrontend: () => Promise<unknown>;
        },
        'loadGovukFrontend',
      )
      .mockReturnValue(Promise.reject(new Error('boom')));

    const errorSpy = vi.spyOn(console, 'error');

    radioComponent['initOuterRadios']();

    // wait for async
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(loadSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith('Failed to import govuk-frontend for rootRadios init', expect.anything());
  });

  it('should warn when neither Radios nor initAll are provided by govuk-frontend', async () => {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    fixture.detectChanges();
    const debugElement = fixture.debugElement.query(By.directive(GovukRadioComponent));
    const host = debugElement.nativeElement as HTMLElement;
    const radios = host.querySelector('.govuk-radios') as HTMLElement;
    if (!radios) {
      throw new Error('radios element missing');
    }

    delete radios.dataset['opalGovukRadiosInitialised'];

    const warnSpy = vi.spyOn(console, 'warn');

    const radioComponent = debugElement.componentInstance as GovukRadioComponent;
    const loadSpy = vi
      .spyOn(
        radioComponent as unknown as {
          loadGovukFrontend: () => Promise<unknown>;
        },
        'loadGovukFrontend',
      )
      .mockReturnValue(Promise.resolve({}));

    radioComponent['initOuterRadios']();

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(loadSpy).toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith('govuk-frontend radios init not found for rootRadios', expect.anything());
    expect(radios.dataset['opalGovukRadiosInitialised']).toBe('true');
  });
});
