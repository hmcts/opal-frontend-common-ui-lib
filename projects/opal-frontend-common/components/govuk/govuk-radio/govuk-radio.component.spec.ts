import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GovukRadioComponent } from './govuk-radio.component';

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

type GovukFrontendLoader = {
  loadGovukFrontend: () => Promise<unknown>;
};

type GovukRadioRenderHookHost = {
  handleAfterNextRender: () => void;
  initOuterRadios: () => void;
};

const flush = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe('GovukRadioComponent', () => {
  let component: TestHostComponent | null;
  let fixture: ComponentFixture<TestHostComponent> | null;
  let loadGovukFrontendSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    document.body.classList.add('govuk-frontend-supported', 'js-enabled');

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    loadGovukFrontendSpy = vi.spyOn(
      GovukRadioComponent.prototype as unknown as GovukFrontendLoader,
      'loadGovukFrontend',
    );
    loadGovukFrontendSpy.mockResolvedValue({ initAll: vi.fn() });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    fixture = null;
    component = null;
    TestBed.resetTestingModule();
  });

  function getRenderedState() {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    const debugElement = fixture.debugElement.query(By.directive(GovukRadioComponent));
    const host = debugElement.nativeElement as HTMLElement;
    const radios = host.querySelector('.govuk-radios') as HTMLElement | null;

    if (!radios) {
      throw new Error('radios element missing');
    }

    return {
      debugElement,
      host,
      radios,
      radioComponent: debugElement.componentInstance as GovukRadioComponent,
    };
  }

  async function renderHost() {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    fixture.detectChanges();
    await flush();

    return getRenderedState();
  }

  async function renderWithModule(module: unknown) {
    if (!fixture) {
      throw new Error('fixture returned null');
    }

    loadGovukFrontendSpy.mockResolvedValueOnce(module);
    fixture.detectChanges();
    await flush();

    return getRenderedState();
  }

  function createFakeRadioHost(radioComponent: GovukRadioComponent) {
    const host = document.createElement('div');
    host.innerHTML = '<div class="govuk-radios"></div>';
    (radioComponent as unknown as { elementRef: { nativeElement: HTMLElement } }).elementRef.nativeElement = host;
    return host;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render into the Legend Text', async () => {
    const { host } = await renderHost();
    const element = host.querySelector('#test > .govuk-fieldset__legend ');
    if (!element) {
      throw new Error('legend element missing');
    }
    expect(element.textContent?.trim()).toBe('Legend Text');
  });

  it('should render into the Legend Hint', async () => {
    const { host } = await renderHost();
    const element = host.querySelector('#test-hint');
    if (!element) {
      throw new Error('hint element missing');
    }
    expect(element.textContent?.trim()).toBe('Legend Hint');
  });

  it('should build describedBy from hint and error', async () => {
    const { radioComponent } = await renderHost();

    radioComponent.legendHint = 'Legend Hint';
    radioComponent.errors = 'Error';

    expect(radioComponent.describedBy).toBe('test-hint test-error-message');
  });

  it('should add a legend class', async () => {
    const { host } = await renderHost();
    const element = host.querySelector('#test > .govuk-fieldset__legend.legend-class');
    if (!element) {
      throw new Error('legend element missing');
    }
    expect(element.textContent?.trim()).toBe('Legend Text');
  });

  it('should add a radio class', async () => {
    const { host } = await renderHost();
    const element = host.querySelector('#test > .radio-class');
    if (!element) {
      throw new Error('radio element missing');
    }
    expect(element.textContent?.trim()).toBe('Hello World');
  });

  it('should set aria-describedby with hint only', async () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component.legendHint = 'Legend Hint';
    component.errors = null;

    const { host } = await renderHost();
    const fieldset = host.querySelector('#test');
    if (!fieldset) {
      throw new Error('fieldset element missing');
    }
    expect(fieldset.getAttribute('aria-describedby')).toBe('test-hint');
  });

  it('should set aria-describedby with error only', async () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component.legendHint = '';
    component.errors = 'Error';

    const { host } = await renderHost();
    const fieldset = host.querySelector('#test');
    if (!fieldset) {
      throw new Error('fieldset element missing');
    }
    expect(fieldset.getAttribute('aria-describedby')).toBe('test-error-message');
  });

  it('should set aria-describedby with hint and error', async () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component.errors = 'Error';

    const { host } = await renderHost();
    const fieldset = host.querySelector('#test');
    if (!fieldset) {
      throw new Error('fieldset element missing');
    }
    expect(fieldset.getAttribute('aria-describedby')).toBe('test-hint test-error-message');
  });

  it('should not set aria-describedby when hint and error are missing', async () => {
    if (!component) {
      throw new Error('component returned null');
    }

    component.legendHint = '';
    component.errors = null;

    const { host } = await renderHost();
    const fieldset = host.querySelector('#test');
    if (!fieldset) {
      throw new Error('fieldset element missing');
    }
    expect(fieldset.getAttribute('aria-describedby')).toBeNull();
  });

  it('should return early when radios root is missing', async () => {
    const { debugElement, host } = await renderHost();
    const radios = host.querySelector('.govuk-radios');
    radios?.remove();

    const radioComponent = debugElement.componentInstance as GovukRadioComponent;
    radioComponent['initOuterRadios']();

    expect(host.querySelector('.govuk-radios')).toBeNull();
  });

  it('should return early when radios are already initialised', async () => {
    const { debugElement, radios } = await renderHost();

    radios.dataset['opalGovukRadiosInitialised'] = 'true';

    const radioComponent = debugElement.componentInstance as GovukRadioComponent;
    radioComponent['initOuterRadios']();

    expect(radios.dataset['opalGovukRadiosInitialised']).toBe('true');
  });

  it('should not initialise radios from the render hook after the component is destroyed', () => {
    const rawFixture = TestBed.createComponent(GovukRadioComponent);
    const rawComponent = rawFixture.componentInstance;
    const initOuterRadiosSpy = vi.spyOn(rawComponent as unknown as GovukRadioRenderHookHost, 'initOuterRadios');

    rawComponent.ngOnDestroy();
    (rawComponent as unknown as GovukRadioRenderHookHost).handleAfterNextRender();

    expect(initOuterRadiosSpy).not.toHaveBeenCalled();
  });

  it('should not call loadGovukFrontend when initOuterRadios runs after destroy', () => {
    const rawFixture = TestBed.createComponent(GovukRadioComponent);
    const rawComponent = rawFixture.componentInstance as GovukRadioComponent;
    createFakeRadioHost(rawComponent);

    rawComponent.ngOnDestroy();
    rawComponent['initOuterRadios']();

    expect(loadGovukFrontendSpy).not.toHaveBeenCalled();
  });

  it('should fall back when radios constructor fails', async () => {
    const initAllSpy = vi.fn();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const { radios } = await renderWithModule({ Radios: ThrowingRadios, initAll: initAllSpy });

    expect(warnSpy).toHaveBeenCalledWith(
      'Govuk Radios constructor failed for rootRadios, falling back to initAll',
      expect.anything(),
    );
    expect(initAllSpy).toHaveBeenCalledWith({ scope: radios });
    expect(radios.dataset['opalGovukRadiosInitialised']).toBe('true');
  });

  it('should call Radios constructor when Radios is provided by govuk-frontend', async () => {
    const FakeRadios = function (root: HTMLElement) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (root as any).__fakeRadiosConstructed = true;
    };

    const { radios } = await renderWithModule({ Radios: FakeRadios });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((radios as any).__fakeRadiosConstructed).toBe(true);
    expect(radios.dataset['opalGovukRadiosInitialised']).toBe('true');
  });

  it('should call Radios constructor when Radios is provided by the default export', async () => {
    const FakeDefaultRadios = function (root: HTMLElement) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (root as any).__defaultRadiosConstructed = true;
    };

    const { radios } = await renderWithModule({ default: { Radios: FakeDefaultRadios } });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((radios as any).__defaultRadiosConstructed).toBe(true);
    expect(radios.dataset['opalGovukRadiosInitialised']).toBe('true');
  });

  it('should call initAll(scope) when initAll is provided and Radios is absent', async () => {
    const initAllSpy = vi.fn();
    const { radios } = await renderWithModule({ initAll: initAllSpy });

    expect(initAllSpy).toHaveBeenCalledWith({ scope: radios });
    expect(radios.dataset['opalGovukRadiosInitialised']).toBe('true');
  });

  it('should call initAll(scope) when initAll is provided by the default export', async () => {
    const initAllSpy = vi.fn();
    const { radios } = await renderWithModule({
      default: {
        initAll: initAllSpy,
      },
    });

    expect(initAllSpy).toHaveBeenCalledWith({ scope: radios });
    expect(radios.dataset['opalGovukRadiosInitialised']).toBe('true');
  });

  it('should load govuk-frontend via loadGovukFrontend', async () => {
    const rawFixture = TestBed.createComponent(GovukRadioComponent);
    const radioComponent = rawFixture.componentInstance;
    radioComponent.ngOnDestroy();

    vi.restoreAllMocks();
    const importedModule = (await (radioComponent as unknown as GovukFrontendLoader).loadGovukFrontend()) as {
      initAll?: () => void;
      default?: {
        initAll?: () => void;
      };
    };

    expect(typeof importedModule.initAll === 'function' || typeof importedModule.default?.initAll === 'function').toBe(
      true,
    );
  });

  it('should not warn when radios construction fails after the component is destroyed', async () => {
    const rawFixture = TestBed.createComponent(GovukRadioComponent);
    const radioComponent = rawFixture.componentInstance as GovukRadioComponent;
    createFakeRadioHost(radioComponent);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const initAllSpy = vi.fn();

    const DestroyingRadios = function () {
      radioComponent.ngOnDestroy();
      throw new Error('ctor failed');
    };

    loadGovukFrontendSpy.mockResolvedValueOnce({ Radios: DestroyingRadios, initAll: initAllSpy });

    radioComponent['initOuterRadios']();
    await flush();

    expect(warnSpy).not.toHaveBeenCalledWith(
      'Govuk Radios constructor failed for rootRadios, falling back to initAll',
      expect.anything(),
    );
    expect(initAllSpy).not.toHaveBeenCalled();
  });

  it('should log an error when import fails', async () => {
    const rawFixture = TestBed.createComponent(GovukRadioComponent);
    const radioComponent = rawFixture.componentInstance as GovukRadioComponent;
    createFakeRadioHost(radioComponent);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    loadGovukFrontendSpy.mockRejectedValueOnce(new Error('boom'));

    radioComponent['initOuterRadios']();
    await flush();

    expect(errorSpy).toHaveBeenCalledWith('Failed to import govuk-frontend for rootRadios init', expect.anything());
    radioComponent.ngOnDestroy();
  });

  it('should warn when neither Radios nor initAll are provided by govuk-frontend', async () => {
    const rawFixture = TestBed.createComponent(GovukRadioComponent);
    const radioComponent = rawFixture.componentInstance as GovukRadioComponent;
    createFakeRadioHost(radioComponent);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    loadGovukFrontendSpy.mockResolvedValueOnce({});

    radioComponent['initOuterRadios']();
    await flush();

    expect(warnSpy).toHaveBeenCalledWith('govuk-frontend radios init not found for rootRadios', expect.anything());
    radioComponent.ngOnDestroy();
  });

  it('should not log an error when import fails after the component is destroyed', async () => {
    const rawFixture = TestBed.createComponent(GovukRadioComponent);
    const radioComponent = rawFixture.componentInstance as GovukRadioComponent;
    createFakeRadioHost(radioComponent);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    let rejectModule: ((reason?: unknown) => void) | undefined;
    loadGovukFrontendSpy.mockReturnValueOnce(
      new Promise((_, reject) => {
        rejectModule = reject;
      }),
    );

    radioComponent['initOuterRadios']();
    radioComponent.ngOnDestroy();
    rejectModule?.(new Error('boom'));
    await flush();

    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('should not initialise radios after the component is destroyed', async () => {
    const rawFixture = TestBed.createComponent(GovukRadioComponent);
    const radioComponent = rawFixture.componentInstance as GovukRadioComponent;
    createFakeRadioHost(radioComponent);

    let resolveModule: ((value: { initAll: () => void }) => void) | undefined;
    const initAllSpy = vi.fn();

    loadGovukFrontendSpy.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveModule = resolve;
      }),
    );

    radioComponent['initOuterRadios']();
    radioComponent.ngOnDestroy();
    await flush();

    resolveModule?.({ initAll: initAllSpy as unknown as () => void });
    await flush();

    expect(initAllSpy).not.toHaveBeenCalled();
  });
});
