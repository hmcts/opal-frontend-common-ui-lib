import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { IMojMultiFileUploadItem } from '@hmcts/opal-frontend-common/components/moj/moj-multi-file-upload/interfaces';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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
  const buttons = (): HTMLButtonElement[] => Array.from(fixture.nativeElement.querySelectorAll('button'));
  const progressbar = (): HTMLElement | null => fixture.nativeElement.querySelector('[role="progressbar"]');

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MojMultiFileUploadFilesComponent] }).compileComponents();
    fixture = TestBed.createComponent(MojMultiFileUploadFilesComponent);
  });

  it('keeps the native feedback structure hidden until the parent supplies files', () => {
    fixture.detectChanges();
    const feedback: HTMLElement = fixture.nativeElement.querySelector('.moj-multi-file__uploaded-files');
    const list: HTMLElement = feedback.querySelector('.moj-multi-file-upload__list')!;

    expect(feedback.classList.contains('moj-hidden')).toBe(true);
    expect(feedback.querySelector('h2')?.textContent).toBe('Files added');
    expect(list.children).toHaveLength(0);
    expect(rows()).toHaveLength(0);

    renderFiles([file()]);

    expect(fixture.nativeElement.querySelector('.moj-multi-file__uploaded-files')).toBe(feedback);
    expect(feedback.querySelector('.moj-multi-file-upload__list')).toBe(list);
    expect(feedback.classList.contains('moj-hidden')).toBe(false);
    expect(rows()).toHaveLength(1);
  });

  it('renders filenames and statuses together in native MoJ single-value rows', () => {
    renderFiles([file(), file({ id: 'second-document', name: 'second.csv' })]);

    expect(text()).toContain('Files added');
    expect(rows()).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('.moj-multi-file-upload__list').tagName).toBe('DIV');
    expect(fixture.nativeElement.querySelector('dt, dd, .govuk-summary-list__key')).toBeNull();
    expect(rows()[0].querySelector('.moj-multi-file-upload__message')?.textContent).toContain('first.csv');
    expect(rows()[0].querySelector('.moj-multi-file-upload__message')?.textContent).toContain('Waiting to upload');
    expect(rows()[0].querySelector('.moj-multi-file-upload__actions')?.tagName).toBe('DIV');
    expect(rows()[0].querySelector('.moj-multi-file-upload__filename')?.textContent).toBe('first.csv');
    expect(rows()[1].querySelector('.moj-multi-file-upload__filename')?.textContent).toBe('second.csv');
    expect(rows().every((row) => row.textContent?.includes('Waiting to upload'))).toBe(true);
    expect(progressbar()).toBeNull();
  });

  it.each([0, 37])('displays parent-supplied %s%% progress with accessible percentage semantics', (progress) => {
    renderFiles([file({ status: 'uploading', progress })]);

    expect(text()).toContain(`Uploading ${progress}%`);
    expect(progressbar()?.classList.contains('moj-multi-file-upload__progress')).toBe(true);
    expect(progressbar()?.getAttribute('aria-label')).toBe('first.csv');
    expect(progressbar()?.getAttribute('aria-valuemin')).toBe('0');
    expect(progressbar()?.getAttribute('aria-valuemax')).toBe('100');
    expect(progressbar()?.getAttribute('aria-valuenow')).toBe(String(progress));
    expect(progressbar()?.getAttribute('aria-valuetext')).toBe(`Uploading ${progress}%`);
  });

  it.each([undefined, null])('omits percentages and aria-valuenow when progress is %s', (progress) => {
    renderFiles([file({ status: 'uploading', progress })]);

    expect(text()).toContain('Uploading');
    expect(text()).not.toContain('%');
    expect(progressbar()).not.toBeNull();
    expect(progressbar()?.hasAttribute('aria-valuenow')).toBe(false);
    expect(progressbar()?.getAttribute('aria-valuetext')).toBe('Uploading');
  });

  it('keeps 100% uploading until the parent explicitly supplies a successful status', () => {
    renderFiles([file({ status: 'uploading', progress: 100 })]);

    expect(text()).toContain('Uploading 100%');
    expect(fixture.nativeElement.querySelector('.moj-multi-file-upload__success')).toBeNull();
    expect(rows()[0].querySelector('svg')).toBeNull();

    renderFiles([file({ status: 'success', progress: 100 })]);

    expect(text()).toContain('Uploaded');
    expect(progressbar()).toBeNull();
    expect(fixture.nativeElement.querySelector('.moj-multi-file-upload__success')).not.toBeNull();
    const success = rows()[0].querySelector('.moj-multi-file-upload__success');
    expect(success?.querySelector('.moj-multi-file-upload__filename')?.textContent).toBe('first.csv');
    expect(success?.textContent).toContain('Uploaded');
    expect(success?.querySelector('svg')?.classList.contains('moj-banner__icon')).toBe(true);
    expect(success?.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 25 25');
    expect(success?.querySelector('svg')?.getAttribute('role')).toBe('presentation');
    expect(success?.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('displays independent mixed outcomes, warning icons and the parent supplied errors', () => {
    renderFiles([
      file({ status: 'success' }),
      file({ id: 'rejected', name: 'invalid.txt', status: 'rejected', errors: ['Choose a CSV file'] }),
      file({ id: 'failed', name: 'failed.csv', status: 'failed', errors: ['The server rejected this document'] }),
      file({ id: 'active', name: 'active.csv', status: 'uploading', progress: 50 }),
    ]);

    expect(rows()).toHaveLength(4);
    expect(text()).toContain('Uploaded');
    expect(text()).toContain('File rejected');
    expect(text()).toContain('Choose a CSV file');
    expect(text()).toContain('Upload failed');
    expect(text()).toContain('The server rejected this document');
    expect(text()).toContain('Uploading 50%');
    expect(fixture.nativeElement.querySelectorAll('.moj-multi-file-upload__error')).toHaveLength(2);
    expect(rows()[1].querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    expect(rows()[2].querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('does not generate validation or fallback error messages', () => {
    renderFiles([file({ status: 'failed' }), file({ id: 'rejected', status: 'rejected', errors: [] })]);

    expect(text()).toContain('Upload failed');
    expect(text()).toContain('File rejected');
    expect(fixture.nativeElement.querySelectorAll('.govuk-error-message')).toHaveLength(0);
  });

  it('supports configurable heading, status labels and action text', () => {
    fixture.componentRef.setInput('heading', 'Documents ready');
    fixture.componentRef.setInput('removeButtonText', 'Delete');
    fixture.componentRef.setInput('statusLabels', { pending: 'Selected', uploading: 'Sending', success: 'Received' });
    renderFiles([
      file(),
      file({ id: 'uploading', status: 'uploading', progress: 20 }),
      file({ id: 'success', status: 'success' }),
      file({ id: 'failed', status: 'failed' }),
    ]);

    expect(text()).toContain('Documents ready');
    expect(text()).toContain('Selected');
    expect(text()).toContain('Sending 20%');
    expect(text()).toContain('Received');
    expect(text()).toContain('Upload failed');
    expect(buttons()[0].textContent).toContain('Delete');
    expect(buttons()[0].textContent).toContain('first.csv');
    expect(buttons()[0].type).toBe('button');
    expect(buttons()[0].name).toBe('delete');
    expect(buttons()[0].value).toBe('first-document');
    expect(buttons()[0].classList.contains('moj-multi-file-upload__delete')).toBe(true);
  });

  it('emits a removal intent without changing the supplied files or their state', () => {
    const supplied = Object.freeze([Object.freeze(file({ status: 'uploading', progress: 45 }))]);
    const removed = vi.fn();
    fixture.componentInstance.removeFile.subscribe(removed);
    renderFiles(supplied);

    buttons()[0].click();
    fixture.detectChanges();

    expect(removed).toHaveBeenCalledExactlyOnceWith('first-document');
    expect(fixture.componentInstance.files).toBe(supplied);
    expect(rows()).toHaveLength(1);
    expect(text()).toContain('Uploading 45%');

    renderFiles([]);

    expect(rows()).toHaveLength(0);
    expect(
      fixture.nativeElement.querySelector('.moj-multi-file__uploaded-files').classList.contains('moj-hidden'),
    ).toBe(true);
    expect(fixture.nativeElement.querySelector('h2')?.textContent).toBe('Files added');
  });

  it('disables removal without changing the supplied status or progress', () => {
    const removed = vi.fn();
    fixture.componentInstance.removeFile.subscribe(removed);
    fixture.componentRef.setInput('disabled', true);
    renderFiles([file({ status: 'uploading', progress: 75 })]);

    buttons()[0].click();

    expect(buttons()[0].disabled).toBe(true);
    expect(removed).not.toHaveBeenCalled();
    expect(text()).toContain('Uploading 75%');
  });

  it('can hide removal actions while preserving feedback', () => {
    fixture.componentRef.setInput('showRemoveButton', false);
    renderFiles([file({ status: 'success' })]);

    expect(buttons()).toHaveLength(0);
    expect(fixture.nativeElement.querySelector('.govuk-summary-list__actions')).toBeNull();
    expect(text()).toContain('first.csv');
    expect(text()).toContain('Uploaded');
  });
});
