import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideMonacoEditor} from 'ngx-monaco-editor-v2';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideMonacoEditor({
      baseUrl: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs'
    })
  ]
};
