import type { CapacitorConfig } from '@capacitor/cli';

// Native shell for the Bestmark web app. The iOS/Android apps load the
// deployed production site so athletes, results, and the AI coach stay live
// without shipping app updates. Replace `url` with your production domain
// (must be HTTPS) before building for release.
const config: CapacitorConfig = {
  appId: 'com.bestmark.app',
  appName: 'Bestmark',
  webDir: 'www', // placeholder shell; real content is served from `server.url`
  server: {
    url: 'https://YOUR-PRODUCTION-DOMAIN.com',
    cleartext: false,
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#0F1E2E',
  },
  android: {
    backgroundColor: '#0F1E2E',
  },
};

export default config;
