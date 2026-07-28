import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MojHeaderNavigationItemComponent } from './moj-header-navigation-item.component';

describe('MojHeaderNavigationItemComponent', () => {
  let component: MojHeaderNavigationItemComponent;
  let fixture: ComponentFixture<MojHeaderNavigationItemComponent>;
  let eventMock: Event;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojHeaderNavigationItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojHeaderNavigationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    eventMock = { preventDefault: vi.fn() } as unknown as Event;
    vi.spyOn(component.actionClick, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test handleClick', () => {
    component.handleClick(eventMock);
    expect(eventMock.preventDefault).toHaveBeenCalled();
    expect(component.actionClick.emit).toHaveBeenCalledWith(true);
  });
});
