# Abstract Tab Data

The `AbstractTabData` class provides a reusable Angular base class for managing tab-based observable data streams in your components. It is designed for components that need to update their data views when a user switches tabs, without duplicating stream logic.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Methods](#methods)
- [Testing](#testing)
- [Contributing](#contributing)

## Installation

To use the `AbstractTabData` class, extend it in your Angular component or service:

```ts
import { AbstractTabData } from '@hmcts/opal-frontend-common/components/abstract/abstract-tab-data/abstract-tab-data';
```

## Usage

Extend this class in a component where you need to switch views based on the current tab and update data accordingly.

### Example:

```ts
@Component({ ... })
export class MyTabComponent extends AbstractTabData {
  tabData$: Observable<MyViewModel[]>;

  ngOnInit(): void {
    const fragment$ = this.clearCacheOnTabChange(
      this.getFragmentStream('default-tab', this.destroy$),
      () => this.myService.clearMyCache()
    );

    this.tabData$ = this.createTabDataStream(
      fragment$,
      (tab) => this.buildParamsForTab(tab),
      (params) => this.myService.getData(params),
      (res) => this.transformData(res)
    );
  }

  onTabChange(tab: string): void {
    this.handleTabSwitch(tab);
  }
}
```

## Methods

### `createTabDataStream`

Creates an observable data stream that emits transformed data based on the active tab.

```ts
createTabDataStream<T, R>(
  fragment$: Observable<string>,
  getParams: (tab?: string) => any,
  fetchData: (params: any) => Observable<T>,
  transform: (data: T) => R
): Observable<R>
```

### `createCountStream`

Emits a formatted count string based on the current tab and fragment.

```ts
createCountStream<T>(
  fragment$: Observable<string>,
  getParams: (tab?: string) => any,
  fetchCount: (params: any) => Observable<T>,
  extractCount: (data: T) => number,
  formatFn?: (count: number) => string
): Observable<string>
```

Defaults to using the format function `(c) => \`\${c}\``. Useful for badge counts and tab indicators.
### `getFragmentStream`

Returns a stream of the current route fragment, starting with the current snapshot or a fallback.

```ts
getFragmentStream(defaultTab: string, destroy$: Observable<void>): Observable<string>
```

---

### `clearCacheOnTabChange`

Wraps a fragment stream and executes a side-effect when the tab changes.

```ts
clearCacheOnTabChange(fragment$: Observable<string>, clearFn: () => void): Observable<string>
```

### `handleTabSwitch`

Sets `activeTab` and triggers a navigation update with the new fragment.

```ts
handleTabSwitch(fragment: string): void
```

---

### `formatCountWithCap`

Returns a formatted count string, capping it at a given value.

```ts
formatCountWithCap(count: number, cap: number): string
```

Example:
```ts
formatCountWithCap(112, 99); // => "99+"
```

## Testing

You can create unit tests by extending `AbstractTabData` in a test class and mocking its dependencies.

### Example Test

```ts
class MockComponent extends AbstractTabData {}
const instance = new MockComponent();

expect(instance.formatCountWithCap(120, 99)).toBe('99+');
```

For more advanced tests, mock `ActivatedRoute` and `Router` via Angular TestBed and use `TestComponent` wrappers.

## Contributing

If you want to improve the shared tab-handling logic or suggest new utility patterns, feel free to submit a PR. Keep the logic generic and framework-agnostic so it can be reused across all tab-based components in the platform.
