import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermissionDeniedComponent } from './permission-denied.component';

describe('PermissionDeniedComponent', () => {
  let component: PermissionDeniedComponent;
  let fixture: ComponentFixture<PermissionDeniedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionDeniedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the expected text content', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector('h1')?.textContent?.trim()).toBe('You do not have permission for this');
    expect(nativeElement.textContent).toContain(
      'the account is outside your business unit and some features are restricted',
    );
    expect(nativeElement.textContent).toContain('you are not permitted to use this feature');
    expect(nativeElement.textContent).toContain('If you think this is incorrect, contact your line manager.');
  });
});
