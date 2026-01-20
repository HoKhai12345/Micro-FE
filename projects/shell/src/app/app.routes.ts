import { Routes } from '@angular/router';
import {loadRemoteModule} from '@angular-architects/native-federation';

export const routes: Routes = [
  {
    path: 'shell',
    loadComponent: () =>
      import('./app').then(m => m.App)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      loadRemoteModule('dashboard', './Component').then(m => m.App)
  },
  {
    path: 'header',
    loadComponent: () =>
      loadRemoteModule('header', './Component').then(m => m.App)
  }
];
