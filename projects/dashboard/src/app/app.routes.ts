import { Routes } from '@angular/router';
import {loadRemoteModule} from '@angular-architects/native-federation';

export const routes: Routes = [
  {
    path: 'dashboard', // Khi gõ /dashboard trên trình duyệt
    loadComponent: () =>
      loadRemoteModule('dashboard', './Component').then(m => m.AppComponent)
  }
];
