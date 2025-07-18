# CustomVerticalScrollPaneInnerPaneComponent

This component provides the **scrollable inner pane** for the `CustomVerticalScrollPane` layout pattern. It is responsible for vertical scrolling of large table content or lists and supports sticky headers via a toggleable flag.

## Selector

```
opal-lib-custom-vertical-scroll-pane-inner-pane
```

## Inputs

| Input                  | Type      | Required | Default   | Description                                                                       |
| ---------------------- | --------- | -------- | --------- | --------------------------------------------------------------------------------- |
| `maxHeight`            | `string`  | No       | `'500px'` | The maximum height applied to the scroll pane. Accepts any valid CSS value.       |
| `stickyHeadersEnabled` | `boolean` | No       | `true`    | When true, applies the `sticky-headers` CSS class to enable sticky table headers. |

## Usage

This component is intended to be used within `opal-lib-custom-vertical-scroll-pane-outer-pane`, and typically wrapped by a shared `opal-lib-custom-scrollable-panes` container.

### Example

```html
<opal-lib-custom-scrollable-panes>
  <opal-lib-custom-vertical-scroll-pane-outer-pane height="100vh">
    <opal-lib-custom-vertical-scroll-pane-inner-pane maxHeight="calc(100vh - 3rem)" [stickyHeadersEnabled]="true">
      <!-- Content here (e.g. moj-sortable-table) -->
    </opal-lib-custom-vertical-scroll-pane-inner-pane>
  </opal-lib-custom-vertical-scroll-pane-outer-pane>
</opal-lib-custom-scrollable-panes>
```

## Notes

- This component does **not** enforce any content structure — you can project any HTML inside.
- Use the `stickyHeadersEnabled` flag to control whether sticky headers are applied via a CSS class.
