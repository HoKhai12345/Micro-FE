import { Injectable, signal } from '@angular/core';

/**
 * ConfigService - Exposed qua Module Federation từ Shell
 * Shell là host app, nên expose service để các remote apps sử dụng
 */
@Injectable({
  providedIn: 'root' // Singleton Service
})
export class ConfigService {
  // Khởi tạo các Signal với giá trị mặc định
  currentUser = signal<string>('Guest');
  editorTheme = signal<string>('vs-dark');

  constructor() {
    console.log('ConfigService được khởi tạo trong Shell! (Exposed via Module Federation)');
  }

  // Các hàm xử lý logic
  updateUser(newName: string) {
    this.currentUser.set(newName);
  }

  toggleTheme() {
    this.editorTheme.update(theme => theme === 'vs-dark' ? 'hc-black' : 'vs-dark');
  }
}
