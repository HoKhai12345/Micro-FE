import { Injectable, signal, inject, Optional } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';

/**
 * ConfigService cho Dashboard
 * - Khi chạy độc lập: Dùng instance riêng
 * - Khi load vào Shell: Có thể load từ Shell qua Module Federation
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  currentUser = signal<string>('Guest');
  editorTheme = signal<string>('vs-dark');

  constructor() {
    console.log('ConfigService được khởi tạo trong Dashboard!');
    
    // Thử load từ Shell nếu có (optional)
    this.tryLoadFromShell();
  }

  private async tryLoadFromShell() {
    try {
      const shellModule = await loadRemoteModule('shell', './ConfigService');
      if (shellModule?.ConfigService) {
        // Nếu load được từ Shell, có thể sync state hoặc dùng trực tiếp
        console.log('ConfigService từ Shell đã được load!');
      }
    } catch (err) {
      // Shell không có hoặc chưa chạy → dùng instance riêng
      console.log('Dashboard chạy độc lập, dùng ConfigService riêng');
    }
  }

  updateUser(newName: string) {
    this.currentUser.set(newName);
  }

  toggleTheme() {
    this.editorTheme.update(theme => theme === 'vs-dark' ? 'hc-black' : 'vs-dark');
  }
}
