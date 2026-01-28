import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternalServerErrorComponent } from './internal-server-error.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

describe('InternalServerErrorComponent', () => {
  let component: InternalServerErrorComponent;
  let fixture: ComponentFixture<InternalServerErrorComponent>;
  let navigationState: { operationId?: string } | undefined;
  let persistedState: { operationId?: string } | undefined;

  beforeEach(async () => {
    navigationState = { operationId: 'OP-500' };
    persistedState = {};
    await TestBed.configureTestingModule({
      imports: [InternalServerErrorComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            currentNavigation: () => (navigationState ? ({ extras: { state: navigationState } } as any) : null),
          },
        },
        {
          provide: Location,
          useValue: {
            getState: () => persistedState,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InternalServerErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an operation id from navigation state when provided', () => {
    const errorCodeElement = fixture.nativeElement.querySelector('[data-testid="error-code"]');
    expect(errorCodeElement.textContent.trim()).toBe('Error code: OP-500.');
  });

  it('should fall back to persisted state when navigation state is unavailable', () => {
    navigationState = undefined;
    persistedState = { operationId: 'PERSISTED-123' };
    fixture = TestBed.createComponent(InternalServerErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const errorCodeElement = fixture.nativeElement.querySelector('[data-testid="error-code"]');
    expect(errorCodeElement.textContent.trim()).toBe('Error code: PERSISTED-123.');
  });

  it('should show a fallback when no operation id is provided', () => {
    navigationState = undefined;
    persistedState = {};
    fixture = TestBed.createComponent(InternalServerErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const errorCodeElement = fixture.nativeElement.querySelector('[data-testid="error-code"]');
    expect(errorCodeElement.textContent.trim()).toBe('Error code: Unavailable.');
  });
});
