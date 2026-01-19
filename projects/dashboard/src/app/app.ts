import { Component, signal, inject } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {EditorComponent} from 'ngx-monaco-editor-v2';
import {FormsModule} from '@angular/forms';
import { ConfigService } from './shared/config.service'; // Import file nội bộ
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EditorComponent, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  public configService = inject(ConfigService);
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
