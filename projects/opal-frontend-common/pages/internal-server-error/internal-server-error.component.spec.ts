import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternalServerErrorComponent } from './internal-server-error.component';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { GLOBAL_ERROR_STATE } from '@hmcts/opal-frontend-common/stores/global/constants';

describe('InternalServerErrorComponent', () => {
  let component: InternalServerErrorComponent;
  let fixture: ComponentFixture<InternalServerErrorComponent>;
  let globalStore: GlobalStoreType;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternalServerErrorComponent],
    }).compileComponents();

    globalStore = TestBed.inject(GlobalStore);
    fixture = TestBed.createComponent(InternalServerErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an operation id when one is provided', () => {
    globalStore.setError({
      ...GLOBAL_ERROR_STATE,
      error: true,
      message: null,
      operationId: 'OP-500',
    });

    fixture.detectChanges();

    const errorCodeElement = fixture.nativeElement.querySelector('[data-testid="error-code"]');
    expect(errorCodeElement.textContent.trim()).toBe('Error code: OP-500.');
  });

  it('should display a fallback operation id when none is provided', () => {
    globalStore.setError({
      ...GLOBAL_ERROR_STATE,
      error: true,
      message: null,
      operationId: null,
    });

    fixture.detectChanges();

    const errorCodeElement = fixture.nativeElement.querySelector('[data-testid="error-code"]');
    expect(errorCodeElement.textContent.trim()).toBe('Error code: Unavailable.');
  });

  it('should reset the error state on component destroy', () => {
    spyOn(globalStore, 'resetError');

    component.ngOnDestroy();

    expect(globalStore.resetError).toHaveBeenCalled();
  });
});
