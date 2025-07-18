# CustomVerticalScrollPaneComponent

This is a structural wrapper component used to pair together `<opal-lib-custom-vertical-scroll-pane-outer-pane>` and `<opal-lib-custom-vertical-scroll-pane-inner-pane>`.

## Purpose

The `CustomVerticalScrollPaneComponent` provides a clean wrapper to contain both outer and inner scrollable panes. It does not apply any styles or logic itself, but serves to encapsulate the pairing and provide a semantic grouping for layout and readability.

## Usage

```html
<opal-lib-custom-vertical-scroll-pane>
  <opal-lib-custom-vertical-scroll-pane-outer-pane height="100vh">
    <opal-lib-custom-vertical-scroll-pane-inner-pane maxHeight="calc(100vh - 3rem)">
      <!-- Table or scrollable content here -->
    </opal-lib-custom-vertical-scroll-pane-inner-pane>
  </opal-lib-custom-vertical-scroll-pane-outer-pane>
</opal-lib-custom-vertical-scroll-pane>
```

## Notes

- The outer pane controls the overall container height.
- The inner pane controls the scrollable area.
- This component is optional but recommended for clarity and future enhancements.
