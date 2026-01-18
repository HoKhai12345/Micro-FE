import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root' // Đảm bảo đây là Singleton Service
})
export class ConfigService {
  // Khởi tạo các Signal với giá trị mặc định
  // Signal giúp UI tự động cập nhật khi giá trị thay đổi mà không cần check manual
  currentUser = signal<string>('Guest');
  editorTheme = signal<string>('vs-dark');

  constructor() {
    console.log('ConfigService được khởi tạo! (Singleton Check)');
  }

  // Bạn có thể viết thêm các hàm xử lý logic tại đây nếu cần
  updateUser(newName: string) {
    this.currentUser.set(newName);
  }

  toggleTheme() {
    this.editorTheme.update(theme => theme === 'vs-dark' ? 'hc-black' : 'vs-dark');
  }
}
