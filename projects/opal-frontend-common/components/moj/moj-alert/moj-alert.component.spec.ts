import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojAlertComponent } from './moj-alert.component';
import { ElementRef } from '@angular/core';

describe('MojAlertComponent', () => {
  let component: MojAlertComponent;
  let fixture: ComponentFixture<MojAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojAlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call renderer.removeChild when host element has a parent', () => {
    // Arrange: Create a fake parent element and attach host element to it.
    const hostElem = component['elref'].nativeElement;
    const fakeParent = document.createElement('div');
    fakeParent.appendChild(hostElem);

    // Spy on the renderer's removeChild method.
    const removeChildSpy = spyOn(component['renderer'], 'removeChild');

    // Act: Dismiss the alert.
    component.dismiss();

    // Assert: Ensure renderer.removeChild was called with the fake parent and host element.
    expect(removeChildSpy).toHaveBeenCalledWith(fakeParent, hostElem);
  });

  it('should not call renderer.removeChild when host element has no parent', () => {
    // Arrange: Override the native element with a fake element whose parentNode is null.
    const fakeHostElem = { parentNode: null } as HTMLElement;
    (component as any).elref = { nativeElement: fakeHostElem } as ElementRef<HTMLElement>;

    // Spy on the renderer's removeChild method.
    const removeChildSpy = spyOn(component['renderer'], 'removeChild');

    // Act: Dismiss the alert.
    component.dismiss();

    // Assert: Ensure renderer.removeChild was not called.
    expect(removeChildSpy).not.toHaveBeenCalled();
  });
});
