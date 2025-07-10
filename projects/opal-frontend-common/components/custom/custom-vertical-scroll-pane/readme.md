# CustomVerticalScrollPaneComponent

A reusable Angular standalone component that enables vertical scrolling for any projected content. Commonly used to wrap tables or long content sections where vertical overflow control is required.

## Selector

```html
<opal-lib-custom-vertical-scroll-pane></opal-lib-custom-vertical-scroll-pane>
```

## Inputs

| Name        | Type   | Default   | Description                                                                                               |
| ----------- | ------ | --------- | --------------------------------------------------------------------------------------------------------- |
| `maxHeight` | string | `'400px'` | Sets the maximum height of the scrollable container. Accepts any valid CSS height unit (e.g. `px`, `vh`). |

## Usage

### Basic

```html
<opal-lib-custom-vertical-scroll-pane>
  <p>Long content that requires vertical scrolling...</p>
</opal-lib-custom-vertical-scroll-pane>
```

### With custom height

```html
<opal-lib-custom-vertical-scroll-pane [maxHeight]="'600px'">
  <my-long-table></my-long-table>
</opal-lib-custom-vertical-scroll-pane>
```

## Notes

- Sticky headers (e.g. `<thead> th`) will remain fixed if using a table inside.
- The component wraps content in a `div.custom-vertical-scroll-pane`, styled with `overflow-y: auto`.

## Styling

The following SCSS styles apply:

```scss
.custom-vertical-scroll-pane {
  max-height: inherit;
  overflow-y: auto;
  overflow-x: hidden;
}

.custom-vertical-scroll-pane .govuk-table thead th {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 2;
}
```
