import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Listbox, Option, Orientation} from './listbox';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Listbox, Option],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'try-signals';
  selectedTopping: string = 'onion';
  protected orientation = signal<Orientation>('horizontal');

  logValueChange(newValue: string | undefined) {
    console.log(newValue);
  }

  logOrientationChange(newOrientation: Orientation) {
    console.log(newOrientation);
  }

  toggleOrientation() {
    this.orientation.update(oldValue =>
        oldValue === 'horizontal' ?
            'vertical' :
            'horizontal');
  }
}
