import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MojSortableTableComponent } from './moj-sortable-table.component';

describe('MojSortableTableComponent', () => {
  let component: MojSortableTableComponent;
  let fixture: ComponentFixture<MojSortableTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojSortableTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojSortableTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default tableClasses as undefined', () => {
    expect(component.tableClasses).toBeUndefined();
  });

  it('should accept tableClasses as input', () => {
    component.tableClasses = 'test-class';
    fixture.detectChanges();
    expect(component.tableClasses).toBe('test-class');
  });

  it('should call initAll on date picker library', waitForAsync(() => {
    const initAllSpy = jasmine.createSpy('initAll');
    spyOn(component, 'configureSortableTable').and.callFake(() => {
      return Promise.resolve({
        initAll: initAllSpy,
      }).then((library) => {
        library.initAll();
        expect(initAllSpy).toHaveBeenCalled();
      });
    });

    component.configureSortableTable();
  }));
});
