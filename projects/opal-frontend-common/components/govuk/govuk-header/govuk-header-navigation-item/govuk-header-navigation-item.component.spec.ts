import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { GovukHeaderNavigationItemComponent } from './govuk-header-navigation-item.component';

describe('GovukHeaderNavigationItemComponent', () => {
  let component: GovukHeaderNavigationItemComponent | null;
  let fixture: ComponentFixture<GovukHeaderNavigationItemComponent> | null;
  let eventMock: Event | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukHeaderNavigationItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukHeaderNavigationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    eventMock = { preventDefault: vi.fn() } as unknown as Event;
    vi.spyOn(component.actionClick, 'emit');
  });

  afterAll(() => {
    fixture = null;
    component = null;
    eventMock = null;
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test handleClick', () => {
    if (!component || !eventMock) {
      throw new Error('component or eventMock returned null');
    }

    component.handleClick(eventMock);
    expect(eventMock.preventDefault).toHaveBeenCalled();
    expect(component.actionClick.emit).toHaveBeenCalledWith(true);
  });
});
