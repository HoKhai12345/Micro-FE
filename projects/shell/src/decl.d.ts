declare module 'dashboard/ConfigService' {
  import { WritableSignal } from '@angular/core';

  export class ConfigService {
    currentUser: WritableSignal<string>;
    editorTheme: WritableSignal<string>;
  }
}
