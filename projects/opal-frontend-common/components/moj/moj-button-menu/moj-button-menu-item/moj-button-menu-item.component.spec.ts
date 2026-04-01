import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojButtonMenuItemComponent } from './moj-button-menu-item.component';
import { Component } from '@angular/core';
import { MojButtonMenuComponent } from '../moj-button-menu.component';
import { describe, beforeEach, it, expect, vi } from 'vitest';
@Component({
  template: `<opal-lib-moj-button-menu menuButtonTitle="More actions">
    <opal-lib-moj-button-menu-item itemText="'Test Item'"> </opal-lib-moj-button-menu-item>
  </opal-lib-moj-button-menu>`,
  imports: [MojButtonMenuComponent, MojButtonMenuItemComponent],
})
class TestHostComponent {}

describe('MojButtonMenuItemComponent in TestHostComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
  });

  it('should create TestHostComponent', () => {
    expect(hostComponent).toBeTruthy();
  });
});

describe('MojButtonMenuItemComponent isolated', () => {
  let component: MojButtonMenuItemComponent;
  let fixture: ComponentFixture<MojButtonMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojButtonMenuItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojButtonMenuItemComponent);
    component = fixture.componentInstance;
    // Provide required input
    component.itemText = 'Test';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prevent default and emit actionClick when handleClick is called', () => {
    const fakeEvent = { preventDefault: vi.fn() } as unknown as Event;
    vi.spyOn(component.actionClick, 'emit');
    component.handleClick(fakeEvent);
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(component.actionClick.emit).toHaveBeenCalled();
  });
});
