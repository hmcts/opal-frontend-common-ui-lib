import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MojMultiFileUploadComponent } from './moj-multi-file-upload.component';

@Component({
  selector: 'opal-lib-multi-file-upload-test-host',
  imports: [MojMultiFileUploadComponent],
  template: `
    <opal-lib-moj-multi-file-upload>
      <h2>Supporting documents</h2>
      <p>Choose the documents for this application.</p>
      <button type="button" (click)="numberOfActions = numberOfActions + 1">Consumer action</button>
    </opal-lib-moj-multi-file-upload>
  `,
})
class MultiFileUploadTestHostComponent {
  public numberOfActions = 0;
}

describe('MojMultiFileUploadComponent composition', () => {
  let fixture: ComponentFixture<MultiFileUploadTestHostComponent>;
  let host: MultiFileUploadTestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MultiFileUploadTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(MultiFileUploadTestHostComponent);
    host = fixture.componentInstance;
  });

  it('projects consumer content and keeps its interactions owned by the consumer', () => {
    fixture.detectChanges();
    const wrapper: HTMLElement = fixture.nativeElement.querySelector('.moj-multi-file-upload');

    expect(wrapper.getAttribute('data-module')).toBe('moj-multi-file-upload');
    expect(wrapper.classList.contains('moj-multi-file-upload--enhanced')).toBe(true);
    expect(wrapper.querySelector('h2')?.textContent).toBe('Supporting documents');
    expect(wrapper.querySelector('p')?.textContent).toBe('Choose the documents for this application.');
    wrapper.querySelector('button')!.click();

    expect(host.numberOfActions).toBe(1);
    expect(wrapper.querySelector('input[type="file"]')).toBeNull();
  });
});
