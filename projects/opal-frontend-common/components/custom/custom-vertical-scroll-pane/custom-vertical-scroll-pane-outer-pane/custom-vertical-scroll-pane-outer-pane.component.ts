import { Component, Input } from '@angular/core';

@Component({
  selector: 'opal-lib-custom-vertical-scroll-pane-outer-pane',
  templateUrl: './custom-vertical-scroll-pane-outer-pane.component.html',
})
export class CustomVerticalScrollPaneOuterPaneComponent {
  private _height: string = '100%';

  @Input()
  set height(value: string) {
    if (!value) {
      this._height = '100%';
    } else if (value.includes('%') || value.includes('vh') || value.includes('em') || value.includes('px')) {
      this._height = value;
    } else {
      this._height = '100%';
    }
  }

  get height(): string {
    return this._height;
  }
}
