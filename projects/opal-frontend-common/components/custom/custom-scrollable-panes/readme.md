# CustomScrollablePanesComponent

A reusable Angular standalone component that enables a vertically scrollable container for any projected content. Commonly used as an outer pane to manage available height for inner content such as tables or long forms. Designed to be paired with `CustomScrollablePanesInnerPaneComponent` for more granular scrolling behaviour.

## Selector

```html
<opal-lib-custom-scrollable-panes></opal-lib-custom-scrollable-panes>
```

## Inputs

| Name     | Type   | Default  | Description                                                           |
| -------- | ------ | -------- | --------------------------------------------------------------------- |
| `height` | string | `'100%'` | Sets the height of the outer scrollable container. Accepts CSS units. |

## Usage

### Basic

```html
<opal-lib-custom-scrollable-panes>
  <p>Scrollable content goes here…</p>
</opal-lib-custom-scrollable-panes>
```

### With inner pane

For more control over inner content scrolling (e.g. sticky headers or scrolling tables), wrap your content in the `CustomScrollablePanesInnerPaneComponent`.

```html
<opal-lib-custom-scrollable-panes height="100vh">
  <opal-lib-custom-scrollable-panes-inner-pane [maxHeight]="'calc(100vh - 3rem)'">
    <my-table-component></my-table-component>
  </opal-lib-custom-scrollable-panes-inner-pane>
</opal-lib-custom-scrollable-panes>
```

## Notes

- `CustomScrollablePanesComponent` provides the height constraint.
- `CustomScrollablePanesInnerPaneComponent` handles the scrolling behaviour via `max-height` and `overflow: auto`.
- Useful for layouts with sticky headers, fixed pagination, or overflow-prone data grids.

## Styling

```scss
.custom-scrollable-pane {
  width: 100%;
}
```
