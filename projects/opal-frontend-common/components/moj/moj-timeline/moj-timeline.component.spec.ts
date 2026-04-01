import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojTimelineComponent } from './moj-timeline.component';
import { Component } from '@angular/core';
import { MojTimelineItemComponent } from './moj-timeline-item/moj-timeline-item.component';
import { describe, beforeEach, it, expect } from 'vitest';

@Component({
  template: `<opal-lib-moj-timeline
    ><opal-lib-moj-timeline-item>
      <ng-content timelineTitle>Test</ng-content>
      <ng-content timelineUser>Test User</ng-content>
      <ng-content timelineDate>23/07/2024</ng-content>
      <ng-content timelineDescription><p>Hello world!</p></ng-content>
    </opal-lib-moj-timeline-item>
  </opal-lib-moj-timeline>`,
  imports: [MojTimelineComponent, MojTimelineItemComponent],
})
class TestHostComponent {}

describe('MojTimelineComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
