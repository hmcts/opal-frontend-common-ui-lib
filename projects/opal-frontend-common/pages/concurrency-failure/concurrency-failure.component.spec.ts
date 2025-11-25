import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConcurrencyFailureComponent } from './concurrency-failure.component';

describe('ConcurrencyFailureComponent', () => {
  let component: ConcurrencyFailureComponent;
  let fixture: ComponentFixture<ConcurrencyFailureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConcurrencyFailureComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ConcurrencyFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the expected content', () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector('h1')?.textContent?.trim()).toBe('Sorry, there is a problem');
    expect(nativeElement.textContent).toContain('Something else was changed while you were doing this.');
    expect(nativeElement.textContent).toContain('Your changes have not been saved. You will need to start again.');
  });
});
