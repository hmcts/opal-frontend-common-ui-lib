import { By } from '@angular/platform-browser';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { GovukErrorSummaryComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-error-summary';
import { MojDatePickerComponent } from '@hmcts/opal-frontend-common/components/moj/moj-date-picker';
import { CustomDateFilterComponent } from '@hmcts/opal-frontend-common/components/custom/custom-date-filter';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CustomFileInterfaceViewerFiltersComponent } from './custom-file-interface-viewer-filters.component';

describe('CustomFileInterfaceViewerFiltersComponent', () => {
  let component: CustomFileInterfaceViewerFiltersComponent;
  let fixture: ComponentFixture<CustomFileInterfaceViewerFiltersComponent>;

  beforeEach(async () => {
    document.body.classList.add('govuk-frontend-supported', 'js-enabled');

    await TestBed.configureTestingModule({
      imports: [CustomFileInterfaceViewerFiltersComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomFileInterfaceViewerFiltersComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isInbound', true);
    fixture.componentRef.setInput('businessUnits', [{ value: '77', name: 'Mock business unit' }]);
    fixture.componentRef.setInput('source', [{ value: 'ALLPAY', name: 'Allpay' }]);
    fixture.componentRef.setInput('sourceList', [{ value: 'SOURCE', name: 'RAW' }]);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('starts with empty dropdowns and only Last 7 days selected', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await vi.dynamicImportSettled();

    expect(component.filtersForm.value).toEqual({
      businessUnit: null,
      dateFilter: 'last7Days',
      days: '',
      dateFrom: '',
      dateTo: '',
      fileType: null,
      source: null,
    });
    const inputs = fixture.nativeElement.querySelectorAll('.autocomplete__input') as NodeListOf<HTMLInputElement>;
    expect(component.businessUnitFilterOptions()).toEqual([
      { name: 'All business units', value: '' },
      { name: 'Mock business unit', value: '77' },
    ]);
    expect(component.sourceFilterOptions()).toEqual([
      { name: 'All sources', value: '' },
      { name: 'Allpay', value: 'ALLPAY' },
    ]);
    expect(component.typeFilterOptions()).toEqual([
      { name: 'All types', value: '' },
      { name: 'RAW', value: 'SOURCE' },
    ]);
    expect(inputs).toHaveLength(3);
    expect(Array.from(inputs, (input) => input.value)).toEqual(['', '', '']);
    expect(fixture.nativeElement.querySelector('input[type="radio"][value="last7Days"]').checked).toBe(true);
    expect(fixture.nativeElement.querySelector('#refresh-reports-button').disabled).toBe(true);
  });

  it('passes its existing date controls and field errors to the shared date filter', () => {
    component.filtersForm.patchValue({ dateFilter: 'customDays', days: '0' });
    fixture.detectChanges();
    const dateFilter = fixture.debugElement.query(By.directive(CustomDateFilterComponent))
      .componentInstance as CustomDateFilterComponent;

    expect(dateFilter.controls).toBe(component.filtersForm.controls);
    expect(dateFilter.idPrefix).toBe('custom-file-interface-viewer');
    expect(dateFilter.errors).toBe(component.dateFilterErrors);
    expect(dateFilter.errors).toEqual({});

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(dateFilter.errors).toBe(component.dateFilterErrors);
    expect(dateFilter.errors).toEqual({
      'custom-file-interface-viewer-days': 'Days must be greater than zero',
      'custom-file-interface-viewer-date-from': '',
      'custom-file-interface-viewer-date-to': '',
    });
  });

  it('submits successfully with blank optional filters and the default date selection', () => {
    const submit = vi.spyOn(component['formSubmit'], 'emit');
    fixture.detectChanges();
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(submit).toHaveBeenCalledExactlyOnceWith({
      formData: {
        businessUnit: null,
        dateFilter: 'last7Days',
        days: '',
        dateFrom: '',
        dateTo: '',
        fileType: null,
        source: null,
      },
      nestedFlow: false,
    });
    expect(component.formErrorSummaryMessage).toEqual([]);
  });

  it('enables Refresh for an edited filter and disables it after applying the selection', () => {
    const submit = vi.spyOn(component['formSubmit'], 'emit');
    fixture.detectChanges();
    component.filtersForm.controls.source.setValue('ALLPAY');
    component.filtersForm.controls.source.markAsDirty();
    fixture.detectChanges();
    const refresh = fixture.nativeElement.querySelector('#refresh-reports-button') as HTMLButtonElement;
    expect(refresh.disabled).toBe(false);

    refresh.click();
    fixture.detectChanges();

    expect(submit).toHaveBeenCalledExactlyOnceWith({
      formData: expect.objectContaining({ businessUnit: null, source: 'ALLPAY', fileType: null }),
      nestedFlow: false,
    });
    expect(refresh.disabled).toBe(true);
  });

  it('enables retrying pristine criteria after failure and disables Refresh when the failure is cleared', () => {
    fixture.componentRef.setInput('refreshFailed', true);
    const submit = vi.spyOn(component['formSubmit'], 'emit');
    fixture.detectChanges();
    const refresh = fixture.nativeElement.querySelector('#refresh-reports-button') as HTMLButtonElement;

    expect(component.filtersForm.pristine).toBe(true);
    expect(refresh.disabled).toBe(false);
    refresh.click();
    expect(submit).toHaveBeenCalledExactlyOnceWith({
      formData: component.filtersForm.getRawValue(),
      nestedFlow: false,
    });
    expect(component.filtersForm.pristine).toBe(true);

    fixture.componentRef.setInput('refreshFailed', false);
    fixture.detectChanges();
    expect(refresh.disabled).toBe(true);
  });

  it('submits shared custom days with the selected business unit, source and type through Refresh', async () => {
    const submit = vi.spyOn(component['formSubmit'], 'emit');
    fixture.detectChanges();
    await fixture.whenStable();
    await vi.dynamicImportSettled();

    for (const [id, label] of [
      ['custom-file-interface-viewer-business-unit-autocomplete', 'Mock business unit'],
      ['custom-file-interface-viewer-type-autocomplete', 'RAW'],
      ['custom-file-interface-viewer-source-autocomplete', 'Allpay'],
    ]) {
      const input = fixture.nativeElement.querySelector(`#${id}`) as HTMLInputElement;
      input.value = label;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await fixture.whenStable();
      const option = Array.from(
        input.closest('opal-lib-alphagov-accessible-autocomplete')!.querySelectorAll<HTMLElement>('[role="option"]'),
      ).find((element) => element.textContent?.trim() === label);
      expect(option).toBeDefined();
      option!.click();
    }

    fixture.nativeElement.querySelector('input[type="radio"][value="customDays"]').click();
    fixture.detectChanges();
    const days = fixture.nativeElement.querySelector('#custom-file-interface-viewer-days') as HTMLInputElement;
    days.value = '14';
    days.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    const refresh = fixture.nativeElement.querySelector('#refresh-reports-button') as HTMLButtonElement;

    expect(refresh.disabled).toBe(false);
    expect(fixture.nativeElement.querySelectorAll('form')).toHaveLength(1);
    refresh.click();
    fixture.detectChanges();

    expect(submit).toHaveBeenCalledExactlyOnceWith({
      formData: {
        businessUnit: '77',
        source: 'ALLPAY',
        fileType: 'SOURCE',
        dateFilter: 'customDays',
        days: '14',
        dateFrom: '',
        dateTo: '',
      },
      nestedFlow: false,
    });
    expect(component.formErrorSummaryMessage).toEqual([]);
    expect(refresh.disabled).toBe(true);
  });

  it('keeps each autocomplete host out of the native input tab order', () => {
    fixture.detectChanges();

    const hosts = fixture.nativeElement.querySelectorAll('opal-lib-alphagov-accessible-autocomplete');
    expect(Array.from(hosts, (host) => (host as HTMLElement).hasAttribute('tabindex'))).toEqual([false, false, false]);
    expect(
      Array.from(fixture.nativeElement.querySelectorAll('label'), (label) =>
        (label as HTMLLabelElement).textContent?.trim(),
      ),
    ).toEqual(expect.arrayContaining(['Filter by business unit', 'Filter by type', 'Filter by source']));
  });

  it('updates supplied options without mutating them or adding All to the source inputs', () => {
    const businessUnits = [{ value: '0046', name: 'Camberwell Green' }];
    const sources = [{ value: 'NATWEST', name: 'NatWest' }];
    const types = [{ value: 'TRANSFORMED_JSON', name: 'TRANSFORMED' }];
    fixture.componentRef.setInput('businessUnits', businessUnits);
    fixture.componentRef.setInput('source', sources);
    fixture.componentRef.setInput('sourceList', types);

    expect(component.businessUnits).toBe(businessUnits);
    expect(component.source).toBe(sources);
    expect(component.sourceList).toBe(types);
    expect(component.businessUnitFilterOptions()).toEqual([
      { name: 'All business units', value: '' },
      ...businessUnits,
    ]);
    expect(component.sourceFilterOptions()).toEqual([{ name: 'All sources', value: '' }, ...sources]);
    expect(component.typeFilterOptions()).toEqual([{ name: 'All types', value: '' }, ...types]);
    expect(businessUnits).toHaveLength(1);
    expect(sources).toHaveLength(1);
    expect(types).toHaveLength(1);
  });

  it('selects business unit, type and source options that arrive after the dropdowns render', async () => {
    fixture.componentRef.setInput('businessUnits', []);
    fixture.componentRef.setInput('source', []);
    fixture.componentRef.setInput('sourceList', []);
    fixture.detectChanges();
    await fixture.whenStable();
    await vi.dynamicImportSettled();

    expect(fixture.nativeElement.querySelectorAll('.autocomplete__input')).toHaveLength(3);

    fixture.componentRef.setInput('businessUnits', [{ value: '0046', name: 'Camberwell Green' }]);
    fixture.componentRef.setInput('source', [{ value: 'NATWEST', name: 'NatWest' }]);
    fixture.componentRef.setInput('sourceList', [{ value: 'TRANSFORMED_JSON', name: 'TRANSFORMED' }]);
    fixture.detectChanges();
    await fixture.whenStable();
    await vi.dynamicImportSettled();

    for (const [id, label] of [
      ['custom-file-interface-viewer-business-unit-autocomplete', 'Camberwell Green'],
      ['custom-file-interface-viewer-type-autocomplete', 'TRANSFORMED'],
      ['custom-file-interface-viewer-source-autocomplete', 'NatWest'],
    ]) {
      const input = fixture.nativeElement.querySelector(`#${id}`) as HTMLInputElement;
      input.value = label;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await fixture.whenStable();
      const option = Array.from(
        input.closest('opal-lib-alphagov-accessible-autocomplete')!.querySelectorAll<HTMLElement>('[role="option"]'),
      ).find((element) => element.textContent?.trim() === label);
      expect(option, `Expected ${id} to offer ${label} after its options arrive`).toBeDefined();
      option!.click();
    }

    expect(component.filtersForm.getRawValue()).toEqual({
      businessUnit: '0046',
      dateFilter: 'last7Days',
      days: '',
      dateFrom: '',
      dateTo: '',
      fileType: 'TRANSFORMED_JSON',
      source: 'NATWEST',
    });
  });

  it.each([
    {
      inputName: 'businessUnits',
      controlName: 'businessUnit',
      inputId: 'custom-file-interface-viewer-business-unit-autocomplete',
      value: '77',
      originalLabel: 'Mock business unit',
      updatedLabel: 'Updated business unit',
    },
    {
      inputName: 'sourceList',
      controlName: 'fileType',
      inputId: 'custom-file-interface-viewer-type-autocomplete',
      value: 'SOURCE',
      originalLabel: 'RAW',
      updatedLabel: 'UPDATED TYPE',
    },
    {
      inputName: 'source',
      controlName: 'source',
      inputId: 'custom-file-interface-viewer-source-autocomplete',
      value: 'ALLPAY',
      originalLabel: 'Allpay',
      updatedLabel: 'Updated source',
    },
  ] as const)(
    'refreshes a same-length $inputName replacement while preserving selections and other dropdowns',
    async ({ inputName, controlName, inputId, value, originalLabel, updatedLabel }) => {
      const control = component.filtersForm.controls[controlName];
      control.setValue(value);
      control.markAsDirty();
      control.markAsTouched();
      fixture.detectChanges();
      await fixture.whenStable();
      await vi.dynamicImportSettled();
      const previousInputs = Array.from(
        (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLInputElement>('.autocomplete__input'),
      );
      const previousInput = previousInputs.find((input) => input.id === inputId)!;

      expect(previousInput.value).toBe(originalLabel);

      fixture.componentRef.setInput(inputName, [{ value, name: updatedLabel }]);
      fixture.detectChanges();
      await fixture.whenStable();
      await vi.dynamicImportSettled();
      const updatedInput = fixture.nativeElement.querySelector(`#${inputId}`) as HTMLInputElement;

      expect(updatedInput).not.toBe(previousInput);
      expect(updatedInput.value).toBe(updatedLabel);
      for (const input of previousInputs.filter((input) => input.id !== inputId)) {
        expect(fixture.nativeElement.querySelector(`#${input.id}`)).toBe(input);
      }
      expect(component.filtersForm.controls[controlName]).toBe(control);
      expect(control.value).toBe(value);
      expect(control.dirty).toBe(true);
      expect(control.touched).toBe(true);

      updatedInput.value = updatedLabel.slice(0, 5);
      updatedInput.dispatchEvent(new Event('input', { bubbles: true }));
      await fixture.whenStable();
      const options = updatedInput
        .closest('opal-lib-alphagov-accessible-autocomplete')!
        .querySelectorAll<HTMLElement>('[role="option"]');

      expect(Array.from(options, (option) => option.textContent?.trim())).toEqual([updatedLabel]);
    },
  );

  it('shows only the business-unit dropdown for outbound files', () => {
    fixture.componentRef.setInput('isInbound', false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('opal-lib-alphagov-accessible-autocomplete')).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('#custom-file-interface-viewer-type')).toBeNull();
    expect(fixture.nativeElement.querySelector('#custom-file-interface-viewer-source')).toBeNull();
  });

  it.each([
    { days: '', message: 'Enter the number of days' },
    { days: 'abc', message: 'Days must be a number' },
    { days: '1.5', message: 'Days must be a number' },
    { days: '0', message: 'Days must be greater than zero' },
  ])('rejects custom days "$days" with its accessible field message', ({ days, message }) => {
    const submit = vi.spyOn(component['formSubmit'], 'emit');
    component.filtersForm.controls.dateFilter.setValue('customDays');
    component.filtersForm.controls.days.setValue(days);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(submit).not.toHaveBeenCalled();
    expect(component.dateFilterErrors['custom-file-interface-viewer-days']).toBe(message);
    expect(
      fixture.nativeElement.querySelector('#custom-file-interface-viewer-days-error-message').textContent,
    ).toContain(message);
    expect(
      fixture.nativeElement.querySelector('#custom-file-interface-viewer-days').getAttribute('aria-describedby'),
    ).toBe('custom-file-interface-viewer-days-error-message');
    expect(fixture.nativeElement.querySelector('.govuk-error-summary').textContent).toContain(message);
  });

  it('submits positive custom days and clears inactive date boundaries', () => {
    const submit = vi.spyOn(component['formSubmit'], 'emit');
    component.filtersForm.patchValue({
      dateFrom: '01/01/2020',
      dateTo: '02/01/2020',
      dateFilter: 'customDays',
      days: '14',
    });
    fixture.detectChanges();
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(submit).toHaveBeenCalledExactlyOnceWith({
      formData: expect.objectContaining({ dateFilter: 'customDays', days: '14', dateFrom: '', dateTo: '' }),
      nestedFlow: false,
    });
    expect(
      fixture.nativeElement.querySelector('#custom-file-interface-viewer-days').getAttribute('aria-describedby'),
    ).toBeNull();
  });

  it.each(['last7Days', null] as const)('clears inactive date values and validation for %s', (dateFilter) => {
    fixture.detectChanges();
    component.filtersForm.controls.dateFilter.setValue('customDays');
    component.filtersForm.controls.days.setValue('0');
    component.filtersForm.controls.dateFrom.setValue('invalid date');
    component.filtersForm.controls.dateTo.setValue('invalid date');

    component.filtersForm.controls.dateFilter.setValue(dateFilter);

    expect(component.filtersForm.controls.dateFilter.value).toBe(dateFilter);
    expect(component.filtersForm.controls.days.value).toBe('');
    expect(component.filtersForm.controls.dateFrom.value).toBe('');
    expect(component.filtersForm.controls.dateTo.value).toBe('');
    expect(component.filtersForm.valid).toBe(true);
  });

  it('passes both date-picker changes to their matching controls and clears custom days', () => {
    component.filtersForm.patchValue({ dateFilter: 'dateRange', days: '14' });
    fixture.detectChanges();
    const pickers = fixture.debugElement.queryAll(By.directive(MojDatePickerComponent));

    pickers[0].triggerEventHandler('dateChange', '01/01/2020');
    pickers[1].triggerEventHandler('dateChange', '03/01/2020');

    expect(component.filtersForm.controls.days.value).toBe('');
    expect(component.filtersForm.controls.dateFrom.value).toBe('01/01/2020');
    expect(component.filtersForm.controls.dateTo.value).toBe('03/01/2020');
  });

  it.each([
    { controlName: 'dateFrom', value: '2020-01-01', message: 'Date from must be in the format DD/MM/YYYY' },
    { controlName: 'dateTo', value: '31/02/2020', message: 'Date to must be a real date' },
    { controlName: 'dateFrom', value: '01/01/2999', message: 'Date from must be in the past' },
    { controlName: 'dateTo', value: '01/01/2999', message: 'Date to must be in the past' },
  ] as const)('rejects $controlName "$value"', ({ controlName, value, message }) => {
    const submit = vi.spyOn(component['formSubmit'], 'emit');
    component.filtersForm.controls.dateFilter.setValue('dateRange');
    component.filtersForm.controls[controlName].setValue(value);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(submit).not.toHaveBeenCalled();
    expect(
      component.dateFilterErrors[`custom-file-interface-viewer-date-${controlName === 'dateFrom' ? 'from' : 'to'}`],
    ).toBe(message);
    expect(fixture.nativeElement.querySelector('.govuk-error-summary').textContent).toContain(message);
  });

  it('requires at least one date-range boundary and focuses the rendered summary', () => {
    component.filtersForm.controls.dateFilter.setValue('dateRange');
    fixture.detectChanges();
    vi.useFakeTimers({ toFake: ['setTimeout'] });
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    const summary = fixture.nativeElement.querySelector('.govuk-error-summary') as HTMLElement;

    vi.runOnlyPendingTimers();

    expect(component.formErrorSummaryMessage).toEqual([
      {
        fieldId: 'dateFrom',
        message: 'You must enter at least 1 of date from or date to',
      },
    ]);
    expect(document.activeElement).toBe(summary);
  });

  it('tolerates an invalid submit before the summary view exists', () => {
    vi.useFakeTimers({ toFake: ['setTimeout'] });
    component.filtersForm.controls.dateFilter.setValue('dateRange');

    component.handleFormSubmit(new SubmitEvent('submit'));

    expect(() => vi.runOnlyPendingTimers()).not.toThrow();
    expect(component.dateFilterErrors['custom-file-interface-viewer-date-from']).toBe(
      'You must enter at least 1 of date from or date to',
    );
  });

  it('tolerates validation while the summary view is updating', () => {
    component.filtersForm.controls.dateFilter.setValue('dateRange');
    fixture.detectChanges();
    vi.useFakeTimers({ toFake: ['setTimeout'] });

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(() => vi.runOnlyPendingTimers()).not.toThrow();
    expect(component.formErrorSummaryMessage).toEqual([
      {
        fieldId: 'dateFrom',
        message: 'You must enter at least 1 of date from or date to',
      },
    ]);
  });

  it('rejects a date from after date to with a standard from-date control error', () => {
    const submit = vi.spyOn(component['formSubmit'], 'emit');
    component.filtersForm.patchValue({ dateFilter: 'dateRange', dateFrom: '03/01/2020', dateTo: '01/01/2020' });
    fixture.detectChanges();
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(component.filtersForm.invalid).toBe(true);
    expect(component.filtersForm.controls.dateFrom.errors).toEqual({ dateFromAfterDateTo: true });
    expect(submit).not.toHaveBeenCalled();
    expect(component.dateFilterErrors['custom-file-interface-viewer-date-from']).toBe(
      'The Date from cannot be after the Date to',
    );
  });

  it.each([
    { dateFrom: '01/01/2020', dateTo: '' },
    { dateFrom: '', dateTo: '03/01/2020' },
    { dateFrom: '01/01/2020', dateTo: '03/01/2020' },
    { dateFrom: '01/01/2020', dateTo: '01/01/2020' },
  ])('submits the permitted date range $dateFrom to $dateTo', ({ dateFrom, dateTo }) => {
    const submit = vi.spyOn(component['formSubmit'], 'emit');
    component.filtersForm.patchValue({ dateFilter: 'dateRange', dateFrom, dateTo });
    fixture.detectChanges();
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(submit).toHaveBeenCalledExactlyOnceWith({
      formData: expect.objectContaining({ dateFilter: 'dateRange', dateFrom, dateTo }),
      nestedFlow: false,
    });
    expect(component.formErrorSummaryMessage).toEqual([]);
  });

  it('does not report a reversed range when the date difference cannot be calculated', () => {
    component.filtersForm.patchValue({ dateFilter: 'dateRange', dateFrom: '01/01/2020', dateTo: '03/01/2020' });
    vi.spyOn(TestBed.inject(DateService), 'calculateDaysBetweenDates').mockReturnValue(Number.NaN);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(component.formErrorSummaryMessage).toEqual([]);
    expect(component.dateFilterErrors['custom-file-interface-viewer-date-from']).toBe('');
  });

  it.each([
    { dateFrom: '', dateTo: '', error: { required: true } },
    { dateFrom: '03/01/2020', dateTo: '01/01/2020', error: { dateFromAfterDateTo: true } },
  ])('clears a date-range error after correcting the to-date: $error', ({ dateFrom, dateTo, error }) => {
    const submit = vi.spyOn(component['formSubmit'], 'emit');
    component.filtersForm.patchValue({ dateFilter: 'dateRange', dateFrom, dateTo });
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(component.filtersForm.invalid).toBe(true);
    expect(component.filtersForm.controls.dateFrom.errors).toEqual(error);
    expect(submit).not.toHaveBeenCalled();

    component.filtersForm.controls.dateTo.setValue('04/01/2020');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(component.filtersForm.valid).toBe(true);
    expect(component.filtersForm.controls.dateFrom.errors).toBeNull();
    expect(component.formErrorSummaryMessage).toEqual([]);
    expect(component.dateFilterErrors).toEqual({
      'custom-file-interface-viewer-days': '',
      'custom-file-interface-viewer-date-from': '',
      'custom-file-interface-viewer-date-to': '',
    });
    expect(submit).toHaveBeenCalledExactlyOnceWith({
      formData: expect.objectContaining({ dateFilter: 'dateRange', dateFrom, dateTo: '04/01/2020' }),
      nestedFlow: false,
    });
  });

  it.each(['last7Days', 'customDays'] as const)(
    'clears a previous date-range control error when switching to %s',
    (dateFilter) => {
      const submit = vi.spyOn(component['formSubmit'], 'emit');
      component.filtersForm.patchValue({ dateFilter: 'dateRange', dateFrom: '03/01/2020', dateTo: '01/01/2020' });
      fixture.detectChanges();
      const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      expect(component.filtersForm.controls.dateFrom.errors).toEqual({ dateFromAfterDateTo: true });
      expect(submit).not.toHaveBeenCalled();

      component.filtersForm.controls.dateFilter.setValue(dateFilter);
      if (dateFilter === 'customDays') {
        component.filtersForm.controls.days.setValue('14');
      }

      expect(component.filtersForm.controls.dateFrom.value).toBe('');
      expect(component.filtersForm.controls.dateTo.value).toBe('');
      expect(component.filtersForm.controls.dateFrom.errors).toBeNull();
      expect(component.filtersForm.valid).toBe(true);

      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      expect(component.formErrorSummaryMessage).toEqual([]);
      expect(submit).toHaveBeenCalledExactlyOnceWith({
        formData: expect.objectContaining({ dateFilter, dateFrom: '', dateTo: '' }),
        nestedFlow: false,
      });
    },
  );

  it.each([
    {
      dateFilter: 'customDays',
      controlName: 'days',
      value: '0',
      fieldId: 'custom-file-interface-viewer-days',
      message: 'Days must be greater than zero',
    },
    {
      dateFilter: 'dateRange',
      controlName: 'dateFrom',
      value: '2020-01-01',
      fieldId: 'custom-file-interface-viewer-date-from',
      message: 'Date from must be in the format DD/MM/YYYY',
    },
    {
      dateFilter: 'dateRange',
      controlName: 'dateTo',
      value: '2020-01-01',
      fieldId: 'custom-file-interface-viewer-date-to',
      message: 'Date to must be in the format DD/MM/YYYY',
    },
  ] as const)(
    'focuses $fieldId when its rendered summary link is clicked',
    ({ dateFilter, controlName, value, fieldId, message }) => {
      component.filtersForm.controls.dateFilter.setValue(dateFilter);
      component.filtersForm.controls[controlName].setValue(value);
      fixture.detectChanges();
      vi.useFakeTimers({ toFake: ['setTimeout'] });
      fixture.nativeElement
        .querySelector('form')
        .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      fixture.detectChanges();
      vi.runOnlyPendingTimers();
      const input = fixture.nativeElement.querySelector(`#${fieldId}`) as HTMLInputElement;
      const label = fixture.nativeElement.querySelector(`label[for="${fieldId}"]`) as HTMLLabelElement;
      label.scrollIntoView = vi.fn();
      const summaryLink = fixture.nativeElement.querySelector('.govuk-error-summary__list a') as HTMLAnchorElement;

      expect(component.formErrorSummaryMessage).toEqual([{ fieldId: controlName, message }]);
      expect(summaryLink.textContent).toContain(message);
      expect(component.dateFilterErrors[fieldId]).toBe(message);
      summaryLink.click();

      expect(label.scrollIntoView).toHaveBeenCalledExactlyOnceWith({ behavior: 'smooth' });
      expect(document.activeElement).toBe(input);
    },
  );

  it('detaches date validation and inactive-field clearing when destroyed', () => {
    fixture.detectChanges();
    fixture.destroy();
    const { dateFilter, days, dateFrom } = component.filtersForm.controls;
    days.setValue('14');
    dateFrom.setValue('01/01/2020');

    dateFilter.setValue('dateRange');
    expect(days.value).toBe('14');
    dateFilter.setValue('customDays');
    days.setValue('');

    expect(days.errors).toBeNull();
    expect(dateFrom.value).toBe('01/01/2020');
  });

  it('forwards summary navigation to the inherited field-focus handler', () => {
    const scrollTo = vi.spyOn(component, 'scrollTo').mockImplementation(() => undefined);
    fixture.detectChanges();
    fixture.debugElement.query(By.directive(GovukErrorSummaryComponent)).triggerEventHandler('errorClick', 'dateFrom');

    expect(scrollTo).toHaveBeenCalledExactlyOnceWith('custom-file-interface-viewer-date-from');
  });

  it('returns no field error before validation initializes the messages', () => {
    expect(component.dateFilterErrors['custom-file-interface-viewer-days']).toBeUndefined();
  });
});
