import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MojSortableTableHeaderSortIconDirective } from './moj-sortable-table-header-sort-icon.directive';
import { MOJ_SORTABLE_TABLE_HEADER_SORT_ICONS } from './constants/moj-sortable-table-header-sort-icons.constant';

@Component({
  template: ` <svg [opalLibMojSortableTableHeaderSortIcon]="sortDirection"></svg> `,
  standalone: true,
  imports: [MojSortableTableHeaderSortIconDirective],
})
class TestHostComponent {
  sortDirection: 'ascending' | 'descending' | 'none' = 'none';
}

describe('MojSortableTableHeaderSortIconDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
  });

  it('should render descending icon path when sortDirection is ascending', () => {
    component.sortDirection = 'ascending';
    fixture.detectChanges();

    const paths = fixture.nativeElement.querySelectorAll('path');
    expect(paths.length).toBe(1);
    expect(paths[0].getAttribute('d')).toBe(MOJ_SORTABLE_TABLE_HEADER_SORT_ICONS.descending);
  });

  it('should render ascending icon path when sortDirection is descending', () => {
    component.sortDirection = 'descending';
    fixture.detectChanges();

    const paths = fixture.nativeElement.querySelectorAll('path');
    expect(paths.length).toBe(1);
    expect(paths[0].getAttribute('d')).toBe(MOJ_SORTABLE_TABLE_HEADER_SORT_ICONS.ascending);
  });

  it('should render both neutral icon paths when sortDirection is none', () => {
    component.sortDirection = 'none';
    fixture.detectChanges();

    const paths = fixture.nativeElement.querySelectorAll('path');
    expect(paths.length).toBe(2);
    expect(paths[0].getAttribute('d')).toBe(MOJ_SORTABLE_TABLE_HEADER_SORT_ICONS.none[0]);
    expect(paths[1].getAttribute('d')).toBe(MOJ_SORTABLE_TABLE_HEADER_SORT_ICONS.none[1]);
  });

  it('should clear previous paths when sortDirection changes', () => {
    component.sortDirection = 'ascending';
    fixture.detectChanges();

    // At this point, one path (descending icon) is rendered
    expect(fixture.nativeElement.querySelectorAll('path').length).toBe(1);

    // Change direction to 'none', which should render two paths
    component.sortDirection = 'none';
    fixture.detectChanges();

    const paths = fixture.nativeElement.querySelectorAll('path');
    expect(paths.length).toBe(2);
    expect(paths[0].getAttribute('d')).toBe(MOJ_SORTABLE_TABLE_HEADER_SORT_ICONS.none[0]);
    expect(paths[1].getAttribute('d')).toBe(MOJ_SORTABLE_TABLE_HEADER_SORT_ICONS.none[1]);
  });
});
