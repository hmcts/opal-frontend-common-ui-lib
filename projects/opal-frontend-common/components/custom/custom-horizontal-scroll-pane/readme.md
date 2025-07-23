# CustomHorizontalScrollPaneComponent

A reusable Angular standalone component that enables horizontal scrolling for any projected content. Useful for wrapping wide tables, charts, or lists that exceed the container width.

## Selector

```html
<opal-lib-custom-horizontal-scroll-pane></opal-lib-custom-horizontal-scroll-pane>
```

## Usage

### Basic

```html
<opal-lib-custom-horizontal-scroll-pane>
  <div style="min-width: 800px">Wide content goes here…</div>
</opal-lib-custom-horizontal-scroll-pane>
```

## Notes

- Only enables horizontal scrolling (`overflow-x: auto`).
- Does not support sticky headers unless combined with vertical scroll or wrapped in a scrollable context with `max-height`.

## Styling

```scss
.custom-horizontal-scroll-pane {
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
}
```
