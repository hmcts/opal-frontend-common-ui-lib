import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { CapitalisationDirective } from './capitalisation.directive';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { GovukTextInputComponent } from '@hmcts/opal-frontend-common/components/govuk/govuk-text-input';

@Component({
  template: `
    <opal-lib-govuk-text-input
      [control]="control"
      [opalLibCapitaliseAllCharacters]="control"
      inputId="test-id"
      inputName="test-name"
    ></opal-lib-govuk-text-input>
  `,
  standalone: true,
  imports: [GovukTextInputComponent, CapitalisationDirective, ReactiveFormsModule],
})
class WrappedTestComponent {
  control = new FormControl('');
}

describe('CapitalisationDirective', () => {
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let fixture: ComponentFixture<WrappedTestComponent> | null;
  let testComponent: WrappedTestComponent;

  beforeEach(async () => {
    mockUtilsService = jasmine.createSpyObj('UtilsService', ['upperCaseAllLetters']);
    mockUtilsService.upperCaseAllLetters.and.callFake((value: string) => value.toUpperCase());

    await TestBed.configureTestingModule({
      imports: [WrappedTestComponent, ReactiveFormsModule],
      providers: [{ provide: UtilsService, useValue: mockUtilsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(WrappedTestComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should capitalise control value in real-time', fakeAsync(() => {
    testComponent.control.setValue('test');
    flush();
    expect(mockUtilsService.upperCaseAllLetters).toHaveBeenCalled();
    expect(testComponent.control.value).toBe('TEST');
  }));

  it('should not capitalise if control value is empty', fakeAsync(() => {
    testComponent.control.setValue('');
    flush();
    expect(mockUtilsService.upperCaseAllLetters).not.toHaveBeenCalled();
    expect(testComponent.control.value).toBe('');
  }));
});

describe('CapitalisationDirective when used without form control binding', () => {
  let mockUtilsService: jasmine.SpyObj<UtilsService>;

  @Component({
    template: `<input type="text" opalLibCapitaliseAllCharacters />`,
    standalone: true,
    imports: [CapitalisationDirective],
  })
  class MissingControlComponent {}

  beforeEach(async () => {
    mockUtilsService = jasmine.createSpyObj('UtilsService', ['upperCaseAllLetters']);
    mockUtilsService.upperCaseAllLetters.and.callFake((value: string) => value.toUpperCase());

    await TestBed.configureTestingModule({
      imports: [MissingControlComponent],
      providers: [{ provide: UtilsService, useValue: mockUtilsService }],
    }).compileComponents();
  });

  it('should not throw or subscribe if control is missing', () => {
    const missingFixture = TestBed.createComponent(MissingControlComponent);
    missingFixture.detectChanges();

    expect(mockUtilsService.upperCaseAllLetters).not.toHaveBeenCalled();
  });
});
