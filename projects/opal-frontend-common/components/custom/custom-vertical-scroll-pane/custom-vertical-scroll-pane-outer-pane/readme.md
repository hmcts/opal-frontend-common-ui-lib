# CustomVerticalScrollPaneOuterPaneComponent

This component provides a configurable outer wrapper for vertical scrollable panes. It sets a fixed or responsive height and wraps any content passed into it.

## Selector

```
opal-lib-custom-vertical-scroll-pane-outer-pane
```

## Inputs

| Input  | Type   | Required | Description                                                                           |
| ------ | ------ | -------- | ------------------------------------------------------------------------------------- |
| height | string | No       | CSS height value. Supports `vh`, `%`, `px`, `em`. Defaults to `100%` if not provided. |

## Usage

Use this component in combination with `opal-lib-custom-vertical-scroll-pane-inner-pane` inside a scrollable container such as `opal-lib-custom-scrollable-panes`.

```html
<opal-lib-custom-scrollable-panes>
  <opal-lib-custom-vertical-scroll-pane-outer-pane height="100vh">
    <opal-lib-custom-vertical-scroll-pane-inner-pane maxHeight="calc(100vh - 3rem)">
      <!-- Scrollable content here -->
    </opal-lib-custom-vertical-scroll-pane-inner-pane>
  </opal-lib-custom-vertical-scroll-pane-outer-pane>
</opal-lib-custom-scrollable-panes>
```
