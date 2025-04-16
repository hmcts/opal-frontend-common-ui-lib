import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CapitalisationDirective } from './capitalisation.directive';
import { UtilsService } from '@hmcts/opal-frontend-common/services/utils-service';

@Component({
  template: `<div opalLibCapitaliseAllCharacters><input type="text" /></div>`,
  imports: [CapitalisationDirective],
})
class TestComponent {}

describe('CapitalisationDirective', () => {
  let inputEl: DebugElement;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;
  let fixture: ComponentFixture<TestComponent> | null;

  beforeEach(async () => {
    mockUtilsService = jasmine.createSpyObj('UtilsService', ['upperCaseAllLetters']);
    mockUtilsService.upperCaseAllLetters.and.callFake((value: string) => value.toUpperCase());

    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [{ provide: UtilsService, useValue: mockUtilsService }],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    inputEl = fixture.debugElement.query(By.css('input'));
    fixture.detectChanges();
  });

  afterAll(() => {
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('should capitalize input value in real-time', () => {
    const inputElement = inputEl.nativeElement as HTMLInputElement;
    inputElement.value = 'test';
    inputEl.triggerEventHandler('input', { target: inputElement });

    expect(mockUtilsService.upperCaseAllLetters).toHaveBeenCalledWith('test');
    expect(inputElement.value).toBe('TEST');
  });

  it('should remove the event listener on destroy', () => {
    const directiveInstance = inputEl.injector.get(CapitalisationDirective);
    const removeListenerSpy = jasmine.createSpy('removeListener');

    directiveInstance['removeListener'] = removeListenerSpy;

    directiveInstance.ngOnDestroy();

    expect(removeListenerSpy).toHaveBeenCalled();
  });
});
