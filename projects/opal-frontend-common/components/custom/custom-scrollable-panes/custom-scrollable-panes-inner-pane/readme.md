# CustomScrollablePanesInnerPaneComponent

This component is designed to work as a scrollable inner container when used alongside the `CustomScrollablePanesComponent`. It enables vertical scrolling and optionally supports sticky headers.

## Selector

```html
<opal-lib-custom-scrollable-panes-inner-pane></opal-lib-custom-scrollable-panes-inner-pane>
```

## Inputs

| Name                   | Type      | Required | Default | Description                                                                    |
| ---------------------- | --------- | -------- | ------- | ------------------------------------------------------------------------------ |
| `maxHeight`            | `string`  | No       | `500px` | The maximum height of the scrollable pane. Accepts any valid CSS height value. |
| `stickyHeadersEnabled` | `boolean` | No       | `true`  | Toggles a `sticky-headers` class on the container for enabling sticky headers. |

## Usage

```html
<opal-lib-custom-scrollable-panes height="100vh">
  <opal-lib-custom-scrollable-panes-inner-pane maxHeight="calc(100vh - 3rem)" [stickyHeadersEnabled]="true">
    <!-- Scrollable content goes here -->
  </opal-lib-custom-scrollable-panes-inner-pane>
</opal-lib-custom-scrollable-panes>
```

This setup ensures the inner pane scrolls while respecting a dynamic height relative to the viewport. Sticky headers can be styled using the `sticky-headers` class.
