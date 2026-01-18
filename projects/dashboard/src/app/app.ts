import { Component, signal } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {EditorComponent} from 'ngx-monaco-editor-v2';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EditorComponent, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly title = signal('Dashboard');
  code = `function hello() {
  console.log("Hello Monaco");
}`;

  options = {
    theme: 'vs-dark',
    language: 'typescript',
    automaticLayout: true
  };
}
