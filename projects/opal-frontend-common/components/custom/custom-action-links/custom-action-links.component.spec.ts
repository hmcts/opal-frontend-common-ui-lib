import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomActionLinksComponent } from './custom-action-links.component';

describe('CustomActionLinksComponent', () => {
  let component: CustomActionLinksComponent;
  let fixture: ComponentFixture<CustomActionLinksComponent>;
  let hostElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomActionLinksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomActionLinksComponent);
    component = fixture.componentInstance;
    component.id = 'test-id';
    fixture.detectChanges();
    hostElement = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind host id attribute to the id input', () => {
    expect(hostElement.getAttribute('id')).toEqual('test-id');
  });

  it('should have default class binding from classSize input', () => {
    expect(hostElement.getAttribute('class')).toEqual('govuk-grid-column-one-third');
  });

  it('should update host id when id input changes', () => {
    component.id = 'new-id';
    fixture.detectChanges();
    expect(hostElement.getAttribute('id')).toEqual('new-id');
  });

  it('should update host class when classSize input changes', () => {
    component.classSize = 'custom-class';
    fixture.detectChanges();
    expect(hostElement.getAttribute('class')).toEqual('custom-class');
  });
});
