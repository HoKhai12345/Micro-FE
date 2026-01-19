import { Injectable, signal } from '@angular/core';

/**
 * Shared ConfigService - Dùng chung cho tất cả apps trong Micro Frontend
 * Đặt trong shared/ để tránh duplicate code
 */
@Injectable({
  providedIn: 'root' // Singleton Service - chỉ có 1 instance
})
export class ConfigService {
  // Khởi tạo các Signal với giá trị mặc định
  // Signal giúp UI tự động cập nhật khi giá trị thay đổi
  currentUser = signal<string>('Guest');
  editorTheme = signal<string>('vs-dark');

  constructor() {
    console.log('ConfigService được khởi tạo! (Shared Service - Singleton)');
  }

  // Các hàm xử lý logic
  updateUser(newName: string) {
    this.currentUser.set(newName);
  }

  toggleTheme() {
    this.editorTheme.update(theme => theme === 'vs-dark' ? 'hc-black' : 'vs-dark');
  }
}
