import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojInsetTextComponent } from './moj-inset-text.component';
import { Component } from '@angular/core';
import { describe, beforeEach, it, expect } from 'vitest';

@Component({
  selector: 'opal-lib-moj-inset-text-host',
  standalone: true,
  imports: [MojInsetTextComponent],
  template: `
    <opal-lib-moj-inset-text [id]="id" [classes]="classes">
      <span class="projected-content">{{ projectedText }}</span>
    </opal-lib-moj-inset-text>
  `,
})
class TestHostComponent {
  public id = 'reports-highlight';
  public classes: string | null = 'govuk-lighter-blue-background-colour';
  public projectedText = 'Projected content';
}

describe('MojInsetText', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render inset text with the id suffix', () => {
    const insetElement = fixture.nativeElement.querySelector('#reports-highlight_inset_text');
    expect(insetElement).toBeTruthy();
  });

  it('should always include the base inset class', () => {
    const insetElement = fixture.nativeElement.querySelector('#reports-highlight_inset_text');
    expect(insetElement.classList.contains('govuk-inset-text')).toBe(true);
  });

  it('should apply additional classes when provided', () => {
    const insetElement = fixture.nativeElement.querySelector('#reports-highlight_inset_text');
    expect(insetElement.classList.contains('govuk-lighter-blue-background-colour')).toBe(true);
  });

  it('should project inner content', () => {
    const projectedElement = fixture.nativeElement.querySelector('.projected-content');
    expect(projectedElement.textContent?.trim()).toBe('Projected content');
  });
});
