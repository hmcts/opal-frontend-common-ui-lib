import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MojSubNavigationComponent } from './moj-sub-navigation.component';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('MojSubNavigationComponent', () => {
  let component: MojSubNavigationComponent;
  let fixture: ComponentFixture<MojSubNavigationComponent>;
  let fragment$: BehaviorSubject<string | null>;

  beforeEach(async () => {
    fragment$ = new BehaviorSubject<string | null>('test');

    await TestBed.configureTestingModule({
      imports: [MojSubNavigationComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: fragment$.asObservable(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MojSubNavigationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have an id', () => {
    component.subNavId = 'example';
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('#example');
    expect(element).toBeTruthy();
  });

  it('should emit the fragment', () => {
    vi.spyOn(component.activeSubNavItemFragment, 'emit');

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.activeSubNavItemFragment.emit).toHaveBeenCalledWith('test');
  });

  it('should not emit the fragment when it is missing', () => {
    vi.spyOn(component.activeSubNavItemFragment, 'emit');

    fragment$.next(null);
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.activeSubNavItemFragment.emit).not.toHaveBeenCalled();
  });
});
