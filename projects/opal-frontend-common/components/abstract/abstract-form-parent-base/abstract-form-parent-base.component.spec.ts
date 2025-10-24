import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AbstractFormParentBaseComponent } from './abstract-form-parent-base.component';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'opal-lib-test-form-parent-base',
  template: '',
})
class TestAbstractFormParentBaseComponent extends AbstractFormParentBaseComponent {
  constructor() {
    super();
  }
}

describe('AbstractFormParentBaseComponent', () => {
  let component: TestAbstractFormParentBaseComponent | null;
  let fixture: ComponentFixture<TestAbstractFormParentBaseComponent> | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestAbstractFormParentBaseComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: of('manual-account-creation'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestAbstractFormParentBaseComponent);
    component = fixture.componentInstance;
  });

  afterAll(() => {
    component = null;
    fixture = null;
    TestBed.resetTestingModule();
  });

  it('should return false if there are unsaved changes', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.stateUnsavedChanges = true;
    expect(component['canDeactivate']()).toBe(false);
  });

  it('should return true if there are no unsaved changes', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    component.stateUnsavedChanges = false;
    expect(component['canDeactivate']()).toBe(true);
  });

  it('should test routerNavigate', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');
    component['routerNavigate']('test');
    expect(routerSpy).toHaveBeenCalledWith(['test'], { relativeTo: component['activatedRoute'].parent });
  });

  it('should test routerNavigate with no activated route', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');
    component['routerNavigate']('test', true);
    expect(routerSpy).toHaveBeenCalledWith(['test'], {});
  });

  it('should test routerNavigate with event', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');
    const event = jasmine.createSpyObj('event', ['preventDefault']);

    component['routerNavigate']('test', false, event);
    expect(routerSpy).toHaveBeenCalledWith(['test'], { relativeTo: component['activatedRoute'].parent });
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should test routerNavigate with routeData', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');
    const event = jasmine.createSpyObj('event', ['preventDefault']);
    const routeData = { someData: 'test' };

    component['routerNavigate']('test', false, event, routeData);
    expect(routerSpy).toHaveBeenCalledWith(['test'], {
      relativeTo: component['activatedRoute'].parent,
      state: routeData,
    });
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should test routerNavigate with fragment', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');
    const fragment = 'section1';

    component['routerNavigate']('test', false, undefined, undefined, fragment);
    expect(routerSpy).toHaveBeenCalledWith(['test'], {
      relativeTo: component['activatedRoute'].parent,
      fragment: fragment,
    });
  });

  it('should test routerNavigate with both routeData and fragment', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const routerSpy = spyOn(component['router'], 'navigate');
    const routeData = { someData: 'test' };
    const fragment = 'section2';

    component['routerNavigate']('test', false, undefined, routeData, fragment);
    expect(routerSpy).toHaveBeenCalledWith(['test'], {
      relativeTo: component['activatedRoute'].parent,
      state: routeData,
      fragment: fragment,
    });
  });

  it('should return true if any form value is truthy', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const form = {
      name: 'John Doe',
      age: 25,
      email: '',
    };
    const result = component['hasFormValues'](form);
    expect(result).toBe(true);
  });

  it('should return false if all form values are falsy', () => {
    if (!component) {
      fail('component returned null');
      return;
    }

    const form = {
      name: '',
      age: 0,
      email: null,
    };
    const result = component['hasFormValues'](form);
    expect(result).toBe(false);
  });
});
