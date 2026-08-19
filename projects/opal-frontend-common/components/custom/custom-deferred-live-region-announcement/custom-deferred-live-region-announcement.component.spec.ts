import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CustomDeferredLiveRegionAnnouncement } from './custom-deferred-live-region-announcement.component';

describe('CustomDeferredLiveRegionAnnouncement', () => {
  let fixture: ComponentFixture<CustomDeferredLiveRegionAnnouncement>;

  const ANNOUNCEMENT_DELAY_MS = 100;
  const MESSAGE = 'No results found';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDeferredLiveRegionAnnouncement],
    }).compileComponents();

    vi.useFakeTimers();

    fixture = TestBed.createComponent(CustomDeferredLiveRegionAnnouncement);
  });

  afterEach(() => {
    fixture?.destroy();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  const initialiseComponent = (message = MESSAGE): void => {
    fixture.componentRef.setInput('message', message);
    fixture.detectChanges();
  };

  const getOutput = (): HTMLOutputElement => fixture.nativeElement.querySelector('output');

  it('should create', () => {
    initialiseComponent();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should initially render an empty output', () => {
    initialiseComponent();

    expect(getOutput().textContent?.trim()).toBe('');
  });

  it('should default role to status', () => {
    initialiseComponent();

    expect(getOutput().getAttribute('role')).toBe('status');
  });

  it('should accept role alert', () => {
    fixture.componentRef.setInput('message', MESSAGE);
    fixture.componentRef.setInput('role', 'alert');

    fixture.detectChanges();

    expect(getOutput().getAttribute('role')).toBe('alert');
  });

  it('should remain empty before the announcement delay', async () => {
    initialiseComponent();

    await vi.advanceTimersByTimeAsync(ANNOUNCEMENT_DELAY_MS - 1);
    fixture.detectChanges();

    expect(getOutput().textContent?.trim()).toBe('');
  });

  it('should populate the message after the announcement delay', async () => {
    initialiseComponent();

    await vi.advanceTimersByTimeAsync(ANNOUNCEMENT_DELAY_MS);
    fixture.detectChanges();

    expect(getOutput().textContent?.trim()).toBe(MESSAGE);
  });

  it('should not schedule an announcement for an empty message', () => {
    initialiseComponent('');

    expect(getOutput().textContent?.trim()).toBe('');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('should clear a pending announcement when destroyed', () => {
    initialiseComponent();

    expect(vi.getTimerCount()).toBeGreaterThan(0);

    fixture.destroy();

    expect(vi.getTimerCount()).toBe(0);
  });

  it('should announce a message that changes after initial render', async () => {
    initialiseComponent(MESSAGE);

    await vi.advanceTimersByTimeAsync(ANNOUNCEMENT_DELAY_MS);
    fixture.detectChanges();

    expect(getOutput().textContent?.trim()).toBe(MESSAGE);

    const updatedMessage = 'Results found';
    fixture.componentRef.setInput('message', updatedMessage);
    fixture.detectChanges();

    expect(getOutput().textContent?.trim()).toBe('');

    await vi.advanceTimersByTimeAsync(ANNOUNCEMENT_DELAY_MS);
    fixture.detectChanges();

    expect(getOutput().textContent?.trim()).toBe(updatedMessage);
  });

  it('should cancel a pending announcement when the message changes', async () => {
    initialiseComponent(MESSAGE);

    await vi.advanceTimersByTimeAsync(ANNOUNCEMENT_DELAY_MS - 1);

    const updatedMessage = 'Results found';
    fixture.componentRef.setInput('message', updatedMessage);
    fixture.detectChanges();

    await vi.advanceTimersByTimeAsync(1);
    fixture.detectChanges();

    expect(getOutput().textContent?.trim()).toBe('');

    await vi.advanceTimersByTimeAsync(ANNOUNCEMENT_DELAY_MS - 1);
    fixture.detectChanges();

    expect(getOutput().textContent?.trim()).toBe(updatedMessage);
  });

  it('should only announce the latest message when the message changes rapidly', async () => {
    initialiseComponent('First message');

    fixture.componentRef.setInput('message', 'Second message');
    fixture.detectChanges();

    fixture.componentRef.setInput('message', 'Third message');
    fixture.detectChanges();

    await vi.advanceTimersByTimeAsync(ANNOUNCEMENT_DELAY_MS);
    fixture.detectChanges();

    expect(getOutput().textContent?.trim()).toBe('Third message');
  });

  it('should clear the announcement when the message changes to empty', async () => {
    initialiseComponent();

    await vi.advanceTimersByTimeAsync(ANNOUNCEMENT_DELAY_MS);
    fixture.detectChanges();

    expect(getOutput().textContent?.trim()).toBe(MESSAGE);

    fixture.componentRef.setInput('message', '');
    fixture.detectChanges();

    expect(getOutput().textContent?.trim()).toBe('');
    expect(vi.getTimerCount()).toBe(0);
  });
});
