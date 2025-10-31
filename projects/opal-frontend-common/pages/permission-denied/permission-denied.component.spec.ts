import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermissionDeniedComponent } from './permission-denied.component';

describe('PermissionDeniedComponent', () => {
  let component: PermissionDeniedComponent;
  let fixture: ComponentFixture<PermissionDeniedComponent>;
  let referrerSpy: jasmine.Spy<(this: Document) => string>;

  beforeEach(async () => {
    referrerSpy = spyOnProperty(Document.prototype, 'referrer', 'get').and.returnValue(
      'https://service.hmcts.net/dashboard',
    );

    await TestBed.configureTestingModule({
      imports: [PermissionDeniedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionDeniedComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    referrerSpy.and.callThrough();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should expose the document referrer when it differs from the current location', () => {
    fixture.detectChanges();
    expect(component.backLinkHref).toBe('https://service.hmcts.net/dashboard');
    const backLink: HTMLAnchorElement = fixture.nativeElement.querySelector(
      '[data-testid="permission-denied-back-link"]',
    );
    expect(backLink.getAttribute('href')).toBe('https://service.hmcts.net/dashboard');
  });

  it('should fall back to root when referrer is missing', () => {
    referrerSpy.and.returnValue('');
    fixture.detectChanges();
    expect(component.backLinkHref).toBe('/');
    const backLink: HTMLAnchorElement = fixture.nativeElement.querySelector(
      '[data-testid="permission-denied-back-link"]',
    );
    expect(backLink.getAttribute('href')).toBe('/');
  });
});
