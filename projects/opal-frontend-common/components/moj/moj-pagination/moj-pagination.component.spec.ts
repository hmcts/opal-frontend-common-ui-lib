import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojPaginationComponent } from './moj-pagination.component';

describe('MojPaginationComponent', () => {
  let component: MojPaginationComponent;
  let fixture: ComponentFixture<MojPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojPaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MojPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return totalPages based on pages signal', () => {
    component['pages'].set([1, 2, 3, 4]);
    expect(component.totalPages).toBe(4);
  });

  it('should return pageStart as 1 when on page 1 with default limit', () => {
    component.currentPage = 1;
    component.limit = 25;
    component.total = 100;
    expect(component.pageStart).toBe(1);
  });

  it('should return pageStart as 0 if total is 0', () => {
    component.total = 0;
    expect(component.pageStart).toBe(0);
  });

  it('should return pageEnd as limit when total exceeds it', () => {
    component.currentPage = 1;
    component.limit = 25;
    component.total = 100;
    expect(component.pageEnd).toBe(25);
  });

  it('should return pageEnd as total if current page overflows it', () => {
    component.currentPage = 5;
    component.limit = 25;
    component.total = 110;
    expect(component.pageEnd).toBe(110);
  });

  it('should return pageEnd as 0 if total is 0', () => {
    component.total = 0;
    expect(component.pageEnd).toBe(0);
  });

  it('should emit changePage with the new page number', () => {
    spyOn(component.changePage, 'emit');
    const mockEvent = new Event('click');
    component.onPageChanged(mockEvent, 3);
    expect(component.changePage.emit).toHaveBeenCalledWith(3);
  });

  it('should not emit changePage when selecting the current page', () => {
    spyOn(component.changePage, 'emit');
    component.currentPage = 2;
    const mockEvent = new Event('click');
    component.onPageChanged(mockEvent, 2);
    expect(component.changePage.emit).not.toHaveBeenCalled();
  });

  it('should prevent default event behaviour', () => {
    const mockEvent = jasmine.createSpyObj('event', ['preventDefault']);
    component.onPageChanged(mockEvent, 2);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should recalculate pages when inputs change', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spyOn<any>(component, 'calculatePages');
    component.ngOnChanges();
    expect(component['calculatePages']).toHaveBeenCalled();
  });

  it('should do nothing if limit <= 0', () => {
    component.limit = 0;
    component.total = 100;
    component['calculatePages']();
    expect(component['pages']()).toEqual([]);
    expect(component['elipsedPages']()).toEqual([]);
  });

  it('should do nothing if total <= 0', () => {
    component.limit = 10;
    component.total = 0;
    component['calculatePages']();
    expect(component['pages']()).toEqual([]);
    expect(component['elipsedPages']()).toEqual([]);
  });

  it('should calculate pages and set elipsedPages when valid', () => {
    component.limit = 10;
    component.total = 80;
    component.currentPage = 4;
    component['calculatePages']();
    expect(component['pages']().length).toBe(8);
    expect(component['elipsedPages']()).toEqual([1, '…', 3, 4, 5, '…', 8]);
  });

  it('should return an array from start to end - 1', () => {
    const result = component['range'](3, 7);
    expect(result).toEqual([3, 4, 5, 6]);
  });

  it('should return an empty array if start >= end', () => {
    const result = component['range'](5, 5);
    expect(result).toEqual([]);
  });

  it('should not add ellipsis if all pages are adjacent', () => {
    const result = component['elipseSkippedPages']([1, 2, 3], 2);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should not add last page if same as first', () => {
    const result = component['elipseSkippedPages']([1], 1);
    expect(result).toEqual([1]);
  });

  it('should render GOV.UK pagination markup inside the MoJ wrapper', () => {
    fixture.componentRef.setInput('id', 'pagination');
    fixture.componentRef.setInput('currentPage', 2);
    fixture.componentRef.setInput('limit', 10);
    fixture.componentRef.setInput('total', 50);
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.querySelector('.moj-pagination');
    expect(wrapper).toBeTruthy();

    const nav = wrapper.querySelector('nav.govuk-pagination');
    expect(nav).toBeTruthy();
    expect(nav.classList.contains('moj-pagination__pagination')).toBeTrue();

    const list = wrapper.querySelector('.govuk-pagination__list');
    expect(list).toBeTruthy();

    const results = wrapper.querySelector('.moj-pagination__results');
    expect(results).toBeTruthy();
  });

  it('should render results without pagination controls when only one page is required', () => {
    fixture.componentRef.setInput('id', 'pagination');
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('limit', 100);
    fixture.componentRef.setInput('total', 20);
    fixture.detectChanges();

    const wrapper = fixture.nativeElement.querySelector('.moj-pagination');
    expect(wrapper).toBeTruthy();

    const nav = wrapper.querySelector('nav.govuk-pagination');
    expect(nav).toBeNull();

    const results = wrapper.querySelector('.moj-pagination__results');
    expect(results.textContent?.trim()).toBe('Showing 1 to 20 of 20 total results');
  });
});
