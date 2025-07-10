# CustomScrollablePanesComponent

A reusable Angular standalone component that enables both vertical and horizontal scrolling for any projected content. Commonly used to wrap large tables or dynamic content that may overflow in both directions.

## Selector

```html
<opal-lib-custom-scrollable-panes></opal-lib-custom-scrollable-panes>
```

## Inputs

| Name        | Type   | Default   | Description                                                             |
| ----------- | ------ | --------- | ----------------------------------------------------------------------- |
| `maxHeight` | string | `'400px'` | Sets the maximum height of the scrollable container. Accepts CSS units. |

## Usage

### Basic

```html
<opal-lib-custom-scrollable-panes>
  <p>Long and wide content goes here…</p>
</opal-lib-custom-scrollable-panes>
```

### With custom height

```html
<opal-lib-custom-scrollable-panes [maxHeight]="'600px'">
  <my-table-component></my-table-component>
</opal-lib-custom-scrollable-panes>
```

## Notes

- Content exceeding the container in height or width will scroll.
- Sticky `<thead> th` headers remain fixed for tables if styled correctly.
- Works well with dynamic or complex table layouts.

## Styling

```scss
.custom-scrollable-pane {
  max-height: inherit;
  overflow: auto;
  width: 100%;
}

.custom-scrollable-pane .govuk-table thead th {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 2;
}
```
