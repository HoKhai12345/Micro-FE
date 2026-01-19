import { Injectable, inject } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/native-federation';

/**
 * Service để load ConfigService từ Shell app qua Module Federation
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigLoaderService {
  private configServicePromise: Promise<any> | null = null;

  async loadConfigService() {
    if (!this.configServicePromise) {
      this.configServicePromise = loadRemoteModule('shell', './ConfigService')
        .then(module => module.ConfigService)
        .catch(err => {
          console.error('Failed to load ConfigService from Shell:', err);
          // Fallback: return null hoặc local ConfigService
          return null;
        });
    }
    return this.configServicePromise;
  }
}
