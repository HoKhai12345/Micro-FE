import { Routes } from '@angular/router';
import {loadRemoteModule} from '@angular-architects/native-federation';

export const routes: Routes = [
  {
    path: 'shell', // Khi gõ /dashboard trên trình duyệt
    loadComponent: () =>
      loadRemoteModule('shell', './Component').then(m => m.AppComponent)
  }
];
