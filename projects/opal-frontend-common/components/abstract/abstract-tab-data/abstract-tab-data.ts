import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, map, shareReplay, distinctUntilChanged, filter, startWith, takeUntil, tap } from 'rxjs';

export abstract class AbstractTabData {
  private readonly router = inject(Router);
  public readonly activatedRoute = inject(ActivatedRoute);
  public activeTab!: string;

  /**
   * Creates an observable stream that fetches and transforms data based on the current tab.
   *
   * It fetches data using the `fetchData` function with parameters obtained from `getParams`,
   * transforms the result using the `transform` function, and shares the result among subscribers.
   *
   * @template T The type of data returned by the fetchData observable.
   * @template U The type of the value emitted by the resulting observable.
   * @param fragment$ - An observable emitting the current tab identifier.
   * @param getParams - A function that returns parameters for data fetching based on the tab.
   * @param fetchData - A function that fetches data as an observable, given the parameters.
   * @param transform - A function to transform the fetched data before emission.
   * @returns An observable emitting the transformed fetched data, depending on the current tab.
   */
  private createConditionalStream<T, U>(
    fragment$: Observable<string>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getParams: (tab?: string) => any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchData: (params: any) => Observable<T>,
    transform: (data: T) => U,
  ): Observable<U> {
    return fragment$.pipe(switchMap((tab) => fetchData(getParams(tab)).pipe(map(transform), shareReplay(1))));
  }

  /**
   * Returns an observable stream of the current URL fragment, starting with the initial fragment or a default tab.
   *
   * This method listens to changes in the route fragment and emits the fragment value as a string.
   * It starts with the current fragment (or the provided default tab if none exists), filters out falsy values,
   * ensures only distinct values are emitted, and completes when the provided `destroy$` observable emits.
   *
   * @param defaultTab - The default tab to use if no fragment is present in the route snapshot.
   * @param destroy$ - An observable that signals when to complete the fragment stream.
   * @returns An observable emitting the current fragment string, updating on changes, and completing on destroy.
   */
  protected getFragmentStream(defaultTab: string, destroy$: Observable<void>): Observable<string> {
    return this.activatedRoute.fragment.pipe(
      startWith(this.activatedRoute.snapshot.fragment ?? defaultTab),
      filter((frag): frag is string => !!frag),
      map((tab) => tab),
      distinctUntilChanged(),
      takeUntil(destroy$),
    );
  }

  /**
   * Wraps a fragment stream and executes the provided callback on each tab change.
   *
   * @param fragment$ - The fragment observable stream.
   * @param clearFn - A function to execute when the tab changes.
   * @returns The fragment stream with a side-effect to run `clearFn` on each emission.
   */
  protected clearCacheOnTabChange(fragment$: Observable<string>, clearFn: () => void): Observable<string> {
    return fragment$.pipe(tap(() => clearFn()));
  }

  /**
   * Creates an observable data stream for a tab, transforming the fetched data as needed.
   *
   * @template T The type of the data fetched.
   * @template R The type of the transformed data.
   * @param fragment$ An observable emitting the current tab fragment.
   * @param getParams A function that returns fetch parameters based on the tab.
   * @param fetchData A function that fetches data given the parameters.
   * @param transform A function to transform the fetched data.
   * @returns An observable emitting the transformed data for the current tab.
   */
  public createTabDataStream<T, R>(
    fragment$: Observable<string>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getParams: (tab?: string) => any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchData: (params: any) => Observable<T>,
    transform: (data: T) => R,
  ): Observable<R> {
    return this.createConditionalStream<T, R>(fragment$, getParams, fetchData, transform);
  }

  /**
   * Creates an observable stream that emits a formatted count string based on the current tab and fragment.
   *
   * @template T - The type of the data returned by the fetchCount observable.
   * @param fragment$ - An observable emitting the current fragment or tab identifier.
   * @param getParams - A function that returns the parameters required for fetching the count.
   * @param fetchCount - A function that takes the parameters and returns an observable emitting the count data.
   * @param extractCount - A function that extracts the numeric count from the fetched data.
   * @param formatFn - (Optional) A function to format the count as a string. Defaults to a simple string conversion.
   * @returns An observable that emits the formatted count string whenever the fragment or parameters change.
   */
  public createCountStream<T>(
    fragment$: Observable<string>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getParams: (tab?: string) => any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchCount: (params: any) => Observable<T>,
    extractCount: (data: T) => number,
    formatFn: (count: number) => string = (c) => `${c}`,
  ): Observable<string> {
    return fragment$.pipe(
      switchMap((tab) =>
        fetchCount(getParams(tab)).pipe(
          map((data) => formatFn(extractCount(data))),
          shareReplay(1),
        ),
      ),
    );
  }

  /**
   * Handles the tab switch by updating the active tab and triggering a router fragment update.
   *
   * @param fragment - The identifier of the tab to activate.
   */
  public handleTabSwitch(fragment: string): void {
    this.activeTab = fragment;
    this.router.navigate([], {
      relativeTo: this.activatedRoute.parent,
      fragment,
    });
  }

  /**
   * Formats a count value, capping it at a specified maximum.
   *
   * If the count exceeds the cap, returns a string in the format "{cap}+".
   * Otherwise, returns the count as a string.
   *
   * @param count - The number to format.
   * @param cap - The maximum value to display before capping.
   * @returns A string representing the count, capped if necessary.
   */
  public formatCountWithCap(count: number, cap: number): string {
    return count > cap ? `${cap}+` : `${count}`;
  }
}
