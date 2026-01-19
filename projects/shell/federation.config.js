const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'shell',
  exposes: {
    './ConfigService': './projects/shell/src/app/shared/config.service.ts'
  },
  remotes: {
    "dashboard": "http://localhost:4201/remoteEntry.json",
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
    'monaco-editor',
    'ngx-monaco-editor-v2'
    // Add further packages you don't need at runtime
  ],
  features: {
    // New feature for more performance and avoiding
    // issues with node libs. Comment this out to
    // get the traditional behavior:
    ignoreUnusedDeps: true
  }
});
