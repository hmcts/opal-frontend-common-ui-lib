import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GovukTabsListItemComponent } from './govuk-tabs-list-item.component';

@Component({
  template: `
    <opal-lib-govuk-tabs-list-item>
      <a class="govuk-tabs__tab" href="#test" id="tab-test">Test Tab</a>
    </opal-lib-govuk-tabs-list-item>
  `,
  standalone: true,
  imports: [GovukTabsListItemComponent],
})
class TestHostComponent {}

describe('GovukTabsListItemComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should project tab content into the list item', () => {
    const listItem = fixture.nativeElement.querySelector('li.govuk-tabs__list-item');
    const tabLink = listItem.querySelector('a.govuk-tabs__tab');

    expect(tabLink).toBeTruthy();
    expect(tabLink.getAttribute('href')).toBe('#test');
    expect(tabLink.innerText).toBe('Test Tab');
  });
});
