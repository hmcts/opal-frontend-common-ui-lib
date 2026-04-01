import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukSummaryListRowActionItemComponent } from './govuk-summary-list-row-action-item.component';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('GovukSummaryListRowActionItemComponent', () => {
  let component: GovukSummaryListRowActionItemComponent;
  let fixture: ComponentFixture<GovukSummaryListRowActionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GovukSummaryListRowActionItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GovukSummaryListRowActionItemComponent);
    component = fixture.componentInstance;

    component.actionName = 'Change';
    component.actionId = 'change';
    component.visuallyHiddenText = 'Minor Creditor';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit linkClicked event when handleActionClick is called', () => {
    const linkClicked = 'change';
    const event = {
      preventDefault: vi.fn().mockName('event.preventDefault'),
    } as unknown as Event;
    vi.spyOn(component.linkClick, 'emit');

    component.handleActionClick(event, linkClicked);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.linkClick.emit).toHaveBeenCalledWith(linkClicked);
  });
});
