import { Component, signal } from '@angular/core';
import { DynamicFilterComponent } from "./dynamic-filter-component/dynamic-filter-component";

@Component({
  selector: 'app-root',
  imports: [ DynamicFilterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('filter');
}
