declare module 'dashboard/ConfigService' {
  import { WritableSignal } from '@angular/core';

  export class ConfigService {
    // Khai báo các thuộc tính giống hệt bên Dashboard để Editor gợi ý đúng
    currentUser: WritableSignal<string>;
    editorTheme: WritableSignal<string>;

    // Nếu bạn có hàm nào khác ở Dashboard, hãy khai báo thêm ở đây
    updateUser(newName: string): void;
    toggleTheme(): void;
  }
}
