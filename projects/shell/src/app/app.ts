import { Component, signal, inject } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { ConfigService } from './shared/config.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  public configService = inject(ConfigService);
  readonly title = signal('shell');

  changeUser() {
    this.configService.currentUser.set('Admin Pro 2026');
    this.configService.editorTheme.set('hc-black'); // Đổi theme của Editor từ Shell luôn!
  }
}
