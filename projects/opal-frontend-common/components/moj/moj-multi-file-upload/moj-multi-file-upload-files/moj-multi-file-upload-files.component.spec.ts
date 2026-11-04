import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { IMojMultiFileUploadItem } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/interfaces';
import { beforeEach, describe, expect, it } from 'vitest';
import { MojMultiFileUploadFilesComponent } from './moj-multi-file-upload-files.component';

describe('MojMultiFileUploadFilesComponent', () => {
  let fixture: ComponentFixture<MojMultiFileUploadFilesComponent>;

  const file = (overrides: Partial<IMojMultiFileUploadItem> = {}): IMojMultiFileUploadItem => ({
    id: 'first-document',
    name: 'first.csv',
    status: 'pending',
    ...overrides,
  });
  const renderFiles = (files: readonly IMojMultiFileUploadItem[]): void => {
    fixture.componentRef.setInput('files', files);
    fixture.detectChanges();
  };
  const text = (): string => fixture.nativeElement.textContent;
  const rows = (): HTMLElement[] => Array.from(fixture.nativeElement.querySelectorAll('.moj-multi-file-upload__row'));
  const progressbar = (): HTMLElement | null => fixture.nativeElement.querySelector('[role="progressbar"]');
  const assertWarningIcon = (row: HTMLElement, label: string): void => {
    const filename: HTMLElement = row.querySelector('.moj-multi-file-upload__filename')!;
    const warning: SVGElement = row.querySelector('svg')!;

    expect(warning).not.toBeNull();
    expect(filename.previousElementSibling).toBe(warning);
    expect(warning.classList.contains('moj-multi-file-upload__error')).toBe(true);
    expect(warning.getAttribute('role')).toBe('img');
    expect(warning.getAttribute('aria-label')).toBe(label);
    expect(warning.getAttribute('viewBox')).toBe('0 0 25 25');
    expect(warning.contains(filename)).toBe(false);
    expect(filename.classList.contains('govuk-body')).toBe(true);
    expect(filename.closest('.moj-multi-file-upload__error, .govuk-error-message')).toBeNull();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MojMultiFileUploadFilesComponent] }).compileComponents();
    fixture = TestBed.createComponent(MojMultiFileUploadFilesComponent);
  });

  it('leaves empty-state content to the consumer and renders feedback only when files are supplied', () => {
    fixture.detectChanges();

    expect(text().trim()).toBe('');
    expect(rows()).toHaveLength(0);
    expect(fixture.nativeElement.querySelector('h2, p, hr')).toBeNull();
    expect(fixture.nativeElement.querySelector('.moj-multi-file__uploaded-files')).toBeNull();

    renderFiles([file()]);

    expect(fixture.nativeElement.querySelector('h2')?.textContent).toBe('Files added');
    expect(rows()).toHaveLength(1);
    expect(rows()[0].querySelector('.moj-multi-file-upload__filename')?.textContent).toBe('first.csv');

    renderFiles([]);

    expect(text().trim()).toBe('');
    expect(rows()).toHaveLength(0);
    expect(fixture.nativeElement.querySelector('h2, p, hr')).toBeNull();

    renderFiles([file({ status: 'success' })]);

    expect(rows()).toHaveLength(1);
    expect(rows()[0].querySelector('.moj-multi-file-upload__filename')?.textContent).toBe('first.csv');
    expect(rows()[0].querySelector('svg')).not.toBeNull();
  });

  it('renders regular GOV.UK filenames without per-file actions', () => {
    renderFiles([file(), file({ id: 'second-document', name: 'second.csv' })]);

    expect(rows()).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('.moj-multi-file-upload__list').tagName).toBe('DIV');
    expect(fixture.nativeElement.querySelector('dt, dd, .govuk-summary-list__key')).toBeNull();
    expect(fixture.nativeElement.querySelector('button, a, .govuk-summary-list__actions')).toBeNull();
    expect(rows()[0].querySelector('.moj-multi-file-upload__filename')?.textContent).toBe('first.csv');
    expect(rows()[1].querySelector('.moj-multi-file-upload__filename')?.textContent).toBe('second.csv');
    for (const row of rows()) {
      const filename = row.querySelector('.moj-multi-file-upload__filename')!;
      expect(filename.classList.contains('govuk-body')).toBe(true);
      expect(filename.closest('.moj-multi-file-upload__success, .moj-multi-file-upload__error')).toBeNull();
      expect(row.querySelector('.govuk-visually-hidden')?.textContent).toBe('Waiting to upload');
      expect(row.querySelector('svg')).toBeNull();
    }
    expect(progressbar()).toBeNull();
  });

  it.each([0, 37, 100])('places %s%% after the filename with accessible progress semantics', (progress) => {
    renderFiles([file({ status: 'uploading', progress })]);
    const filename: HTMLElement = rows()[0].querySelector('.moj-multi-file-upload__filename')!;

    expect(progressbar()?.textContent?.trim()).toBe(`${progress}%`);
    expect(filename.nextElementSibling).toBe(progressbar());
    expect(progressbar()?.classList.contains('moj-multi-file-upload__progress')).toBe(true);
    expect(progressbar()?.getAttribute('aria-label')).toBe('first.csv');
    expect(progressbar()?.getAttribute('aria-valuemin')).toBe('0');
    expect(progressbar()?.getAttribute('aria-valuemax')).toBe('100');
    expect(progressbar()?.getAttribute('aria-valuenow')).toBe(String(progress));
    expect(progressbar()?.getAttribute('aria-valuetext')).toBe(`Uploading ${progress}%`);
    expect(rows()[0].querySelector('svg')).toBeNull();
  });

  it.each([undefined, null])('keeps unknown progress indeterminate when progress is %s', (progress) => {
    renderFiles([file({ status: 'uploading', progress })]);

    expect(progressbar()?.textContent?.trim()).toBe('Uploading');
    expect(text()).not.toContain('%');
    expect(progressbar()?.hasAttribute('aria-valuenow')).toBe(false);
    expect(progressbar()?.getAttribute('aria-valuetext')).toBe('Uploading');
    expect(rows()[0].querySelector('svg')).toBeNull();
  });

  it('shows only a separate accessible green tick to the left of a successful filename', () => {
    renderFiles([file({ status: 'success', progress: 100 })]);
    const filename: HTMLElement = rows()[0].querySelector('.moj-multi-file-upload__filename')!;
    const success: SVGElement = rows()[0].querySelector('svg')!;

    expect(filename.previousElementSibling).toBe(success);
    expect(success.classList.contains('moj-multi-file-upload__success')).toBe(true);
    expect(success.getAttribute('role')).toBe('img');
    expect(success.getAttribute('aria-label')).toBe('Uploaded');
    expect(success.getAttribute('viewBox')).toBe('0 0 25 25');
    expect(success.contains(filename)).toBe(false);
    expect(filename.closest('.moj-multi-file-upload__success')).toBeNull();
    expect(rows()[0].textContent?.trim()).toBe('first.csv');
    expect(progressbar()).toBeNull();
    expect(fixture.nativeElement.querySelector('.moj-multi-file-upload__status')).toBeNull();
  });

  it('shows supplied red errors above regular filenames for independent failed and rejected rows', () => {
    renderFiles([
      file({ status: 'success' }),
      file({
        id: 'rejected',
        name: 'invalid.txt',
        status: 'rejected',
        errors: ['Choose a CSV file', 'The filename is invalid'],
      }),
      file({ id: 'failed', name: 'failed.csv', status: 'failed', errors: ['The server rejected this document'] }),
      file({ id: 'active', name: 'active.csv', status: 'uploading', progress: 50 }),
    ]);

    expect(rows()).toHaveLength(4);
    const rejectedMessage = rows()[1].querySelector('.moj-multi-file-upload__message')!;
    const failedMessage = rows()[2].querySelector('.moj-multi-file-upload__message')!;
    expect(
      Array.from(rejectedMessage.querySelectorAll('.govuk-error-message')).map((error) => error.textContent?.trim()),
    ).toEqual(['Error: Choose a CSV file', 'Error: The filename is invalid']);
    expect(failedMessage.firstElementChild?.textContent?.trim()).toBe('Error: The server rejected this document');
    expect(rejectedMessage.lastElementChild?.textContent).toBe('invalid.txt');
    expect(failedMessage.lastElementChild?.textContent).toBe('failed.csv');
    expect(rows()[1].querySelector('.moj-multi-file-upload__filename')?.closest('.govuk-error-message')).toBeNull();
    expect(rows()[2].querySelector('.moj-multi-file-upload__filename')?.closest('.govuk-error-message')).toBeNull();
    assertWarningIcon(rows()[1], 'File rejected');
    assertWarningIcon(rows()[2], 'Upload failed');
    expect(progressbar()?.textContent?.trim()).toBe('50%');
  });

  it('describes explicit failed or rejected states above their filenames when no detailed errors are supplied', () => {
    renderFiles([file({ status: 'failed' }), file({ id: 'rejected', status: 'rejected', errors: [] })]);

    expect(rows()[0].querySelector('.govuk-error-message')?.textContent).toContain('Upload failed');
    expect(rows()[1].querySelector('.govuk-error-message')?.textContent).toContain('File rejected');
    assertWarningIcon(rows()[0], 'Upload failed');
    assertWarningIcon(rows()[1], 'File rejected');
    expect(
      rows().every((row) => row.querySelector('.moj-multi-file-upload__filename')?.textContent === 'first.csv'),
    ).toBe(true);
  });

  it('uses configurable headings and accessible status labels for success, errors and progress', () => {
    fixture.componentRef.setInput('heading', 'Documents received');
    fixture.componentRef.setInput('statusLabels', {
      success: 'Received',
      uploading: 'Sending',
      failed: 'Not received',
      rejected: 'Not accepted',
    });
    renderFiles([
      file({ status: 'success' }),
      file({ id: 'active', status: 'uploading', progress: 25 }),
      file({ id: 'failed', status: 'failed' }),
      file({ id: 'rejected', status: 'rejected' }),
    ]);

    expect(fixture.nativeElement.querySelector('h2')?.textContent).toBe('Documents received');
    expect(rows()[0].querySelector('svg')?.getAttribute('aria-label')).toBe('Received');
    expect(rows()[0].textContent?.trim()).toBe('first.csv');
    expect(progressbar()?.getAttribute('aria-valuetext')).toBe('Sending 25%');
    expect(progressbar()?.textContent?.trim()).toBe('25%');
    expect(rows()[2].querySelector('.govuk-error-message')?.textContent).toContain('Not received');
    expect(rows()[3].querySelector('.govuk-error-message')?.textContent).toContain('Not accepted');
    assertWarningIcon(rows()[2], 'Not received');
    assertWarningIcon(rows()[3], 'Not accepted');
  });

  it('does not change parent-owned file records when presenting their progress', () => {
    const supplied = Object.freeze([Object.freeze(file({ status: 'uploading', progress: 45 }))]);
    renderFiles(supplied);

    expect(fixture.componentInstance.files).toBe(supplied);
    expect(supplied[0]).toEqual(file({ status: 'uploading', progress: 45 }));
    expect(progressbar()?.textContent?.trim()).toBe('45%');
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });
});
