import {
  Component,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output, signal
} from '@angular/core';

export type Orientation = 'vertical' | 'horizontal';

@Component({
  selector: 'jm-listbox',
  template: `<ng-content />`,
  standalone: true,
  host: {
    'role': 'listbox',
    '[tabIndex]': 'disabled() || activeOption() ? -1 : 0',
    '(focus)' : 'activateOption()',
  },
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      border: 1px solid black;
      padding: 4px;
    }
    
    :host:focus {
      outline: 2px solid darkblue;
    }
  `,
})
export class Listbox<T> {
  readonly value = model<T>();
  readonly disabled = input(false);
  readonly orientation = input<Orientation>('horizontal');

  readonly options = contentChildren(Option);
  activeOption = signal<Option<T> | undefined>(undefined);

  readonly orientationChange = output<Orientation>();

  constructor() {
    effect(() => {
      this.orientationChange.emit(this.orientation());
    });
  }

  // TODO: keyboard handling

  activateOption() {
    const selectedOption = this.options().find(o => o.isSelected());
    if (selectedOption) {
      this.activeOption.set(selectedOption);
    } else {
      const firstEnabledOption = this.options().find(o => !o.disabled());
      this.activeOption.set(firstEnabledOption);
    }

    // TODO: focus the active option
  }
}


@Component({
  selector: 'jm-option',
  template: `
    <ng-content />
    
    @if (isSelected()) {
      ✓
    }
  `,
  standalone: true,
  host: {
    'role': 'option',
    '[attr.aria-disabled]': 'isDisabled()',
    '[attr.aria-selected]': 'isSelected()',
    '[tabIndex]': 'isActive() ? 0 : -1',
    '(click)': 'select()',
  },
  styles: `
    :host {
      display: block;
      border: 1px solid black;
      margin: 4px;
      padding: 4px;
      cursor: pointer;
    }
    
    :host[aria-disabled="true"] {
      color: lightgray;
      border-color: lightgray;
      cursor: default;
    }
    
    :host:focus {
      outline: 1px dashed darkblue;
    }
  `,
})
export class Option<T> {
  private listbox = inject<Listbox<T>>(Listbox);

  readonly value = input.required<T>();
  readonly disabled = input(false);

  protected readonly isDisabled =
      computed(() => this.listbox.disabled() || this.disabled());
  readonly isSelected =
      computed(() => this.value() === this.listbox.value());
  readonly isActive = computed(() => this === this.listbox.activeOption());

  protected select() {
    if (!this.isDisabled()) {
      this.listbox.value.set(this.value());
    }
  }
}
